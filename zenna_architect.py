import os
from dotenv import load_dotenv
from mcp import StdioServerParameters
from smolagents import CodeAgent, LiteLLMModel, ToolCollection

load_dotenv()

model = LiteLLMModel(
    model_id="gemini/gemini-2.5-flash",
    temperature=0.2
)

github_mcp_params = StdioServerParameters(
    command="npx",
    args=["-y", "@modelcontextprotocol/server-github"],
    env={"GITHUB_PERSONAL_ACCESS_TOKEN": os.getenv("GITHUB_PERSONAL_ACCESS_TOKEN")}
)

print("🤖 Initializing Zenna Lead Architect...")

try:
    with ToolCollection.from_mcp(github_mcp_params) as github_tools:
        agent = CodeAgent(
            tools=[*github_tools],
            model=model,
            additional_authorized_imports=["json", "os", "requests"]
        )
        print("🚀 Zenna Lead Architect awake! Auditing repository...")
        response = agent.run("Access 'J-Gsketch/Zenna1'. List root files and identify backend tech stack.")
        print("\n--- Report ---\n", response)
except Exception as e:
    print(f"❌ Error: {e}")