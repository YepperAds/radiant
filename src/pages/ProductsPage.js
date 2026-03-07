import { useState } from "react";
import { PRODUCTS } from "../data/constants";

import Insurance from '../img/insurance.png';
import Search from '../img/search.png'

const inputCls = "h-11 px-3.5 border-[1.5px] border-[#D8E2EC] rounded-lg font-['DM_Sans'] text-sm text-[#0D1B2A] bg-white outline-none transition-all w-full focus:border-[#C9943A] focus:ring-2 focus:ring-[#C9943A]/10 placeholder:text-[#7A94AD]";
const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";

export default function ProductsPage({ setPage, setSelectedProduct }) {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())
  );
  const handleApply = (product) => { setSelectedProduct(product); setPage("apply"); };

  return (
    <div className="p-8 flex-1">
      <div className="bg-black text-white rounded-lg px-4 py-3.5 flex gap-3 items-start text-[13px] leading-relaxed mb-5">
        <span>All applications are processed digitally. You'll receive your policy document by email within 24 hours of payment.</span>
      </div>

      <div className="mb-6 relative max-w-[460px]">
        {/* Outer border glow on focus — achieved via peer */}
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center justify-center pointer-events-none z-10">
            <img
              src={Search}
              alt=""
              className="w-[18px] h-[18px] object-contain opacity-40 peer-focus:opacity-100 transition-opacity"
            />
          </div>
          <input
            className="peer w-full h-12 pl-11 pr-4 bg-white border-[1.5px] border-[#D8E2EC] rounded-xl text-[14px] text-[#0D1B2A] font-['DM_Sans'] placeholder:text-[#A0B4C5] outline-none transition-all duration-200 focus:border-[#C9943A] focus:ring-4 focus:ring-[#C9943A]/10 shadow-[0_1px_4px_rgba(13,27,42,0.06)] focus:shadow-[0_4px_20px_rgba(201,148,58,0.12)]"
            placeholder="Search insurance products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 w-6 h-6 flex items-center justify-center rounded-full bg-[#EBF1F7] hover:bg-[#D8E2EC] text-[#4A6380] text-[12px] font-bold transition-colors border-none cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-7">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white border border-[#D8E2EC] rounded-2xl p-6 cursor-pointer flex flex-col hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(13,27,42,0.18)] hover:border-[#C9943A] transition-all">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: p.bg }}>
              <img src={p.icon} alt={p.name} className="w-8 h-8 object-contain" />
            </div>
            <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-2">{p.name}</div>
            <div className="text-[13px] text-[#7A94AD] leading-relaxed flex-1">{p.desc}</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.tags.map((t) => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF1F7] text-[#4A6380]">{t}</span>)}
            </div>
            <div className="mt-5 pt-4 border-t border-[#D8E2EC] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#7A94AD]">Starting</div>
                <div className="font-bold text-[#C9943A] text-[15px]">{p.from}</div>
              </div>
              <button onClick={() => handleApply(p)} className={`px-4 py-2 text-[13px] font-bold rounded-lg ${btnPrimary}`}>
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}