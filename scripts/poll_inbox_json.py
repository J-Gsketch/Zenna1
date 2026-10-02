import imaplib
import email
from email.header import decode_header
import re
import json
import time
import os
import sys

IMAP_SERVER = "imap.gmail.com"
EMAIL_ACCOUNT = os.getenv("INBOX_EMAIL", "jsaharris@gmail.com")
EMAIL_PASSWORD = os.getenv("INBOX_APP_PASSWORD", "pygc lema zpzh obrc")

def extract_body(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                charset = part.get_content_charset() or "utf-8"
                body += part.get_payload(decode=True).decode(charset, errors="ignore")
    else:
        charset = msg.get_content_charset() or "utf-8"
        body = msg.get_payload(decode=True).decode(charset, errors="ignore")
    return body

def parse_applicant(msg, body):
    raw_from = msg.get("From", "")
    reply_to = msg.get("Reply-To", "")
    headers_text = f"{reply_to} {raw_from}"

    relay_match = re.search(r"[\w\.-]+@reply\.craigslist\.org", f"{headers_text} {body}")
    applicant_relay = relay_match.group(0) if relay_match else None

    # City detection from subject or body
    city = "Regional NZ"
    combined = f"{headers_text} {body}".lower()
    if "auckland" in combined:
        city = "Auckland"
    elif "wellington" in combined:
        city = "Wellington"
    elif "christchurch" in combined:
        city = "Christchurch"
    elif "hamilton" in combined or "tauranga" in combined:
        city = "Tauranga / Waikato"
    elif "sydney" in combined:
        city = "Sydney"
    elif "melbourne" in combined:
        city = "Melbourne"
    elif "brisbane" in combined:
        city = "Brisbane"

    phone_match = re.search(
        r"(?:(?:\+?64|\+?61|\+?1)?\s*(?:\([0-9\s]+\)|[0-9]+)?[\s.-]*[0-9]{3,4}[\s.-]*[0-9]{3,4})",
        body
    )
    phone = phone_match.group(0).strip() if phone_match else "In Relay"

    return {
        "relay_email": applicant_relay or raw_from,
        "phone": phone,
        "city": city,
        "timestamp": msg.get("Date", time.strftime("%Y-%m-%d %H:%M:%S")),
        "body_preview": body[:350].replace("\n", " ").strip(),
        "status": "Ready for Fast-Track"
    }

def scan_inbox(limit=15):
    applicants = []
    try:
        mail = imaplib.IMAP4_SSL(IMAP_SERVER)
        mail.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
        mail.select("inbox")

        status, messages = mail.search(None, '(FROM "craigslist.org")')
        if status == "OK" and messages[0]:
            mail_ids = messages[0].split()
            # take most recent
            recent_ids = mail_ids[-limit:]
            for mail_id in reversed(recent_ids):
                _, data = mail.fetch(mail_id, "(RFC822)")
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)

                subject, encoding = decode_header(msg.get("Subject", "No Subject"))[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding or "utf-8", errors="ignore")

                body = extract_body(msg)
                app_info = parse_applicant(msg, body)
                app_info["subject"] = subject
                app_info["id"] = f"cl_{mail_id.decode()}"
                applicants.append(app_info)

        mail.logout()
    except Exception as e:
        return {"error": str(e), "applicants": []}

    return {"error": None, "applicants": applicants, "total": len(applicants)}

if __name__ == "__main__":
    result = scan_inbox()
    print(json.dumps(result))
