import { useState } from "react";
import { MY_POLICIES, CLAIMS } from "../data/constants";
import { Steps, StatusPill, SummaryCard } from "../components/ui";

import Document from '../img/document.png';
import Documents from '../img/documents-folder.png';
import Check from '../img/check.png';
import Calendar from '../img/calendar.png'

const inputCls = "h-11 px-3.5 border-[1.5px] border-[#D8E2EC] rounded-lg font-['DM_Sans'] text-sm text-[#0D1B2A] bg-white outline-none transition-all w-full focus:border-[#C9943A] focus:ring-2 focus:ring-[#C9943A]/10 placeholder:text-[#7A94AD]";
const labelCls = "text-[13px] font-semibold text-[#0D1B2A]";
const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";
const btnGhost  = "bg-transparent text-[#4A6380] border border-[#D8E2EC] rounded-lg font-semibold transition-all hover:bg-[#EBF1F7] hover:text-[#0D1B2A] cursor-pointer font-['DM_Sans']";

const CLAIM_STEPS = ["Select Policy", "Incident Details", "Documents", "Submit"];

function Ico({ src, alt = "", size = 20, className = "" }) {
  return <img src={src} alt={alt} style={{ width: size, height: size }} className={`object-contain shrink-0 ${className}`} />;
}

function ClaimSuccess({ onTrack }) {
  const ref = `CLM-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
  return (
    <div className="p-8 text-center">
      <div className="bg-white border border-[#D8E2EC] rounded-2xl max-w-[560px] mx-auto py-16 px-10">
        <div className="flex justify-center mb-5"><Ico src={Document} size={72} /></div>
        <div className="font-['Playfair_Display'] text-[28px] font-bold text-[#0D1B2A] mb-2.5">Claim Filed Successfully</div>
        <div className="text-[15px] text-[#7A94AD] leading-relaxed max-w-[400px] mx-auto mb-7">Your claim has been submitted. Our team will review it within 3 business days.</div>
        <div className="font-mono text-sm bg-[#EBF1F7] px-5 py-2.5 rounded-lg inline-block text-[#0D1B2A] mb-7">{ref}</div>
        <button onClick={onTrack} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Track My Claim</button>
      </div>
    </div>
  );
}

function NewClaimForm({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([
    { name: "accident_photo_front.jpg", size: "2.4 MB" },
    { name: "police_report.pdf", size: "1.1 MB" },
  ]);
  const activePolicies = MY_POLICIES.filter((p) => p.status === "active");

  return (
    <div className="max-w-[780px]">
      <Steps steps={CLAIM_STEPS} current={step} />

      {step === 0 && (
        <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
            <Ico src={Document} size={20} /> Which policy are you claiming on?
          </div>
          <div className="text-[13px] text-[#7A94AD] mb-6">Select the policy related to your claim.</div>
          {activePolicies.map((p) => (
            <div key={p.id} onClick={() => setStep(1)} className="border-2 border-[#D8E2EC] rounded-2xl p-5 cursor-pointer flex items-center gap-4 mb-3 hover:border-[#E5B96A] transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
                <img src={p.icon} alt={p.type} className="w-7 h-7 object-contain" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-[15px] text-[#0D1B2A] mb-1">{p.type}</div>
                <div className="text-[13px] text-[#7A94AD]">{p.id}{p.vehicle ? ` • ${p.vehicle}` : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
            <img src={Calendar} alt="" className="w-7 h-7 object-contain" /> 
            Incident Details
          </div>
          <div className="text-[13px] text-[#7A94AD] mb-6">Provide clear and accurate information about what happened.</div>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5"><label className={labelCls}>Date of Incident <span className="text-red-700">*</span></label><input type="date" className={inputCls} /></div>
            <div className="flex flex-col gap-1.5"><label className={labelCls}>Time of Incident</label><input type="time" className={inputCls} /></div>
            <div className="flex flex-col gap-1.5"><label className={labelCls}>Location <span className="text-red-700">*</span></label><input className={inputCls} placeholder="e.g. KN 3 Ave, Kigali" /></div>
            <div className="flex flex-col gap-1.5"><label className={labelCls}>Type of Incident <span className="text-red-700">*</span></label>
              <select className={inputCls}><option>Road Accident</option><option>Theft / Burglary</option><option>Fire</option><option>Natural Disaster</option><option>Medical Emergency</option><option>Other</option></select>
            </div>
          </div>
          <div className="h-px bg-[#D8E2EC] my-6" />
          <div className="flex flex-col gap-1.5 mb-4"><label className={labelCls}>Estimated Loss Amount (RWF)</label><input className={inputCls} placeholder="e.g. 500,000" /></div>
          <div className="flex flex-col gap-1.5 mb-4"><label className={labelCls}>Description of Incident <span className="text-red-700">*</span></label><textarea className={`${inputCls} h-auto py-3 resize-y`} rows={5} placeholder="Describe exactly what happened..." /></div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Were Police / Authorities Involved?</label>
            <div className="flex gap-3 mt-1.5">
              {["Yes — I have a police report", "No"].map((o) => (
                <div key={o} className="border-2 border-[#D8E2EC] rounded-2xl p-3 px-4 cursor-pointer flex-1 hover:border-[#E5B96A] hover:bg-[#FDF6E8] transition-all">
                  <div className="text-[13px] font-bold text-[#0D1B2A]">{o}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
            <Ico src={Documents} size={20} /> Supporting Documents
          </div>
          <div className="text-[13px] text-[#7A94AD] mb-6">Upload photos and documents. Accepted: JPG, PNG, PDF — max 10MB each.</div>
          <div className="border-2 border-dashed border-[#D8E2EC] rounded-2xl p-10 text-center cursor-pointer hover:border-[#C9943A] hover:bg-[#FDF6E8] transition-all">
            <div className="flex justify-center mb-3"><Ico src={Documents} size={52} /></div>
            <div className="font-bold text-[15px] text-[#0D1B2A] mb-1.5">Drag files here or click to browse</div>
            <div className="text-[13px] text-[#7A94AD]">Photos of damage, police report, receipts, medical records</div>
            <button className={`mt-3.5 px-5 py-2.5 text-[13px] font-bold rounded-lg ${btnPrimary}`}>Choose Files</button>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#EBF1F7] rounded-lg px-3.5 py-2.5">
                <Ico src={Document} size={20} />
                <span className="text-[13px] font-semibold text-[#0D1B2A] flex-1">{f.name}</span>
                <span className="text-[11px] text-[#7A94AD] font-mono">{f.size}</span>
                <button onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} className="text-red-700 text-base border-none bg-transparent cursor-pointer">✕</button>
              </div>
            ))}
          </div>
          <div className="bg-[#FFF8E1] border border-[#FFE082] text-[#E65100] rounded-lg px-4 py-3.5 flex gap-3 items-start text-[13px] leading-relaxed mt-5">
            <span>For motor claims: include photos of all damaged areas. For medical claims: attach hospital receipts and a doctor's report.</span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5">
          <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
            <Ico src={Check} size={20} /> Review & Submit
          </div>
          <div className="text-[13px] text-[#7A94AD] mb-6">Please confirm all details before submitting your claim.</div>
          <SummaryCard title="Claim Summary" rows={[["Policy","Motor Insurance — RAD-2024-M0421"],["Incident Date","15 March 2025"],["Type","Road Accident"],["Estimated Loss","RWF 320,000"],["Documents",`${files.length} files attached`]]} />
          <div className="bg-[#E3F2FD] border border-[#90CAF9] text-[#1565C0] rounded-lg px-4 py-3.5 flex gap-3 items-start text-[13px] leading-relaxed">
            <span>By submitting, you confirm that all information provided is accurate. False claims may result in policy cancellation.</span>
          </div>
        </div>
      )}

      <div className="bg-white border-t border-[#D8E2EC] px-9 py-4 flex items-center justify-between sticky bottom-0 z-40">
        <div className="text-[13px] text-[#7A94AD]">Step {step + 1} of {CLAIM_STEPS.length}</div>
        <div className="flex gap-3">
          {step > 0 && <button onClick={() => setStep((s) => s - 1)} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnGhost}`}>Back</button>}
          {step < CLAIM_STEPS.length - 1
            ? <button onClick={() => setStep((s) => s + 1)} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Continue</button>
            : <button onClick={onSuccess} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Submit Claim</button>}
        </div>
      </div>
    </div>
  );
}

