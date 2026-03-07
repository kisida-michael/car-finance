import {
  ArrowRight,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Files,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { adminOverview, customerOverview } from "./mock-data";
import { useSession } from "./session";
import { DataTable, MetricCard, SectionCard, StatusPill } from "./ui";

export function LandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="surface-card-dark overflow-hidden p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_360px]">
          <div>
            <p className="eyebrow border-white/10 bg-white/8 text-white/70">Frontend rebuild track</p>
            <h1 className="headline mt-5 text-white">
              A cleaner customer portal and admin console for the post-Firebase cutover.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
              This rebuild replaces the broken SPA route tree with nested workspaces, a session bootstrap tied to the new Express API, and a UI shell that can move independently while backend contracts land in parallel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="action-button-primary" to="/apply">
                Review lead intake
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="action-button-secondary border-white/12 bg-white/10 text-white" to="/login">
                Customer access
              </Link>
              <Link className="action-button-secondary border-white/12 bg-white/10 text-white" to="/admin/login">
                Admin access
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-white/48">Public, customer, admin</p>
              <p className="mt-3 text-2xl font-semibold text-white">Three route families, one session model.</p>
              <p className="mt-3 text-sm leading-6 text-white/64">
                The frontend no longer relies on nested <code className="rounded bg-white/10 px-2 py-1">Routes</code> inside route elements. Everything hangs from one router with clear protected boundaries.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile icon={ShieldCheck} label="Session bootstrap" body="Targets /api/session and can fall back to local preview mode for UI work." />
              <InfoTile icon={Files} label="Surface coverage" body="Landing, application intake, customer billing, admin operations, and route guards." />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <FeatureCard
          icon={Sparkles}
          title="Intentional visual system"
          body="Warm neutrals, high-contrast dark workspaces, and reusable shells replace the ad-hoc Firebase-era styling."
        />
        <FeatureCard
          icon={Banknote}
          title="Billing-first customer flow"
          body="Dashboard, invoice visibility, and payment status are laid out around the customer servicing workflow."
        />
        <FeatureCard
          icon={Building2}
          title="Operations-first admin flow"
          body="Customers, leads, invoices, and staff surfaces are isolated behind an admin session boundary."
        />
      </section>
    </div>
  );
}

export function ApplicationPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <SectionCard
        title="Lead intake surface"
        subtitle="This is the frontend contract for the future application flow. Submission wiring will move to the new API instead of Firestore writes."
      >
        <form className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            First name
            <input className="field-input" placeholder="Avery" />
          </label>
          <label className="grid gap-2 text-sm">
            Last name
            <input className="field-input" placeholder="Nguyen" />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            Email
            <input className="field-input" placeholder="avery@example.com" type="email" />
          </label>
          <label className="grid gap-2 text-sm">
            Vehicle target
            <input className="field-input" placeholder="2022 Honda CR-V" />
          </label>
          <label className="grid gap-2 text-sm">
            Requested amount
            <input className="field-input" placeholder="$22,000" />
          </label>
          <label className="grid gap-2 text-sm md:col-span-2">
            Notes
            <textarea className="field-input min-h-[144px]" placeholder="Down payment, trade-in, or underwriting notes…" />
          </label>
          <div className="md:col-span-2">
            <button className="action-button-primary" type="button">
              API contract pending
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        dark
        title="Planned server ownership"
        subtitle="These actions leave the browser as the backend thread comes online."
      >
        <div className="space-y-4 text-sm text-white/68">
          <ChecklistItem text="POST lead/application intake to Express instead of writing direct to Firebase." />
          <ChecklistItem text="Attach upload references and underwriting steps to normalized customer records." />
          <ChecklistItem text="Convert approved leads into customer and financing records server-side." />
        </div>
      </SectionCard>
    </div>
  );
}

export function CustomerLoginPage() {
  return <AuthPage audience="customer" />;
}

export function AdminLoginPage() {
  return <AuthPage audience="admin" />;
}

