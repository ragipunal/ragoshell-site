// Progressive enhancement motion engine (see docs/Motion.md).
// Zero cookies, zero web storage, zero external network calls, zero innerHTML.
// Respects prefers-reduced-motion: reduce and falls back cleanly when inactive.

const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let isReduced = reducedQuery.matches;
const isCoarseOrNarrow = () => window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;

interface StagePreset {
  cmd: string;
  lines: ReadonlyArray<{ key: string; type: string; value: string; note?: string }>;
  elapsed: string;
  desc: string;
}

interface WireRow {
  key: string;
  tag: string;
  val: string;
  warm?: boolean;
}

interface WirePreset {
  cmd: string;
  rows: ReadonlyArray<WireRow>;
  desc: string;
  status: string;
}

function initRouteTransition(): void {
  const root = document.documentElement;
  const label = document.querySelector<HTMLElement>('[data-route-label]');
  if (!label) return;

  let leavingLock = false;
  const clearTransition = () => {
    leavingLock = false;
    root.classList.remove('is-entering', 'is-entered', 'is-leaving');
  };
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted || root.classList.contains('is-leaving')) clearTransition();
  });

  if (isReduced || isCoarseOrNarrow()) return;

  document.addEventListener('click', (event: MouseEvent) => {
    if (
      leavingLock ||
      isReduced ||
      isCoarseOrNarrow() ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.hasAttribute('download')) return;
    const linkTarget = anchor.getAttribute('target');
    if (linkTarget && linkTarget !== '_self') return;

    let dest: URL;
    try {
      dest = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (dest.origin !== window.location.origin) return;
    if (dest.pathname === window.location.pathname && dest.search === window.location.search) return;

    event.preventDefault();
    leavingLock = true;
    label.textContent = `route.eval("${dest.pathname}")`;
    root.classList.remove('is-entering', 'is-entered');
    root.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.assign(dest.href);
    }, 140);
  });

  let sameOriginArrival = false;
  if (document.referrer) {
    try {
      const ref = new URL(document.referrer);
      sameOriginArrival =
        ref.origin === window.location.origin &&
        (ref.pathname !== window.location.pathname || ref.search !== window.location.search);
    } catch {
      sameOriginArrival = false;
    }
  }
  const navEntry = performance.getEntriesByType?.('navigation')?.[0] as PerformanceNavigationTiming | undefined;
  if (!sameOriginArrival || (navEntry && navEntry.type !== 'navigate')) return;

  label.textContent = `route.eval("${window.location.pathname}")`;

  root.classList.add('is-entering');
  window.setTimeout(clearTransition, 1300);
}

function initDirectionalButtons(): void {
  const buttons = document.querySelectorAll<HTMLElement>('[data-fill]');
  for (const btn of buttons) {
    const updatePoint = (e: PointerEvent) => {
      if (isReduced) return;
      const rect = btn.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      btn.style.setProperty('--mx', `${Math.round(x)}px`);
      btn.style.setProperty('--my', `${Math.round(y)}px`);
    };
    btn.addEventListener('pointerenter', updatePoint);
    btn.addEventListener('pointermove', updatePoint);
  }
}

function initDropdowns(): void {
  const disclosures = document.querySelectorAll<HTMLDetailsElement>('details[data-disclosure]');
  for (const details of disclosures) {
    const summary = details.querySelector<HTMLElement>('summary');
    const isMobileMenu = details.classList.contains('mobile-menu');
    const syncExpanded = () => {
      if (isMobileMenu && summary) {
        summary.setAttribute('aria-expanded', details.open ? 'true' : 'false');
      }
    };
    details.addEventListener('toggle', syncExpanded);
    syncExpanded();

    details.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && details.open) {
        details.open = false;
        summary?.focus();
        return;
      }
      if (isMobileMenu && details.open && e.key === 'Tab') {
        const focusables = [
          ...(summary ? [summary] : []),
          ...Array.from(details.querySelectorAll<HTMLElement>('.mobile-drawer a[href]')),
        ];
        if (focusables.length > 1) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
    details.addEventListener('click', (e: MouseEvent) => {
      const target = e.target;
      if (target instanceof Element && target.closest('a[href]')) {
        details.open = false;
      }
    });
  }

  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Node)) return;
    for (const details of disclosures) {
      if (details.open && !details.contains(target)) {
        details.open = false;
      }
    }
  });
}

