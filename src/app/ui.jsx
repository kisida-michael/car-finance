import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function BrandMark({ inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          inverse ? "bg-white text-slate-950" : "bg-[color:var(--page-ink)] text-white"
        }`}
      >
        CF
      </div>
      <div>
        <p className={`text-xs uppercase tracking-[0.28em] ${inverse ? "text-white/60" : "text-[color:var(--page-muted)]"}`}>
          Car Finance
        </p>
        <p className={`font-semibold ${inverse ? "text-white" : "text-[color:var(--page-ink)]"}`}>
          Rebuild Preview
        </p>
      </div>
    </div>
  );
}

export function SectionCard({ title, subtitle, action, children, dark = false }) {
  return (
    <section className={dark ? "surface-card-dark p-6" : "surface-card p-6"}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle ? <p className={`mt-2 text-sm ${dark ? "text-white/66" : "text-[color:var(--page-muted)]"}`}>{subtitle}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({ label, value, detail, tone = "default" }) {
  const toneClass =
    tone === "accent"
      ? "from-[rgba(213,108,61,0.16)] to-transparent"
      : tone === "success"
        ? "from-[rgba(28,143,99,0.16)] to-transparent"
        : "from-white/30 to-transparent";

  return (
    <div className={`surface-card-strong relative overflow-hidden p-5`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneClass}`} />
      <div className="relative">
        <p className="text-sm text-[color:var(--page-muted)]">{label}</p>
        <p className="metric-value mt-3">{value}</p>
        <p className="mt-2 text-sm text-[color:var(--page-muted)]">{detail}</p>
      </div>
    </div>
  );
}

export function StatusPill({ value }) {
  const normalized = value.toLowerCase();
  const success = ["paid", "current", "verified", "on shift", "scheduled"].includes(normalized);
  const warning = ["pending", "review", "manual underwriting", "needs approval", "docs pending", "queued"].includes(normalized);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        success
          ? "bg-emerald-500/12 text-emerald-800"
          : warning
            ? "bg-amber-500/16 text-amber-900"
            : "bg-slate-900/8 text-slate-700"
      }`}
    >
      {success ? <CheckCircle2 className="h-3.5 w-3.5" /> : warning ? <AlertCircle className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
      {value}
    </span>
  );
}

export function DataTable({ columns, rows, compact = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? row.name ?? row.invoice ?? row.applicant ?? index}>
              {columns.map((column) => (
                <td key={column.key} className={compact ? "py-3" : undefined}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[color:var(--line)] px-5 py-8 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-[color:var(--page-muted)]">{body}</p>
    </div>
  );
}
