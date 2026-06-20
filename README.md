# vigil

A self-hosted VPS monitoring dashboard with a deliberately e-ink-inspired interface — built to feel like a reMarkable display rather than another dark-mode admin panel.

**Live demo:** _add URL once deployed_

---

## Why this exists

Most server dashboards default to the same look: dark background, neon accents, glowing charts. It's a fine aesthetic, but it's also the first thing an AI coding assistant reaches for, which makes every project look the same.

`vigil` takes a different reference point — paper-like e-ink displays (reMarkable, Boox). No gradients, no shadows, no glow. Just hairline borders, restrained grays, monospace numerals, and dithered block-character bars standing in for progress bars. The constraint forced more deliberate design decisions than a typical dark theme would.

It also tackles a real access-control problem: a monitoring dashboard you want to show publicly (e.g. to recruiters, as a "this is actually running" proof) without exposing full system internals — process names, mount paths, per-core load — to anyone who finds the URL.

## Features

- **Live system metrics** — CPU, memory, disk, and network usage, streamed in real time over Server-Sent Events
- **Two-tier access**
  - **Public** — aggregate CPU/memory/disk/network percentages and service up/down status, visible to anyone
  - **Authenticated** — per-core CPU breakdown, load average, disk mounts, network interfaces, and a live process table, gated behind a JWT-authenticated login
- **Dithered bar visualizations** — every percentage renders as a hand-built `▒`/`░` density bar instead of a standard progress bar, with color thresholds for warning/critical states
- **Light and dark themes** — both built on the same restrained e-ink palette, toggle persists across sessions
- **Fully responsive** — data tables collapse into stacked label/value cards on mobile rather than truncating

## Tech stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — async Python web framework
- [psutil](https://github.com/giampaolo/psutil) — system metrics collection
- [PyJWT](https://pyjwt.readthedocs.io/) + [bcrypt](https://github.com/pyca/bcrypt) — authentication
- [uv](https://github.com/astral-sh/uv) — package and environment management
- Server-Sent Events for live metric streaming (no WebSockets needed for one-way data)

**Frontend**
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- Plain CSS with custom properties — no utility framework, no component library
- `fetch` + `ReadableStream` for the authenticated SSE connection (native `EventSource` can't send credentials reliably cross-origin)

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Browser    │  SSE    │  FastAPI backend  │ psutil  │  VPS host   │
│  (React/TS)  │ ◄─────► │  /metrics/stream  │ ◄─────► │  /proc      │
│              │  JWT    │  /metrics/private │         │  /sys       │
└─────────────┘ cookie  └──────────────────┘         └─────────────┘
```

- The public stream (`/metrics/stream`) requires no auth and pushes aggregate metrics every 2 seconds.
- Logging in via `/auth/login` sets an `httpOnly` JWT cookie. The private stream (`/metrics/private/stream`) validates that cookie on every connection.
- The frontend conditionally renders the private dashboard sections only once `/auth/me` confirms a valid session.

## Local setup

### Prerequisites
- Node 18+
- Python 3.11+
- [uv](https://github.com/astral-sh/uv)

### Backend

```bash
cd backend
uv sync
cp .env.example .env   # set SECRET_KEY and ADMIN_PASSWORD
uv run uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. API docs available at `/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Screenshots

| Light | Dark |
|---|---|
| _add screenshot_ | _add screenshot_ |

| Desktop | Mobile |
|---|---|
| _add screenshot_ | _add screenshot_ |

## Roadmap

- [ ] Docker + Nginx reverse proxy, deployed to the actual VPS this dashboard monitors
- [ ] Network throughput percentage calibrated to the VPS's real link speed
- [ ] Historical CPU sparkline (rolling window, not just instantaneous value)
- [ ] Alert thresholds with visual/notification escalation
- [ ] SSL certificate expiry tracking
- [ ] Accessibility pass — `aria-live` regions for streaming data, keyboard navigation audit, contrast verification
- [ ] Component and hook test coverage
