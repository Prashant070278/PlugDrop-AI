"""Email sender via SMTP. Uses Hostinger SMTP by default.
Configure via env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, LEADS_TO.
If credentials are missing, send_email() returns False and the caller falls back to DB-only.
"""
import os
import smtplib
import ssl
import logging
from email.message import EmailMessage

logger = logging.getLogger(__name__)


def send_email(subject: str, html: str, text: str | None = None) -> bool:
    host  = os.environ.get("SMTP_HOST", "smtp.hostinger.com")
    port  = int(os.environ.get("SMTP_PORT", "465"))
    user  = os.environ.get("SMTP_USER")
    pwd   = os.environ.get("SMTP_PASS")
    sender = os.environ.get("SMTP_FROM", user or "no-reply@plugdrop.ai")
    to    = os.environ.get("LEADS_TO", "sales@plugdrop.ai")

    if not user or not pwd:
        logger.warning("SMTP credentials missing — skipping email send (subject=%s)", subject)
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"]    = sender
    msg["To"]      = to
    msg.set_content(text or "Please view this email in HTML.")
    msg.add_alternative(html, subtype="html")

    try:
        ctx = ssl.create_default_context()
        if port == 465:
            with smtplib.SMTP_SSL(host, port, context=ctx, timeout=15) as s:
                s.login(user, pwd)
                s.send_message(msg)
        else:
            with smtplib.SMTP(host, port, timeout=15) as s:
                s.starttls(context=ctx)
                s.login(user, pwd)
                s.send_message(msg)
        logger.info("Email sent to %s · subject=%s", to, subject)
        return True
    except Exception as e:
        logger.error("Email send failed: %s", e)
        return False


def format_lead_email(payload: dict) -> tuple[str, str]:
    name    = payload.get("name", "")
    email   = payload.get("email", "")
    company = payload.get("company", "")
    phone   = payload.get("phone", "")
    interest = payload.get("interest", "")
    message = payload.get("message", "")

    is_callback = interest == "callback" or "CALLBACK" in (message or "").upper()
    subject = f"[PlugDrop] {'⚡ Quick callback request' if is_callback else 'New demo request'} — {name} ({company or 'no company'})"

    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif;max-width:560px;margin:0 auto;color:#080808">
      <div style="background:linear-gradient(135deg,#8B5CF6,#6D28D9);color:#fff;padding:20px;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:20px">PlugDrop · {'⚡ Callback request' if is_callback else 'New demo request'}</h1>
        <div style="opacity:.85;margin-top:4px;font-size:13px">A visitor on plugdrop.ai needs a follow-up.</div>
      </div>
      <div style="background:#fff;border:1px solid #ede9fe;border-top:0;padding:20px;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 0;color:#6b7280;width:120px">Name</td><td style="font-weight:600">{name}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Email</td><td><a href="mailto:{email}">{email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Phone</td><td><a href="tel:{phone}">{phone}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Company</td><td>{company or '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280">Interest</td><td>{interest or '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;vertical-align:top">Message</td><td style="white-space:pre-wrap">{message or '—'}</td></tr>
        </table>
        <p style="margin:20px 0 0;color:#8B5CF6;font-weight:600">{'Please call back as soon as possible.' if is_callback else 'Reach out within 24 hours.'}</p>
      </div>
    </div>
    """
    text = (
        f"PlugDrop — {'Callback' if is_callback else 'Demo request'}\n\n"
        f"Name: {name}\nEmail: {email}\nPhone: {phone}\nCompany: {company or '—'}\n"
        f"Interest: {interest or '—'}\nMessage: {message or '—'}\n"
    )
    return subject, html