function ClaimHistory() {
  return (
    <div className="bg-white border border-[#D8E2EC] rounded-2xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#F7F3ED]">
            {["Claim ID","Policy","Description","Date Filed","Amount","Status"].map((h) => (
              <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-[1px] text-[#7A94AD] px-4 py-3 border-b-2 border-[#D8E2EC]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CLAIMS.map((c) => (
            <tr key={c.id} className="hover:bg-[#FDF6E8] transition-colors">
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm"><span className="font-mono text-[12px]">{c.id}</span></td>
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm">{c.policy}</td>
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm text-[#7A94AD]">{c.desc}</td>
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm text-[#7A94AD]">{c.date}</td>
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm font-bold">{c.amount}</td>
              <td className="px-4 py-3.5 border-b border-[#D8E2EC] text-sm"><StatusPill status={c.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ClaimsPage() {
  const [tab, setTab]             = useState("new");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return <ClaimSuccess onTrack={() => { setSubmitted(false); setTab("history"); }} />;

  return (
    <div className="p-8 flex-1">
      <div className="flex gap-1.5 bg-[#EBF1F7] rounded-lg p-1 mb-6 max-w-[400px]">
        {["new","history"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 text-center px-4 py-2 rounded-md text-[13px] font-semibold cursor-pointer border-none transition-all font-['DM_Sans']
            ${tab === t ? "bg-white text-[#0D1B2A] shadow-[0_2px_8px_rgba(13,27,42,0.08)]" : "bg-transparent text-[#4A6380]"}`}>
            {t === "new" ? "File New Claim" : "Claim History"}
          </button>
        ))}
      </div>
      {tab === "new"     && <NewClaimForm onSuccess={() => setSubmitted(true)} />}
      {tab === "history" && <ClaimHistory />}
    </div>
  );
}