function initReveals(): void {
  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (items.length === 0) return;

  if (isReduced || !('IntersectionObserver' in window)) {
    for (const el of items) el.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );

  for (const el of items) observer.observe(el);
}

function initNarrativeSync(): void {
  const indicator = document.querySelector<HTMLElement>('[data-narrative-indicator]');
  const numEl = document.querySelector<HTMLElement>('[data-narrative-num]');
  const tagEl = document.querySelector<HTMLElement>('[data-narrative-tag]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-narrative-card]'));
  if (!indicator || !numEl || !tagEl || cards.length === 0 || !('IntersectionObserver' in window)) return;

  const total = String(cards.length).padStart(2, '0');
  const setActive = (card: HTMLElement) => {
    const num = card.dataset.narrativeCard ?? '01';
    const tag = card.dataset.narrativeTag ?? '';
    numEl.textContent = `${num} / ${total}`;
    if (tag) tagEl.textContent = tag;
    for (const item of cards) item.classList.toggle('is-active', item === card);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          setActive(entry.target);
        }
      }
    },
    { rootMargin: '-25% 0px -45% 0px', threshold: 0.15 },
  );

  for (const card of cards) observer.observe(card);
}

function initShellStage(): void {
  const stage = document.querySelector<HTMLElement>('[data-shell-stage]');
  if (!stage) return;

  const presetsJson = stage.getAttribute('data-presets');
  if (!presetsJson) return;

  let presets: Record<string, StagePreset>;
  try {
    presets = JSON.parse(presetsJson) as Record<string, StagePreset>;
  } catch {
    return;
  }

  const tabs = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-stage-tab]'));
  const cmdEl = stage.querySelector<HTMLElement>('[data-stage-cmd]');
  const bodyEl = stage.querySelector<HTMLElement>('[data-stage-body]');
  const elapsedEl = stage.querySelector<HTMLElement>('[data-stage-elapsed]');
  const descEl = stage.querySelector<HTMLElement>('[data-stage-desc]');
  const pulseBar = stage.querySelector<HTMLElement>('[data-stage-pulse]');
  const clockEl = stage.querySelector<HTMLElement>('[data-stage-clock]');
  const keys = tabs.map((t) => t.dataset.stageTab ?? '').filter(Boolean);

  if (!cmdEl || !bodyEl || keys.length === 0) return;

  let activeIndex = 0;

  const renderPreset = (key: string) => {
    const preset = presets[key];
    if (!preset) return;

    for (let i = 0; i < tabs.length; i++) {
      const selected = tabs[i].dataset.stageTab === key;
      tabs[i].setAttribute('aria-selected', selected ? 'true' : 'false');
      tabs[i].classList.toggle('is-active', selected);
    }

    cmdEl.textContent = preset.cmd;
    if (elapsedEl) elapsedEl.textContent = preset.elapsed;
    if (descEl) descEl.textContent = preset.desc;

    const frag = document.createDocumentFragment();
    for (const row of preset.lines) {
      const line = document.createElement('div');
      line.className = 'bson-line';

      const k = document.createElement('span');
      k.className = 'bson-key';
      k.textContent = row.key;

      const t = document.createElement('span');
      t.className = 'bson-type';
      t.textContent = row.type;

      const v = document.createElement('span');
      v.className = `bson-val bson-val--${row.type.toLowerCase()}`;
      v.textContent = row.value;

      line.append(k, t, v);
      if (row.note) {
        const n = document.createElement('span');
        n.className = 'bson-note';
        n.textContent = row.note;
        line.append(n);
      }
      frag.append(line);
    }
    bodyEl.replaceChildren(frag);
  };

  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];
    tab.addEventListener('click', () => {
      activeIndex = i;
      const key = tab.dataset.stageTab;
      if (key) renderPreset(key);
    });
  }

  let rafId = 0;
  let visible = true;
  let lastClockSec = -1;
  let lastDraw = 0;
  const startTime = performance.now();

  const stopClock = () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const tick = (now: number) => {
    rafId = 0;
    if (isReduced || isCoarseOrNarrow() || !visible) return;

    if (now - lastDraw >= 50) {
      lastDraw = now;
      const elapsed = (now - startTime) / 1000;
      if (pulseBar) {
        const phase = (elapsed * 0.23) % 1;
        const scale = 0.15 + phase * 0.85;
        pulseBar.style.transform = `scaleX(${scale.toFixed(3)})`;
      }

      if (clockEl) {
        const dec = Math.floor(elapsed * 4);
        if (dec !== lastClockSec) {
          lastClockSec = dec;
          const ms = String((dec * 250) % 1000).padStart(3, '0');
          const sec = String(Math.floor(dec / 4) % 60).padStart(2, '0');
          clockEl.textContent = `00:${sec}.${ms}`;
        }
      }
    }

    rafId = window.requestAnimationFrame(tick);
  };

  const startClock = () => {
    if (!isReduced && !isCoarseOrNarrow() && visible && rafId === 0) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible) startClock();
          else stopClock();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(stage);
  }

  reducedQuery.addEventListener('change', (e: MediaQueryListEvent) => {
    isReduced = e.matches;
    if (isReduced) {
      stopClock();
      document.documentElement.classList.remove('is-entering', 'is-entered', 'is-leaving');
      for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
        el.classList.add('is-visible');
      }
      if (pulseBar) pulseBar.style.transform = 'scaleX(1)';
    } else {
      startClock();
    }
  });

  renderPreset(keys[activeIndex]);
  startClock();
}

