// Email notifications for contact-form messages, sent through Brevo's transactional API (free plan: 300/day).
// Server-only: the API key must never reach the browser, so none of these variables are NEXT_PUBLIC_.

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_FROM_ADDRESS || "";
const SENDER_NAME = process.env.BREVO_SENDER_NAME || process.env.EMAIL_FROM_NAME || "Portfolio Contact Form";
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || SENDER_EMAIL;

export const isEmailConfigured = Boolean(BREVO_API_KEY && SENDER_EMAIL && NOTIFY_EMAIL);

type ContactMessage = { name: string; email: string; subject: string; message: string };

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Sends the message to the site owner. Returns false (and logs) on failure instead of throwing. */
export async function sendContactNotification({ name, email, subject, message }: ContactMessage) {
  if (!isEmailConfigured) return false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#14161a">
      <h2 style="margin:0 0 16px">New message from your portfolio</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#5a606d;width:90px">Name</td><td style="padding:6px 0"><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#5a606d">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#5a606d">Subject</td><td style="padding:6px 0">${escapeHtml(subject || "(no subject)")}</td></tr>
      </table>
      <div style="margin:16px 0;padding:16px;background:#f0f2f5;border-radius:8px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>
      <p style="font-size:13px;color:#5a606d">Just hit <strong>Reply</strong> to answer ${escapeHtml(name)} directly.${
        siteUrl ? ` All messages are also in your <a href="${siteUrl}/admin/messages">admin inbox</a>.` : ""
      }</p>
    </div>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: NOTIFY_EMAIL }],
        replyTo: { email, name },
        subject: `Portfolio: ${subject || `New message from ${name}`}`,
        htmlContent: html,
        textContent: `From: ${name} <${email}>\nSubject: ${subject || "(no subject)"}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error("[email] Brevo error", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Brevo request failed:", error);
    return false;
  }
}
