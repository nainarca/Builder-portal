# MyPropertyAsset — Complete Project Documentation

> **Version**: 1.0.0
> **Last Updated**: June 2026
> **Status**: Beta (90% Database Migration Complete)
> **Maintained by**: EbaTech Developers · ebatechdevelopers@gmail.com

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Software Requirements](#3-software-requirements)
4. [Environment Setup Guide](#4-environment-setup-guide)
5. [Project Folder Structure](#5-project-folder-structure)
6. [Database Documentation](#6-database-documentation)
7. [Development Commands](#7-development-commands)
8. [Deployment Guide](#8-deployment-guide)
9. [KT (Knowledge Transfer) Document](#9-kt-knowledge-transfer-document)
10. [Troubleshooting Guide](#10-troubleshooting-guide)
11. [Daily Developer Workflow](#11-daily-developer-workflow)

---

# 1. Project Overview

## 1.1 Business Purpose

**MyPropertyAsset** is a full-stack property investment management platform built for Indian real estate owners and NRIs. It solves the core problem of fragmented property management — owners currently track loans in spreadsheets, rent payments in WhatsApp, and documents in physical folders with no consolidated financial view.

The platform consolidates every financial dimension of property ownership:

- Track purchased properties with full cost basis (purchase price + registration + stamp duty + renovation)
- Manage home loans, LAP (Loan Against Property), and construction loans with EMI-level tracking
- Collect and record rent from tenants with Razorpay integration
- Compute property-level and portfolio-level ROI, CAGR, and rental yield
- Store and track document expiry (sale deeds, insurance, rent agreements, NOCs)
- Generate P&L statements and tax-ready reports (with Indian income tax sections 24(b), 80C, 37)
- Provide tenants a self-service view of their lease, rent history, and pending dues

## 1.2 Core Features

| Feature | Description |
|---------|-------------|
| **Portfolio Dashboard** | Net worth, total investment, unrealized gain, monthly cash flow, yield KPIs |
| **Property Management** | CRUD for properties, multi-photo upload, valuation history, property timeline |
| **Loan & EMI Tracking** | Full amortization schedules, payment recording, overdue tracking |
| **Tenant Management** | Lease agreements, rent collection via Razorpay, TDS management |
| **Expense Tracking** | Income/expense ledger with Indian tax category mapping |
| **Document Vault** | Secure upload with expiry alerts (90/30/7 day reminders) |
| **Analytics & Reports** | Per-property and portfolio ROI, P&L statements, cash flow charts |
| **Notifications** | In-app + FCM push for rent due, EMI due, document expiry, lease expiry |
| **Subscription Management** | Free / Pro / Business tiers with Razorpay billing |
| **Tenant Self-Service** | Tenant app (Flutter) for lease view, payment history, pending dues |

## 1.3 Platform Modules

```
MyPropertyAsset
├── Web Dashboard (Angular 17)            — Primary owner interface
│   ├── Auth Module                       — Login, Register, OTP, Onboarding
│   ├── Portfolio Module                  — Dashboard & summary views
│   ├── Properties Module                 — Full property lifecycle management
│   ├── Loans Module                      — Loan tracking & EMI management
│   ├── Tenants Module                    — Tenant & rent collection management
│   ├── Expenses Module                   — Transaction & expense ledger
│   ├── Documents Module                  — Document vault & expiry management
│   ├── Analytics Module                  — ROI, cash flow, P&L reports
│   ├── Notifications Module              — Alert center
│   └── Settings Module                  — Profile, subscription, preferences
│
└── Mobile App (Flutter)                  — iOS & Android
    ├── Owner App (6 flavors)             — Full feature set on mobile
    └── Tenant App (6 flavors)            — Tenant self-service portal
```

## 1.4 User Roles

| Role | Access Level | Primary Use Case |
|------|-------------|-----------------|
| **Owner** | Full CRUD on all own data | Property owners managing their portfolio |
| **Manager** | Read + limited write on assigned properties | Property managers acting on behalf of owners |
| **Tenant** | Read-only on own tenancy data | Tenants viewing lease, paying rent, accessing documents |

Role assignment is per-property via the `property_access` table. A user can be an Owner for property A and a Manager for property B simultaneously.

---

# 2. System Architecture

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│   ┌─────────────────────┐      ┌──────────────────────────┐   │
│   │  Angular 17 Web App  │      │    Flutter Mobile App     │   │
│   │  (my-property-asset- │      │    (my_property_asset)    │   │
│   │       web)           │      │  Owner (6 flavors) +      │   │
│   │  PrimeNG + Tailwind  │      │  Tenant (6 flavors)       │   │
│   └──────────┬──────────┘      └───────────┬──────────────┘   │
│              │  Supabase JS SDK              │  Supabase Flutter │
└──────────────┼───────────────────────────────┼──────────────────┘
               │                               │
┌──────────────▼───────────────────────────────▼──────────────────┐
│                     SUPABASE PLATFORM                            │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  Auth (JWT)   │  │ Storage (S3) │  │   Realtime (WS)     │  │
│  │  Email / SMS  │  │  3 buckets   │  │  Notifications sub  │  │
│  │  OAuth Google │  │  Signed URLs │  │                     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘  │
│         │                 │                       │              │
│  ┌──────▼─────────────────▼───────────────────────▼──────────┐ │
│  │           PostgreSQL 15 Database                            │ │
│  │  18 tables · RLS on all · Triggers · Views · Functions      │ │
│  │  pg_cron · pg_net · pg_trgm · moddatetime                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │           Edge Functions (Deno / TypeScript)                 │ │
│  │  create-razorpay-order · create-rent-order                  │ │
│  │  razorpay-webhook · handle-rent-payment-webhook             │ │
│  │  send-push-notification                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
               │                               │
┌──────────────▼───────────┐   ┌───────────────▼──────────────────┐
│     Razorpay Gateway     │   │   Firebase Cloud Messaging (FCM)  │
│  Subscription payments   │   │   iOS + Android push alerts       │
│  Rent collection         │   │   Background & foreground msgs    │
└──────────────────────────┘   └──────────────────────────────────┘
```

## 2.2 Frontend Architecture (Angular)

The Angular web application follows a **feature-module architecture** with standalone components (Angular 17+):

```
app.config.ts                        ← Bootstrap: providers, routes, interceptors
app.routes.ts                        ← Root lazy-load route definitions
│
├── core/                            ← Singleton services (providedIn: 'root')
│   ├── supabase/                    ← Single Supabase client instance
│   ├── auth/                        ← Auth state, guards, role checks
│   ├── interceptors/                ← JWT attachment, error centralization
│   └── services/                    ← API, Storage, Loading, Notification
│
├── shared/                          ← Reusable, stateless UI pieces
│   ├── components/                  ← MetricCard, StatusBadge, EmptyState…
│   ├── pipes/                       ← InrFormat, DaysRemaining, RelativeDate
│   ├── directives/                  ← PermissionDirective
│   └── utils/                       ← EmiCalculator, RoiCalculator
│
├── layout/                          ← App shells (auth shell, main shell)
│   ├── auth-layout/                 ← Login/register wrapper
│   └── main-layout/                 ← Sidebar + topbar wrapper
│
└── features/                        ← Lazy-loaded feature areas
    ├── auth/ properties/ loans/
    ├── tenants/ expenses/ documents/
    ├── analytics/ notifications/ settings/
    └── portfolio/
```

**Key Patterns:**
- `standalone: true` on all components — no NgModules
- `changeDetection: OnPush` everywhere — pull-based rendering
- `inject()` over constructor injection throughout
- Services use `Signals` for reactive state where applicable
- Models imported via `@models` TypeScript path alias

## 2.3 Backend Architecture (Supabase)

Supabase acts as the complete backend (BaaS). There is no separate Node.js API server for primary data operations.

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **API** | Supabase PostgREST (auto-generated) | CRUD via REST from Supabase JS SDK |
| **Auth** | Supabase Auth (GoTrue) | JWT issuance, OTP, OAuth |
| **Storage** | Supabase Storage (S3-compatible) | Files, images, documents |
| **Realtime** | Supabase Realtime (Phoenix channels) | Live notification subscriptions |
| **Functions** | Supabase Edge Functions (Deno) | Razorpay orders, webhooks, FCM |
| **Scheduler** | pg_cron extension | Daily notification jobs |
| **HTTP Callbacks** | pg_net extension | Trigger-to-webhook calls |

## 2.4 Database Architecture

PostgreSQL 15 with 18 core tables organized into logical domains:

```
auth.users (Supabase managed)
    │
    ▼ trigger: on_auth_user_created
public.user_profiles ──────────────── subscription_plans
    │                                        │
    ├── portfolios                    subscription_payments
    │
    ├── property_access ─────────────────────────────────┐
    │                                                     │
    ├── properties (soft-delete)                          │
    │   ├── market_value_snapshots  (append-only)         │
    │   ├── property_timeline       (append-only)         │
    │   ├── loans                                         │
    │   │   └── emi_schedules       (append-only)         │
    │   ├── tenants                                       │
    │   │   ├── rent_payments       (append-only)         │
    │   │   └── tenant_user_links                         │
    │   ├── transactions            (append-only ledger)  │
    │   ├── property_documents      (soft-delete)         │
    │   └── notifications           (per-user)            │
    │                                                     │
    └── tenant_invitations ◄────────────────────────────┘
```

**Immutable Ledgers** (append-only, no UPDATE/DELETE allowed via RLS):
- `rent_payments` — every rent transaction ever recorded
- `emi_schedules` — full loan amortization table
- `market_value_snapshots` — valuation history for charts
- `subscription_payments` — billing audit trail

## 2.5 Authentication Flow

```
User opens app
      │
      ▼
Is session token in localStorage?
      │
    NO ──► /auth/login ──► Enter email + password
      │                          │
    YES                   Supabase Auth validates
      │                          │
      │                   On success: JWT issued
      │                    + refresh token stored
      │                          │
      ▼                          ▼
authGuard allows         auth.service updates
route rendering          isLoggedIn signal = true
      │                          │
      ▼                          ▼
JWT interceptor          GoRouter / Angular Router
attaches token to        redirects to /portfolio
all API requests
      │
      ▼
RLS: auth.uid() scopes all
database queries to user's
own data automatically
```

**Session Management:**
- JWT expiry: 1 hour
- Refresh token rotation enabled (reuse interval: 10 seconds)
- Supabase JS SDK auto-refreshes token before expiry
- On 401 from any intercepted request: `error.interceptor.ts` triggers signout + redirect

## 2.6 Storage Flow

```
User selects file (DocumentUploaderComponent)
      │
      ▼
StorageService.upload(file, path)
      │
      ▼
Path format: {user_id}/{property_id}/{document_type}_{epoch}.{ext}
      │
      ▼
Supabase Storage (private bucket)
      │
      ▼
storage.service generates signed URL (1-hour expiry)
      │
      ▼
property_documents record inserted with:
  - file_name, file_size, mime_type
  - storage_path (bucket + path)
  - expiry_date (if applicable)
      │
      ▼
For display: signed URL fetched fresh each time
(prevents direct storage access bypass)
```

**Buckets:**

| Bucket | Max File Size | Used For |
|--------|-------------|---------|
| `property-documents` | 25 MB | Legal docs, agreements, certificates |
| `property-images` | 10 MB | Property photos |
| `user-avatars` | 2 MB | Profile pictures |

## 2.7 Notification Flow

```
Triggering Event (e.g., rent becomes due tomorrow)
      │
      ▼
pg_cron daily job (runs at 08:00 IST)
      │
      ▼
scheduled_notifications table scanned
      │
      ▼
send-push-notification Edge Function called
      │
      ├──► Insert row into notifications table (in-app)
      │
      └──► FCM HTTP API → Firebase → device
                │
                ▼
           iOS / Android receives push notification
                │
                ▼
           Tap navigates to action_url (deep link)
           e.g., mypropertyasset://tenants/123
```

**Deduplication:** Unique index on `(user_id, type, entity_id, DATE(created_at))` prevents the same notification being sent twice in one day for the same entity.

---

# 3. Software Requirements

## 3.1 Required Software

### Core Development

| Software | Required Version | Download |
|---------|-----------------|---------|
| **Node.js** | 20.x LTS (minimum 18.x) | [nodejs.org](https://nodejs.org) |
| **npm** | 10.x (bundled with Node 20) | Bundled with Node.js |
| **Angular CLI** | 17.x (`@angular/cli`) | `npm install -g @angular/cli@17` |
| **Supabase CLI** | Latest (`supabase`) | `npm install -g supabase` |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com) |
| **Flutter SDK** | 3.22+ | [flutter.dev](https://flutter.dev) |

### Optional but Recommended

| Software | Purpose |
|---------|---------|
| **Docker Desktop** | Running local Supabase stack (`supabase start`) |
| **pgAdmin 4** or **TablePlus** | Direct database inspection |
| **Postman** or **Insomnia** | Testing Edge Functions manually |
| **Android Studio** | Android emulator + Flutter Android builds |
| **Xcode 15+** (macOS only) | iOS simulator + Flutter iOS builds |

## 3.2 VS Code Extensions

Install all of these for the best development experience:

| Extension | ID | Purpose |
|-----------|-----|---------|
| **Angular Language Service** | `Angular.ng-template` | Template autocomplete, error highlighting |
| **ESLint** | `dbaeumer.vscode-eslint` | Real-time lint feedback |
| **Prettier** | `esbenp.prettier-vscode` | Auto-formatting on save |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Class autocomplete |
| **TypeScript Importer** | `pmneo.tsimporter` | Auto-import resolution |
| **GitLens** | `eamodio.gitlens` | Advanced git history + blame |
| **REST Client** | `humao.rest-client` | `.http` file testing |
| **Thunder Client** | `rangav.vscode-thunder-client` | GUI API testing |
| **Supabase** | `Supabase.supabase-vscode` | Schema explorer |
| **Flutter** | `Dart-Code.flutter` | Flutter dev tools |
| **Dart** | `Dart-Code.dart-code` | Dart language support |
| **Error Lens** | `usernamehw.errorlens` | Inline error messages |
| **Auto Rename Tag** | `formulahendry.auto-rename-tag` | HTML tag renaming |
| **Path Intellisense** | `christian-kohler.path-intellisense` | File path autocomplete |

## 3.3 VS Code Workspace Settings

Create `.vscode/settings.json` in the Angular project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "angular.enable-strict-mode-prompt": false,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 3.4 Recommended Browsers

| Browser | Version | Notes |
|---------|---------|-------|
| **Google Chrome** | Latest | Primary dev browser. Chrome DevTools + Angular DevTools extension |
| **Microsoft Edge** | Latest | Chromium-based; good for testing production builds |
| **Firefox** | Latest | Secondary testing browser |

Install the **Angular DevTools** Chrome extension for component tree inspection and change detection debugging.

---

# 4. Environment Setup Guide

## 4.1 Clone the Repository

```bash
git clone <repository-url>
cd AssetManagement
```

The repository contains two sub-projects:
```
AssetManagement/
├── my-property-asset-web/     ← Angular web dashboard
└── my_property_asset/         ← Flutter mobile app
```

## 4.2 Install Angular Dependencies

```bash
cd my-property-asset-web
npm install
```

Verify installation:
```bash
ng version
# Should show Angular CLI 17.x, Angular 17.x, Node 20.x
```

## 4.3 Configure Environment Files

### Step 1: Copy the environment template

```bash
# In my-property-asset-web/
cp .env.example .env
```

### Step 2: Edit `src/environments/environment.ts` (development)

```typescript
export const environment = {
  production: false,
  supabaseUrl:   'https://YOUR_PROJECT_REF.supabase.co',
  supabaseKey:   'YOUR_SUPABASE_ANON_KEY',
  apiBaseUrl:    'http://localhost:3000/api/v1',
  razorpayKeyId: 'rzp_test_YOUR_RAZORPAY_TEST_KEY',
  appName:       'MyPropertyAsset'
};
```

### Step 3: Where to get the values

| Variable | Where to Get It |
|----------|----------------|
| `supabaseUrl` | Supabase Dashboard → Project Settings → API → Project URL |
| `supabaseKey` | Supabase Dashboard → Project Settings → API → `anon` `public` key |
| `razorpayKeyId` | Razorpay Dashboard → Settings → API Keys → Test Key ID |

## 4.4 Configure Supabase (Local Development)

### Option A: Use Local Supabase Stack (Recommended for development)

```bash
cd my_property_asset   # project with supabase/ folder

# Log in to Supabase CLI
npx supabase login

# Start local Supabase (requires Docker Desktop to be running)
npx supabase start
```

Output will show:
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324    ← Email testing inbox
```

Update `environment.ts` to use local URLs:
```typescript
supabaseUrl: 'http://localhost:54321',
supabaseKey: 'YOUR_LOCAL_ANON_KEY',  // shown in supabase start output
```

### Option B: Use Remote Supabase Project

```bash
# Link to your remote project
npx supabase link --project-ref YOUR_PROJECT_REF

# Check migration status
npx supabase migration list

# Push all migrations to remote
npx supabase db push
```

## 4.5 Run Migrations

```bash
# Run all pending migrations against local or linked remote DB
npx supabase db push

# OR run against local only
npx supabase migration up
```

Expected: 27 migrations applied (001 through 20260609).

## 4.6 Generate TypeScript Types

After migrations are applied, regenerate the TypeScript database types:

```bash
# Against local Supabase
npx supabase gen types typescript --local > src/types/supabase.ts

# Against remote (linked) project
npx supabase gen types typescript --linked > src/types/supabase.ts
```

This generates `src/types/supabase.ts` with full type definitions matching the current database schema. Commit this file whenever the schema changes.

## 4.7 Start the Angular Development Server

```bash
cd my-property-asset-web
npm start
# Opens http://localhost:4200
```

---

# 5. Project Folder Structure

## 5.1 Angular Web App (`my-property-asset-web/`)

```
my-property-asset-web/
├── src/
│   ├── app/
│   │   ├── core/                    # ← Singleton services (never lazy-loaded)
│   │   │   ├── supabase/
│   │   │   │   └── supabase.client.ts       # Supabase JS client init
│   │   │   ├── auth/
│   │   │   │   ├── auth.service.ts          # Auth state management + guards
│   │   │   │   ├── auth.guard.ts            # Protects authenticated routes
│   │   │   │   └── role.guard.ts            # Role-based route protection
│   │   │   ├── interceptors/
│   │   │   │   ├── jwt.interceptor.ts       # Auto-attach Bearer token
│   │   │   │   └── error.interceptor.ts     # Handle 401/403/500 globally
│   │   │   ├── services/
│   │   │   │   ├── api.service.ts           # HTTP wrapper (get/post/put/delete)
│   │   │   │   ├── loading.service.ts       # Global spinner state
│   │   │   │   ├── storage.service.ts       # Supabase Storage operations
│   │   │   │   └── notification.service.ts  # Realtime notification subscriptions
│   │   │   └── models/                      # All TypeScript interfaces
│   │   │       ├── user.model.ts
│   │   │       ├── property.model.ts
│   │   │       ├── loan.model.ts
│   │   │       ├── tenant.model.ts
│   │   │       ├── expense.model.ts
│   │   │       ├── transaction.model.ts
│   │   │       ├── document.model.ts
│   │   │       ├── notification.model.ts
│   │   │       └── index.ts                 # Barrel export (import from '@models')
│   │   │
│   │   ├── shared/                  # ← Reusable UI (imported everywhere)
│   │   │   ├── components/
│   │   │   │   ├── metric-card/     # KPI display cards
│   │   │   │   ├── status-badge/    # Colored status labels
│   │   │   │   ├── empty-state/     # Empty list placeholder
│   │   │   │   ├── page-header/     # Page title + breadcrumb
│   │   │   │   ├── property-card/   # Property overview card
│   │   │   │   ├── emi-progress-bar/ # Loan repayment visualization
│   │   │   │   ├── document-uploader/ # File drag-drop + upload
│   │   │   │   └── chart-widget/    # ApexCharts wrapper
│   │   │   ├── pipes/
│   │   │   │   ├── inr-format.pipe.ts       # ₹12,34,567 formatting
│   │   │   │   ├── days-remaining.pipe.ts   # "5 days remaining"
│   │   │   │   └── relative-date.pipe.ts    # "2 days ago"
│   │   │   ├── directives/
│   │   │   │   └── permission.directive.ts  # *hasPermission="'owner'"
│   │   │   └── utils/
│   │   │       ├── emi-calculator.util.ts   # Amortization math
│   │   │       └── roi-calculator.util.ts   # ROI, CAGR, yield
│   │   │
│   │   ├── layout/                  # ← App shells
│   │   │   ├── auth-layout/         # Wraps /auth/* routes
│   │   │   ├── main-layout/         # Wraps authenticated routes
│   │   │   ├── sidebar/             # Left navigation
│   │   │   └── topbar/              # Top header
│   │   │
│   │   ├── features/                # ← Lazy-loaded feature areas
│   │   │   ├── auth/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/       # Email + password sign-in
│   │   │   │   │   ├── register/    # New account creation
│   │   │   │   │   ├── otp-verify/  # SMS/email OTP confirmation
│   │   │   │   │   ├── onboarding/  # Profile + portfolio setup wizard
│   │   │   │   │   └── reset-password/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── portfolio/           # Dashboard & portfolio summary
│   │   │   ├── properties/          # Property list, detail, wizard
│   │   │   ├── loans/               # Loan management & EMI tracking
│   │   │   ├── tenants/             # Tenant management & rent collection
│   │   │   ├── expenses/            # Transaction & expense ledger
│   │   │   ├── documents/           # Document vault & expiry alerts
│   │   │   ├── analytics/           # ROI, cash flow, reports
│   │   │   ├── notifications/       # Alert center
│   │   │   └── settings/            # Profile, subscription, preferences
│   │   │
│   │   ├── app.component.ts         # Root component
│   │   ├── app.config.ts            # Angular providers + interceptors
│   │   └── app.routes.ts            # Root routing
│   │
│   ├── environments/
│   │   ├── environment.ts           # Development config (gitignored values)
│   │   └── environment.production.ts # Production config (uses process.env)
│   │
│   ├── types/
│   │   └── supabase.ts              # Auto-generated DB types (run gen types)
│   │
│   └── styles/
│       ├── styles.scss              # Global styles entry point
│       ├── _variables.scss          # Design tokens (colors, spacing)
│       ├── _typography.scss         # Font scales
│       ├── _components.scss         # Global component overrides
│       └── _primeng-overrides.scss  # PrimeNG theme customizations
│
├── package.json                     # Dependencies and scripts
├── angular.json                     # Angular CLI project config
├── tsconfig.json                    # TypeScript config (paths aliases)
├── tailwind.config.js               # Tailwind CSS customization
├── .env.example                     # Environment variable template
└── .eslintrc.json                   # ESLint configuration
```

## 5.2 Supabase (`my_property_asset/supabase/`)

```
supabase/
├── config.toml                      # Local Supabase stack configuration
│
├── migrations/                      # Ordered SQL migration files
│   ├── 20260606000001_extensions_and_schemas.sql
│   ├── 20260606000002_enums.sql
│   ├── 20260606000003_users_and_access.sql
│   ├── 20260606000004_properties.sql
│   ├── 20260606000005_loans_and_emi.sql
│   ├── 20260606000006_tenants_and_rent.sql
│   ├── 20260606000007_expenses_and_transactions.sql
│   ├── 20260606000008_documents.sql
│   ├── 20260606000009_notifications.sql
│   ├── 20260606000010_subscriptions.sql
│   ├── 20260606000011_views.sql
│   ├── 20260606000012_functions.sql
│   ├── 20260606000013_triggers.sql
│   ├── 20260606000014_indexes.sql
│   ├── 20260606000015_rls_policies.sql
│   ├── 20260606000016_storage_policies.sql
│   ├── 20260606000017_seed_data.sql
│   ├── 20260606000018_audit_and_webhooks.sql
│   ├── 20260606000019_rls_policies_complete.sql
│   ├── 20260606000020_storage_rls_complete.sql
│   ├── 20260606000021_property_images.sql
│   ├── 20260606000022_webhook_sequencing.sql
│   ├── 20260606000023_tenant_invitation_acceptance.sql
│   ├── 20260606000024_security_hardening.sql
│   ├── 20260608000001_fcm_token.sql
│   ├── 20260608000002_notification_scheduler.sql
│   └── 20260609000001_rent_payment_webhook.sql
│
└── functions/                       # Edge Functions (TypeScript / Deno)
    ├── create-razorpay-order/
    │   └── index.ts                 # Creates Razorpay order for subscriptions
    ├── create-rent-order/
    │   └── index.ts                 # Creates Razorpay order for rent payments
    ├── razorpay-webhook/
    │   └── index.ts                 # Generic Razorpay webhook handler
    ├── handle-rent-payment-webhook/
    │   └── index.ts                 # Processes rent payment completion
    └── send-push-notification/
        └── index.ts                 # Sends FCM push via Firebase HTTP API
```

## 5.3 Flutter Mobile (`my_property_asset/lib/`)

```
lib/
├── main.dart                        # Owner app entry point
├── main_tenant.dart                 # Tenant app entry point
│
├── app/
│   ├── app.dart                     # ProviderScope + MaterialApp.router
│   ├── router/
│   │   └── app_router.dart          # GoRouter config (guards, deep links)
│   └── theme/
│       └── app_theme.dart           # Color scheme, typography, spacing
│
├── core/
│   ├── config/
│   │   ├── flavor_config.dart       # dart-define-from-file Firebase options
│   │   └── app_config.dart          # Deep link scheme, support email, URLs
│   ├── services/
│   │   ├── crashlytics_service.dart # Firebase Crashlytics setup
│   │   ├── fcm_service.dart         # FCM permission + token management
│   │   └── razorpay_service.dart    # Razorpay checkout + webhook validation
│   └── utils/
│       ├── emi_calculator.dart      # Amortization math (same logic as web)
│       └── roi_calculator.dart      # ROI, CAGR, yield
│
├── features/                        # Riverpod-powered feature screens
│   ├── auth/                        # Login, OTP, onboarding
│   ├── portfolio/                   # Dashboard
│   ├── properties/                  # Property management
│   ├── loans/                       # Loan & EMI tracking
│   ├── tenants/                     # Tenant management
│   ├── expenses/                    # Expense tracking
│   ├── documents/                   # Document vault
│   ├── analytics/                   # Reports & charts
│   ├── notifications/               # Notification center
│   └── settings/                    # Profile, subscription
│
└── shared/
    ├── components/                  # Reusable Flutter widgets
    └── utils/                       # Date formatting, currency helpers
```

---

# 6. Database Documentation

## 6.1 Table List & Purpose

| Table | Domain | Purpose |
|-------|--------|---------|
| `user_profiles` | Users | Extended auth user data — subscription, PAN, NRI flag, FCM token |
| `property_access` | Access | Role assignments per user per property |
| `portfolios` | Users | Optional grouping of properties |
| `tenant_user_links` | Access | Maps tenant record to Supabase auth user |
| `tenant_invitations` | Access | One-time SMS/email tokens for tenant self-signup |
| `properties` | Core | Primary property records (soft-deleted via `deleted_at`) |
| `market_value_snapshots` | Core | Immutable valuation history for appreciation charts |
| `property_timeline` | Core | Chronological event log per property |
| `loans` | Finance | Home loans, LAP, construction loans |
| `emi_schedules` | Finance | Full amortization table (one row per EMI instalment) |
| `tenants` | Finance | Tenant records with lease terms |
| `rent_payments` | Finance | Immutable rent payment ledger |
| `expense_categories` | Finance | System global + user-defined categories (29 defaults) |
| `transactions` | Finance | Combined income/expense ledger |
| `property_documents` | Docs | Document vault metadata (soft-deleted) |
| `notifications` | Alerts | In-app + FCM notification records |
| `subscription_plans` | Billing | Plan definitions (free, pro, business) |
| `subscription_payments` | Billing | Payment/invoice records per subscription transaction |

## 6.2 Table Schemas

### `user_profiles`
```sql
id                  UUID (FK → auth.users.id, PK)
full_name           TEXT
phone               TEXT UNIQUE
pan_number          TEXT UNIQUE        -- Tax filing (India)
aadhaar_last4       CHAR(4)            -- Compliance (PDPB 2023)
is_nri              BOOLEAN DEFAULT false
subscription_plan   subscription_plan DEFAULT 'free'
subscription_expires_at  TIMESTAMPTZ
fcm_token           TEXT               -- Firebase push token
notification_prefs  JSONB DEFAULT '{}'
onboarding_completed BOOLEAN DEFAULT false
avatar_url          TEXT
created_at          TIMESTAMPTZ DEFAULT now()
updated_at          TIMESTAMPTZ        -- auto-updated by moddatetime trigger
```

### `properties`
```sql
id              UUID PRIMARY KEY DEFAULT uuid_generate_v4()
user_id         UUID (FK → user_profiles.id)
portfolio_id    UUID (FK → portfolios.id, nullable)
name            TEXT NOT NULL
property_type   property_type
property_status property_status DEFAULT 'owned'
address_line1   TEXT
address_line2   TEXT
city            TEXT
state           TEXT
pincode         TEXT
area_sqft       NUMERIC
purchase_price  NUMERIC NOT NULL
registration_cost  NUMERIC DEFAULT 0
stamp_duty      NUMERIC DEFAULT 0
renovation_cost NUMERIC DEFAULT 0
other_costs     NUMERIC DEFAULT 0
total_investment NUMERIC GENERATED ALWAYS AS   -- computed column
                (purchase_price + registration_cost + stamp_duty + renovation_cost + other_costs) STORED
market_value    NUMERIC DEFAULT 0
monthly_rent    NUMERIC DEFAULT 0
purchase_date   DATE
rera_number     TEXT
is_nri_property BOOLEAN DEFAULT false
images          TEXT[]                 -- array of storage paths
deleted_at      TIMESTAMPTZ            -- soft-delete
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ
```

### `loans`
```sql
id                   UUID PRIMARY KEY
property_id          UUID (FK → properties.id)
user_id              UUID (FK → user_profiles.id)
loan_type            loan_type
lender_name          TEXT NOT NULL
loan_amount          NUMERIC NOT NULL
outstanding_balance  NUMERIC
interest_rate        NUMERIC NOT NULL   -- annual % rate
tenure_months        INTEGER NOT NULL
emi_amount           NUMERIC
disbursement_date    DATE
first_emi_date       DATE
loan_status          loan_status DEFAULT 'active'
total_emis_paid      INTEGER DEFAULT 0
total_emis_remaining INTEGER
total_interest_paid  NUMERIC DEFAULT 0
foreclosure_amount   NUMERIC
closed_at            DATE
notes                TEXT
created_at           TIMESTAMPTZ DEFAULT now()
updated_at           TIMESTAMPTZ
```

### `emi_schedules`
```sql
id              UUID PRIMARY KEY
loan_id         UUID (FK → loans.id)
property_id     UUID (FK → properties.id)
user_id         UUID (FK → user_profiles.id)
emi_number      INTEGER NOT NULL
due_date        DATE NOT NULL
principal       NUMERIC NOT NULL
interest        NUMERIC NOT NULL
emi_amount      NUMERIC NOT NULL     -- principal + interest
outstanding_balance_after  NUMERIC
emi_status      emi_status DEFAULT 'pending'
paid_date       DATE
paid_amount     NUMERIC
late_fee        NUMERIC DEFAULT 0
notes           TEXT
```

### `tenants`
```sql
id                  UUID PRIMARY KEY
property_id         UUID (FK → properties.id)
user_id             UUID (FK → user_profiles.id)
full_name           TEXT NOT NULL
phone               TEXT
email               TEXT
emergency_contact   TEXT
lease_start         DATE NOT NULL
lease_end           DATE NOT NULL
monthly_rent        NUMERIC NOT NULL
security_deposit    NUMERIC DEFAULT 0
maintenance_charge  NUMERIC DEFAULT 0
tds_applicable      BOOLEAN DEFAULT false  -- auto-set when rent > ₹50,000
payment_mode        payment_mode DEFAULT 'bank_transfer'
tenant_status       tenant_status DEFAULT 'active'
id_proof_type       TEXT
id_proof_number     TEXT
notes               TEXT
deleted_at          TIMESTAMPTZ
created_at          TIMESTAMPTZ DEFAULT now()
updated_at          TIMESTAMPTZ
```

### `rent_payments`
```sql
id              UUID PRIMARY KEY
tenant_id       UUID (FK → tenants.id)
property_id     UUID (FK → properties.id)
user_id         UUID (FK → user_profiles.id)
payment_month   DATE NOT NULL       -- first day of payment month
amount          NUMERIC NOT NULL
tds_deducted    NUMERIC DEFAULT 0
late_fee        NUMERIC DEFAULT 0
net_received    NUMERIC GENERATED ALWAYS AS  -- computed
                (amount - tds_deducted + late_fee) STORED
payment_mode    payment_mode
razorpay_order_id   TEXT
razorpay_payment_id TEXT
razorpay_signature  TEXT
payment_status  payment_status DEFAULT 'captured'
notes           TEXT
paid_at         TIMESTAMPTZ DEFAULT now()
created_at      TIMESTAMPTZ DEFAULT now()
```

### `subscription_plans`
```sql
id          UUID PRIMARY KEY
name        subscription_plan UNIQUE
display_name TEXT
monthly_price_paise   INTEGER     -- price in paise (₹1 = 100)
annual_price_paise    INTEGER
max_properties        INTEGER
max_tenants          INTEGER
max_documents        INTEGER
max_storage_mb       INTEGER
has_analytics        BOOLEAN DEFAULT false
has_document_ocr     BOOLEAN DEFAULT false
has_market_api       BOOLEAN DEFAULT false
has_ca_export        BOOLEAN DEFAULT false
has_team_members     BOOLEAN DEFAULT false
has_api_access       BOOLEAN DEFAULT false
is_active            BOOLEAN DEFAULT true
```

## 6.3 Table Relationships

```
user_profiles (1) ────────── (N) properties
user_profiles (1) ────────── (N) portfolios
user_profiles (1) ────────── (N) notifications
user_profiles (1) ────────── (1) subscription_plan

properties (1) ────────────── (N) loans
properties (1) ────────────── (N) tenants
properties (1) ────────────── (N) transactions
properties (1) ────────────── (N) property_documents
properties (1) ────────────── (N) market_value_snapshots
properties (1) ────────────── (N) property_timeline

loans (1) ──────────────────── (N) emi_schedules
tenants (1) ────────────────── (N) rent_payments

property_access (M) ────────── (M) properties ×  user_profiles
```

## 6.4 Views

| View | Purpose |
|------|---------|
| `portfolio_summary` | Portfolio-wide KPIs: total investment, market value, net gain, gross yield, total loan balance, monthly rent income, tenant counts |
| `property_summary_list` | Per-property card data: investment, current value, unrealized gain, active loans, monthly rent, tenant status |
| `roi_summary` | Per-property ROI metrics: gross yield %, net yield %, estimated CAGR, annual ROI |
| `monthly_cashflow` | Monthly income vs expense breakdown per property |
| `loan_summary` | Aggregated loan data: amount, outstanding, paid, EMIs remaining |
| `tenant_rent_status` | Current rent status per tenant: due, overdue, paid this month |
| `expiring_documents` | Documents expiring within 90 days with days-remaining |
| `upcoming_emis` | EMIs due in next 30 days across all loans |

## 6.5 Database Functions

| Function | Parameters | Returns | Purpose |
|----------|-----------|---------|---------|
| `get_expense_summary(user_id, property_id?, year?, month?)` | UUIDs, integers | JSON | Income/expense totals by category |
| `get_portfolio_roi(user_id)` | UUID | JSON | Portfolio-wide ROI aggregation |
| `mark_emi_paid(emi_id, paid_amount, paid_date, late_fee?)` | UUID, numeric, date | void | Atomically mark EMI paid + update loan counters |
| `generate_invoice_number()` | — | TEXT | Sequential format: MPA-YYYY-NNNNNN |
| `get_pl_statement(user_id, year)` | UUID, integer | JSON | Annual P&L with tax section breakdown |
| `calculate_property_roi(property_id)` | UUID | JSON | Single property ROI computation |
| `get_cashflow_by_month(user_id, months?)` | UUID, integer | TABLE | Monthly cash flow for charts (default 12 months) |
| `is_property_manager(property_id, user_id)` | UUIDs | BOOLEAN | RLS helper for manager access |
| `my_tenant_id(property_id)` | UUID | UUID | RLS helper to get calling user's tenant record |
| `is_premium(user_id?)` | UUID? | BOOLEAN | Check if user has pro/business subscription |
| `get_upcoming_emis(user_id, days?)` | UUID, integer | TABLE | EMIs due within N days (default 30) |
| `get_expiring_documents(user_id, days?)` | UUID, integer | TABLE | Documents expiring within N days |

## 6.6 Triggers

| Trigger | Table | Event | Action |
|---------|-------|-------|--------|
| `handle_updated_at_*` | All tables | BEFORE UPDATE | Set `updated_at = now()` |
| `on_auth_user_created` | `auth.users` | AFTER INSERT | Auto-create `user_profiles` row |
| `on_emi_paid` | `emi_schedules` | AFTER UPDATE (status→paid) | Update loan counters, create transaction |
| `on_rent_payment_created` | `rent_payments` | AFTER INSERT | Update tenant last_paid_at, create transaction |
| `on_property_created` | `properties` | AFTER INSERT | Create initial `property_timeline` entry |
| `on_market_value_updated` | `properties` | AFTER UPDATE (market_value) | Insert `market_value_snapshots` row |
| `on_tenant_status_changed` | `tenants` | AFTER UPDATE (tenant_status) | Create `property_timeline` entry |
| `on_loan_created` | `loans` | AFTER INSERT | Create `property_timeline` entry |

## 6.7 Row Level Security Policies

All tables have RLS enabled with `DEFAULT DENY` (no policy = no access).

### Owner Policies (example: `properties`)
```sql
-- SELECT: owner can read own properties
CREATE POLICY "owner_read_properties" ON properties
  FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);

-- INSERT: owner can create properties
CREATE POLICY "owner_insert_properties" ON properties
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- UPDATE: owner can update own non-deleted properties
CREATE POLICY "owner_update_properties" ON properties
  FOR UPDATE USING (user_id = auth.uid() AND deleted_at IS NULL);
```

### Manager Policies (example: `properties`)
```sql
-- SELECT: manager can read assigned properties
CREATE POLICY "manager_read_properties" ON properties
  FOR SELECT USING (
    is_property_manager(id, auth.uid()) AND deleted_at IS NULL
  );
```

### Tenant Policies (example: `tenants`)
```sql
-- SELECT: tenant can read own record
CREATE POLICY "tenant_read_own" ON tenants
  FOR SELECT USING (
    id = my_tenant_id(property_id) AND tenant_status = 'active'
  );
```

### Storage Policies
```sql
-- property-documents bucket: owner upload
CREATE POLICY "owner_upload_documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

# 7. Development Commands

## 7.1 Node.js / Angular Commands

```bash
# ── Dependencies ─────────────────────────────────────────────────────────────

# Install all dependencies
npm install

# Add a new package
npm install <package-name>

# Add a dev-only package
npm install --save-dev <package-name>

# ── Development Server ───────────────────────────────────────────────────────

# Start dev server with hot-reload (uses environment.ts)
npm start
# Equivalent to:
ng serve --configuration development

# Start on custom port
ng serve --port 4201

# ── Production Build ─────────────────────────────────────────────────────────

# Production build (output: dist/my-property-asset-web/)
npm run build:prod
# Equivalent to:
ng build --configuration production

# Analyze bundle size
npx source-map-explorer dist/my-property-asset-web/browser/**/*.js

# ── Tests ─────────────────────────────────────────────────────────────────────

# Run unit tests (Karma + Jasmine)
npm test

# Run tests once (CI mode, no watch)
ng test --watch=false --browsers=ChromeHeadless

# Run end-to-end tests (if configured)
ng e2e

# ── Code Quality ──────────────────────────────────────────────────────────────

# Lint
npm run lint
# Equivalent to:
ng lint

# Format with Prettier
npx prettier --write "src/**/*.{ts,html,scss}"

# ── Angular Code Generation ───────────────────────────────────────────────────

# Generate a new standalone component
ng generate component features/my-feature/pages/my-page --standalone

# Generate a service
ng generate service core/services/my-service

# Generate a guard
ng generate guard core/auth/my-guard

# Stop dev server
Ctrl + C
```

## 7.2 Supabase CLI Commands

```bash
# ── Authentication ────────────────────────────────────────────────────────────

# Log in to Supabase CLI
npx supabase login

# ── Project Linking ───────────────────────────────────────────────────────────

# Link to remote project (run once per machine)
npx supabase link --project-ref <your-project-ref>
# Project ref: found in Supabase Dashboard → Project Settings → General

# ── Local Development Stack ───────────────────────────────────────────────────

# Start local Supabase (Docker must be running)
npx supabase start

# Stop local Supabase
npx supabase stop

# Stop and delete all local data
npx supabase stop --no-backup

# View local Supabase status
npx supabase status

# ── Migrations ────────────────────────────────────────────────────────────────

# Check migration status (local vs remote)
npx supabase migration list

# Apply pending migrations to local DB
npx supabase migration up

# Push all migrations to remote/linked project
npx supabase db push

# Create a new migration file
npx supabase migration new <migration-name>
# Example: npx supabase migration new add_market_value_api

# Squash all migrations into one (destructive — use only on new DBs)
npx supabase migration squash

# ── TypeScript Types ──────────────────────────────────────────────────────────

# Generate types from local Supabase
npx supabase gen types typescript --local > src/types/supabase.ts

# Generate types from remote (linked) project
npx supabase gen types typescript --linked > src/types/supabase.ts

# ── Edge Functions ────────────────────────────────────────────────────────────

# Deploy all Edge Functions to remote
npx supabase functions deploy

# Deploy a specific function
npx supabase functions deploy create-razorpay-order

# Run an Edge Function locally (serve all)
npx supabase functions serve

# Set a secret for Edge Functions
npx supabase secrets set RAZORPAY_KEY_SECRET=rzp_live_secret

# List secrets
npx supabase secrets list

# ── Database ──────────────────────────────────────────────────────────────────

# Open Supabase Studio (local)
npx supabase studio
# Or open in browser: http://localhost:54323

# Execute raw SQL against local DB
npx supabase db execute --file path/to/query.sql

# Reset local DB and re-run all migrations
npx supabase db reset
```

## 7.3 Flutter Commands

```bash
# ── Dependencies ─────────────────────────────────────────────────────────────
flutter pub get

# ── Run on device/emulator ───────────────────────────────────────────────────

# Owner app — development flavor
flutter run --flavor devOwner --dart-define-from-file=config/devOwner.json -t lib/main.dart

# Tenant app — development flavor
flutter run --flavor devTenant --dart-define-from-file=config/devTenant.json -t lib/main_tenant.dart

# ── Builds ───────────────────────────────────────────────────────────────────

# Android APK — staging owner
flutter build apk --flavor stagingOwner --dart-define-from-file=config/stagingOwner.json -t lib/main.dart --release

# iOS IPA — staging owner (macOS only)
flutter build ipa --flavor stagingOwner --dart-define-from-file=config/stagingOwner.json -t lib/main.dart --export-options-plist=ios/ExportOptions/stagingOwner.plist

# ── Assets ───────────────────────────────────────────────────────────────────
dart run flutter_launcher_icons
dart run flutter_native_splash:create

# ── Tests ────────────────────────────────────────────────────────────────────
flutter test test/unit/
flutter test test/widget/
```

---

# 8. Deployment Guide

## 8.1 Frontend Deployment (Angular)

### Recommended: Vercel or Netlify

**Step 1: Build for production**
```bash
cd my-property-asset-web
npm run build:prod
# Output: dist/my-property-asset-web/browser/
```

**Step 2: Configure environment variables**

Set these environment variables in your hosting platform's dashboard:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
RAZORPAY_KEY_ID=rzp_live_your-live-key
API_BASE_URL=https://your-api-domain.com/api/v1
```

**Step 3: Configure SPA routing**

Add `vercel.json` at project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Or for Netlify, create `public/_redirects`:
```
/*    /index.html    200
```

**Step 4: Deploy**
```bash
# Vercel
npx vercel --prod

# Netlify
netlify deploy --prod --dir=dist/my-property-asset-web/browser
```

### Alternative: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select dist/my-property-asset-web/browser as public dir
firebase deploy --only hosting
```

## 8.2 Supabase Deployment

### Push Schema to Production

```bash
# Link to production project (first time)
npx supabase link --project-ref YOUR_PROD_PROJECT_REF

# Review pending migrations
npx supabase migration list

# Push all pending migrations
npx supabase db push

# If migration fails: check logs
npx supabase logs --project-ref YOUR_PROD_PROJECT_REF
```

### Deploy Edge Functions

```bash
# Set production secrets first
npx supabase secrets set --project-ref YOUR_PROD_PROJECT_REF \
  RAZORPAY_KEY_ID=rzp_live_xxx \
  RAZORPAY_KEY_SECRET=rzp_live_secret_xxx \
  FCM_SERVER_KEY=your-firebase-server-key

# Deploy all functions
npx supabase functions deploy --project-ref YOUR_PROD_PROJECT_REF

# Deploy specific function
npx supabase functions deploy razorpay-webhook --project-ref YOUR_PROD_PROJECT_REF
```

### Configure Supabase Auth (Production Dashboard)

1. **Site URL**: Set to your production domain (`https://app.mypropertyasset.in`)
2. **Redirect URLs**: Add `mypropertyasset://auth` (for Flutter deep link callback)
3. **Email templates**: Customize OTP email with brand assets
4. **SMS provider**: Configure Twilio or MSG91 for OTP delivery
5. **Google OAuth**: Add production client ID + secret

## 8.3 Environment Configuration (Production)

### Production `environment.production.ts`

```typescript
export const environment = {
  production: true,
  supabaseUrl:   process.env['SUPABASE_URL'] ?? '',
  supabaseKey:   process.env['SUPABASE_ANON_KEY'] ?? '',
  razorpayKeyId: process.env['RAZORPAY_KEY_ID'] ?? '',
  appName:       'MyPropertyAsset'
};
```

### Critical: Never commit real credentials

The `.env` file and populated `config/*.json` are gitignored. Use:
- CI/CD environment variables (GitHub Actions secrets, Vercel env vars)
- Never hardcode credentials in any committed file

## 8.4 Production Checklist

**Database**
- [ ] All 27 migrations applied: `npx supabase migration list`
- [ ] RLS policies verified on every table
- [ ] Seed data present (subscription_plans, expense_categories, states)
- [ ] Edge Functions deployed and tested
- [ ] Razorpay webhook URL configured: `https://YOUR_PROJECT.supabase.co/functions/v1/razorpay-webhook`
- [ ] pg_cron job running for daily notifications

**Authentication**
- [ ] Site URL set to production domain in Supabase Auth settings
- [ ] Mobile deep link redirect URL added (`mypropertyasset://auth`)
- [ ] Google OAuth credentials updated for production
- [ ] SMS OTP provider configured (Twilio or MSG91)
- [ ] JWT expiry set (3600s recommended)

**Frontend**
- [ ] Environment variables set in hosting platform
- [ ] `ng build --configuration production` completes without errors
- [ ] SPA routing fallback configured
- [ ] CSP headers configured
- [ ] HTTPS enforced (auto on Vercel/Netlify/Firebase)

**Mobile (Flutter)**
- [ ] Keystore generated and backed up
- [ ] All 6 ExportOptions plists have real Team ID
- [ ] Firebase GoogleService-Info.plist (iOS) and google-services.json (Android) present for production flavors
- [ ] Razorpay live key configured in `config/prodOwner.json` and `config/prodTenant.json`
- [ ] Android `assetlinks.json` deployed to `https://mypropertyasset.in/.well-known/`
- [ ] iOS `apple-app-site-association` deployed to `https://mypropertyasset.in/.well-known/`
- [ ] ProGuard rules verified for Razorpay and Crashlytics

**Security**
- [ ] Supabase `anon` key used (never `service_role` key in client apps)
- [ ] Storage buckets are PRIVATE (no public access)
- [ ] Signed URLs used for all document access
- [ ] Input validation on all Edge Functions
- [ ] Razorpay signature verified in webhook handler

---

# 9. KT (Knowledge Transfer) Document

## 9.1 How the Application Starts

### Angular (Web)
1. Browser loads `index.html` → bootstraps `main.ts`
2. `main.ts` calls `bootstrapApplication(AppComponent, appConfig)`
3. `app.config.ts` registers: Supabase client provider, HTTP interceptors, router
4. `app.routes.ts` defines lazy route tree
5. Router evaluates `authGuard` → reads `AuthService.isLoggedIn` signal
6. If logged in: loads `/portfolio` (lazy-loads `PortfolioModule`)
7. If not logged in: redirects to `/auth/login`

### Flutter (Mobile)
1. `main.dart` or `main_tenant.dart` calls `runApp()`
2. `FlavorConfig.initialize()` reads `dart-define-from-file` environment
3. `Firebase.initializeApp()` with programmatic `FirebaseOptions` (no static JSON)
4. `ProviderScope` wraps the app
5. `AppRouter` (GoRouter) checks auth state via `authNotifierProvider`
6. If authenticated: navigate to `PortfolioDashboardPage`
7. If not: navigate to `LoginPage`

## 9.2 Authentication Code Flow

### Sign In (Angular)
```typescript
// In LoginComponent:
async onSubmit() {
  const { data, error } = await this.authService.signInWithEmail(email, password);
  if (error) { this.showError(error.message); return; }
  this.router.navigate(['/portfolio']);  // authGuard now passes
}

// In AuthService:
async signInWithEmail(email: string, password: string) {
  return this.supabase.auth.signInWithPassword({ email, password });
  // Supabase stores JWT in localStorage automatically
  // auth.onAuthStateChange event fires → isLoggedIn signal updated
}
```

### JWT Interceptor
```typescript
// jwt.interceptor.ts (runs on every HTTP request)
const session = await this.supabase.auth.getSession();
const token = session.data.session?.access_token;
if (token) {
  request = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
```

### RLS Enforcement
Once the JWT reaches the database, Supabase automatically sets `auth.uid()` for every query. All RLS policies evaluate against this — no row can be read or written unless the policy allows it.

## 9.3 API / Data Access Flow

All data access goes through the Supabase JS SDK via feature services:

```typescript
// PropertiesService example:
async getProperties(): Promise<Property[]> {
  const { data, error } = await this.supabase
    .from('properties')           // PostgREST auto-generates REST from schema
    .select(`                     // column selection + joins
      *,
      loans(count),
      tenants(count)
    `)
    .is('deleted_at', null)       // soft-delete filter
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Property[];
}
```

For complex aggregations, call database functions:
```typescript
const { data } = await this.supabase.rpc('get_expense_summary', {
  p_user_id: userId,
  p_year: 2026
});
```

## 9.4 Database Flow (Write Path)

### Creating a Rent Payment (example end-to-end)

```
User clicks "Record Payment" in TenantDetailComponent
          │
          ▼
TenantDetailComponent calls TenantsService.recordPayment(payload)
          │
          ▼
TenantsService calls supabase.from('rent_payments').insert({...})
          │
          ▼
PostgREST receives INSERT → RLS check (user owns this tenant)
          │
          ▼
Row inserted into rent_payments
          │
          ▼
TRIGGER on_rent_payment_created fires:
  1. Updates tenants.last_paid_at, paid_months_count
  2. Inserts row into transactions (income ledger)
  3. Creates notification: "Rent received from {tenant.name}"
          │
          ▼
Realtime subscription in NotificationService receives new row
          │
          ▼
NotificationBell in TopbarComponent shows count badge
```

## 9.5 Storage Flow (Document Upload)

```
DocumentUploaderComponent receives File from input
          │
          ▼
StorageService.upload(file, bucketName, path)
  path = `${userId}/${propertyId}/${docType}_${Date.now()}.pdf`
          │
          ▼
supabase.storage.from('property-documents').upload(path, file)
          │
          ▼
On success: DocumentsService.createDocumentRecord({
  property_id,
  document_type,
  file_name: file.name,
  file_size: file.size,
  storage_path: path,
  expiry_date: userSelectedDate  // optional
})
          │
          ▼
property_documents row inserted
          │
          ▼
To display: StorageService.getSignedUrl(path)
  → supabase.storage.createSignedUrl(path, 3600)
  → returns time-limited URL (1 hour)
```

## 9.6 Notification Flow

```
Daily at 08:00 IST (pg_cron job):
  SELECT * FROM scheduled_notifications WHERE scheduled_for <= now()
          │
          ▼
For each pending notification:
  1. Call send-push-notification Edge Function
          │
  2. Edge Function:
     a. Fetches user's FCM token from user_profiles
     b. Sends FCM message via Firebase HTTP API
     c. Inserts row into notifications table
     d. Marks scheduled_notification as sent
          │
          ▼
Supabase Realtime fires notifications INSERT event
          │
          ▼
Angular app: NotificationService subscription receives event
  → unreadCount signal incremented
  → Toast shown if app is in foreground

Flutter app: FCM SDK receives push
  → Shows system notification if app in background
  → FcmService.onMessage handler shows in-app banner if foreground
```

## 9.7 How to Add a New Module (Angular)

Follow this pattern to add a new feature (example: `maintenance`):

**Step 1: Create the folder structure**
```bash
mkdir -p src/app/features/maintenance/pages/list
mkdir -p src/app/features/maintenance/pages/form
```

**Step 2: Create the service**
```bash
ng generate service features/maintenance/maintenance --flat
```

```typescript
// maintenance.service.ts
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private supabase = inject(SupabaseClient);

  getMaintenanceItems(propertyId: string) {
    return this.supabase.from('maintenance_requests')
      .select('*')
      .eq('property_id', propertyId);
  }
}
```

**Step 3: Create the routes file**
```typescript
// maintenance.routes.ts
export const MAINTENANCE_ROUTES: Routes = [
  { path: '', component: MaintenanceListComponent },
  { path: ':id', component: MaintenanceDetailComponent }
];
```

**Step 4: Register in app.routes.ts**
```typescript
{
  path: 'maintenance',
  canActivate: [authGuard],
  loadChildren: () => import('./features/maintenance/maintenance.routes')
    .then(m => m.MAINTENANCE_ROUTES)
}
```

**Step 5: Add navigation link in sidebar.component.html**
```html
<a routerLink="/maintenance" routerLinkActive="active">
  <i class="pi pi-wrench"></i> Maintenance
</a>
```

**Step 6: Create the database migration** (see Section 9.8)

## 9.8 How to Create a Database Migration

**Step 1: Create the migration file**
```bash
npx supabase migration new add_maintenance_requests
# Creates: supabase/migrations/TIMESTAMP_add_maintenance_requests.sql
```

**Step 2: Write the SQL**
```sql
-- supabase/migrations/TIMESTAMP_add_maintenance_requests.sql

-- Create the table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES user_profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  status        TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  cost          NUMERIC DEFAULT 0,
  reported_at   TIMESTAMPTZ DEFAULT now(),
  resolved_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- Updated_at trigger
CREATE TRIGGER handle_updated_at_maintenance_requests
  BEFORE UPDATE ON maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- Enable RLS
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

-- RLS policy: owner can CRUD own records
CREATE POLICY "owner_all_maintenance" ON maintenance_requests
  FOR ALL USING (user_id = auth.uid());

-- Index for common query patterns
CREATE INDEX idx_maintenance_property_id ON maintenance_requests(property_id);
CREATE INDEX idx_maintenance_user_id ON maintenance_requests(user_id);
```

**Step 3: Apply locally and test**
```bash
npx supabase migration up
npx supabase gen types typescript --local > src/types/supabase.ts
```

**Step 4: Push to production**
```bash
npx supabase db push
```

## 9.9 How to Deploy Updates

### Web Frontend
```bash
cd my-property-asset-web
git pull origin main
npm install              # in case dependencies changed
npm run build:prod       # build
# deploy dist/ to hosting platform
```

### Database (Migration-only change)
```bash
npx supabase db push
```

### Edge Functions (Function-only change)
```bash
npx supabase functions deploy <function-name>
```

### Flutter (Mobile)
```bash
flutter pub get
flutter build apk --flavor prodOwner ...   # Android
flutter build ipa --flavor prodOwner ...   # iOS
# Submit via Play Store / App Store Connect
```

---

# 10. Troubleshooting Guide

## 10.1 Migration Issues

### Problem: `npx supabase db push` fails with "migration already applied"
```
ERROR: migration "20260606000001..." is already applied
```
**Cause:** The migration hash in `supabase_migrations` table doesn't match the file (file was edited after being applied).

**Fix:**
```bash
# Check which migrations are in conflict
npx supabase migration list

# Option A: Reset local DB (local only — safe)
npx supabase db reset

# Option B: Repair migration record (remote — use carefully)
npx supabase migration repair --status applied 20260606000001
```

### Problem: Migration fails with "column already exists"
```
ERROR: column "fcm_token" of relation "user_profiles" already exists
```
**Cause:** Migration was partially applied or ran twice.

**Fix:** Add `IF NOT EXISTS` to the migration:
```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS fcm_token TEXT;
```

### Problem: `npx supabase start` fails — "Docker not running"
**Fix:** Start Docker Desktop. Verify Docker is running:
```bash
docker ps
```

### Problem: `npx supabase migration list` shows "No linked project"
**Fix:**
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```

## 10.2 Supabase Issues

### Problem: Supabase client returns 401 Unauthorized
**Cause:** JWT expired, or wrong `supabaseKey` in environment config.

**Fix:**
1. Check `environment.ts` has the correct `supabaseKey` (use `anon` key, not `service_role`)
2. Verify `supabaseUrl` includes `https://` prefix
3. Try signing out and back in: `supabase.auth.signOut()`

### Problem: RLS blocks queries that should work
**Symptom:** `data` is empty, no `error`, but you expect rows.

**Diagnosis:**
```sql
-- Run in Supabase SQL Editor, substituting your user's UUID
SET request.jwt.claims = '{"sub": "YOUR_USER_UUID"}';
SELECT * FROM properties; -- should return your rows
```

**Fix:** Check the RLS policy uses the correct column (`user_id` not `owner_id`):
```sql
-- View all policies for a table
SELECT * FROM pg_policies WHERE tablename = 'properties';
```

### Problem: Realtime subscription not receiving events
**Cause:** The table may not have Realtime enabled.

**Fix:** In Supabase Dashboard → Database → Replication → enable the table for Realtime. Or via SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

### Problem: Edge Function returns 500 Internal Server Error
**Diagnosis:**
```bash
# View live function logs
npx supabase functions logs --project-ref YOUR_PROJECT_REF

# Or in Dashboard → Edge Functions → select function → Logs
```

## 10.3 Authentication Issues

### Problem: OTP not received on phone
**Possible causes:**
1. SMS provider not configured in Supabase Auth settings
2. Phone number format wrong (must include country code: `+919876543210`)
3. Rate limiting: Supabase limits OTP requests per IP

**Fix:**
1. Supabase Dashboard → Auth → Providers → Phone → configure Twilio/MSG91
2. Ensure phone input includes `+91` prefix
3. Wait 60 seconds between OTP requests

### Problem: Google OAuth redirect fails with `invalid redirect URL`
**Fix:** In Supabase Dashboard → Auth → URL Configuration → add your URL to the allowed redirect list:
```
https://your-production-domain.com/auth/callback
http://localhost:4200/auth/callback
mypropertyasset://auth/callback
```

### Problem: User is signed in but `authGuard` redirects to login
**Cause:** Supabase session not persisted between page refreshes.

**Diagnosis:**
```typescript
// In browser console:
const { data } = await supabase.auth.getSession();
console.log(data.session); // null if no session
```

**Fix:** Ensure `supabaseClient` is created as a singleton (use `providedIn: 'root'`). Multiple client instances will not share session state.

## 10.4 Build Issues

### Problem: `ng build` fails with "Budget exceeded"
```
Error: bundle initial exceeded maximum budget.
```
**Fix:** Either reduce bundle size (lazy-load more modules) or temporarily increase the budget in `angular.json`:
```json
"budgets": [
  { "type": "initial", "maximumWarning": "600kb", "maximumError": "1.5mb" }
]
```

### Problem: TypeScript error — `Property 'X' does not exist on type 'Database'`
**Cause:** `src/types/supabase.ts` is out of date with the current schema.

**Fix:**
```bash
npx supabase gen types typescript --linked > src/types/supabase.ts
```

### Problem: `npm install` fails with peer dependency errors
**Fix:**
```bash
# Force resolve (Angular 17 peer deps can be strict)
npm install --legacy-peer-deps
```

### Problem: Flutter build fails — "Kotlin version mismatch"
**Fix:** In `android/build.gradle`, update the Kotlin version:
```gradle
ext.kotlin_version = '1.9.0'
```

## 10.5 Environment Issues

### Problem: `environment.ts` values appear undefined in production build
**Cause:** `environment.production.ts` uses `process.env['VAR']` but the vars aren't set at build time.

**Fix:** Ensure environment variables are set in your CI/CD pipeline before running `ng build --configuration production`. For Vercel: set them in Project Settings → Environment Variables.

### Problem: Supabase Storage CORS error when displaying images
**Cause:** CORS not configured for your domain in Supabase Storage.

**Fix:** Supabase Dashboard → Storage → Policies → CORS configuration. Add your domain to allowed origins.

### Problem: Razorpay checkout modal doesn't open
**Cause:** `razorpayKeyId` is wrong or Razorpay script blocked by ad blocker.

**Fix:**
1. Verify `rzp_test_` key is used in development, `rzp_live_` in production
2. Check browser console for Razorpay script loading errors
3. Verify the Edge Function `create-razorpay-order` is deployed and returns `{ orderId }`

---

# 11. Daily Developer Workflow

## Standard Feature Development Workflow

### Step 1: Start the Day — Pull Latest Code

```bash
# Navigate to the project
cd AssetManagement/my-property-asset-web

# Ensure you're on main and up to date
git checkout main
git pull origin main

# Check if there are new migrations from teammates
cd ../my_property_asset
git pull origin main
npx supabase migration list    # check for pending migrations
npx supabase migration up      # apply any new ones
npx supabase gen types typescript --local > ../my-property-asset-web/src/types/supabase.ts
```

### Step 2: Install Any New Packages

```bash
cd ../my-property-asset-web

# Check if package.json changed since last pull
git diff HEAD@{1} -- package.json

# If it changed, reinstall
npm install
```

### Step 3: Start the Project

```bash
# Terminal 1: Start local Supabase (if doing backend work)
cd my_property_asset
npx supabase start   # requires Docker

# Terminal 2: Start Angular dev server
cd my-property-asset-web
npm start
# App opens at http://localhost:4200
```

### Step 4: Create a Feature Branch

```bash
# Always branch from main
git checkout main
git pull origin main

# Create a descriptive branch
git checkout -b feature/add-maintenance-module
# or: fix/resolve-notification-duplicate
# or: chore/update-supabase-types
```

Branch naming conventions:
- `feature/` — new functionality
- `fix/` — bug fixes
- `chore/` — dependency updates, tooling
- `db/` — migration-only changes

### Step 5: Develop the Feature

```bash
# Make code changes
# Run Angular dev server: npm start (if not already running)

# If creating a new migration:
npx supabase migration new your-migration-name
# Edit the generated SQL file
npx supabase migration up
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Step 6: Test Your Changes

```bash
# Run unit tests
ng test --watch=false

# Run linter
ng lint

# Check for TypeScript errors
npx tsc --noEmit

# Manual test in browser at http://localhost:4200
# Test the golden path + edge cases for your feature
```

### Step 7: Commit Changes

```bash
# Stage specific files (never use git add . blindly)
git add src/app/features/maintenance/
git add src/app/app.routes.ts          # if you added a new route
git add supabase/migrations/           # if new migration
git add src/types/supabase.ts          # if types were regenerated

# Review what you're committing
git diff --staged

# Commit with a clear message
git commit -m "feat: add maintenance request module with CRUD and RLS

- Add maintenance_requests table with RLS policies
- Create MaintenanceService with Supabase integration
- Add list + form components with PrimeNG DataTable
- Register /maintenance route in app.routes.ts"
```

Commit message format:
```
<type>: <short summary>

<optional body with details>
```
Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `db`

### Step 8: Push Changes

```bash
# Push to remote (first push on this branch)
git push -u origin feature/add-maintenance-module

# Subsequent pushes
git push
```

### Step 9: Create a Pull Request

```bash
# Via GitHub CLI
gh pr create \
  --title "feat: add maintenance request module" \
  --body "## What this does
- Adds maintenance request tracking per property
- Full CRUD with owner/manager RLS
- Razorpay-ready for contractor payment (coming later)

## Testing
- [ ] Create maintenance request
- [ ] View list per property
- [ ] Edit/close request
- [ ] Manager can view (cannot delete)
- [ ] Tenant cannot see maintenance requests

## Migration
Migration 028 — run: npx supabase db push" \
  --base main

# Or open GitHub in browser
gh pr create --web
```

### Step 10: After PR is Merged

```bash
# Switch back to main and pull
git checkout main
git pull origin main

# Delete the local branch
git branch -d feature/add-maintenance-module

# Apply the new migration locally (your teammates' PRs may have included new ones)
npx supabase migration up

# Regenerate types if migrations changed
npx supabase gen types typescript --local > src/types/supabase.ts
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Start dev server | `npm start` |
| Start local Supabase | `npx supabase start` |
| Apply migrations | `npx supabase migration up` |
| Regenerate DB types | `npx supabase gen types typescript --local > src/types/supabase.ts` |
| Run tests | `ng test --watch=false` |
| Lint | `ng lint` |
| New migration | `npx supabase migration new <name>` |
| Push to production DB | `npx supabase db push` |
| Deploy Edge Functions | `npx supabase functions deploy` |
| Production build | `npm run build:prod` |
| New component | `ng generate component features/<name>/pages/<page> --standalone` |
| New service | `ng generate service features/<name>/<name>` |

---

*This document is auto-maintained. When schema changes, run `npx supabase gen types` and update Section 6. When new features are added, update Sections 1.2, 5.1, and 9.7.*
