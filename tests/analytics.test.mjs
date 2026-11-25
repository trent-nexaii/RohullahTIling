import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/js/analytics.js', import.meta.url), 'utf8');
const choiceKey = 'roh-analytics-choice-v1';

function setup(choice, { blockedStorage = false, path = '/contact', preview = false, search = '?email=qa@example.com' } = {}) {
  const elements = new Map(['consent', 'manage', 'accept', 'decline'].map(name => [
    `roh-analytics-${name}`, { hidden: true, addEventListener(_, handler) { this.click = handler; }, focus() {} }
  ]));
  const scripts = [];
  let reloads = 0;
  const sessionStorage = new Map();
  const requestPath = path === '/404' ? '/unknown/customer@example.com' : path;
  const context = vm.createContext({
    URL,
    URLSearchParams,
    sessionStorage: { getItem: key => sessionStorage.get(key), setItem: (key, value) => sessionStorage.set(key, value) },
    localStorage: {
      getItem(key) { assert.equal(key, choiceKey); if (blockedStorage) throw new Error('Blocked'); return choice; },
      setItem(key, value) { assert.equal(key, choiceKey); if (blockedStorage) throw new Error('Blocked'); choice = value; }
    },
    document: {
      currentScript: { dataset: { preview: String(preview) } },
      referrer: 'https://example.com/private/customer?email=qa@example.com#secret',
      querySelector() { return { href: `https://www.rohtiling.co.nz${path}` }; },
      getElementById(id) { return elements.get(id); },
      createElement() { return {}; },
      head: { appendChild(script) { scripts.push(script); } }
    },
    window: {
      location: { href: `https://www.rohtiling.co.nz${requestPath}${search}#private`, search, reload() { reloads++; } }
    }
  });
  const run = () => vm.runInContext(source, context);
  const commands = () => Array.from(context.window.dataLayer || []);
  const events = () => commands().filter(entry => entry.event && entry.event !== 'gtm.js');
  const boot = () => commands().find(entry => entry.event === 'gtm.js');
  run();
  return { context, scripts, run, commands, events, boot, click: name => elements.get(`roh-analytics-${name}`).click(),
    banner: elements.get('roh-analytics-consent'), reloads: () => reloads };
}

test('unaccepted and declined visitors load no tag and queue no contact events', () => {
  for (const choice of [null, 'declined']) {
    const page = setup(choice);
    page.context.window.rohAnalytics.record('roh_enquiry_success');
    page.context.window.rohAnalytics.record('roh_email_click');
    assert.equal(page.scripts.length, 0);
    assert.equal(page.commands().length, 0);
    assert.equal(page.banner.hidden, choice === 'declined');
  }
});

test('one official async GTM load survives repeated opt-in and duplicate inclusion', () => {
  const page = setup(null);
  page.click('accept');
  page.click('accept');
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].async, true);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-MW3J6S4L');
  assert.equal(page.commands().filter(entry => entry.event === 'gtm.js').length, 1);
  assert.equal(page.boot().roh_page_location, 'https://www.rohtiling.co.nz/contact');
  assert.equal(page.boot().roh_page_referrer, 'https://example.com/');
  assert.equal(page.commands().filter(entry => entry[0] === 'consent').length, 2);
  const defaults = page.commands()[0];
  assert.equal(defaults[0], 'consent');
  assert.equal(defaults[1], 'default');
  assert.equal(defaults[2].ad_storage, 'denied');
});

test('contact events expose only allowed metadata; unknown events are ignored', () => {
  const page = setup('accepted');
  const record = page.context.window.rohAnalytics.record;
  const privateDetail = { form: 'quote', email: 'qa@example.com', message: 'Private enquiry', phone: '123456789' };
  record('roh_click_to_call', privateDetail);
  record('roh_email_click', privateDetail);
  record('roh_enquiry_success', privateDetail);
  record('roh_enquiry_success', { ...privateDetail, form: 'untrusted value' });
  record('form_submit', privateDetail);
  const events = page.events();
  assert.deepEqual(events.map(entry => entry.event), ['phone_click', 'email_click', 'generate_lead', 'generate_lead']);
  assert.equal(events[0].roh_form_type, undefined);
  assert.equal(events[1].roh_form_type, undefined);
  assert.equal(events[2].roh_form_type, 'quote');
  assert.equal(events[3].roh_form_type, 'contact');
  assert(!JSON.stringify(page.commands()).includes('qa@example.com'));
  assert(!JSON.stringify(page.commands()).includes('Private enquiry'));
});

test('404 measurement uses authored canonical path rather than an unknown request path', () => {
  const page = setup('accepted', { path: '/404' });
  assert.equal(page.boot().roh_page_location, 'https://www.rohtiling.co.nz/404');
});

test('consent revocation suppresses subsequent events and reloads; blocked storage stays usable', () => {
  const page = setup('accepted');
  page.click('decline');
  page.context.window.rohAnalytics.record('roh_enquiry_success');
  assert.equal(page.reloads(), 1);
  assert.equal(page.events().length, 0);
  const blocked = setup(null, { blockedStorage: true });
  assert.equal(blocked.scripts.length, 0);
  blocked.click('accept');
  assert.equal(blocked.scripts.length, 1);
});

test('only recognised GBP attribution values survive query sanitisation', () => {
  const gbp = setup('accepted', { search: '?utm_source=google&utm_medium=organic&utm_campaign=google_business_profile&email=qa@example.com' });
  assert.equal(gbp.boot().roh_page_location, 'https://www.rohtiling.co.nz/contact?utm_source=google&utm_medium=organic&utm_campaign=gbp');
  const other = setup('accepted', { search: '?utm_source=google&utm_medium=organic&utm_campaign=qa@example.com&gclid=private' });
  assert.equal(other.boot().roh_page_location, 'https://www.rohtiling.co.nz/contact');
});

test('preview analytics requires an explicit Tag Assistant session and consent', () => {
  assert.equal(setup('accepted', { preview: true }).scripts.length, 0);
  assert.equal(setup('declined', { preview: true, search: '?gtm_debug=1' }).scripts.length, 0);
  const debug = setup('accepted', { preview: true, search: '?gtm_debug=1' });
  assert.equal(debug.scripts.length, 1);
  assert.equal(debug.boot().roh_page_location, 'https://www.rohtiling.co.nz/contact');
});
