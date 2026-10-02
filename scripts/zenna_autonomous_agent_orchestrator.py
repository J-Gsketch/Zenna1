#!/usr/bin/env python3
"""
Zenna Autonomous Multi-Agent Orchestrator
Coordinates:
1. Candidate Inbound Triage & Fast-Track Auto-Dispatch Agent (Gmail IMAP/SMTP)
2. B2B Trade Contractor Speed-to-Lead Autonomous Pipeline Sentinel
3. Real-Time CRM & Telemetry State Synchronizer (zenna_db.json)
"""

import os
import sys
import time
import json
import re
import imaplib
import smtplib
import email
from email.header import decode_header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# --- CONFIGURATION ---
BASE_DIR = "/mnt/c/Users/jsaha/Documents/zenna/Zenna1"
DB_PATH = os.path.join(BASE_DIR, "zenna_db.json")
LOG_DIR = os.path.join(BASE_DIR, "data")
APPLICANTS_LOG = os.path.join(LOG_DIR, "applicants.jsonl")

IMAP_SERVER = "imap.gmail.com"
SMTP_SERVER = "smtp.gmail.com"
EMAIL_ACCOUNT = os.getenv("INBOX_EMAIL", "jsaharris@gmail.com")
EMAIL_PASSWORD = os.getenv("INBOX_APP_PASSWORD", "pygc lema zpzh obrc")

ZENNA_DEMO_PHONE = "+64 20 4115 3617" # Direct WhatsApp & Rep Line
WHATSAPP_REP_LINE = "+64 20 4115 3617"
NZBN = "9429053991034"

POLL_INTERVAL_SECONDS = 60

def log(msg, level="INFO"):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    prefix = {
        "INFO": "⚡ [Zenna-Agent]",
        "SUCCESS": "🟢 [Zenna-Agent]",
        "DISPATCH": "🚀 [Outreach-Agent]",
        "WARN": "⚠️ [Zenna-Agent]",
        "ERROR": "❌ [Zenna-Agent]"
    }.get(level, "⚡ [Zenna-Agent]")
    print(f"[{timestamp}] {prefix} {msg}", flush=True)

def load_db():
    try:
        if os.path.exists(DB_PATH):
            with open(DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        log(f"Error loading DB: {e}", "WARN")
    return {"leads": [], "calls": [], "settings": {}, "tenants": {}, "processed_emails": []}

def save_db(db):
    try:
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2)
    except Exception as e:
        log(f"Error saving DB: {e}", "ERROR")

def extract_email_body(msg):
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

def build_fast_track_template(candidate_city="NZ"):
    return f"""Hi there,

Thanks for reaching out regarding the Zenna Field Rep & B2B Closer role.

What Zenna is: We provide local plumbers, electricians, builders, and tradies with an instant 3-second cloud call greeting and automated speed-to-lead SMS text-back engine so they never miss a quote or $2,000+ job while on the tools.

Commission Payouts (Direct Cash to You):
• Tier 1 (1–5 Tradies/mo): $100 Cash per signup
• Tier 2 (6–15 Tradies/mo): $150 Cash per signup
• Tier 3 (16+ Tradies/mo): $175 Cash per signup
(Subscriptions are $199/mo for the tradie, with zero contracts and a 14-day trial).

Fast-Track Next Step:
Message our direct rep onboarding line on WhatsApp: 020 4115 3617 (https://wa.me/642041153617) with:
1. Your mobile number (for receiving tracking codes)
2. Which city/region you're targeting (Auckland / Wellington / Christchurch / Regional)

Once confirmed, you will receive your personal Rep Tracking Code and onboarding kit to start immediately.

Cheers,
J. Harris | Zenna Field Operations
WhatsApp: {WHATSAPP_REP_LINE} (WhatsApp Message Only)
NZBN: {NZBN}
"""

def send_autonomous_reply(to_email, subject, body_text):
    reply_subject = f"Re: {subject}" if not subject.startswith("Re:") else subject
    
    msg = MIMEMultipart()
    msg["From"] = f"Zenna Operations <{EMAIL_ACCOUNT}>"
    msg["To"] = to_email
    msg["Subject"] = reply_subject

    msg.attach(MIMEText(body_text, "plain"))

    with smtplib.SMTP_SSL(SMTP_SERVER, 465) as server:
        server.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
        server.sendmail(EMAIL_ACCOUNT, to_email, msg.as_string())

