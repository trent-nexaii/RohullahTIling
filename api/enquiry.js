/**
 * Contact-form handler — Vercel Serverless Function.
 *
 * Receives an enquiry from the contact page and emails it to the business via
 * Resend. No dependencies: Resend is a plain REST call and Node 18+ has fetch.
 *
 * Environment variables (set in Vercel → Settings → Environment Variables):
 *
 *   RESEND_API_KEY   required. From resend.com → API Keys.
 *   ENQUIRY_TO       optional. Defaults to the address below.
 *   ENQUIRY_FROM     optional. Must be on a domain verified in Resend, e.g.
 *                    "ROH Tiling <enquiries@rohullahtiling.co.nz>". Until the
 *                    domain is verified, Resend accepts "onboarding@resend.dev".
 *
 * If RESEND_API_KEY is absent this returns 503 with { code: "not_configured" },
 * which the client treats as a signal to fall back to the mailto: handoff. That
 * way the form keeps working before the key is added, and upgrades to real
 * server-side delivery the moment it is set — no code change needed.
 */

const DEFAULT_TO = 'Rohullah.rassuli@gmail.com';
const DEFAULT_FROM = 'ROH Tiling Website <onboarding@resend.dev>';

/** Readable labels for the email body, keyed by form field name. */
const LABELS = {
  full_name: 'Name',
  name: 'Name',
  phone: 'Phone',
  email: 'Email',
  suburb: 'Suburb',
  service: 'Service',
  description: 'Project details',
  message: 'Message',
  preferred_contact: 'Preferred contact method',
};

/** Order the fields sensibly regardless of how the browser serialises them. */
const ORDER = [
  'full_name', 'name', 'phone', 'email', 'suburb',
  'service', 'preferred_contact', 'description', 'message',
];

const MAX_FIELD = 5000;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body' });
  }

  // Honeypot: a hidden field no human fills in. Accept silently so bots do not
  // learn they were caught, but send nothing.
  if (String(body.company || '').trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.full_name || body.name || '').trim();
  const from = String(body.email || '').trim();
  if (!name || !from) {
    return res.status(400).json({ ok: false, error: 'Name and email are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ ok: false, code: 'not_configured' });
  }

  const keys = [
    ...ORDER.filter((k) => k in body),
    ...Object.keys(body).filter((k) => !ORDER.includes(k) && k !== 'company'),
  ];

  const rows = [];
  for (const key of keys) {
    const value = String(body[key] ?? '').trim().slice(0, MAX_FIELD);
    if (!value) continue;
    rows.push([LABELS[key] || key, value]);
  }

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    '\n\n— Sent from the contact form at rohullahtiling.co.nz';

  const html =
    '<h2 style="font-family:Georgia,serif;margin:0 0 16px">New website enquiry</h2>' +
    '<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">' +
    rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:6px 16px 6px 0;color:#6F6F6F;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td>` +
          `<td style="padding:6px 0"><strong>${escapeHtml(v).replace(/\n/g, '<br>')}</strong></td></tr>`
      )
      .join('') +
    '</table>' +
    '<p style="font-family:Arial,sans-serif;font-size:12px;color:#6F6F6F;margin-top:20px">' +
    'Sent from the contact form at rohullahtiling.co.nz. Reply directly to answer the enquirer.</p>';

  try {
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || DEFAULT_FROM,
        to: [process.env.ENQUIRY_TO || DEFAULT_TO],
        // So Rohullah can just hit reply and answer the customer directly.
        reply_to: from,
        subject: `Website enquiry — ${name}`,
        text,
        html,
      }),
    });

    if (!resend.ok) {
      console.error('Resend rejected the enquiry:', resend.status);
      return res.status(502).json({ ok: false, error: 'Delivery failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Enquiry provider unavailable');
    return res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}
