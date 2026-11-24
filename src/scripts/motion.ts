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

function initRouteTransition(): void {
  const root = document.documentElement;
  const label = document.querySelector<HTMLElement>('[data-route-label]');
  if (!label) return;

  const clearTransition = () => {
    root.classList.remove('is-entering', 'is-entered');
  };
  window.addEventListener('pageshow', (event: PageTransitionEvent) => {
    if (event.persisted) clearTransition();
  });

  if (isReduced || isCoarseOrNarrow()) return;

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
    details.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && details.open) {
        details.open = false;
        summary?.focus();
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

  // Single-clock rAF ambient pulse (paused off-screen, on coarse/narrow touch devices, and under reduced motion).
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
      document.documentElement.classList.remove('is-entering', 'is-entered');
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
initShellStage();
initRuntimeBus();
initTocSpy();
