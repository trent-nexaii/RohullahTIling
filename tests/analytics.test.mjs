import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../public/js/analytics.js', import.meta.url), 'utf8');
const choiceKey = 'roh-analytics-choice-v1';

function setup(choice, { blockedStorage = false, path = '/contact' } = {}) {
  const elements = new Map(['consent', 'manage', 'accept', 'decline'].map(name => [
    `roh-analytics-${name}`, { hidden: true, addEventListener(_, handler) { this.click = handler; }, focus() {} }
  ]));
  const scripts = [];
  let reloads = 0;
  const context = vm.createContext({
    URL,
    localStorage: {
      getItem(key) { assert.equal(key, choiceKey); if (blockedStorage) throw new Error('Blocked'); return choice; },
      setItem(key, value) { assert.equal(key, choiceKey); if (blockedStorage) throw new Error('Blocked'); choice = value; }
    },
    document: {
      referrer: 'https://example.com/private/customer?email=qa@example.com#secret',
      querySelector() { return { href: `https://www.rohtiling.co.nz${path}` }; },
      getElementById(id) { return elements.get(id); },
      createElement() { return {}; },
      head: { appendChild(script) { scripts.push(script); } }
    },
    window: {
      location: { origin: 'https://www.rohtiling.co.nz', pathname: path, search: '?email=qa@example.com', hash: '#private', reload() { reloads++; } }
    }
  });
  if (path === '/404') context.window.location.pathname = '/unknown/customer@example.com';
  const run = () => vm.runInContext(source, context);
  const commands = () => Array.from(context.window.dataLayer || [], args => Array.from(args));
  run();
  return { context, scripts, run, commands, click: name => elements.get(`roh-analytics-${name}`).click(),
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

test('one official async tag and config survive repeated opt-in and duplicate inclusion', () => {
  const page = setup(null);
  page.click('accept');
  page.click('accept');
  page.run();
  assert.equal(page.scripts.length, 1);
  assert.equal(page.scripts[0].async, true);
  assert.equal(page.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-2PHKFXFMS7');
  const config = page.commands().filter(c => c[0] === 'config');
  assert.equal(config.length, 1);
  assert.equal(config[0][1], 'G-2PHKFXFMS7');
  assert.equal(config[0][2].send_page_view, true);
  assert.equal(config[0][2].page_location, 'https://www.rohtiling.co.nz/contact');
  assert.equal(config[0][2].page_referrer, 'https://example.com/');
  assert.equal(config[0][2].allow_google_signals, false);
  assert.equal(config[0][2].allow_ad_personalization_signals, false);
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
  const events = page.commands().filter(c => c[0] === 'event');
  assert.deepEqual(events.map(c => c[1]), ['click_to_call', 'email_click', 'generate_lead', 'generate_lead']);
  assert.deepEqual(Object.keys(events[0][2]).sort(), ['engagement_type', 'page_path']);
  assert.deepEqual(Object.keys(events[2][2]).sort(), ['form_type', 'page_path']);
  assert.equal(events[2][2].form_type, 'quote');
  assert.equal(events[3][2].form_type, 'contact');
  assert(!JSON.stringify(page.commands()).includes('qa@example.com'));
  assert(!JSON.stringify(page.commands()).includes('Private enquiry'));
});

test('404 measurement uses authored canonical path rather than an unknown request path', () => {
  const page = setup('accepted', { path: '/404' });
  assert.equal(page.commands().find(c => c[0] === 'config')[2].page_location, 'https://www.rohtiling.co.nz/404');
});

test('consent revocation suppresses subsequent events and reloads; blocked storage stays usable', () => {
  const page = setup('accepted');
  page.click('decline');
  page.context.window.rohAnalytics.record('roh_enquiry_success');
  assert.equal(page.reloads(), 1);
  assert.equal(page.commands().filter(c => c[0] === 'event').length, 0);
  const blocked = setup(null, { blockedStorage: true });
  assert.equal(blocked.scripts.length, 0);
  blocked.click('accept');
  assert.equal(blocked.scripts.length, 1);
});
