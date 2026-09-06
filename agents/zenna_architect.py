import os
import json
import urllib.request
import base64
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN", "").strip()
gemini_key = os.getenv("GEMINI_API_KEY", "").strip()

print("🤖 Zenna Lead Architect Initialized...\n")

headers = {"User-Agent": "Zenna-Architect"}
if token:
    headers["Authorization"] = f"Bearer {token}"

def get_file_content(path):
    try:
        url = f"https://api.github.com/repos/J-Gsketch/Zenna1/contents/{path}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            return base64.b64decode(data.get("content", "")).decode("utf-8", errors="ignore")
    except Exception:
        return None

# Fetch Repo Root
try:
    url = "https://api.github.com/repos/J-Gsketch/Zenna1/contents"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        files = [f["name"] for f in json.loads(resp.read().decode())]
        print(f"✅ Repository Context Pulled ({len(files)} files/folders in root)")

    # Fetch key stack configs
    pkg_raw = get_file_content("package.json")
    server_raw = get_file_content("server.ts")
    firebase_raw = get_file_content("firebase.json")

    print("\n" + "="*50)
    print("      🏗️ ZENNA1 REPOSITORY ARCHITECTURE AUDIT")
    print("="*50)

    if pkg_raw:
        pkg = json.loads(pkg_raw)
        deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
        print("\n📦 DEPENDENCIES & INTEGRATIONS:")
        for dep in sorted(deps.keys()):
            if any(k in dep.lower() for k in ["firebase", "twilio", "stripe", "express", "vite", "react", "openai", "google", "ai"]):
                print(f"  • {dep}: {deps[dep]}")

    print("\n⚡ BACKEND & INFRASTRUCTURE:")
    print(f"  • Entrypoint: {'server.ts' if 'server.ts' in files else 'index.js/app.js'}")
    print(f"  • Database: {'Firestore/Firebase + Local JSON (zenna_db.json)' if 'zenna_db.json' in files else 'Database identified'}")
    print(f"  • Hosting/Backend Config: {'firebase.json' if firebase_raw else 'Node Server'}")
    print(f"  • Frontend: Vite + TypeScript ({'vite.config.ts' if 'vite.config.ts' in files else 'Standard Static'})")

    if gemini_key and "YOUR_FREE" not in gemini_key:
        print("\n🧠 AI DEEP ANALYSIS (Gemini 2.5 Flash):")
        from google import genai
        client = genai.Client(api_key=gemini_key)
        res = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Analyze this codebase architecture. package.json: {pkg_raw[:1500] if pkg_raw else 'N/A'}. server.ts preview: {server_raw[:1500] if server_raw else 'N/A'}. Summarize core functionality and integration points."
        )
        print(res.text)

    print("\n="*50 + "\n")

except Exception as e:
    print(f"❌ Error during audit: {e}")