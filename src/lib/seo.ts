import { SITE_URL } from '../data/business';

/** Established production URLs: HTTPS/www, root slash, no other trailing slash. */
export function canonicalUrlFor(path: string): string {
  const url = new URL(path, SITE_URL);
  if (url.origin !== new URL(SITE_URL).origin) {
    throw new Error('Canonical URLs must use the production site origin');
  }
  url.pathname = url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
  url.search = '';
  url.hash = '';
  return url.href;
}
