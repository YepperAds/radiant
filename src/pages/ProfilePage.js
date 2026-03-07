import User from '../img/user.png';
import Bell from '../img/bell.png';
import Locker from '../img/lock.png'
import Phone from '../img/whitePhone.png';
import Mail from '../img/mail.png'
import Location from '../img/location.png';

const inputCls = "h-11 px-3.5 border-[1.5px] border-[#D8E2EC] rounded-lg font-['DM_Sans'] text-sm text-[#0D1B2A] bg-white outline-none transition-all w-full focus:border-[#C9943A] focus:ring-2 focus:ring-[#C9943A]/10 placeholder:text-[#7A94AD]";
const labelCls = "text-[13px] font-semibold text-[#0D1B2A]";
const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";

const NOTIFICATIONS = ["Policy renewal reminders","Claim status updates","Payment confirmations","Promotional offers"];

export default function ProfilePage() {
  return (
    <div className="p-8 flex-1">
      {/* Header */}
      <div className="bg-black rounded-3xl p-8 px-9 flex items-center gap-6 mb-6 relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9943A] to-[#E5B96A] flex items-center justify-center font-['Playfair_Display'] text-[32px] font-bold text-[#0D1B2A] shrink-0 shadow-[0_0_0_4px_rgba(201,148,58,0.3)]">JP</div>
        <div>
          <div className="font-['Playfair_Display'] text-[26px] font-bold text-white">Jean-Pierre Habimana</div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="bg-black rounded-3xl p-5 px-7 flex items-center gap-0 mb-6">
        {[
          [Phone,    "+250 788 381 093", "Primary Phone" ],
          [Mail,     "jean@example.com", "Email Address" ],
          [Location, "KG 14 Ave, Kigali","Address"       ],
        ].map(([icon, text, sub], i) => (
          <div key={sub} className={`flex items-center gap-3.5 flex-1 ${i !== 0 ? "border-l border-white/[0.08] pl-7 ml-7" : ""}`}>
            <div className="w-9 h-9 rounded-xl bg-white/[0.07] flex items-center justify-center shrink-0">
              <img src={icon} alt={sub} className="w-[18px] h-[18px] object-contain opacity-80" />
            </div>
            <div>
              <div className="text-white text-[13px] font-semibold leading-snug">{text}</div>
              <div className="text-white/40 text-[11px] mt-0.5 tracking-wide uppercase">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Personal details */}
        <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-6 flex items-center gap-2.5">
            <img src={User} alt="" className="w-5 h-5 object-contain" /> Personal Details
          </div>
          <div className="grid grid-cols-2 gap-5 mb-5">
            {[["First Name","Jean-Pierre"],["Last Name","Habimana"],["National ID","1 2000 8 0000000 0 00"]].map(([lbl,val]) => (
              <div key={lbl} className="flex flex-col gap-1.5"><label className={labelCls}>{lbl}</label><input className={inputCls} defaultValue={val} /></div>
            ))}
            <div className="flex flex-col gap-1.5"><label className={labelCls}>Date of Birth</label><input type="date" className={inputCls} defaultValue="1988-05-14" /></div>
          </div>
          <div className="h-px bg-[#D8E2EC] my-6" />
          <div className="flex flex-col gap-1.5 mb-4"><label className={labelCls}>Phone</label><input className={inputCls} defaultValue="+250 788 000 000" /></div>
          <div className="flex flex-col gap-1.5 mb-5"><label className={labelCls}>Email</label><input type="email" className={inputCls} defaultValue="jean@example.com" /></div>
          <button className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Save Changes</button>
        </div>

        <div>
          {/* Security */}
          <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-4">
            <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-6 flex items-center gap-2.5">
              <img src={Locker} alt="" className="w-5 h-5 object-contain" /> Security
            </div>
            <div className="flex flex-col gap-1.5 mb-3.5"><label className={labelCls}>Current Password</label><input type="password" className={inputCls} placeholder="••••••••" /></div>
            <div className="flex flex-col gap-1.5 mb-5"><label className={labelCls}>New Password</label><input type="password" className={inputCls} placeholder="••••••••" /></div>
            <button className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Update Password</button>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9">
            <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-6 flex items-center gap-2.5">
              <img src={Bell} alt="" className="w-5 h-5 object-contain" /> Notifications
            </div>
            {NOTIFICATIONS.map((n) => (
              <div key={n} className="flex justify-between items-center py-2.5 border-b border-[#D8E2EC] last:border-none">
                <span className="text-sm text-[#0D1B2A]">{n}</span>
                <div className="w-11 h-6 bg-[#C9943A] rounded-full cursor-pointer relative">
                  <div className="w-[18px] h-[18px] bg-white rounded-full absolute right-[3px] top-[3px] shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}