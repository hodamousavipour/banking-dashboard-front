# Banking Dashboard — Frontend

This repository contains the frontend for a finance dashboard built with React + TypeScript and Vite. 
This project uses a feature-based architecture, where each feature (Transactions, Dashboard) contains its own components, hooks, API calls, and validation.
All network requests go through a centralized Axios API layer, while TanStack React Query handles caching, mutations, and data synchronization.
Form logic is isolated using React Hook Form + Zod, and UI state (like theme toggling) is managed with Zustand.
The entire backend is simulated using MSW, with a fully mocked API for development and testing. The project also includes test coverage built with Vitest and Testing Library.

This README explains how to set up, run, test and work with the codebase, and gives a short architecture overview and recommended next steps.

## Quick start

Requirements: Node.js 18+ (or compatible), npm or yarn.

Run the dev server (Vite):

```bash
npm run dev
# or
yarn dev
```

Run tests:

```bash
npm test
# interactive UI runner
npm run test:ui
# watch mode
npm run test:watch
```

## What you'll find in this repo

Top-level layout
- `src/app` — application bootstrap, routing, and top-level layouts (`App.tsx`, `main.tsx`, `routes`, `layout`).
- `src/features` — feature folders (dashboard, transactions). Each feature groups `api`, `hooks`, `components` and `pages`.
- `src/shared` — shared UI components, hooks, utilities, and constants used across features.
- `src/lib` — small client and helpers (e.g., `apiClient.ts`, `queryClient.ts`, formatters).
- `src/mocks` — MSW handlers and browser/server setup used for local development and tests.

Key files
- `src/app/main.tsx` — initializes MSW in dev and mounts the app.
- `src/app/App.tsx` — root composition (QueryClientProvider, Router, ErrorBoundary).
- `src/lib/apiClient.ts` — axios client used by feature APIs.
- `src/lib/queryClient.ts` — React Query client configuration.
- `src/mocks/handlers.ts` — in-memory handlers for `/transactions` and `/summary`.

Testing
- Tests are written with Vitest and Testing Library. MSW is used to mock network calls in integration tests.
- Common test patterns: mock hooks or small components in feature-level tests; use the real `handlers` for API integration tests.

Architecture & conventions
- Feature-first organization: logic for a domain (transactions, dashboard) lives next to its UI.
- Types and validation: uses `zod` for schema validation and `react-hook-form` for forms.
- State: React Query for server state; small local state via hooks and Zustand for persisted theme.
- Styling: Tailwind CSS.

Developer notes & recommendations
- Error handling: consider centralizing error normalization in `src/lib/apiClient.ts`, add an `AppError` type, wire React Query `onError` defaults to show toasts and log errors, and add `window.onerror`/`unhandledrejection` captures. (There is an open todo list in the repo.)
- Formatters: consolidate `src/lib/formatters/*` into a single re-export `src/lib/formatters/index.ts` for discoverability.
- Routes: feature route files exist; decide whether to import them into the central router or remove duplicates.
- Linting/CI: enable ESLint rule sets for unused exports and dead code detection in CI.

What I changed during the recent sweep
- Removed many redundant `//` inline comments to reduce noise (kept contextual comments in tests and a few helpful notes).


