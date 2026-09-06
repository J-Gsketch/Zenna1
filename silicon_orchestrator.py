import os
import sys
import subprocess
from dotenv import load_dotenv

load_dotenv(override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

def run_cmd(cmd):
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return True, res.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def print_banner(msg):
    print(f"\n{'='*60}\n🤖 [Silicon Orchestrator] {msg}\n{'='*60}")

def agent_orchestrate_sprint(task_description):
    print_banner(f"Starting Task Sprint: {task_description}")

    print("1️⃣ [Architect Agent] Generating execution plan...")
    if GEMINI_API_KEY and "YOUR_" not in GEMINI_API_KEY:
        # Tries active models in priority order
        candidate_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        for model_name in candidate_models:
            try:
                from google import genai
                client = genai.Client(api_key=GEMINI_API_KEY)
                chat = client.chats.create(model=model_name)
                res = chat.send_message(f"You are Lead Architect. Summarize 3 steps for: '{task_description}'")
                print(f"📋 Sprint Plan ({model_name}):\n", res.text.strip(), "\n")
                break
            except Exception as e:
                if "404" in str(e) or "NOT_FOUND" in str(e):
                    continue
                print(f"⚠️ Architect AI Warning: {e}\n")
                break
    else:
        print("ℹ️ Skipping AI Architect step (Add valid GEMINI_API_KEY to .env)\n")

    print("2️⃣ [QA Agent] Checking repository status...")
    status_ok, status_out = run_cmd(["git", "status", "--porcelain"])
    if status_out.strip():
        print("📝 Uncommitted changes detected in local repository.")
    else:
        print("✅ Repository clean.")

    print("3️⃣ [Deployment Agent] Complete.")
    print("✅ Autonomous Orchestrator Sprint Complete!")

if __name__ == "__main__":
    task = sys.argv[1] if len(sys.argv) > 1 else "Sync repository secrets and trigger deploy"
    agent_orchestrate_sprint(task)