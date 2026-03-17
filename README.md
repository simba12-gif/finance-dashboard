# Vault — AI Personal Finance Dashboard

A full-stack AI-powered personal finance dashboard built with Next.js, Plaid, and OpenAI. Connect your bank accounts, analyze spending patterns, and chat with an AI about your finances.

![Dashboard](screenshots/screenshot-dashboard.png)

---

## Features

- **Account Overview** — Connect bank accounts via Plaid and view live balances across checking, savings, and credit accounts
- **Net Worth Tracking** — Real-time net worth calculation based on assets and debt
- **Spending Analytics** — Visual breakdown of spending by category with horizontal bar charts
- **Transactions Page** — Browse all transactions with search, category filter, date range filter, and CSV export
- **Analytics Page** — Detailed spending breakdown with percentage share per category
- **AI Chat** — GPT-4o powered chat that answers questions about your financial data in natural language
- **Plaid Sandbox** — Test with realistic fake bank data using Plaid's sandbox environment

---

## Screenshots

### Dashboard
![Dashboard](screenshots/screenshot-dashboard.png)

### Transactions
![Transactions](screenshots/screenshot-transactions.png)

### Category filter
![Filters](screenshots/screenshot-filters.png)

### AI Chat
![AI Chat](screenshots/screenshot-chat.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS |
| UI Components | shadcn/ui |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Bank Integration | Plaid API |
| AI Chat | OpenAI GPT-4o |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Plaid developer account (free sandbox)
- OpenAI API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/simba12-gif/finance-dashboard.git
cd finance-dashboard
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/finance_dashboard?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-string"

# Plaid
PLAID_CLIENT_ID="your-plaid-client-id"
PLAID_SECRET="your-plaid-sandbox-secret"
PLAID_ENV="sandbox"

# OpenAI
OPENAI_API_KEY="sk-..."
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. Navigate to the dashboard at `/dashboard`
2. Click **Connect bank** to link a sandbox bank account
3. Use Plaid sandbox credentials:
   - Username: `user_good`
   - Password: `pass_good`
4. Your transactions and balances will sync automatically
5. Browse transactions at `/transactions`
6. View spending analytics at `/analytics`
7. Chat with the AI at `/chat`

---

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/      # Main dashboard page
│   │   ├── transactions/   # Transactions with filters
│   │   ├── analytics/      # Spending analytics
│   │   ├── chat/           # AI chat interface
│   │   └── settings/       # User settings
│   └── api/
│       ├── plaid/          # Plaid integration routes
│       ├── dashboard/      # Dashboard data API
│       ├── transactions/   # Transactions API
│       └── chat/           # AI chat API
├── components/
│   ├── Sidebar.js          # Navigation sidebar
│   └── PlaidLink.js        # Bank connection component
└── lib/
    ├── prisma.js            # Prisma client singleton
    └── plaid.js             # Plaid client singleton
prisma/
└── schema.prisma            # Database schema
```

---

## Key Technical Decisions

**Plaid for bank data** — Industry standard for financial data aggregation. The same API used by Venmo, Robinhood, and Coinbase. Sandbox mode allows full testing without real bank credentials.

**Prisma ORM** — Type-safe database queries with automatic migration management. Schema-first approach makes the data model easy to understand and modify.

**Next.js API Routes** — Full-stack in a single framework. Backend endpoints live alongside frontend pages, simplifying deployment and reducing context switching.

**RAG for AI Chat** — The chat feature uses Retrieval Augmented Generation — financial data is injected into GPT-4o's context window before each message, allowing accurate answers about the user's specific financial situation.

**shadcn/ui** — Components are copied directly into the codebase rather than installed as a black-box library, giving full control over styling and behaviour.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | App URL for NextAuth |
| `NEXTAUTH_SECRET` | Secret for session encryption |
| `PLAID_CLIENT_ID` | Plaid API client ID |
| `PLAID_SECRET` | Plaid sandbox or production secret |
| `PLAID_ENV` | `sandbox` or `production` |
| `OPENAI_API_KEY` | OpenAI API key for chat feature |

---

## License

MIT

---

Built by [simba12-gif](https://github.com/simba12-gif)
