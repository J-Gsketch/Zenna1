#!/usr/bin/env node

/**
 * Zenna Toolkit - MCP Server
 * This provides the agent with custom tools to manage the Zenna Application.
 */

const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");

const server = new Server(
  {
    name: "zenna-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "zenna_status",
        description: "Get the status of the Zenna application",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      }
    ],
  };
});

// Handle tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "zenna_status") {
    return {
      content: [{ type: "text", text: "Zenna Multi-Tenant backend is online and functional!" }],
    };
  }
  throw new Error("Tool not found");
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // console.error("Zenna MCP Server running on stdio"); // Logging to stderr to not corrupt JSON-RPC
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
