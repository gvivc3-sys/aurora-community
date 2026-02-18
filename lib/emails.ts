import { getResend } from "@/lib/resend";

const FROM = "Aurora Community <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auroracommunity.com";

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------

function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
  <tr><td style="padding:32px 40px 24px;border-bottom:1px solid #f0ece8;">
    <p style="margin:0;font-size:24px;font-style:italic;color:#1c1917;">Aurora</p>
  </td></tr>
  <tr><td style="padding:32px 40px;">
    ${body}
  </td></tr>
  <tr><td style="padding:24px 40px;border-top:1px solid #f0ece8;">
    <p style="margin:0;font-size:13px;color:#a8a29e;text-align:center;">
      &copy; ${new Date().getFullYear()} Aurora Community &mdash; You received this email because you have an account with us.
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function button(text: string, href: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="background-color:#1c1917;border-radius:6px;padding:12px 24px;">
    <a href="${href}" style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">${text}</a>
  </td></tr></table>`;
}

const textStyle = 'style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1c1917;"';

// ---------------------------------------------------------------------------
// Send helpers (fire-and-forget)
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(email: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to Aurora",
      html: emailLayout(
        "Welcome to Aurora",
        `<p ${textStyle}>Thanks for joining Aurora Community — we're glad you're here.</p>
         <p ${textStyle}>Aurora is a space for thoughtful conversation, shared learning, and genuine connection. Here's what to expect:</p>
         <ul style="margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.6;color:#1c1917;">
           <li>Curated discussions and resources</li>
           <li>Access to our private Telegram group (with a membership)</li>
           <li>Regular community events</li>
         </ul>
         ${button("Go to your dashboard", `${SITE_URL}/dashboard`)}
         <p ${textStyle}>See you inside.</p>`,
      ),
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}

export async function sendSubscriptionConfirmedEmail(email: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "You're in! Membership confirmed",
      html: emailLayout(
        "Membership Confirmed",
        `<p ${textStyle}>Your Aurora membership is confirmed — welcome to the inner circle.</p>
         <p ${textStyle}>You now have full access to everything Aurora has to offer, including our private Telegram group.</p>
         ${button("Set up Telegram access", `${SITE_URL}/dashboard`)}
         <p ${textStyle}>If you have any questions, just reply to this email. We're happy to help.</p>`,
      ),
    });
  } catch (err) {
    console.error("Failed to send subscription confirmed email:", err);
  }
}

export async function sendPaymentFailedEmail(email: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Payment update needed",
      html: emailLayout(
        "Payment Update Needed",
        `<p ${textStyle}>We had trouble processing your latest payment for Aurora.</p>
         <p ${textStyle}>This can happen when a card expires or your bank flags the charge. No worries — you can update your payment details below and keep your membership active.</p>
         ${button("Update billing info", `${SITE_URL}/dashboard`)}
         <p ${textStyle}>If you think this is a mistake, just reply to this email and we'll sort it out.</p>`,
      ),
    });
  } catch (err) {
    console.error("Failed to send payment failed email:", err);
  }
}

export async function sendSubscriptionCanceledEmail(email: string) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "We'll miss you",
      html: emailLayout(
        "Subscription Canceled",
        `<p ${textStyle}>Your Aurora membership has been canceled. We're sorry to see you go.</p>
         <p ${textStyle}>You'll continue to have access to your account, but premium features and Telegram access will be removed.</p>
         <p ${textStyle}>The door is always open if you'd like to come back — you can resubscribe anytime.</p>
         ${button("Resubscribe", `${SITE_URL}/dashboard`)}
         <p ${textStyle}>Thanks for being part of the community.</p>`,
      ),
    });
  } catch (err) {
    console.error("Failed to send subscription canceled email:", err);
  }
}
