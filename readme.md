# Wallet Watcher

A Node.js/TypeScript service to track crypto wallet addresses across multiple chains.

## Features

- Create and manage wallets
- Add wallet addresses with optional chain and label metadata
- Supports chains: EVM, SOL, BTC, TRX, TON, COSMOS
- Input validation and structured error responses
- Fully tested with Jest and Supertest

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Running the Server

```bash
# Development
npm run dev

# Production (after build)
npm run build
npm start
```

The server starts on port 3000 by default. Set the `PORT` environment variable to override.

## API Reference

### Wallets

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/wallets` | Create a wallet |
| GET | `/api/wallets` | List all wallets |
| GET | `/api/wallets/:id` | Get a wallet by ID |
| POST | `/api/wallets/:id/addresses` | Add an address to a wallet |
| GET | `/api/wallets/:id/addresses` | List addresses for a wallet |

### Create Wallet

```
POST /api/wallets
Content-Type: application/json

{ "name": "My Wallet" }
```

### Add Address

```
POST /api/wallets/:id/addresses
Content-Type: application/json

{
  "address": "0xAbCd...",
  "chain": "EVM",
  "label": "Main account"
}
```

`chain` is optional but must be one of: `EVM`, `SOL`, `BTC`, `TRX`, `TON`, `COSMOS`

## Testing

```bash
npm test
npm run test:coverage
```

## Linting

```bash
npm run lint
```

## Project Structure

```
src/
  __tests__/        # Tests (unit, repository, service, api)
  domain/           # Domain models (Wallet, WalletAddress)
  errors/           # AppError, NotFoundError, ValidationError, ConflictError
  repositories/     # In-memory repository implementations
  routes/           # Express route handlers
  services/         # Business logic services
  validation/       # Address and chain validators
  app.ts            # Express app factory
  server.ts         # Server bootstrap with DI
  index.ts          # Entry point
```
