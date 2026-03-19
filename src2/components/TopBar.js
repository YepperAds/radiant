// TopBar.js
import { PAGE_META } from "../data/constants";
import Bell from '../img/bell.png';
import Phone from '../img/phone-call (1).png';

const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";
const btnGhost  = "bg-transparent text-[#4A6380] border border-[#D8E2EC] rounded-lg font-semibold transition-all hover:bg-[#EBF1F7] hover:text-[#0D1B2A] cursor-pointer font-['DM_Sans']";

export default function TopBar({ page, setPage }) {
  const meta = PAGE_META[page] || PAGE_META.dashboard;
  return (
    <div className="bg-white border-b border-[#D8E2EC] px-9 h-[68px] flex items-center justify-between sticky top-0 z-50">
      <div>
        <div className="font-['Playfair_Display'] text-[22px] font-bold text-[#0D1B2A]">{meta.title}</div>
        <div className="text-[13px] text-[#7A94AD] mt-0.5">{meta.sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button className={`h-9 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 ${btnGhost}`}>
          <img src={Bell} alt="" className="w-3 h-3 object-contain" />
          <span className="w-2 h-2 bg-red-600 rounded-full ml-0.5 inline-block" />
        </button>
        <button className={`h-9 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 ${btnGhost}`}>
          <img src={Phone} alt="" className="w-3 h-3 object-contain" />
          0788 381 093
        </button>
        <button className={`h-9 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 ${btnPrimary}`} onClick={() => setPage("products")}>
          + Get Insurance
        </button>
      </div>
    </div>
  );
}