# Echo Nomad Orchestrator

A highly atmospheric, post-apocalyptic Web3 survival and exploration game, orchestrated by an ERC-8004 compliant AI Agent. Built for Base Mainnet.

## Project Overview

In **Echo Nomads**, players navigate a desolate yet serene world, managing essential survival resources while uncovering ancient relics and broadcasting their resonance on-chain. This repository powers the AI Orchestrator that manages nomadic exploration patterns, echo mechanics, and multi-realm task automation.

### Tech Stack
- Frontend: React / Next.js (App Router API compatible via `/app/api`)
- Web3: Base Mainnet, Wagmi, Viem
- AI/Agent: ERC-8004 Compliant, Model Context Protocol (MCP)

### Agent Capabilities

The Echo Nomad platform employs a modular AI agent to control exploration patterns. 
Registered capabilities include:
- `nomadic-exploration`
- `echo-mechanics`
- `multi-realm-management`
- `journey-orchestration`
- `task-automation`
- `mcp-command-execution`

### Agent Registration (ERC-8004)

The agent card is openly accessible and conforms to EIP-8004 registration standards:
```
GET /.well-known/agent-card.json
```

It exposes three primary services:
1. **A2A**: Agent-to-Agent communication
2. **MCP**: Model Context Protocol - Active command execution
3. **API**: Main agent control API

### MCP Connection Guide

The Orchestrator exposes an MCP (Model Context Protocol) API to allow advanced orchestration:

- **Endpoint**: `POST /api/mcp`
- **Supported Methods**: 
  - `initialize`
  - `tools/list`
  - `tools/call`

*Note: Production URLs, API endpoints, and smart contract connection environments are securely provided by the Echo Nomad system orchestrator and excluded from public repository templates.*

## Local Development

If you are running the project locally:

1. Install dependencies
2. Start the development server (`npm run dev`)
3. Access the primary endpoints at `http://localhost:3000`
