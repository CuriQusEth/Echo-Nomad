import { NextRequest, NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Echo Nomad MCP Endpoint",
    status: "active",
    description: "Active MCP server for Echo Nomad Orchestrator Agent",
    capabilities: [
      "nomadic-exploration",
      "echo-mechanics",
      "multi-realm-management"
    ],
    timestamp: new Date().toISOString()
  }, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params } = body;

    if (method === 'initialize') {
      return NextResponse.json({
        protocolVersion: "1.0.0",
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: "Echo Nomad MCP Endpoint",
          version: "1.0.0"
        }
      }, { headers: CORS_HEADERS });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
        tools: [
          {
            name: 'get_race_status',
            description: 'Get current race status',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'start_race',
            description: 'Start a new race',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'get_leaderboard',
            description: 'Get race leaderboard',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'optimize_speed',
            description: 'Optimize nomad speed',
            inputSchema: { type: 'object', properties: {} }
          },
          {
            name: 'get_track_info',
            description: 'Get track information',
            inputSchema: { type: 'object', properties: {} }
          }
        ]
      }, { headers: CORS_HEADERS });
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      let resultText = `Executed ${toolName} successfully.`;
      
      switch (toolName) {
        case 'get_race_status':
          resultText = 'Race Status: Active. Current position: 3rd. Distance: 1540m.';
          break;
        case 'start_race':
          resultText = 'New race initiated in the Echo Nomad realm.';
          break;
        case 'get_leaderboard':
          resultText = 'Leaderboard: 1. 0xA1... (4200m), 2. 0xB2... (3800m).';
          break;
        case 'optimize_speed':
          resultText = 'Speed optimized. Energy efficiency increased by 12%.';
          break;
        case 'get_track_info':
          resultText = 'Track Info: Next checkpoint in 400m. Incoming sandstorm detected.';
          break;
        default:
          resultText = `Unknown tool: ${toolName}`;
      }

      return NextResponse.json({
        content: [{ type: 'text', text: resultText }]
      }, { headers: CORS_HEADERS });
    }

    if (method === 'prompts/list') { return NextResponse.json({ prompts: [] }, { headers: CORS_HEADERS }); }
    if (method === 'resources/list') { return NextResponse.json({ resources: [] }, { headers: CORS_HEADERS }); }

    return NextResponse.json({
      status: "success",
      message: "MCP command received",
      agent: "Echo Nomad Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({ error: "Invalid MCP request" }, { status: 400, headers: CORS_HEADERS });
  }
}
