# GridWar — Backend

Node.js + Express + Socket.io + MongoDB

## Structure

```
backend/
├── src/
│   ├── index.js               # Entry point — boots Express + Socket.io
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── grid.js            # Grid constants (cols, rows, cooldown)
│   │   ├── gridStore.js       # In-memory grid state + helpers
│   │   └── userStore.js       # Online users in-memory map
│   ├── models/
│   │   ├── Block.js           # Mongoose block schema
│   │   └── User.js            # Mongoose user schema
│   ├── routes/
│   │   └── api.js             # REST endpoints
│   └── socket/
│       └── handlers.js        # All Socket.io event handlers
├── .env.example
└── package.json
```

## Setup

```bash
cd backend
cp .env.example .env          # Edit MONGO_URI if needed
npm install
npm run dev                   # Development with nodemon
npm start                     # Production
```

## Environment Variables

| Variable        | Default                              | Description                  |
|-----------------|--------------------------------------|------------------------------|
| PORT            | 5000                                 | Server port                  |
| MONGO_URI       | mongodb://localhost:27017/gridwar    | MongoDB connection string    |
| CLIENT_ORIGIN   | http://localhost:5173                | Allowed CORS origin          |
| COOLDOWN_MS     | 1500                                 | Cooldown between captures    |
| GRID_COLS       | 40                                   | Number of columns            |
| GRID_ROWS       | 25                                   | Number of rows               |

## REST API

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| GET    | /api/state       | Full grid state + leaderboard      |
| GET    | /api/leaderboard | Top 10 players by blocks owned     |
| GET    | /api/stats       | Grid stats + online users          |
| GET    | /api/health      | Health check                       |

## Socket.io Events

### Client → Server

| Event     | Payload                        | Description                  |
|-----------|--------------------------------|------------------------------|
| `join`    | `{ userId, name, color }`      | Register user on connect     |
| `capture` | `{ blockIndex }`               | Claim a block                |

### Server → Client

| Event             | Payload                                          | Description                     |
|-------------------|--------------------------------------------------|---------------------------------|
| `init`            | `{ grid, cols, rows, total, leaderboard, stats, cooldownMs }` | Full state on join  |
| `block_captured`  | `{ blockIndex, ownerId, ownerName, ownerColor, capturedAt, leaderboard, stats }` | Real-time capture broadcast |
| `presence_update` | `{ onlineCount, onlineUsers }`                   | Online user list update         |
| `cooldown`        | `{ remaining, msg }`                             | Cooldown rejection              |
| `error`           | `{ msg }`                                        | Error message                   |

## Architecture Decisions

- **In-memory grid** as primary state: all captures are O(1), reads are instant.
  MongoDB is written to asynchronously (fire-and-forget) so it never slows down real-time response.
- **In-memory user map** keyed by socket ID for O(1) lookup on every event.
- **Cooldown map** (userId → timestamp) prevents spam without a DB round-trip.
- **Socket.io `io.emit`** broadcasts to all clients at once — no fan-out loops.
- On server restart, in-memory state is hydrated from MongoDB so no data is lost.