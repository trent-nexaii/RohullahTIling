import { test } from "node:test";
import assert from "node:assert/strict";
import handler from "../api/enquiry.js";
const valid = {
  full_name: "Preview Test",
  preferred_contact: "phone",
  contact_detail: "021 000 0000",
  suburb: "Whitby",
  service: "bathroom-tiling",
  description: "Local automated test; no real delivery.",
  request_id: "d14a4562-335c-49e5-a3d8-940d79006c70",
};
async function call(body, method = "POST") {
  const res = {
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
  };
  await handler({ body, method }, res);
  return res;
}
test("phone/email enquiries, spam, photo validation and delivery failures", async (t) => {
  const original = globalThis.fetch;
  const previous = process.env.RESEND_API_KEY;
  process.env.RESEND_API_KEY = "local-test-only";
  let calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    return { ok: true };
  };
  try {
    await t.test(
      "phone-only enquiry has no reply-to and fixed destination",
      async () => {
        const res = await call(valid);
        assert.deepEqual(res.data, { ok: true, accepted: true });
        assert.equal(calls.length, 1);
        assert.equal(calls[0].body.reply_to, undefined);
        assert.deepEqual(calls[0].body.to, [
          process.env.ENQUIRY_TO || "Rohullah.rassuli@gmail.com",
        ]);
        assert.equal(
          calls[0].init.headers["Idempotency-Key"],
          "roh-enquiry-" + valid.request_id,
        );
      },
    );
    await t.test(
      "email reply-to is the validated contact and HTML is escaped",
      async () => {
        const res = await call({
          ...valid,
          full_name: "<script>Test</script>",
          preferred_contact: "email",
          contact_detail: "preview@example.test",
        });
        assert.equal(res.code, 200);
        assert.equal(calls.at(-1).body.reply_to, "preview@example.test");
        assert.ok(!calls.at(-1).body.html.includes("<script>"));
        assert.ok(calls.at(-1).body.html.includes("&lt;script&gt;"));
      },
    );
    await t.test("old deployed email form remains compatible", async () => {
      assert.equal(
        (
          await call({
            full_name: "Previous form",
            email: "preview@example.test",
            description: "Existing client",
          })
        ).code,
        200,
      );
    });
    await t.test(
      "honeypot accepts silently but does not confirm a lead or send mail",
      async () => {
        const count = calls.length;
        assert.deepEqual((await call({ ...valid, company: "spam" })).data, {
          ok: true,
          accepted: false,
        });
        assert.equal(calls.length, count);
      },
    );
    await t.test("invalid inputs never reach the provider", async () => {
      const count = calls.length;
      for (const body of [
        [],
        null,
        "broken JSON",
        { ...valid, contact_detail: "123----" },
        { ...valid, preferred_contact: "email", contact_detail: "bad@email" },
        { ...valid, service: "invented" },
        { ...valid, description: "" },
        { ...valid, full_name: "x".repeat(121) },
      ])
        assert.equal((await call(body)).code, 400);
      assert.equal(calls.length, count);
      assert.equal((await call(valid, "GET")).code, 405);
    });
    await t.test(
      "a genuine small photo is attached with a safe fixed name",
      async () => {
        const photo = {
          name: "../../private.png",
          type: "image/png",
          content:
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jH7sAAAAASUVORK5CYII=",
        };
        assert.equal((await call({ ...valid, photo })).code, 200);
        assert.equal(
          calls.at(-1).body.attachments[0].filename,
          "project-photo.png",
        );
        assert.equal(calls.at(-1).body.attachments[0].content, photo.content);
      },
    );
    await t.test(
      "the advertised 2 MB limit accepts a full-sized upload without regex overflow",
      async () => {
        const bytes = Buffer.alloc(2 * 1024 * 1024);
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(bytes);
        assert.equal(
          (
            await call({
              ...valid,
              photo: { type: "image/png", content: bytes.toString("base64") },
            })
          ).code,
          200,
        );
      },
    );
    await t.test(
      "wrong MIME, fake signature, invalid base64 and oversize uploads are rejected",
      async () => {
        const count = calls.length;
        for (const photo of [
          { type: "image/svg+xml", content: "PHN2Zz4=" },
          { type: "image/png", content: "aGVsbG8=" },
          { type: "image/png", content: "$$$$" },
          {
            type: "image/png",
            content: Buffer.alloc(2 * 1024 * 1024 + 1).toString("base64"),
          },
        ])
          assert.equal((await call({ ...valid, photo })).code, 400);
        assert.equal(calls.length, count);
      },
    );
    await t.test(
      "missing configuration reports unavailability, not success",
      async () => {
        delete process.env.RESEND_API_KEY;
        const count = calls.length;
        assert.equal((await call(valid)).code, 503);
        assert.equal(calls.length, count);
        process.env.RESEND_API_KEY = "local-test-only";
      },
    );
    await t.test(
      "provider failure and network failure never confirm a lead",
      async () => {
        globalThis.fetch = async () => ({ ok: false, status: 429 });
        assert.equal((await call(valid)).data.ok, false);
        globalThis.fetch = async () => {
          throw new Error("local test");
        };
        assert.equal((await call(valid)).code, 502);
      },
    );
  } finally {
    globalThis.fetch = original;
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  }
});
