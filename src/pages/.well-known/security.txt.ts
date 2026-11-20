import site from '../../../site.config.mjs';

// RFC 9116. Built from the config so the addresses are spelled once; Expires is counted from each build.
export const GET = () => {
  const expires = new Date(Date.now() + site.securityTxtValidDays * 24 * 60 * 60 * 1000).toISOString();
  const lines = [
    '# Report security vulnerabilities privately to the security mailbox below.',
    '# Never post unpatched vulnerability details in a public issue.',
    `Contact: mailto:${site.contacts.security}`,
    `Contact: ${site.repo.issuesUrl}`,
    `Expires: ${expires}`,
    `Preferred-Languages: ${site.enabledLocales.map((l) => l.code).join(', ')}`,
    `Canonical: ${site.url}/.well-known/security.txt`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
