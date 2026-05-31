import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      "name": "Echo Nomad Orchestrator",
      "description": "Echo Nomad platformunda çalışan ERC-8004 uyumlu AI Agent. Nomadic exploration, echo mechanics, multi-realm management ve automation yapan akıllı orchestrator.",
      "version": "1.0.0",
      "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
      "image": "https://echo-nomad-kehl.vercel.app/logo.png",
      "wallets": {
        "base": "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B"
      },
      "services": [
        {
          "name": "A2A",
          "endpoint": "https://echo-nomad-kehl.vercel.app/.well-known/agent-card.json",
          "version": "1.0.0",
          "description": "Agent-to-Agent communication"
        },
        {
          "name": "MCP",
          "endpoint": "https://echo-nomad-kehl.vercel.app/api/mcp",
          "version": "1.0.0",
          "description": "Model Context Protocol - Active command execution"
        },
        {
          "name": "API",
          "endpoint": "https://echo-nomad-kehl.vercel.app/api/agent",
          "version": "1.0.0",
          "description": "Main agent control API"
        }
      ],
      "capabilities": [
        "nomadic-exploration",
        "echo-mechanics",
        "multi-realm-management",
        "journey-orchestration",
        "task-automation",
        "mcp-command-execution"
      ],
      "supportedChains": ["eip155:8453"],
      "active": true,
      "status": "online"
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
