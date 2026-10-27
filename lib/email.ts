import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// Same card as the verification email, so every Fiscit email looks alike.
export function emailCard(title: string, text: string, button: { label: string; url: string }, footnote: string): string {
  return `<div style="max-width:480px;margin:0 auto;font-family:Inter,-apple-system,sans-serif;background:#111;border-radius:16px;padding:2.5rem;text-align:center;color:#f4f4f5">
<div style="font-size:1.5rem;font-weight:700;color:#4ade80;margin-bottom:0.5rem">Fiscit</div>
<h1 style="font-size:1.25rem;font-weight:600;margin-bottom:1rem;color:#f4f4f5">${title}</h1>
<p style="color:#a1a1aa;margin-bottom:2rem">${text}</p>
<a href="${button.url}" style="display:inline-block;padding:0.875rem 2rem;background:#4ade80;color:#080808;font-weight:700;font-size:1rem;border-radius:8px;text-decoration:none">${button.label}</a>
<p style="color:#52525b;font-size:0.8rem;margin-top:2rem">${footnote}</p>
</div>`
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!resend) {
    console.warn('RESEND_API_KEY missing: email not sent')
    return false
  }
  try {
    await resend.emails.send({ from: 'Fiscit <no-reply@fiscit.com>', to, subject, html })
    return true
  } catch (e) {
    console.error('Failed to send email:', e instanceof Error ? e.message : e)
    return false
  }
}
