// Sidebar.js
import { NAV } from "../data/constants";
import Chat from '../img/chat.png'
import Phone from '../img/phone-call.png'
import Question from '../img/question-sign.png'

export default function Sidebar({ page, setPage }) {
  const isActive = (id) => page === id || (page === "apply" && id === "products");

  const SUPPORT = [
    { icon: Chat, label: "Live Chat" },
    { icon: Phone, label: "Call Agent" },
    { icon: Question, label: "Help Centre" },
  ];

  return (
    <nav className="w-[280px] min-w-[280px] bg-black flex flex-col fixed top-0 left-0 bottom-0 z-[100] overflow-y-auto">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#C9943A] to-[#E5B96A] rounded-xl flex items-center justify-center text-lg font-black text-[#0D1B2A] font-['Playfair_Display'] shrink-0 shadow-[0_8px_32px_rgba(201,148,58,0.25)]">
            R
          </div>
          <div>
            <div className="font-['Playfair_Display'] text-xl font-bold leading-tight tracking-wide text-white">Radiant</div>
            <div className="text-[10px] text-[#E5B96A] tracking-[2px] uppercase font-medium mt-0.5">Insurance Portal</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 pb-4">
        <div className="px-6 pt-5 pb-2 text-[10px] tracking-[2px] uppercase text-[#7A94AD] font-semibold">Main Menu</div>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`flex items-center gap-3 w-full px-6 py-3 text-sm font-medium transition-all border-none text-left relative
              ${isActive(n.id)
                ? "text-white bg-[#C9943A]/15 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-gradient-to-b before:from-[#C9943A] before:to-[#E5B96A] before:rounded-r-sm"
                : "text-white/60 bg-transparent hover:text-white hover:bg-white/5"}`}
          >
            <img
              src={n.icon}
              alt={n.label}
              className={`w-5 h-5 shrink-0 object-contain transition-all ${isActive(n.id) ? "opacity-100 brightness-[1.2]" : "opacity-50 brightness-0 invert"}`}
            />
            {n.label}
            {n.badge && (
              <span className="ml-auto bg-[#C9943A] text-[#0D1B2A] text-[10px] font-bold px-1.5 py-0.5 rounded-[10px]">
                {n.badge}
              </span>
            )}
          </button>
        ))}

        <div className="px-6 pt-5 pb-2 text-[10px] tracking-[2px] uppercase text-[#7A94AD] font-semibold mt-3">Support</div>
        {SUPPORT.map(({ icon, label }) => (
          <button key={label} className="flex items-center gap-3 w-full px-6 py-3 text-sm font-medium text-white/60 bg-transparent border-none hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <img
              src={icon}
              alt={label}
              className="w-5 h-5 shrink-0 object-contain opacity-50 brightness-0 invert"
            />
            {label}
          </button>
        ))}
      </div>

      {/* User footer */}
      <div className="px-6 pt-4 pb-6 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
          <div className="w-9 h-9 bg-gradient-to-br from-[#C9943A] to-[#E5B96A] rounded-full flex items-center justify-center font-bold text-sm text-[#0D1B2A] shrink-0">
            JP
          </div>
          <div>
            <div className="text-white text-[13px] font-semibold">Jean-Pierre H.</div>
            <div className="text-[#7A94AD] text-[11px]">RAD-CLT-00421</div>
          </div>
        </div>
      </div>
    </nav>
  );
}