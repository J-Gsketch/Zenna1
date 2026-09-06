import os
import json
import urllib.request
import base64
import re
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN", "").strip()
headers = {"User-Agent": "Zenna-Key-Scanner"}
if token:
    headers["Authorization"] = f"Bearer {token}"

print("🔍 Scanning J-Gsketch/Zenna1 repository for keys and credentials...\n")

target_files = [
    ".env.example",
    "firebase-applet-config.json",
    ".firebaserc",
    "metadata.json",
    "zenna_db.json",
    "server.ts",
    "db.ts",
    "SYSTEM_INSTRUCTIONS.md"
]

found_keys = {}

def fetch_file(path):
    try:
        url = f"https://api.github.com/repos/J-Gsketch/Zenna1/contents/{path}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return base64.b64decode(data.get("content", "")).decode("utf-8", errors="ignore")
    except Exception:
        return None

for fname in target_files:
    content = fetch_file(fname)
    if not content:
        continue
    
    print(f"📄 Scanned: {fname}")

    if fname.endswith(".json"):
        try:
            parsed = json.loads(content)
            if "apiKey" in parsed:
                found_keys["FIREBASE_API_KEY"] = parsed["apiKey"]
            if "projectId" in parsed:
                found_keys["FIREBASE_PROJECT_ID"] = parsed["projectId"]
            if "appId" in parsed:
                found_keys["FIREBASE_APP_ID"] = parsed["appId"]
            if "messagingSenderId" in parsed:
                found_keys["FIREBASE_MESSAGING_SENDER_ID"] = parsed["messagingSenderId"]
            if "projects" in parsed and "default" in parsed["projects"]:
                found_keys["FIREBASE_PROJECT_ID"] = parsed["projects"]["default"]
        except Exception:
            pass

    gemini_matches = re.findall(r'AIzaSy[A-Za-z0-9_-]{33}', content)
    if gemini_matches:
        found_keys["GEMINI_API_KEY"] = gemini_matches[0]

    stripe_sk = re.findall(r'sk_test_[A-Za-z0-9]{24,}', content) or re.findall(r'sk_live_[A-Za-z0-9]{24,}', content)
    if stripe_sk:
        found_keys["STRIPE_SECRET_KEY"] = stripe_sk[0]

    stripe_wh = re.findall(r'whsec_[A-Za-z0-9]{24,}', content)
    if stripe_wh:
        found_keys["STRIPE_WEBHOOK_SECRET"] = stripe_wh[0]

    twilio_sid = re.findall(r'AC[a-f0-9]{32}', content)
    if twilio_sid:
        found_keys["TWILIO_ACCOUNT_SID"] = twilio_sid[0]

print("\n" + "="*50)
print("🔑 EXTRACTED CREDENTIALS & CONFIGS:")
print("="*50)

if not found_keys:
    print("No hardcoded keys detected in target configs.")
else:
    for k, v in found_keys.items():
        masked = v[:8] + "..." + v[-4:] if len(v) > 12 else v
        print(f"  • {k} = {masked}")

    env_lines = []
    if os.path.exists(".env"):
        with open(".env", "r") as f:
            env_lines = f.readlines()
    
    existing_env = {}
    for line in env_lines:
        if "=" in line and not line.startswith("#"):
            k, v = line.strip().split("=", 1)
            existing_env[k] = v

    for k, v in found_keys.items():
        if k not in existing_env or "YOUR_" in existing_env[k] or not existing_env[k]:
            existing_env[k] = v

    with open(".env", "w") as f:
        for k, v in existing_env.items():
            f.write(f"{k}={v}\n")

    print("\n✅ Automatically merged extracted credentials into `.env`!")
print("="*50 + "\n")