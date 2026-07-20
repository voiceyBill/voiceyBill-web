import type { VercelRequest, VercelResponse } from "@vercel/node";

const SITE_DESCRIPTION = `# VoiceyBill

Personal financial platform — track income and expenses with voice input, AI receipt scanning, analytics charts, and scheduled email reports.

## Features

- **Voice Input** — Add transactions by speaking naturally
- **AI Receipt Scanning** — Snap a photo and auto-extract amount, category, and date
- **Analytics** — Visual breakdowns of spending by category and trends over time
- **Budget Tracking** — Set budgets and get alerts when you're close to limits
- **Scheduled Reports** — Receive financial summaries via email on your schedule

## API

Base URL: \`https://voiceybill-server.vercel.app/api\`

### Authentication

POST \`/auth/login\` with \`{"email": "...", "password": "..."}\` to receive a Bearer token.

### Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /transaction | List transactions (supports pagination, filtering) |
| POST | /transaction | Create a transaction |
| PUT | /transaction/:id | Update a transaction |
| DELETE | /transaction/:id | Delete a transaction |
| POST | /voice/transcribe | Create transaction via voice |
| POST | /transaction/scan-receipt | Extract data from receipt image |
| GET | /analytics/summary | Spending summary and trends |
| GET | /budget | List budgets |
| POST | /budget | Create a budget |

## Discovery

- [API Catalog](/.well-known/api-catalog)
- [MCP Server Card](/.well-known/mcp/server-card.json)
- [Agent Skills](/.well-known/agent-skills/index.json)
- [Auth Documentation](/auth.md)
- [OAuth Discovery](/.well-known/openid-configuration)

## Links

- Website: https://voiceybill.com
- GitHub: https://github.com/zainAwan9175/voiceyBill-web
`;

export default function handler(req: VercelRequest, res: VercelResponse) {
  const accept = req.headers["accept"] || "";

  if (accept.includes("text/markdown")) {
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("x-markdown-tokens", String(SITE_DESCRIPTION.split(/\s+/).length));
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(SITE_DESCRIPTION);
  } else {
    res.status(406).json({ error: "This endpoint only serves text/markdown" });
  }
}
