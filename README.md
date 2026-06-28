# UPI Transaction Summary

A digital-banking-style dashboard that parses unstructured UPI transaction
messages, auto-categorizes merchants, detects cashback-eligible purchases,
and visualizes spend with animated category breakdowns.


## What it does

- Parses raw text like `"Paid Rs.250 to Zomato"` into structured data
  (amount, direction, merchant)
- Auto-categorizes merchants (Zomato → Food & Dining, Uber → Travel, etc.),
  with word-boundary matching so lookalike names (e.g. "Uberoi Sweets")
  don't get miscategorized
- Detects salary credits via keyword **or** a known-employer list
- Injects a green "Expected Savings" row under cashback-eligible purchases
- Lets you manually override any transaction's category via dropdown —
  totals and charts recompute and animate instantly
- Separates incoming vs outgoing transactions with live totals
- Shows category spend as animated progress bars and a donut chart


## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Zustand, Framer Motion, Recharts |
| Backend | Node.js, Express, TypeScript |
| Shared | `shared-types` workspace package (types shared across frontend/backend) |
| Testing | Vitest, Supertest, React Testing Library |

## Project structure

```
upi-summary/
├── package.json                 # npm workspaces root
├── packages/
│   ├── shared-types/             # Category, Transaction, ApiResponse types
│   ├── backend/                  # Express API
│   │   └── src/
│   │       ├── parser/           # extracts amount/direction/merchant from text
│   │       ├── categorization/   # priority-chain category engine
│   │       ├── rewards/          # cashback detection + savings calculation
│   │       ├── repository/       # in-memory store behind an interface
│   │       ├── services/         # orchestrates parser → category → cashback
│   │       └── controllers/, routes/, app.ts
│   └── frontend/                 # React app
│       └── src/
│           ├── store/             # Zustand store + derived selectors
│           └── components/        # Dashboard, TransactionCard, Header, etc.
```

## Installation

**Requirements:** Node.js 18+ and npm.

```bash
git clone <your-repo-url>
cd upi-summary
npm install
```

Build the shared types package (required once, before anything else works):

```bash
npm run build --workspace=shared-types
```

Create environment files:

```bash
# macOS / Linux
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

```powershell
# Windows PowerShell
"PORT=4000" | Set-Content packages\backend\.env
"VITE_API_BASE_URL=http://localhost:4000/api" | Set-Content packages\frontend\.env
```

## Running the app

Open two terminals.

**Terminal 1 — backend:**
```bash
npm run dev:backend
```
Runs at `http://localhost:4000`. Verify with: `curl http://localhost:4000/api/transactions`

**Terminal 2 — frontend:**
```bash
npm run dev:frontend
```
Open the URL Vite prints (usually `http://localhost:5173`).

## Running tests

```bash
cd packages/backend
npx vitest run
```

Covers the parser, category engine, cashback engine, and full API routes
(23 tests, including edge cases like word-boundary merchant matching and
unparseable-message handling).

## How categorization works

1. **Salary check** — credit transactions are checked against a known-employer
   list (Infosys, TCS, etc.) and a `"salary"` keyword before anything else.
2. **Merchant lookup** — remaining transactions are matched against a
   merchant → category table using word-boundary regex, so `"Uberoi Sweets"`
   does not falsely match `"Uber"`.
3. **Fallback** — anything unmatched, or with no merchant at all, becomes
   `Miscellaneous`.

Messages with no extractable amount are logged to the console and dropped
rather than shown as empty/zero-value cards.

## Extending it

- Swap `InMemoryTransactionRepository` for a real database by implementing
  `ITransactionRepository` against Prisma/SQLite/Postgres — no other code
  needs to change.
- Add new merchants/categories by editing `merchantRules.ts` and
  `rewardPartners.ts` — no code logic changes required.
- Add authentication, real bank API ingestion, or AI-based categorization
  as a new pipeline stage alongside the parser/category/cashback engines.
