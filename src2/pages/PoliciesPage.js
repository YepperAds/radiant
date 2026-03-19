import { useState } from "react";
import { MY_POLICIES } from "../data/constants";
import { StatusPill } from "../components/ui";

import Check from '../img/check.png';

const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";
const btnGhost  = "bg-transparent text-[#4A6380] border border-[#D8E2EC] rounded-lg font-semibold transition-all hover:bg-[#EBF1F7] hover:text-[#0D1B2A] cursor-pointer font-['DM_Sans']";

export default function PoliciesPage({ setPage }) {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? MY_POLICIES : MY_POLICIES.filter((p) => p.status === tab);

  return (
    <div className="p-8 flex-1">
      <div className="bg-black text-white rounded-lg px-4 py-3.5 flex gap-3 items-start text-[13px] leading-relaxed mb-5">
        <span>You have <strong>2 active policies</strong> providing total coverage of <strong>RWF 8,400,000</strong>.</span>
      </div>

      <div className="flex gap-1.5 bg-[#EBF1F7] rounded-lg p-1 mb-6">
        {["all","active","pending","expired"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 text-center px-4 py-2 rounded-md text-[13px] font-semibold cursor-pointer border-none transition-all font-['DM_Sans']
            ${tab === t ? "bg-white text-[#0D1B2A] shadow-[0_2px_8px_rgba(13,27,42,0.08)]" : "bg-transparent text-[#4A6380]"}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "active" && <span className="ml-1.5 bg-green-600 text-white rounded-[10px] px-1.5 py-0.5 text-[10px]">2</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-[#D8E2EC] p-5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:border-[#C9943A] transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3.5 items-center">
                <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
                  <img src={p.icon} alt={p.type} className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <div className="font-bold text-[17px] text-[#0D1B2A] mb-1">{p.type}</div>
                  <div className="font-mono text-[11px] text-[#7A94AD]">{p.id}</div>
                  {p.vehicle  && <div className="text-[12px] text-[#7A94AD] mt-0.5">Vehicle: {p.vehicle}</div>}
                  {p.plan     && <div className="text-[12px] text-[#7A94AD] mt-0.5">Plan: {p.plan}</div>}
                </div>
              </div>
              <StatusPill status={p.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[["Annual Premium",p.premium],["Start Date",p.start],["Expiry Date",p.end],["Coverage Used",`${p.progress}%`]].map(([lbl,val]) => (
                <div key={lbl}><label className="text-[10px] uppercase tracking-[1px] text-[#7A94AD] block mb-0.5">{lbl}</label><span className="text-sm font-semibold text-[#0D1B2A]">{val}</span></div>
              ))}
            </div>
            <div className="h-[3px] bg-[#EBF1F7] rounded-full mt-4">
              <div className="h-full rounded-full bg-gradient-to-r from-[#C9943A] to-[#E5B96A]" style={{ width: `${p.progress}%` }} />
            </div>
            <div className="flex gap-2.5 mt-4">
              <button className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnPrimary}`}>Renew Policy</button>
              <button onClick={() => setPage("claims")} className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnGhost}`}>File Claim</button>
              <button className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnGhost}`}>Download Certificate</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={() => setPage("products")} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>+ Get Another Policy</button>
      </div>
    </div>
  );
}