/**
 * Where the contact and quote forms post to.
 *
 * The site is statically hosted, so it has no server of its own to receive a
 * form submission. Set this to the URL of a form handler (Formspree, Basin,
 * Getform, a Vercel function, or anything else that accepts a normal HTML form
 * POST) and both forms will submit without JavaScript and redirect to
 * /quote-sent on success.
 *
 * While it is empty the forms fall back to a mailto: submission, which opens
 * the visitor's mail client with the details filled in. That still works with
 * JavaScript turned off, but it depends on the visitor having a mail client
 * set up, so a real endpoint is worth wiring in.
 */
export const FORM_ENDPOINT = '';

/**
 * Field name the handler reads to decide where to send the browser after a
 * successful post. Formspree and Basin both use `_next`; change it if your
 * handler expects something else.
 */
export const FORM_REDIRECT_FIELD = '_next';
