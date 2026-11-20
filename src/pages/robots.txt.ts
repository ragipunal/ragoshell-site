import site from '../../site.config.mjs';
import { robotsTxt } from '../lib/seo';

// Built from the config so the sitemap address follows the domain.
export const GET = () =>
  new Response(robotsTxt(`${site.url}/sitemap.xml`), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
