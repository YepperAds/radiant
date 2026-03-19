import { MY_POLICIES, ACTIVITIES } from "../data/constants";
import { StatusPill } from "../components/ui";

import Insurance from '../img/shield.png';
import Document from '../img/document.png';
import Money from '../img/money.png';
import Calendar from '../img/calendar.png';
import Documents from '../img/folder.png';
import Card from '../img/card.png';
import Filing from '../img/filing.png';
import Chat from '../img/chat.png';

const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";

const STATS = [
  { icon: Insurance, bg: "#E3F2FD", label: "Active Policies",  value: "2",        change: "+1 this year",        up: true  },
  { icon: Document,  bg: "#FFF8E1", label: "Open Claims",       value: "1",        change: "1 processing",        up: false },
  { icon: Money,     bg: "#E8F5E9", label: "Total Coverage",    value: "RWF 8.4M", change: "Across all policies", up: false },
  { icon: Calendar,  bg: "#FCE4EC", label: "Next Renewal",      value: "Jan 2026", change: "Motor insurance",     up: false },
];

const QUICK_ACTIONS = [
  { icon: Insurance, bg: "#E3F2FD", label: "New Policy",  page: "products"  },
  { icon: Filing,    bg: "#FFF8E1", label: "File Claim",  page: "claims"    },
  { icon: Card,      bg: "#E8F5E9", label: "Pay Premium", page: "payments"  },
  { icon: Documents, bg: "#EDE7F6", label: "Documents",   page: "documents" },
];

export default function Dashboard({ setPage }) {
  return (
    <div className="p-8 flex-1 animate-[fadeUp_0.4s_ease_both]">

      {/* Welcome banner */}
      <div className="bg-black rounded-3xl p-9 relative overflow-hidden mb-7">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[radial-gradient(circle,rgba(201,148,58,0.15)_0%,transparent_70%)] rounded-full" />
        <div className="absolute -bottom-20 right-28 w-44 h-44 bg-[radial-gradient(circle,rgba(201,148,58,0.08)_0%,transparent_70%)] rounded-full" />
        <div className="text-[11px] tracking-[2.5px] uppercase text-[#E5B96A] font-semibold mb-2.5">Welcome back</div>
        <div className="font-['Playfair_Display'] text-[32px] font-bold text-white leading-tight mb-2.5">Hello, Jean-Pierre</div>
        <div className="text-white/60 text-[15px] max-w-[480px]">
          You have 2 active policies and 1 claim being processed. Everything you need, right here.
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setPage("products")} className={`px-6 py-3 text-sm font-semibold rounded-lg ${btnPrimary}`}>Get New Insurance</button>
          <button onClick={() => setPage("claims")} className="px-6 py-3 text-sm font-semibold rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all cursor-pointer">File a Claim</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-[#D8E2EC] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] transition-all cursor-default">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5" style={{ background: s.bg }}>
              <img src={s.icon} alt={s.label} className="w-5 h-5 object-contain" />
            </div>
            <div className="font-['Playfair_Display'] text-[28px] font-bold text-[#0D1B2A]">{s.value}</div>
            <div className="text-[13px] text-[#7A94AD] mt-1">{s.label}</div>
            <div className={`text-[12px] font-semibold mt-1.5 ${s.up ? "text-green-700" : "text-[#7A94AD]"}`}>
              {s.up ? "↑ " : ""}{s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A]">Quick Actions</div>
      </div>
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {QUICK_ACTIONS.map((a, i) => (
          <div key={i} onClick={() => setPage(a.page)} className="bg-white border border-[#D8E2EC] rounded-2xl p-5 text-center cursor-pointer flex flex-col items-center gap-2.5 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:border-[#C9943A] transition-all">
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center" style={{ background: a.bg }}>
              <img src={a.icon} alt={a.label} className="w-6 h-6 object-contain" />
            </div>
            <span className="text-[13px] font-semibold text-[#0D1B2A]">{a.label}</span>
          </div>
        ))}
      </div>

      {/* Policies + Activity */}
      <div className="grid grid-cols-2 gap-6 mb-7">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A]">My Policies</div>
            <button className="text-[13px] font-semibold text-[#C9943A] bg-none border-none cursor-pointer hover:text-[#E5B96A] transition-all" onClick={() => setPage("policies")}>View All →</button>
          </div>
          {MY_POLICIES.slice(0, 2).map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-[#D8E2EC] p-5 mb-3.5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:border-[#C9943A] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
                    <img src={p.icon} alt={p.type} className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-[#0D1B2A] mb-1">{p.type}</div>
                    <div className="font-mono text-[11px] text-[#7A94AD]">{p.id}</div>
                  </div>
                </div>
                <StatusPill status={p.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div><label className="text-[10px] uppercase tracking-[1px] text-[#7A94AD] block mb-0.5">Premium</label><span className="text-sm font-semibold text-[#0D1B2A]">{p.premium}</span></div>
                <div><label className="text-[10px] uppercase tracking-[1px] text-[#7A94AD] block mb-0.5">Expires</label><span className="text-sm font-semibold text-[#0D1B2A]">{p.end}</span></div>
              </div>
              <div className="h-[3px] bg-[#EBF1F7] rounded-full mt-4">
                <div className="h-full rounded-full bg-gradient-to-r from-[#C9943A] to-[#E5B96A]" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A] mb-4">Recent Activity</div>
          <div className="bg-white border border-[#D8E2EC] rounded-2xl p-6">
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="flex gap-3.5 py-3.5 border-b border-[#D8E2EC] last:border-none last:pb-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: a.color }}>
                  <img src={a.icon} alt="" className="w-[18px] h-[18px] object-contain" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#0D1B2A] mb-0.5">{a.text}</div>
                  <div className="text-[12px] text-[#7A94AD]">{a.sub}</div>
                </div>
                <div className="text-[11px] text-[#7A94AD] font-mono whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat CTA */}
      <div className="bg-black rounded-3xl p-6 px-7 flex items-center gap-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(13,27,42,0.18)] transition-all mb-7">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
          <img src={Chat} alt="" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <div className="font-['Playfair_Display'] text-[17px] font-bold text-white mb-1">Need help choosing a plan?</div>
          <div className="text-[13px] text-white/60">Our virtual agent can guide you through every product.</div>
        </div>
        <button className="ml-auto bg-[#C9943A] text-[#0D1B2A] border-none rounded-lg px-[18px] py-2.5 text-[13px] font-bold cursor-pointer shrink-0 font-['DM_Sans']">Chat with Agent</button>
      </div>

    </div>
  );
}