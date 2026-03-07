# Task: Branch-Specific Rebuild Plan

## Plan

- [x] Read project task instructions and check for existing lessons.
- [x] Inspect the current branch routes, auth flows, Firestore usage, and Stripe integration.
- [x] Determine whether this branch contains a real customer-facing product or only admin scaffolding.
- [x] Produce a decision-complete refactor plan tied to the current branch.
- [x] Confirm the proposed plan before implementation work starts.
- [x] Scaffold the initial `api` service with Express, Better Auth, Drizzle, PostgreSQL config, and base routes.
- [x] Scaffold `web` and `api` responsibilities for the new architecture.
- [ ] Replace Firebase auth/data access with Better Auth + Express + Drizzle + PostgreSQL.
- [ ] Rebuild the admin and customer UI in shadcn with server-backed route/session guards.
- [ ] Build and validate the Firebase-to-PostgreSQL migration and cutover path.

## Frontend Rebuild Worktree Plan

- [x] Read the current frontend entry points, layout components, store, and styling baseline.
- [x] Replace the broken Firebase-era route tree with a nested React Router application shell.
- [x] Add a frontend session bootstrap and API client boundary that targets the new Express backend.
- [x] Rebuild the first-pass public, customer, and admin surfaces with shared shell components and placeholder server states.
- [x] Validate the rebuilt frontend with a production build and document remaining backend-dependent gaps.

## Branch Findings

- The branch is a Vite React SPA with all business data read and written directly from the client via Firebase, plus a small Firebase Functions Stripe backend.
- `src/App.jsx` uses malformed React Router 6 nesting by rendering nested `<Routes>` inside route `element` trees instead of nested route definitions.
- `src/layouts/users/UserLayout.jsx` exists and renders a customer shell, but the component is internally misnamed and relies on the broken route composition above.
- `src/components/PrivateRoute.jsx` exists but is not actually used to protect the admin or user route trees.
- Firebase usage is inconsistent:
  - v9 modular style in files such as `src/screens/UserLogin.jsx`
  - v8 compat-style calls in `src/screens/Signup.jsx`
  - Realtime Database is pulled in only to generate IDs in `src/components/admin/adminCustomers/forms/AddCustomer.jsx`
- Stripe secrets are exposed in the frontend in `src/utils/stripe.js`, and Stripe server calls are attempted directly from browser code there.
- The customer portal is real but partial:
  - implemented: `src/screens/UserLogin.jsx`, `src/screens/UserDash.jsx`, `src/screens/UserBilling.jsx`, `src/components/client/UserPortalHeader.jsx`
  - incomplete: `src/screens/UserPayment.jsx`
  - structurally fragile: payment flow posts directly to Firebase Functions and depends on client-known Stripe/customer invoice fields
- Admin is the most complete product area:
  - dashboard, customers, leads, invoices, and user management all exist
  - privileged actions are still effectively client-authorized
- `firebaseConfig` is absent from this checkout, so exact runtime wiring cannot be validated locally, but the app’s required Firebase contracts are clear from imports and reads/writes.

## Scope Decision

The first pass should rebuild both admin and customer product areas, not admin-only.

Reason:

- This branch already contains a meaningful customer workflow: user login, dashboard summary, invoice list/detail, and payment submission.
- Shipping only an admin rebuild plus a placeholder customer shell would be a regression relative to this branch.
- The right first-pass boundary is:
  - full admin rebuild for current operational workflows
  - real authenticated customer portal for login, dashboard, billing, invoice detail, and payment actions
  - defer only low-signal or clearly incomplete areas such as richer self-service application management or non-essential payment-method management UX

## Proposed Plan

### 1. Repository Shape

- Keep a React SPA for `web`.
- Add a dedicated `api` service for auth, business operations, and Stripe.
- Treat the current code as reference only; do not preserve Firebase-era routing/auth/data patterns.

Target split:

- `web`: Vite React, TypeScript if feasible at scaffold time, shadcn/ui, TanStack Query, React Router 6 nested routing, form validation, server-session-based guards.
- `api`: Express, Better Auth, Drizzle, PostgreSQL, Stripe SDK, migration/import scripts.

### 2. Product Scope for First Launch

Ship these in the cutover branch:

- Public:
  - landing page
  - simple financing application / lead capture
  - customer login
  - admin login
- Customer:
  - authenticated shell
  - dashboard
  - billing list
  - invoice detail
  - payment action
  - basic profile/session surface
- Admin:
  - dashboard
  - customers list/detail/create/edit
  - leads list/detail
  - invoices list/detail/create
  - user/admin management

Defer from first launch unless discovered as truly in use:

- advanced document-management UX beyond preserving uploaded file references
- broad self-service customer profile editing
- partial/incomplete screens equivalent to current `UserPayment.jsx`

### 3. Server Ownership Boundaries

Move all privileged behavior to `api`:

- auth/session issuance and revocation
- Google and email/password auth flows
- role enforcement for admin operations
- customer CRUD
- lead intake and conversion
- invoice creation and retrieval
- Stripe customer creation, invoice/payment orchestration, webhook handling
- audit logging for admin actions and billing mutations

The web app should only call authenticated HTTP endpoints and never talk to Stripe secrets or privileged persistence directly.

### 4. Branch-Derived Domain Model

Current Firestore shape observed from the branch:

