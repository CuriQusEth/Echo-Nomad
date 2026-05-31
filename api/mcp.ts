import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS are handled by vercel.json, but we can do it here too
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Echo Nomad MCP Endpoint",
      status: "active",
      description: "Active MCP server for Echo Nomad Orchestrator Agent",
      capabilities: ["nomadic-exploration", "echo-mechanics", "multi-realm-management"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const { method, params, id, jsonrpc } = body || {};

      const wrapRpc = (result: any) => {
        if (jsonrpc) {
          return { jsonrpc: "2.0", id, result };
        }
        return result;
      };

      if (method === 'initialize') {
        return res.status(200).json(wrapRpc({
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "Echo Nomad MCP Endpoint", version: "1.0.0" }
        }));
      }

      if (method === 'tools/list') {
        return res.status(200).json(wrapRpc({
          tools: [
            { name: 'get_race_status', description: 'Get current race status', inputSchema: { type: 'object', properties: {} } },
            { name: 'start_race', description: 'Start a new race', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_leaderboard', description: 'Get race leaderboard', inputSchema: { type: 'object', properties: {} } },
            { name: 'optimize_speed', description: 'Optimize nomad speed', inputSchema: { type: 'object', properties: {} } },
            { name: 'get_track_info', description: 'Get track information', inputSchema: { type: 'object', properties: {} } }
          ]
        }));
      }

      if (method === 'tools/call') {
        const toolName = params?.name;
        let resultText = `Executed ${toolName} successfully.`;
        switch (toolName) {
          case 'get_race_status': resultText = 'Race Status: Active. Current position: 3rd. Distance: 1540m.'; break;
          case 'start_race': resultText = 'New race initiated in the Echo Nomad realm.'; break;
          case 'get_leaderboard': resultText = 'Leaderboard: 1. 0xA1... (4200m), 2. 0xB2... (3800m).'; break;
          case 'optimize_speed': resultText = 'Speed optimized. Energy efficiency increased by 12%.'; break;
          case 'get_track_info': resultText = 'Track Info: Next checkpoint in 400m. Incoming sandstorm detected.'; break;
          default: resultText = `Unknown tool: ${toolName}`;
        }
        return res.status(200).json(wrapRpc({ content: [{ type: 'text', text: resultText }] }));
      }

      if (method === 'prompts/list') { return res.status(200).json(wrapRpc({ prompts: [] })); }
      if (method === 'resources/list') { return res.status(200).json(wrapRpc({ resources: [] })); }

      return res.status(200).json(wrapRpc({
        status: "success",
        message: "MCP command received",
        agent: "Echo Nomad Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      }));

    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
