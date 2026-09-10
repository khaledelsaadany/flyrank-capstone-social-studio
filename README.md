# FlyRank Capstone — Social Media Studio

A resilient backend for ingesting long-form content, generating platform-specific variants, enforcing publishing constraints, reviewing content, scheduling campaigns, and publishing through pluggable adapters.

## Stack
- Node.js + Express
- SQLite via better-sqlite3
- Mock and real-capable social publisher adapters
- Durable scheduler with idempotency protection

## Run
```bash
npm install
npm run seed
npm start
```
Open `http://localhost:3000`.

## Test
```bash
npm test
```

## 30-hour implementation phases
1. Foundation and persistence — 5h
2. Ingestion, generation and validation — 5h
3. Human review workflow — 5h
4. Publisher adapters and idempotency — 5h
5. Durable scheduler and crash recovery — 5h
6. Dashboard, acceptance tests and documentation — 5h

## Repository
https://github.com/khaledelsaadany/flyrank-capstone-social-studio
