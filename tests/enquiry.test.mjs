import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/enquiry.js';

function response() {
  return { headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; } };
}
const body = { name: 'Local test', email: 'qa@example.com', message: '<script>example</script>' };

test('invalid requests and honeypot never contact the email provider', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected provider call'); });
  for (const [req, expected] of [
    [{ method: 'GET' }, 405],
    [{ method: 'POST', body: null }, 400],
    [{ method: 'POST', body: {} }, 400],
    [{ method: 'POST', body: { name: 'QA', email: 'bad' } }, 400],
    [{ method: 'POST', body: { company: 'bot' } }, 200],
  ]) {
    const res = response(); await handler(req, res); assert.equal(res.code, expected);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test('unconfigured delivery returns the existing fallback response', async () => {
  const saved = process.env.RESEND_API_KEY;
  try {
    delete process.env.RESEND_API_KEY;
    const res = response(); await handler({ method: 'POST', body }, res);
    assert.equal(res.code, 503); assert.equal(res.body.code, 'not_configured');
  } finally {
    if (saved === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved;
  }
});

test('provider acceptance, rejection and timeout preserve the endpoint contract', async (t) => {
  const saved = process.env.RESEND_API_KEY;
  try {
    process.env.RESEND_API_KEY = 'local-mock-only';
    const fetchMock = t.mock.method(globalThis, 'fetch', async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      assert(options.signal instanceof AbortSignal);
      const payload = JSON.parse(options.body);
      assert.equal(payload.reply_to, body.email);
      assert(payload.html.includes('&lt;script&gt;example&lt;/script&gt;'));
      return { ok: true };
    });
    let res = response(); await handler({ method: 'POST', body }, res);
    assert.equal(res.code, 200); assert.deepEqual(res.body, { ok: true });
    t.mock.method(console, 'error', () => {});
    fetchMock.mock.mockImplementation(async () => ({ ok: false, status: 429 }));
    res = response(); await handler({ method: 'POST', body }, res); assert.equal(res.code, 502);
    fetchMock.mock.mockImplementation(async () => { throw new DOMException('Mock timeout', 'TimeoutError'); });
    res = response(); await handler({ method: 'POST', body }, res); assert.equal(res.code, 502);
  } finally {
    if (saved === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved;
  }
});