function initWireStage(): void {
  const stage = document.querySelector<HTMLElement>('[data-wire-stage]');
  if (!stage) return;

  const presetsJson = stage.getAttribute('data-presets');
  if (!presetsJson) return;

  let presets: Record<string, WirePreset>;
  try {
    presets = JSON.parse(presetsJson) as Record<string, WirePreset>;
  } catch {
    return;
  }

  const tabs = Array.from(stage.querySelectorAll<HTMLButtonElement>('[data-wire-tab]'));
  const cmdEl = stage.querySelector<HTMLElement>('[data-wire-cmd]');
  const bodyEl = stage.querySelector<HTMLElement>('[data-wire-body]');
  const descEl = stage.querySelector<HTMLElement>('[data-wire-desc]');
  const statusEl = stage.querySelector<HTMLElement>('[data-wire-status]');
  const pulseBar = stage.querySelector<HTMLElement>('[data-wire-pulse]');

  if (!cmdEl || !bodyEl || tabs.length === 0) return;

  const renderPreset = (key: string) => {
    const preset = presets[key];
    if (!preset) return;

    for (const tab of tabs) {
      const selected = tab.dataset.wireTab === key;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.classList.toggle('is-active', selected);
    }

    cmdEl.textContent = preset.cmd;
    if (descEl) descEl.textContent = preset.desc;
    if (statusEl) statusEl.textContent = preset.status;

    const frag = document.createDocumentFragment();
    for (const row of preset.rows) {
      const line = document.createElement('div');
      line.className = 'bson-line';

      const k = document.createElement('span');
      k.className = 'bson-key';
      k.textContent = row.key;

      const t = document.createElement('span');
      t.className = 'bson-type';
      t.textContent = row.tag;

      const v = document.createElement('span');
      v.className = row.warm ? 'bson-val bson-val--wire-warm' : 'bson-val bson-val--objectid';
      v.textContent = row.val;

      line.append(k, t, v);
      frag.append(line);
    }
    bodyEl.replaceChildren(frag);
  };

  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      const key = tab.dataset.wireTab;
      if (key) renderPreset(key);
    });
  }

  if (!pulseBar) return;

  let rafId = 0;
  let visible = true;
  let lastDraw = 0;
  const startTime = performance.now();

  const stopWire = () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const tick = (now: number) => {
    rafId = 0;
    if (isReduced || isCoarseOrNarrow() || !visible) return;
    if (now - lastDraw >= 50) {
      lastDraw = now;
      const elapsed = (now - startTime) / 1000;
      const phase = (elapsed * 0.25) % 1;
      const scale = 0.18 + phase * 0.82;
      pulseBar.style.transform = `scaleX(${scale.toFixed(3)})`;
    }
    rafId = window.requestAnimationFrame(tick);
  };

  const startWire = () => {
    if (!isReduced && !isCoarseOrNarrow() && visible && rafId === 0) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible) startWire();
          else stopWire();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(stage);
  }

  reducedQuery.addEventListener('change', (e: MediaQueryListEvent) => {
    if (e.matches) {
      stopWire();
      pulseBar.style.transform = 'scaleX(1)';
    } else {
      startWire();
    }
  });

  startWire();
}

