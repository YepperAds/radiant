import { StatusPill } from "../components/ui";

import Motor from '../img/sportbike.png';
import Heart from '../img/heart.png';
import Card from '../img/card.png';
import Phone from '../img/cell-phone.png'

const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";
const btnGhost  = "bg-transparent text-[#4A6380] border border-[#D8E2EC] rounded-lg font-semibold transition-all hover:bg-[#EBF1F7] hover:text-[#0D1B2A] cursor-pointer font-['DM_Sans']";

const DUE_PAYMENTS = [
  { policy: "Motor Insurance",  due: "Jan 15, 2026", amount: "RWF 85,000",  icon: Motor },
  { policy: "Health Insurance", due: "Mar 01, 2026", amount: "RWF 240,000", icon: Heart },
];
const PAYMENT_HISTORY = [
  { date: "15 Jan 2025", desc: "Motor Insurance Premium",  amount: "RWF 85,000",  status: "active" },
  { date: "01 Mar 2025", desc: "Health Insurance Premium", amount: "RWF 240,000", status: "active" },
  { date: "08 Aug 2024", desc: "Fire & Property Premium",  amount: "RWF 48,000",  status: "pending" },
];

export default function PaymentsPage() {
  return (
    <div className="p-8 flex-1">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A] mb-4">Due Payments</div>
          {DUE_PAYMENTS.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#D8E2EC] p-5 mb-3.5 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(13,27,42,0.12)] hover:border-[#C9943A] transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#EBF1F7]">
                    <img src={p.icon} alt={p.policy} className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <div className="font-bold text-[15px] text-[#0D1B2A] mb-1">{p.policy}</div>
                    <div className="font-mono text-[11px] text-[#7A94AD]">Due: {p.due}</div>
                  </div>
                </div>
                <div className="font-['Playfair_Display'] text-xl font-bold text-[#C9943A]">{p.amount}</div>
              </div>
              <div className="flex gap-2.5 mt-3">
                <button className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnPrimary}`}>
                  <img src={Phone} alt="" className="w-4 h-4 object-contain" /> Pay via MoMo
                </button>
                <button className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnPrimary}`}>
                  <img src={Card} alt="" className="w-4 h-4 object-contain" /> Bank Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A] mb-4">Payment History</div>
          <div className="bg-white border border-[#D8E2EC] rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F7F3ED]">
                  {["Date","Description","Amount","Status"].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[1px] text-[#7A94AD] px-4 py-3 border-b-2 border-[#D8E2EC]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYMENT_HISTORY.map((r, i) => (
                  <tr key={i} className="hover:bg-[#FDF6E8] transition-colors">
                    <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm text-[#7A94AD]">{r.date}</td>
                    <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm">{r.desc}</td>
                    <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm font-bold">{r.amount}</td>
                    <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}