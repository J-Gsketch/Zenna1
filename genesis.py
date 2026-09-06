import os
import subprocess
import webbrowser
import time

def print_step(msg):
    print(f"\n[🤖 Genesis Agent] {msg}...")

def run_genesis():
    print_step("Initializing your AI Agency Workspace")
    
    # 1. Create Directory Structure
    folders = ["agents", "memory", "config", "logs"]
    for folder in folders:
        os.makedirs(folder, exist_ok=True)
    
    # 2. Install Python Orchestrator Dependencies
    print_step("Installing smolagents and LLM routers")
    subprocess.run(["pip", "install", "-q", "smolagents", "python-dotenv", "google-genai"])

    # 3. Install MCP Global Tools (Headless connections)
    print_step("Installing Model Context Protocol (MCP) servers for GitHub and Databases")
    subprocess.run(["npm", "install", "-g", "-y", "@modelcontextprotocol/server-github", "@modelcontextprotocol/inspector"], shell=True)

    # 4. Handle GitHub Security Token
    print_step("I need GitHub access to manage the J-Gsketch/Zenna1 repo.")
    print("Opening your browser to the GitHub Token creation page...")
    time.sleep(2)
    # Opens directly to the fine-grained token generation page
    webbrowser.open("https://github.com/settings/tokens/new?description=Zenna-AI-Architect&scopes=repo,workflow")
    
    pat = input("\n🔑 Please generate the token, copy it, and paste it here: ").strip()
    
    # 5. Write Environment Variables securely
    with open(".env", "w") as f:
        f.write(f"GITHUB_PERSONAL_ACCESS_TOKEN={pat}\n")
        f.write("GEMINI_API_KEY=YOUR_FREE_GEMINI_KEY_HERE\n")
        f.write("DEEPSEEK_API_KEY=YOUR_FREE_DEEPSEEK_KEY_HERE\n")
    print_step("Credentials saved to secure .env file")

    # 6. Generate the Lead Architect Agent Code
    print_step("Writing the code for your Zenna Lead Architect")
    agent_code = """import os
from dotenv import load_dotenv
from smolagents import CodeAgent, HfApiModel, Tool

load_dotenv()

# We will configure this to route to Gemini 3 Flash or DeepSeek
model = HfApiModel(token=os.getenv("HF_TOKEN")) # Placeholder for your chosen free model

print("Zenna Lead Architect initialized. Waiting for repository context...")
# Tool definitions for MCP GitHub will go here
"""
    with open("agents/zenna_architect.py", "w") as f:
        f.write(agent_code)

    print("\n✅ Agency successfully scaffolded! Next steps:")
    print("1. Open the `.env` file and paste in your free Gemini/DeepSeek API keys.")
    print("2. Run `python agents/zenna_architect.py` to wake up your first employee.")

if __name__ == "__main__":
    run_genesis()