function initRuntimeBus(): void {
  const stage = document.querySelector<HTMLElement>('[data-bus-stage]');
  if (!stage) return;

  const pulseBar = stage.querySelector<HTMLElement>('[data-bus-pulse]');
  const nodes = stage.querySelectorAll<HTMLElement>('[data-bus-target]');

  const setHighlight = (targetId: string | undefined, active: boolean) => {
    if (!targetId) return;
    const row = document.getElementById(targetId);
    if (row) row.classList.toggle('is-highlighted', active);
  };

  for (const node of nodes) {
    const targetId = node.dataset.busTarget;
    node.addEventListener('pointerenter', () => setHighlight(targetId, true));
    node.addEventListener('pointerleave', () => setHighlight(targetId, false));
    node.addEventListener('focus', () => setHighlight(targetId, true));
    node.addEventListener('blur', () => setHighlight(targetId, false));
  }

  if (!pulseBar) return;

  let rafId = 0;
  let visible = true;
  let lastDraw = 0;
  const startTime = performance.now();

  const stopBus = () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const tick = (now: number) => {
    rafId = 0;
    if (isReduced || isCoarseOrNarrow() || !visible) return;
    if (now - lastDraw >= 50) {
      lastDraw = now;
      const elapsed = (now - startTime) / 1000;
      const phase = (elapsed * 0.28) % 1;
      const scale = 0.2 + phase * 0.8;
      pulseBar.style.transform = `scaleX(${scale.toFixed(3)})`;
    }
    rafId = window.requestAnimationFrame(tick);
  };

  const startBus = () => {
    if (!isReduced && !isCoarseOrNarrow() && visible && rafId === 0) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible = entry.isIntersecting;
          if (visible) startBus();
          else stopBus();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(stage);
  }

  reducedQuery.addEventListener('change', (e: MediaQueryListEvent) => {
    if (e.matches) {
      stopBus();
      pulseBar.style.transform = 'scaleX(1)';
    } else {
      startBus();
    }
  });

  startBus();
}

function initTocSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-link[href^="#"]'));
  if (links.length === 0) return;

  const entries = links
    .map((link) => {
      const id = decodeURIComponent((link.getAttribute('href') ?? '').slice(1));
      const target = id ? document.getElementById(id) : null;
      return target ? { link, target } : null;
    })
    .filter((entry): entry is { link: HTMLAnchorElement; target: HTMLElement } => entry !== null);

  if (entries.length === 0) return;

  let activeLink: HTMLAnchorElement | null = null;
  const setActive = (next: HTMLAnchorElement) => {
    if (activeLink === next) return;
    for (const entry of entries) {
      const match = entry.link === next;
      entry.link.classList.toggle('is-active', match);
      if (match) entry.link.setAttribute('aria-current', 'location');
      else entry.link.removeAttribute('aria-current');
    }
    activeLink = next;
  };

  const update = () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
    let current = entries[0].link;
    if (nearBottom) {
      current = entries[entries.length - 1].link;
    } else {
      for (const entry of entries) {
        if (entry.target.getBoundingClientRect().top <= 160) {
          current = entry.link;
        } else {
          break;
        }
      }
    }
    setActive(current);
  };

  let scheduled = false;
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      update();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}

initRouteTransition();
initDirectionalButtons();
initDropdowns();
initReveals();
initNarrativeSync();
initShellStage();
initWireStage();
initRuntimeBus();
initTocSpy();
