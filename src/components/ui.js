// ui.jsx  — Shared components
// ─────────────────────────────────────────────────────────────────────────────

// ── StatusPill ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  active:     "bg-green-100 text-green-800",
  approved:   "bg-green-100 text-green-800",
  paid:       "bg-green-100 text-green-800",
  pending:    "bg-yellow-50 text-yellow-800",
  processing: "bg-yellow-50 text-yellow-800",
  expired:    "bg-red-100 text-red-700",
};

const STATUS_LABEL = {
  active: "Active", pending: "Pending", expired: "Expired",
  approved: "Approved", paid: "Paid Out", processing: "Processing",
};

export function StatusPill({ status }) {
  return (
    <span className={`text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full uppercase ${STATUS_STYLES[status] || "bg-yellow-50 text-yellow-800"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────────
export function Steps({ steps, current }) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((s, i) => (
        <div key={i} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all
              ${i < current  ? "bg-green-600 text-white"
              : i === current ? "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] shadow-[0_8px_32px_rgba(201,148,58,0.35)]"
              : "bg-[#EBF1F7] text-[#7A94AD]"}`}>
              {i < current ? "✓" : i + 1}
            </div>
            <div className={`text-[11px] font-semibold mt-1.5
              ${i < current ? "text-green-600" : i === current ? "text-[#C9943A]" : "text-[#7A94AD]"}`}>
              {s}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all
              ${i < current ? "bg-green-600" : i === current ? "bg-gradient-to-r from-[#C9943A] to-[#D8E2EC]" : "bg-[#D8E2EC]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── PolicyCard ────────────────────────────────────────────────────────────────
export function PolicyCard({ policy, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#D8E2EC] p-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:border-[#C9943A] relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: policy.bg }}>
            {policy.icon}
          </div>
          <div>
            <div className="font-bold text-[15px] text-[#0D1B2A] mb-1">{policy.type}</div>
            <div className="font-mono text-[11px] text-[#7A94AD]">{policy.id}</div>
          </div>
        </div>
        <StatusPill status={policy.status} />
      </div>
      {children}
      <div className="h-[3px] bg-[#EBF1F7] rounded-full mt-4">
        <div className="h-full rounded-full bg-gradient-to-r from-[#C9943A] to-[#E5B96A]" style={{ width: `${policy.progress}%` }} />
      </div>
    </div>
  );
}

// ── SummaryCard ───────────────────────────────────────────────────────────────
export function SummaryCard({ title, rows, totalLabel, totalAmount }) {
  return (
    <div className="bg-black rounded-2xl p-7 text-white mb-5">
      <div className="font-['Playfair_Display'] text-lg font-bold mb-5 text-white">{title}</div>
      {rows.map(([label, value], i) => (
        <div key={i} className="flex justify-between py-2.5 border-b border-white/10 last:border-none">
          <span className="text-[13px] text-white/60">{label}</span>
          <span className="text-[13px] font-semibold text-white">{value}</span>
        </div>
      ))}
      {totalAmount && (
        <div className="bg-[#C9943A]/15 rounded-lg p-4 mt-4">
          <div className="text-[13px] text-[#E5B96A] mb-1">{totalLabel}</div>
          <div className="font-['Playfair_Display'] text-4xl font-bold text-[#C9943A]">{totalAmount}</div>
        </div>
      )}
    </div>
  );
}