- `users`
  - `uid`
  - `email`
  - `isAdmin`
  - `firstName`
  - `lastName`
  - `cusID`
- `customers`
  - top-level identifiers such as `cusID`, `uid`
  - nested `applicant`
  - nested `employment`
  - nested `vehicle`
  - document links from uploads
  - `StripeCustomerId` or similar Stripe linkage
  - `status`
- `customers/{customerId}/invoices`
- root `invoices`
- `leads`
- `tempInvoices`

Relational target for first pass:

- auth tables from Better Auth:
  - `users`
  - `sessions`
  - `accounts`
  - verification tables required by Better Auth
- business tables:
  - `staff_roles`
  - `customers`
  - `customer_applicants`
  - `customer_employment`
  - `customer_vehicles`
  - `customer_documents`
  - `leads`
  - `invoices`
  - `invoice_line_items`
  - `customer_financing_terms`
  - `stripe_customers`
  - `audit_log`

Recommended mapping choices:

- Keep auth user identity separate from customer profile records.
- Replace `isAdmin` booleans with role rows or explicit role enums plus optional dealership/staff scope.
- Flatten nested Firestore objects into related tables instead of a single JSON blob.
- Preserve original Firebase identifiers in import columns such as `legacy_firebase_uid`, `legacy_customer_id`, `legacy_invoice_id` for traceability during cutover.

### 5. Auth and Authorization Design

- Better Auth becomes the only auth source.
- Preserve both email/password and Google sign-in.
- Migrate Firebase Auth users/accounts into Better Auth-compatible user/account records.
- Use HTTP-only server sessions.
- Gate admin routes from server session data, not client-owned booleans.
- Expose `/me` or equivalent session bootstrap endpoint so `web` can hydrate current user and role cleanly.

### 6. Stripe Design

- Remove Stripe secret usage from `web` immediately.
- Keep Stripe entirely server-side except publishable-key usage needed for client payment UI.
- Model Stripe around server-created customers and invoice/payment intents tied to internal invoice records.
- Replace `tempInvoices` + Firestore trigger behavior with explicit API commands:
  - admin creates invoice
  - API persists invoice draft
  - API creates Stripe objects
  - Stripe webhook updates canonical payment state
- Record Stripe IDs on dedicated business records, not scattered across client state.

### 7. Migration Plan

- Export Firebase Auth users and Firestore data from the source environment.
- Build import scripts that transform:
  - Firestore `users` into Better Auth users/accounts plus role assignments
  - Firestore `customers` into normalized customer/applicant/employment/vehicle/document rows
  - nested customer invoices and root `invoices` into one canonical invoice model
  - `leads` into lead records
- Resolve field inconsistencies discovered in this branch:
  - `StripeCustomerId` vs `stripeCustomerId`
  - `cusID` vs customer document id
  - mixed invoice status casing such as `Pending` vs `paid`
- Dry-run imports into PostgreSQL until row counts and spot checks reconcile.
- Execute a big-bang cutover:
  - freeze Firebase writes
  - run final export/import
  - switch frontend to new API/auth
  - validate payments and sessions
  - decommission Firebase usage
  - rotate exposed Stripe credentials immediately

### 8. Recommended Implementation Order

1. Scaffold `api` with Express, Drizzle, PostgreSQL, Better Auth, env handling, and Stripe wiring.
2. Define the normalized schema and generate migrations.
3. Build auth/session endpoints and role-aware guards.
4. Build migration/import scripts from Firebase exports.
5. Scaffold `web` app structure with nested routing, shadcn primitives, TanStack Query, and auth bootstrap.
6. Rebuild admin flows against `api`.
7. Rebuild customer flows against `api`.
8. Run import rehearsal, end-to-end smoke tests, and cutover validation.

## Review

- Completed a branch-specific assessment instead of relying on prior assumptions.
- Confirmed this branch contains a real customer-facing billing/login product, so first-pass scope must include customer rebuild, not just admin.
- Captured the implementation sequence, server boundaries, and schema direction needed to start the refactor on this branch.
- Added an `api` service scaffold with Express, Better Auth, Drizzle, PostgreSQL connection/config, and base `/api/health` plus `/api/session` routes.
- Added initial normalized business schema tables for customers, leads, invoices, financing terms, documents, staff roles, Stripe linkage, and audit logging.
- Added root convenience scripts for the new backend and verified the scaffold with `npm run typecheck` and `npm run build` in `api/`.
- Smoke-tested API startup with local env overrides and confirmed the Express service boots successfully.
- Replaced the legacy Firebase-driven `src/App.jsx` route composition with a nested router scaffold under `src/app/` for public, customer, and admin route families.
- Added a frontend session provider and API helper that bootstrap from `/api/session`, expose role-aware protected routes, and support mock preview mode for UI work while backend auth is still landing.
- Rebuilt the first-pass landing, application, customer, and admin surfaces into shared shell/page components with compatibility redirects for legacy URLs such as `/auto-loan`, `/application`, `/user/*`, and `/admin/dash`.
- Installed frontend dependencies with `npm ci` in this worktree and verified the new scaffold with a successful `npm run build`.
- Remaining backend-dependent gaps:
  - sign-in/sign-out actions are not wired because the backend auth contract is still in progress
  - route guards currently depend on role/session fields that must be exposed by `/api/session`
  - page data is placeholder/UI-shape data until customer, lead, invoice, and billing endpoints land
