# MyPropertyAsset Web Platform

Production Angular 20 frontend for the MyPropertyAsset commercial SaaS platform.

## Stack

- **Angular 20** — Standalone components, Signals, strict TypeScript
- **PrimeNG 20** — UI component library with `@primeuix/themes`
- **PrimeFlex** — Utility-first CSS layout
- **PrimeIcons** — Icon set
- **Supabase** — Backend integration (JavaScript SDK)
- **SCSS** — Styling with design tokens

## Prerequisites

- Node.js 20.x
- npm 10.x

## Getting Started

```bash
npm install
npm start
```

Navigate to `http://localhost:4200/`.

## Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm start`             | Dev server (development environment) |
| `npm run build`         | Production build                     |
| `npm run build:dev`     | Development build                    |
| `npm run build:qa`      | QA environment build                 |
| `npm run build:staging` | Staging environment build            |
| `npm run lint`          | ESLint check                         |
| `npm run lint:fix`      | ESLint auto-fix                      |
| `npm run format`        | Prettier format                      |
| `npm run format:check`  | Prettier check                       |

## Project Structure

```
src/
├── app/              Application bootstrap (config, routes, root component)
├── core/             Core constants and cross-cutting primitives
├── shared/           Shared utilities and reusable building blocks
├── features/         Feature shells (lazy-loaded route modules)
│   ├── public-website/
│   ├── authentication/
│   ├── super-admin/
│   └── builder-portal/
├── layouts/          Application layout components
├── theme/            Design tokens, global styles, PrimeNG preset
├── assets/           Static assets
├── infrastructure/   Supabase client and platform providers
└── environments/     Environment configuration
```

## Environment Configuration

Configure Supabase credentials in the environment files under `src/environments/`:

- `environment.ts` — Production
- `environment.development.ts` — Local development
- `environment.qa.ts` — QA
- `environment.staging.ts` — Staging

## Architecture

This workspace follows the approved MyPropertyAsset architecture (NG-series). Feature shells are in place for IMP-002 feature development. Business logic, authentication flows, API calls, and state management are intentionally not implemented in this bootstrap phase.

## Documentation

Architecture documentation is available in the `docs/` directory.
