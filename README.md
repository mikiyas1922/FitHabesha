# Fit Habesha Frontend

React + Tailwind CSS frontend for the Fit Habesha gym management system, structured for backend integration.

## Tech Stack

- **React 19** (JavaScript)
- **Vite** — dev server & production build
- **Tailwind CSS v4** — utility-first styling with design tokens
- **React Router v7** — role-based routing
- **Axios** — HTTP client with JWT interceptors
- **Lucide React** — icons

## Getting Started

```bash
npm install
cp .env.example .env   # optional — defaults to production API URL
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (default: Render production) |

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-only UI (staff registration modal)
│   ├── auth/           # ProtectedRoute, registration wizard
│   ├── brand/          # Logo / brand mark
│   ├── feedback/       # ErrorBoundary
│   ├── layout/         # DashboardLayout, Sidebar, Header
│   └── ui/             # Reusable primitives (Button, Card, Table, AsyncState)
├── config/             # API endpoints, navigation, registration schemas
├── constants/          # Routes, storage keys
├── contexts/           # AuthContext, ThemeContext
├── data/               # Mock/fallback data (used when API unavailable)
├── hooks/              # useAsync, useResourceList
├── pages/              # Route pages by role (admin, auth, member, trainer, receptionist)
├── services/           # API service layer (auth, members, trainers, equipment, lockers)
└── utils/              # Auth helpers, API normalizers, formatters
```

## Backend Integration

### Live today
- **Auth** — login, register, logout, refresh
- **Admin staff** — `POST /admin/register` with role assignment

### Integration-ready (services + hooks wired)
- Members list — `memberService.getAllMembers()`
- Trainers list — `trainerService.getAllTrainers()`
- Equipment list — `equipmentService.getAllEquipment()`
- Lockers list — `lockerService.getAllLockers()`

Pages use `useResourceList` to fetch from the API and gracefully fall back to mock data when endpoints are unavailable.

### Adding a new feature
1. Add endpoint to `src/config/api.js`
2. Add methods to a service in `src/services/`
3. Create/use a hook in `src/hooks/`
4. Build the page using `AsyncState` components for loading/error/empty states
5. Normalize API responses in `src/utils/apiHelpers.js`

## Routes

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | Sign in |
| `/register` | Public | Member/trainer registration |
| `/admin` | Admin | Dashboard |
| `/admin/staff` | Admin | Add staff & assign roles |
| `/admin/members` | Admin | Members management |
| `/admin/trainers` | Admin | Trainers management |
| `/trainer/*` | Trainer | Trainer portal |
| `/receptionist/*` | Reception | Front desk portal |
| `/member/*` | Member | Member portal |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run oxlint

## Design

Based on the Fit Habesha gym management design. Uses semantic Tailwind tokens (`bg-surface`, `text-foreground`, `text-muted`, `border-border`, `bg-primary`) defined in `src/index.css`.
