import {
  Briefcase,
  Car,
  ClipboardList,
  DollarSign,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";

import { useSession } from "./session";
import { BrandMark } from "./ui";

const customerNav = [
  {
    to: "/app/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/app/billing",
    label: "Billing",
    icon: DollarSign,
  },
  {
    to: "/app/payments",
    label: "Payments",
    icon: Gauge,
  },
];

const adminNav = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    to: "/admin/leads",
    label: "Leads",
    icon: ClipboardList,
  },
  {
    to: "/admin/invoices",
    label: "Invoices",
    icon: DollarSign,
  },
  {
    to: "/admin/staff",
    label: "Staff",
    icon: ShieldCheck,
  },
];

export function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { error, isAuthenticated, role, status } = useSession();

  if (status === "loading") {
    return <LoadingState message="Bootstrapping server session…" />;
  }

  if (status === "error") {
    return (
      <div className="page-shell">
        <div className="page-inner flex min-h-screen items-center justify-center">
          <div className="surface-card max-w-xl p-8">
            <p className="eyebrow">Backend handoff</p>
            <h1 className="headline mt-4 text-3xl">Session bootstrap is not reachable.</h1>
            <p className="subhead mt-4">
              The rebuild is pointed at <code className="rounded bg-black/5 px-2 py-1">/api/session</code>.
              The frontend shell is ready, but protected routes need the backend thread to expose session state.
            </p>
            <p className="mt-4 text-sm text-[color:var(--page-muted)]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginTarget = allowedRoles.includes("admin") ? "/admin/login" : "/login";
    return <Navigate to={loginTarget} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin/dashboard" : "/app/dashboard"} replace />;
  }

  return children;
}

export function PublicLayout() {
  const { error, isPreviewSession, mockModeEnabled, role, status } = useSession();

  return (
    <div className="page-shell">
      <div className="page-inner">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <BrandMark />
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip
              label={status === "ready" ? "API session connected" : status === "error" ? "API session offline" : "Checking session"}
            />
            {mockModeEnabled ? <StatusChip label="Mock preview available" /> : null}
            {isPreviewSession ? <StatusChip label={`Previewing ${role} workspace`} tone="accent" /> : null}
            {error ? <StatusChip label="Backend wiring pending" tone="warning" /> : null}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}

export function CustomerLayout() {
  return (
    <WorkspaceLayout
      eyebrow="Customer workspace"
      title="Collections and billing experience"
      description="Server-backed customer billing, payment visibility, and support handoff."
      navItems={customerNav}
      supportText="Customer portal"
      supportIcon={Car}
    />
  );
}

export function AdminLayout() {
  return (
    <WorkspaceLayout
      eyebrow="Operations workspace"
      title="Admin servicing console"
      description="Role-aware operations surfaces for customers, leads, invoices, and collections."
      navItems={adminNav}
      supportText="Ops control"
      supportIcon={Briefcase}
    />
  );
}

function WorkspaceLayout({
  eyebrow,
  title,
  description,
  navItems,
  supportText,
  supportIcon: SupportIcon,
}) {
  const { clearPreview, isPreviewSession, refreshSession, role, session, user } = useSession();

  return (
    <div className="page-shell">
      <div className="workspace-grid">
        <aside className="workspace-sidebar">
          <BrandMark inverse />
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.24em] text-white/48">{supportText}</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-white/66">{description}</p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <SupportIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name ?? "Unknown user"}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/48">{role ?? "No role"}</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-white/60">
              {session ? `Session ${session.id}` : "Waiting for session details."}
            </p>
          </div>
        </aside>

        <main className="workspace-main">
          <section className="surface-card-strong p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">{eyebrow}</p>
                <p className="mt-3 text-lg font-semibold">{description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="action-button-secondary" onClick={refreshSession} type="button">
                  Refresh session
                </button>
                {isPreviewSession ? (
                  <button className="action-button-primary" onClick={clearPreview} type="button">
                    Exit preview
                  </button>
                ) : null}
              </div>
            </div>
          </section>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function StatusChip({ label, tone = "default" }) {
  const toneClass =
    tone === "accent"
      ? "bg-[rgba(213,108,61,0.14)] text-[color:var(--accent-strong)]"
      : tone === "warning"
        ? "bg-amber-500/12 text-amber-900"
        : "bg-white/70 text-[color:var(--page-ink)]";

  return <span className={`status-chip ${toneClass}`}>{label}</span>;
}

function LoadingState({ message }) {
  return (
    <div className="page-shell">
      <div className="page-inner flex min-h-screen items-center justify-center">
        <div className="surface-card max-w-md p-8 text-center">
          <p className="eyebrow">Frontend rebuild</p>
          <h1 className="headline mt-4 text-3xl">Loading workspace</h1>
          <p className="subhead mt-4">{message}</p>
        </div>
      </div>
    </div>
  );
}
