/** Vercel enquiry endpoint. Resend accepts the message before success is returned.
 * Existing RESEND_API_KEY / ENQUIRY_TO / ENQUIRY_FROM configuration is unchanged.
 * Photos pass through to the enquiry email; they are not written to this app's disk.
 */
const DEFAULT_TO = "Rohullah.rassuli@gmail.com";
const DEFAULT_FROM = "ROH Tiling Website <onboarding@resend.dev>";
const SERVICES = {
  "bathroom-tiling": "Bathroom tiling",
  "kitchen-tiling": "Kitchen tiling",
  "floor-tiling": "Floor tiling",
  waterproofing: "Waterproofing",
  "tile-repairs": "Tile repairs",
  "underfloor-heating": "Underfloor heating",
  "not-sure": "Not sure / more than one",
};
const escapeHtml = (value) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const textField = (value) => (typeof value === "string" ? value.trim() : "");
const validEmail = (value) =>
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validPhone = (value) =>
  /^\+?[\d\s\-()]{7,25}$/.test(value) && value.replace(/\D/g, "").length >= 7;

function attachment(photo) {
  if (!photo || typeof photo !== "object" || Array.isArray(photo))
    throw new Error("Invalid photo");
  if (
    typeof photo.content !== "string" ||
    photo.content.length > 2796204 ||
    photo.content.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(photo.content)
  )
    throw new Error("Invalid photo");
  const bytes = Buffer.from(photo.content, "base64");
  if (
    !bytes.length ||
    bytes.toString("base64") !== photo.content ||
    bytes.length > 2 * 1024 * 1024
  )
    throw new Error("Photo exceeds 2 MB");
  const type = photo.type;
  const valid =
    type === "image/jpeg"
      ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      : type === "image/png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : type === "image/webp"
          ? bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP"
          : false;
  if (!valid) throw new Error("Photo must be a JPG, PNG or WebP");
  // Use a fixed filename, never an untrusted path or header from the upload.
  return {
    filename: `project-photo.${type === "image/jpeg" ? "jpg" : type.split("/")[1]}`,
    content: photo.content,
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  if (!body || typeof body !== "object" || Array.isArray(body))
    return res.status(400).json({ ok: false, error: "Invalid request body" });
  // Silent spam response; accepted:false prevents a completed-enquiry event.
  if (textField(body.company))
    return res.status(200).json({ ok: true, accepted: false });
  const name = textField(body.full_name || body.name);
  const modern = "contact_detail" in body;
  const method =
    textField(body.preferred_contact) ||
    (textField(body.email) ? "email" : "phone");
  const contact = textField(modern ? body.contact_detail : body[method]);
  const suburb = textField(body.suburb);
  const service = textField(body.service);
  const description = textField(body.description || body.message);
  if (
    !name ||
    name.length > 120 ||
    !["email", "phone"].includes(method) ||
    !(method === "email" ? validEmail(contact) : validPhone(contact))
  )
    return res
      .status(400)
      .json({
        ok: false,
        error: "A name and valid phone number or email are required",
      });
  if (
    suburb.length > 160 ||
    description.length > 5000 ||
    service.length > 160 ||
    (modern && (!suburb || !SERVICES[service] || !description))
  )
    return res
      .status(400)
      .json({
        ok: false,
        error: "Add the suburb, service and a short description",
      });
  let photo;
  try {
    if (body.photo != null) photo = attachment(body.photo);
  } catch (error) {
    return res.status(400).json({ ok: false, error: error.message });
  }
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return res.status(503).json({ ok: false, code: "not_configured" });
  const rows = [
    ["Name", name],
    ["Reply by", method],
    [method === "email" ? "Email" : "Phone", contact],
    ["Suburb", suburb],
    ["Service", SERVICES[service] || service],
    ["Project details", description],
  ].filter(([, value]) => value);
  const text =
    rows.map(([label, value]) => `${label}: ${value}`).join("\n") +
    "\n\nSent from the ROH Tiling website.";
  const html =
    "<h2>New website enquiry</h2><dl>" +
    rows
      .map(
        ([label, value]) =>
          `<dt>${label}</dt><dd>${escapeHtml(value).replace(/\n/g, "<br>")}</dd>`,
      )
      .join("") +
    "</dl>";
  const requestId = textField(body.request_id);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(/^[a-f0-9-]{36}$/i.test(requestId)
          ? { "Idempotency-Key": `roh-enquiry-${requestId}` }
          : {}),
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || DEFAULT_FROM,
        to: [process.env.ENQUIRY_TO || DEFAULT_TO],
        ...(method === "email" ? { reply_to: contact } : {}),
        subject: `Website enquiry — ${name.replace(/[\r\n]/g, " ")}`,
        text,
        html,
        ...(photo ? { attachments: [photo] } : {}),
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error("Enquiry provider rejected request:", response.status);
      return res.status(502).json({ ok: false, error: "Enquiry not sent" });
    }
    // Confirms provider acceptance, not mailbox delivery or a booked job.
    return res.status(200).json({ ok: true, accepted: true });
  } catch {
    console.error("Enquiry provider unavailable");
    return res.status(502).json({ ok: false, error: "Enquiry not sent" });
  }
}
