import Motor from '../img/sportbike.png';
import Heart from '../img/heart.png';
import Document from '../img/document.png';
import House from '../img/home.png';
import Card from '../img/card.png';
import Documents from '../img/documents-folder.png';

const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";

const DOCUMENTS = [
  { name: "Motor Insurance Certificate", policy: "RAD-2024-M0421", date: "Jan 2025", icon: Motor,    type: "Certificate" },
  { name: "Health Policy Document",      policy: "RAD-2024-H0108", date: "Mar 2025", icon: Heart,    type: "Policy" },
  { name: "Claim Settlement Letter",     policy: "CLM-2025-0042",  date: "Feb 2025", icon: Document, type: "Claim" },
  { name: "Premium Receipt — Motor",     policy: "RAD-2024-M0421", date: "Jan 2025", icon: Card,     type: "Receipt" },
  { name: "Premium Receipt — Health",    policy: "RAD-2024-H0108", date: "Mar 2025", icon: Card,     type: "Receipt" },
  { name: "Fire Policy Document",        policy: "RAD-2023-F0055", date: "Aug 2024", icon: House,    type: "Policy" },
];

export default function DocumentsPage() {
  return (
    <div className="p-8 flex-1">
      <div className="bg-white border border-[#D8E2EC] rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F7F3ED]">
              {["Document","Type","Reference","Date","Action"].map((h) => (
                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[1px] text-[#7A94AD] px-4 py-3 border-b-2 border-[#D8E2EC]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DOCUMENTS.map((d, i) => (
              <tr key={i} className="hover:bg-[#FDF6E8] transition-colors">
                <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm">
                  <div className="flex items-center gap-2.5">
                    <img src={d.icon} alt="" className="w-6 h-6 object-contain shrink-0" />
                    <span className="font-semibold">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm"><span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF1F7] text-[#4A6380]">{d.type}</span></td>
                <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm font-mono text-[12px] text-[#7A94AD]">{d.policy}</td>
                <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm text-[#7A94AD]">{d.date}</td>
                <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm">
                  <button className={`h-9 px-3.5 text-[12px] font-semibold flex items-center gap-1.5 rounded-lg ${btnPrimary}`}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}