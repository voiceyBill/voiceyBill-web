# VoiceyBill — Web Client

React web dashboard for tracking income and expenses with voice input, AI receipt scanning, analytics charts, and scheduled email reports.
The client supports multi-currency transaction entry and displays converted totals in the user's selected base currency.

## Tech stack

- **React 19** + **Vite**
- **Tailwind CSS v4** + **Radix UI** for styling and components
- **Redux Toolkit** + RTK Query for state and API calls
- **React Router v7** for navigation
- **Recharts** for analytics charts
- **TanStack Table** for transaction data tables

## Prerequisites

- **Node.js 20.0.0 or later** (`node --version` to check)
- **npm 10.0.0 or later** (`npm --version` to check)
- Git
- A running instance of the backend (see [voiceyBill-server README](https://github.com/voiceyBill/voiceyBill-server#readme))

> If you don't meet the Node/npm version requirement, download from https://nodejs.org/ (choose the LTS version 20+)

## Verify your setup

Before continuing, verify your machine meets the requirements:

```bash
node --version      # should be v20.0.0 or higher
npm --version       # should be 10.0.0 or higher
git --version       # should be 2.x or higher
```

**If versions are too old:**

- Download Node.js from https://nodejs.org/ (choose LTS v20+)
- Restart your terminal and verify again

**To verify the backend is running:**

```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

If this fails, start the backend first in another terminal (see [voiceyBill-server](https://github.com/voiceyBill/voiceyBill-server#readme)).

## Setup

```bash
cp .env.example .env
npm ci
```

### Environment variables

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:8000/api`) |

## Development

```bash
npm run dev       # starts dev server on http://localhost:5173
```

You should see:

```
VITE v6.x.x  build ready in xxx ms

➜  Local:   http://localhost:5173/
```

Open http://localhost:5173 in your browser. If you see the login page and can interact with it, the web app is working.

Other commands:

```bash
npm run build     # production build → dist/
npm run preview   # preview production build locally
npm run lint      # ESLint
```

## Features

- **Dashboard** — income/expense summary cards, area chart, recent transactions
- **Transactions** — full table with search, filters, bulk delete, CSV import, duplicate
- **Multi-currency** — base-currency setting, transaction currency picker, converted/original amount display
- **Voice input** — record a voice note and have it parsed into a transaction automatically
- **AI receipt scanning** — upload a receipt image and extract transaction details via AI
- **Reports** — view generated reports and schedule recurring email delivery
- **Analytics** — expense breakdown pie chart and trend data
- **Settings** — account profile, appearance (light/dark/system theme), billing

### Multi-currency UI

- Account Settings includes a base-currency dropdown loaded from the backend.
- Transaction forms include a currency picker next to the amount field.
- Foreign-currency transactions show the converted base amount and original amount.
- Dashboard summary cards, charts and expense breakdown values use the user's base currency.
- Voice and receipt flows can prefill the detected currency when the backend returns one.

## Contributing

Contributors should follow the repository `CONTRIBUTING.md` guide, use the issue templates for bugs, features, and questions, and complete the pull request template before review.

For visual changes, include screenshots or screen recordings directly in the issue or PR so reviewers can verify the result quickly.

## Design system

The UI is built on a two-layer token system defined in `src/index.css`.

**Semantic tokens** (Radix-style, theme-aware):

| Token                            | Light                  | Dark               |
| -------------------------------- | ---------------------- | ------------------ |
| `--background`                   | `oklch(1 0 0)`         | `oklch(0.141 ...)` |
| `--foreground`                   | `oklch(0.141 ...)`     | `oklch(0.985 0 0)` |
| `--primary`                      | near-black             | near-white         |
| `--muted` / `--muted-foreground` | subtle fill / dim text | same               |
| `--destructive`                  | red                    | brighter red       |

**Brand tokens** (fixed, theme-independent):

| Token                 | Value                   | Usage                                            |
| --------------------- | ----------------------- | ------------------------------------------------ |
| `--brand-green`       | `rgb(22, 97, 20)`       | Income chart series, accent highlights           |
| `--brand-green-light` | `rgb(159, 255, 89)`     | Hover states, badges                             |
| `--app-dark`          | `rgb(23, 23, 23)`       | Navbar, footer — always dark regardless of theme |
| `--surface-alt`       | `rgb(243, 244, 247)`    | Page section backgrounds (light)                 |
| `--surface-border`    | `rgba(23, 23, 23, 0.2)` | Subtle dividers                                  |

All tokens are consumed via Tailwind's `@theme inline` block, so they are available as utility classes (e.g. `bg-brand-green`, `text-app-dark`, `border-surface-border`).

## Troubleshooting

### Port 8000 already in use

If you get "address already in use", the backend server is already running or another app is on that port.

```bash
# Find what's using port 8000
npm run dev                    # web will be on http://localhost:5173
```

The web app connects to the backend at the URL you set in `VITE_API_URL`. Make sure the backend is running before testing API calls.

### Module not found or import errors

1. Clear `node_modules` and reinstall:

   ```bash
   rm -rf node_modules
   npm ci
   npm run dev
   ```

2. If using an old Node version, upgrade to Node 20+:
   ```bash
   node --version
   ```

### Build or lint failures

1. Check TypeScript:

   ```bash
   npx tsc --noEmit
   ```

2. Check ESLint:

   ```bash
   npm run lint
   ```

3. If still stuck, check the error message in the README or open an issue with the full output.

### Backend connection refused

If you see "connection refused" or 503 errors:

1. Verify the backend is running:

   ```bash
   curl http://localhost:8000/health
   ```

2. Check `VITE_API_URL` in `.env` matches your backend URL.

3. If using Docker for the backend database, verify it's running:
   ```bash
   docker ps | grep mongo
   ```
