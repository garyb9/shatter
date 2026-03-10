# shatter

a visual blockchain explorer — artistic display of onchain and IPFS open data

## stack

- **Next.js 15** + React 18 + TypeScript
- **viem v2** — Ethereum RPC client
- **@tanstack/react-query** — data fetching + 12s polling
- **styled-components** — dark theme CSS-in-JS
- no backend, no database, no auth — pure frontend

## pages

| route                | description                                               |
| -------------------- | --------------------------------------------------------- |
| `/`                  | home — live block/tx feed, search                         |
| `/explore`           | gas chart, latest blocks, quick nav                       |
| `/address/[address]` | wallet or contract — balance, tx history, token transfers |
| `/tx/[hash]`         | transaction — visual from→to flow, logs                   |
| `/block/[number]`    | block — header info, transaction list                     |
| `/ipfs/[cid]`        | IPFS content — renders markdown, images, JSON, text       |

## getting started

```bash
cp .env.example .env.local
# fill in your RPC URL and Etherscan API key
yarn install
yarn dev
```

## environment variables

```bash
# Ethereum RPC — Alchemy/Infura key recommended
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Etherscan — free tier at etherscan.io/apis
NEXT_PUBLIC_ETHERSCAN_API_KEY=YOUR_KEY
```

Without keys the app works but rate limits apply (public demo RPC, 1 req/5s Etherscan).

## scripts

```bash
yarn dev          # development server
yarn build        # production build
yarn type-check   # TypeScript check
yarn format       # prettier
yarn lint         # eslint
```

## data sources

- **Ethereum RPC** (viem) — blocks, transactions, balances, ENS
- **Etherscan API** — historical tx lists, token transfers
- **IPFS gateways** — ipfs.io, cloudflare-ipfs.com, gateway.pinata.cloud (fallback chain)