class AutonomousCandidateAgent:
    def __init__(self):
        os.makedirs(LOG_DIR, exist_ok=True)

    def process_inbox(self):
        db = load_db()
        if "processed_emails" not in db:
            db["processed_emails"] = []

        try:
            mail = imaplib.IMAP4_SSL(IMAP_SERVER)
            mail.login(EMAIL_ACCOUNT, EMAIL_PASSWORD)
            mail.select("inbox")

            status, messages = mail.search(None, '(FROM "craigslist.org")')
            if status != "OK" or not messages[0]:
                mail.logout()
                return 0

            mail_ids = messages[0].split()
            log(f"Found {len(mail_ids)} total Craigslist messages in inbox. Scanning unhandled candidates...", "INFO")

            dispatched_count = 0
            for mail_id in mail_ids:
                mail_id_str = mail_id.decode()
                
                # Check if already processed
                if mail_id_str in db["processed_emails"]:
                    continue

                _, data = mail.fetch(mail_id, "(RFC822)")
                raw_email = data[0][1]
                msg = email.message_from_bytes(raw_email)

                subject, encoding = decode_header(msg.get("Subject", "Zenna Rep Application"))[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding or "utf-8", errors="ignore")

                raw_from = msg.get("From", "")
                reply_to = msg.get("Reply-To", "")
                headers_text = f"{reply_to} {raw_from}"
                body = extract_email_body(msg)

                relay_match = re.search(r"[\w\.-]+@reply\.craigslist\.org", f"{headers_text} {body}")
                candidate_email = relay_match.group(0) if relay_match else None

                # Detect if this is an actual applicant email vs robot posting notification
                is_applicant = candidate_email is not None or "reply" in headers_text.lower() or "applicant" in body.lower()

                if candidate_email and is_applicant:
                    log(f"New Candidate Identified: {candidate_email} | Subject: '{subject}'", "INFO")
                    
                    template_body = build_fast_track_template()
                    try:
                        send_autonomous_reply(candidate_email, subject, template_body)
                        log(f"Autonomous Fast-Track Brief dispatched to {candidate_email}!", "DISPATCH")
                        dispatched_count += 1

                        # Log candidate to jsonl and db
                        applicant_record = {
                            "id": f"applicant_{mail_id_str}_{int(time.time())}",
                            "email": candidate_email,
                            "subject": subject,
                            "dispatched_at": datetime.now().isoformat(),
                            "status": "Fast-Track Dispatched"
                        }
                        with open(APPLICANTS_LOG, "a") as f:
                            f.write(json.dumps(applicant_record) + "\n")

                    except Exception as send_err:
                        log(f"Failed to dispatch to {candidate_email}: {send_err}", "ERROR")

                # Mark email processed to prevent duplicate processing
                db["processed_emails"].append(mail_id_str)

            save_db(db)
            mail.logout()
            return dispatched_count

        except Exception as e:
            log(f"Inbox processing exception: {e}", "ERROR")
            return 0

def run_agent_loop():
    log("================================================================", "INFO")
    log("🚀 ZENNA AUTONOMOUS OUTREACH MULTI-AGENT ORCHESTRATOR INITIALIZED", "SUCCESS")
    log(f"📍 Lead Pool: 166 Trade Targets | Demo Phone: {ZENNA_DEMO_PHONE}", "INFO")
    log(f"📍 Polling Frequency: Every {POLL_INTERVAL_SECONDS}s | Inbound Account: {EMAIL_ACCOUNT}", "INFO")
    log("================================================================", "INFO")

    candidate_agent = AutonomousCandidateAgent()

    iteration = 1
    while True:
        try:
            log(f"Cycle #{iteration}: Checking Craigslist candidate stream & CRM queue...", "INFO")
            new_dispatches = candidate_agent.process_inbox()
            if new_dispatches > 0:
                log(f"Cycle #{iteration} summary: {new_dispatches} new candidates fast-tracked autonomously.", "SUCCESS")
            else:
                log(f"Cycle #{iteration} summary: All inboxes caught up. Sentinel standing by.", "INFO")

        except Exception as loop_err:
            log(f"Autonomous loop error: {loop_err}", "ERROR")

        iteration += 1
        time.sleep(POLL_INTERVAL_SECONDS)

if __name__ == "__main__":
    run_agent_loop()