export function CustomerDashboardPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {customerOverview.metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={index === 0 ? "accent" : index === 1 ? "success" : "default"}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <SectionCard title="Recent invoices" subtitle="The new customer dashboard keeps billing data front-and-center and lets backend status drive the UI.">
          <DataTable
            columns={[
              { key: "id", label: "Invoice" },
              { key: "vehicle", label: "Vehicle" },
              { key: "dueDate", label: "Due date" },
              { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
              { key: "amount", label: "Amount" },
            ]}
            rows={customerOverview.recentInvoices}
          />
        </SectionCard>

        <SectionCard title="Activity" subtitle="Account state, support events, and payment updates share one timeline.">
          <div className="space-y-4">
            {customerOverview.timeline.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-[color:var(--line)] bg-white/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs uppercase tracking-[0.16em] text-[color:var(--page-muted)]">
                    {item.time}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--page-muted)]">{item.detail}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export function CustomerBillingPage() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_340px]">
      <SectionCard title="Billing ledger" subtitle="Canonical invoice records from the API replace the current client-computed view.">
        <DataTable
          columns={[
            { key: "id", label: "Invoice" },
            { key: "vehicle", label: "Contract" },
            { key: "dueDate", label: "Due" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
          ]}
          rows={customerOverview.recentInvoices}
        />
      </SectionCard>

      <SectionCard title="Payment rails" subtitle="Payment methods move behind server-created intents and webhook-confirmed states.">
        <div className="space-y-4">
          {customerOverview.paymentMethods.map((method) => (
            <div key={method.descriptor} className="rounded-[24px] border border-[color:var(--line)] bg-white/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{method.method}</p>
                  <p className="mt-1 text-sm text-[color:var(--page-muted)]">{method.descriptor}</p>
                </div>
                <StatusPill value={method.status} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function CustomerPaymentsPage() {
  return (
    <SectionCard
      title="Payment action design"
      subtitle="This route is reserved for the backend-owned payment intent flow. The UI is scaffolded and waiting on the Stripe contract."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <FeatureCard
          icon={CreditCard}
          title="Intent creation"
          body="The browser will request a payment action from the API instead of constructing Stripe behavior directly."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Webhook-confirmed status"
          body="Paid, failed, and pending states will come from Stripe webhooks syncing back into invoice records."
        />
        <FeatureCard
          icon={Files}
          title="Audit visibility"
          body="Support and collections teams can see why a payment moved into review without reading client state."
        />
      </div>
    </SectionCard>
  );
}

export function AdminDashboardPage() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminOverview.metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={index === 0 ? "accent" : index === 1 ? "warning" : "default"}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard title="Customers in focus" subtitle="Collections and account health can be surfaced from normalized customer + financing rows.">
          <DataTable
            columns={[
              { key: "name", label: "Customer" },
              { key: "segment", label: "Segment" },
              { key: "balance", label: "Balance" },
              { key: "health", label: "Health", render: (row) => <StatusPill value={row.health} /> },
            ]}
            rows={adminOverview.customers}
          />
        </SectionCard>
        <SectionCard title="Lead queue" subtitle="Underwriting and intake work stays visible while API contracts are still landing.">
          <DataTable
            columns={[
              { key: "applicant", label: "Applicant" },
              { key: "source", label: "Source" },
              { key: "stage", label: "Stage", render: (row) => <StatusPill value={row.stage} /> },
              { key: "requested", label: "Requested" },
            ]}
            rows={adminOverview.leads}
          />
        </SectionCard>
      </div>
    </div>
  );
}

export function AdminCustomersPage() {
  return (
    <SectionCard title="Customer servicing roster" subtitle="The rebuild keeps customer operations inside one stable table instead of scattered Firebase reads.">
      <DataTable
        columns={[
          { key: "name", label: "Customer" },
          { key: "segment", label: "Portfolio note" },
          { key: "balance", label: "Balance" },
          { key: "health", label: "Health", render: (row) => <StatusPill value={row.health} /> },
        ]}
        rows={adminOverview.customers}
      />
    </SectionCard>
  );
}

export function AdminLeadsPage() {
  return (
    <SectionCard title="Lead and application intake" subtitle="This route is the handoff point for the future lead submission API and underwriting progression.">
      <DataTable
        columns={[
          { key: "applicant", label: "Applicant" },
          { key: "source", label: "Source" },
          { key: "stage", label: "Stage", render: (row) => <StatusPill value={row.stage} /> },
          { key: "requested", label: "Requested amount" },
        ]}
        rows={adminOverview.leads}
      />
    </SectionCard>
  );
}

export function AdminInvoicesPage() {
  return (
    <SectionCard title="Invoice operations" subtitle="Invoice creation and payment reconciliation will move entirely behind the backend.">
      <DataTable
        columns={[
          { key: "invoice", label: "Invoice" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
        ]}
        rows={adminOverview.invoices}
      />
    </SectionCard>
  );
}

export function AdminStaffPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <SectionCard title="Staff access model" subtitle="Role-aware admin routes replace the current client-owned isAdmin boolean flow.">
        <DataTable
          columns={[
            { key: "person", label: "Team member" },
            { key: "role", label: "Assignment" },
            { key: "status", label: "Status", render: (row) => <StatusPill value={row.status} /> },
          ]}
          rows={adminOverview.staff}
        />
      </SectionCard>
      <SectionCard title="Guardrails" subtitle="Frontend expectations for the backend auth thread.">
        <div className="space-y-4">
          <ChecklistItem text="Expose stable session role data from /api/session." />
          <ChecklistItem text="Gate admin endpoints with server-side roles, not booleans stored in client documents." />
          <ChecklistItem text="Support clean sign-out and session refresh flows for admin staff." />
        </div>
      </SectionCard>
    </div>
  );
}

function AuthPage({ audience }) {
  const navigate = useNavigate();
  const {
    clearPreview,
    enablePreview,
    error,
    isAuthenticated,
    isPreviewSession,
    mockModeEnabled,
    refreshSession,
    role,
    user,
  } = useSession();

  const isAdmin = audience === "admin";
  const title = isAdmin ? "Admin access" : "Customer access";
  const destination = isAdmin ? "/admin/dashboard" : "/app/dashboard";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <SectionCard
        title={title}
        subtitle="The old Firebase auth bootstrap is gone. This page now aligns to the new backend session contract."
      >
        <div className="grid gap-4">
          <div className="rounded-[24px] border border-[color:var(--line)] bg-white/60 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--page-muted)]">Session state</p>
            <p className="mt-3 text-2xl font-semibold">
              {isAuthenticated ? `Signed in as ${user?.name ?? user?.email}` : "Waiting for backend auth wiring"}
            </p>
            <p className="mt-3 text-sm leading-6 text-[color:var(--page-muted)]">
              When the backend thread finishes auth endpoints, this route can host Better Auth email/password and Google sign-in flows without changing the route structure again.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="action-button-secondary" onClick={refreshSession} type="button">
                Refresh session
              </button>
              {isAuthenticated && role === audience ? (
                <button className="action-button-primary" onClick={() => navigate(destination)} type="button">
                  Open workspace
                </button>
              ) : null}
            </div>
            {error ? <p className="mt-4 text-sm text-[color:var(--accent-strong)]">{error}</p> : null}
          </div>

          {mockModeEnabled ? (
            <div className="rounded-[24px] border border-[rgba(213,108,61,0.22)] bg-[rgba(213,108,61,0.08)] p-5">
              <p className="text-sm font-semibold">Local preview mode</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--page-muted)]">
                Enable UI reviews while backend auth is still in flight. Set <code className="rounded bg-black/5 px-2 py-1">VITE_ENABLE_MOCK_SESSION=true</code> in local development.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="action-button-primary" onClick={() => enablePreview(audience)} type="button">
                  Preview {audience} shell
                </button>
                {isPreviewSession ? (
                  <button className="action-button-secondary" onClick={clearPreview} type="button">
                    Clear preview
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard
        dark
        title="What this page is waiting on"
        subtitle="The backend work can land without forcing another frontend route rewrite."
      >
        <div className="space-y-4 text-sm text-white/68">
          <ChecklistItem text="Better Auth sign-in routes and CSRF/session handling." />
          <ChecklistItem text="Stable role metadata from the /api/session response." />
          <ChecklistItem text="Optional Google sign-in surface for returning customers and staff." />
        </div>
      </SectionCard>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="surface-card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(213,108,61,0.12)] text-[color:var(--accent-strong)]">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[color:var(--page-muted)]">{body}</p>
    </div>
  );
}

function InfoTile({ icon: Icon, label, body }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <p className="mt-4 font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/64">{body}</p>
    </div>
  );
}

function ChecklistItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--success)]" />
      <p>{text}</p>
    </div>
  );
}
