import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Echo Nomad Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "Echo Nomad",
    version: "1.0.0"
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent command received",
      agent: "Echo Nomad Orchestrator",
      receivedAt: new Date().toISOString(),
      payload: body
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
