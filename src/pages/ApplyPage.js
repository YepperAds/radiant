import { useState } from "react";
import { PRODUCTS, COVERAGE_TIERS } from "../data/constants";
import { Steps, SummaryCard } from "../components/ui";

import Motor from '../img/sportbike.png';
import Insurance from '../img/insurance.png';
import User from '../img/user.png';
import Card from '../img/card.png';
import Document from '../img/file.png';
import Celebrate from '../img/confetti.png'

const APPLY_STEPS = ["Personal Info", "Coverage", "Details", "Review & Pay"];

const inputCls = "h-11 px-3.5 border-[1.5px] border-[#D8E2EC] rounded-lg font-['DM_Sans'] text-sm text-[#0D1B2A] bg-white outline-none transition-all w-full focus:border-[#C9943A] focus:ring-2 focus:ring-[#C9943A]/10 placeholder:text-[#7A94AD]";
const labelCls = "text-[13px] font-semibold text-[#0D1B2A]";
const btnPrimary = "bg-gradient-to-br from-[#C9943A] to-[#E5B96A] text-[#0D1B2A] font-bold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(201,148,58,0.35)] shadow-[0_8px_32px_rgba(201,148,58,0.25)] cursor-pointer border-none font-['DM_Sans']";
const btnGhost  = "bg-transparent text-[#4A6380] border border-[#D8E2EC] rounded-lg font-semibold transition-all hover:bg-[#EBF1F7] hover:text-[#0D1B2A] cursor-pointer font-['DM_Sans']";

function Ico({ src, alt = "", size = 20, className = "" }) {
  return <img src={src} alt={alt} style={{ width: size, height: size }} className={`object-contain shrink-0 ${className}`} />;
}

function StepPersonal({ onChange }) {
  return (
    <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5 shadow-[0_2px_8px_rgba(13,27,42,0.08)]">
      <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
        <Ico src={User} size={20} /> Personal Information
      </div>
      <div className="text-[13px] text-[#7A94AD] mb-6">Tell us about yourself so we can tailor the right coverage for you.</div>
      <div className="grid grid-cols-2 gap-5">
        {[["First Name","Jean-Pierre","firstName"],["Last Name","Habimana","lastName"],["National ID / Passport","1 2000 8 0000000 0 00","nid"],null,["Phone Number","+250 788 000 000","phone"],["Email Address","you@example.com","email"]].map((f, i) => {
          if (!f) return (
            <div key={i} className="flex flex-col gap-1.5">
              <label className={labelCls}>Date of Birth <span className="text-red-700 ml-0.5">*</span></label>
              <input type="date" className={inputCls} onChange={(e) => onChange("dob", e.target.value)} />
            </div>
          );
          return (
            <div key={i} className="flex flex-col gap-1.5">
              <label className={labelCls}>{f[0]} <span className="text-red-700 ml-0.5">*</span></label>
              <input className={inputCls} placeholder={f[1]} onChange={(e) => onChange(f[2], e.target.value)} />
            </div>
          );
        })}
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className={labelCls}>Physical Address</label>
          <input className={inputCls} placeholder="KG 14 Ave, Kigali" onChange={(e) => onChange("address", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

function StepCoverage({ selectedTier, onSelect }) {
  return (
    <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5 shadow-[0_2px_8px_rgba(13,27,42,0.08)]">
      <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
        <Ico src={Insurance} size={20} /> Choose Your Coverage
      </div>
      <div className="text-[13px] text-[#7A94AD] mb-6">Select the level of protection that fits your needs and budget.</div>
      {COVERAGE_TIERS.map((t) => (
        <div key={t.id} onClick={() => onSelect(t.id)}
          className={`border-2 rounded-2xl p-5 cursor-pointer flex items-start gap-4 mb-3 transition-all
            ${selectedTier === t.id ? "border-[#C9943A] bg-[#FDF6E8]" : "border-[#D8E2EC] hover:border-[#E5B96A]"}`}>
          <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${selectedTier === t.id ? "border-[#C9943A] bg-[#C9943A]" : "border-[#D8E2EC]"}`}>
            {selectedTier === t.id && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div className="flex-1">
            <div className="font-bold text-[15px] text-[#0D1B2A] mb-1">{t.name}</div>
            <div className="text-[13px] text-[#7A94AD] leading-relaxed">{t.desc}</div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {t.features.map((f) => <span key={f} className="text-[11px] px-2 py-0.5 rounded-full bg-[#EBF1F7] text-[#4A6380]">{f}</span>)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-['Playfair_Display'] text-[22px] font-bold text-[#C9943A]">{t.price.split("/")[0]}</div>
            <div className="text-[11px] text-[#7A94AD]">/{t.price.split("/")[1]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepDetails({ productId }) {
  const isMotor = !productId || productId === "motor";
  return (
    <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5 shadow-[0_2px_8px_rgba(13,27,42,0.08)]">
      <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
        <Ico src={Motor} size={20} /> Policy Details
      </div>
      <div className="text-[13px] text-[#7A94AD] mb-6">Provide the details of what you're insuring.</div>
      {isMotor ? (
        <>
          <div className="grid grid-cols-2 gap-5">
            {[["Vehicle Registration","RAB 234 A"],["Vehicle Make & Model","Toyota Corolla 2019"],["Engine Capacity (cc)","1600"],["Year of Manufacture","2019"],["Chassis Number","JTDZN3EU0E3307264"]].map(([lbl, ph], i) =>
              i === 4 ? null : (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className={labelCls}>{lbl}</label>
                  <input className={inputCls} placeholder={ph} />
                </div>
              )
            )}
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Vehicle Use</label>
              <select className={`${inputCls}`}><option>Private / Personal</option><option>Commercial / Taxi</option><option>Corporate / Fleet</option><option>Goods Transport</option></select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Chassis Number</label>
              <input className={inputCls} placeholder="JTDZN3EU0E3307264" />
            </div>
          </div>
          <div className="h-px bg-[#D8E2EC] my-6" />
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Additional Notes</label>
            <textarea className={`${inputCls} h-auto py-3 resize-y`} rows={3} placeholder="Any additional information..." />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5"><label className={labelCls}>Subject of Insurance</label><input className={inputCls} placeholder="Describe what you're insuring" /></div>
          <div className="flex flex-col gap-1.5"><label className={labelCls}>Estimated Value (RWF)</label><input className={inputCls} placeholder="e.g. 10,000,000" /></div>
          <div className="flex flex-col gap-1.5"><label className={labelCls}>Coverage Start Date</label><input type="date" className={inputCls} /></div>
          <div className="flex flex-col gap-1.5"><label className={labelCls}>Coverage Period</label><select className={inputCls}><option>1 Year</option><option>6 Months</option><option>3 Months</option></select></div>
        </div>
      )}
    </div>
  );
}

function StepReview({ product, formData, coverageTier }) {
  const tier = COVERAGE_TIERS.find((t) => t.id === coverageTier);
  const rows = [
    ["Product", product.name],
    ["Coverage Tier", tier?.name || "Standard"],
    ["Applicant", `${formData.firstName || "Jean-Pierre"} ${formData.lastName || "Habimana"}`],
    ["Phone", formData.phone || "+250 788 000 000"],
    ["Email", formData.email || "jean@example.com"],
  ];
  return (
    <div>
      <SummaryCard title={<span className="flex items-center gap-2"><Ico src={Document} size={18} /> Application Summary</span>} rows={rows} totalLabel="Annual Premium" totalAmount={tier?.price || "RWF 38,000"} />
      <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 mb-5">
        <div className="font-['Playfair_Display'] text-lg font-bold text-[#0D1B2A] mb-1.5 flex items-center gap-2.5">
          <Ico src={Card} size={20} /> Payment Method
        </div>
        <div className="text-[13px] text-[#7A94AD] mb-6">Choose how you'd like to pay your premium.</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            [Card, "MTN MoMo",      "Instant"],
            [Card, "Airtel Money",  "Instant"],
            [Card, "Bank Transfer", "1-2 days"],
          ].map(([icon, name, sub]) => (
            <div key={name} className="border-2 border-[#D8E2EC] rounded-2xl p-4 cursor-pointer text-center hover:border-[#E5B96A] hover:bg-[#FDF6E8] transition-all">
              <div className="flex justify-center mb-2"><Ico src={icon} size={32} /></div>
              <div className="text-[13px] font-bold text-[#0D1B2A] mb-1">{name}</div>
              <div className="text-[12px] text-[#7A94AD]">{sub}</div>
            </div>
          ))}
        </div>
        <div className="h-px bg-[#D8E2EC] my-6" />
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>MoMo / Account Number</label>
          <input className={inputCls} placeholder="0788 000 000" />
        </div>
      </div>
    </div>
  );
}

function ApplySuccess({ productName, onViewPolicies, onGetAnother }) {
  const ref = `RAD-2025-${Math.floor(Math.random() * 9000 + 1000)}`;
  return (
    <div className="p-8">
      <div className="bg-white border border-[#D8E2EC] rounded-2xl p-9 max-w-xl mx-auto text-center py-16 px-10">
        <div className="flex align-center justify-center mb-5">
          <img src={Celebrate} alt="" className="w-14 h-14 object-contain" />
        </div>
        <div className="font-['Playfair_Display'] text-[28px] font-bold text-[#0D1B2A] mb-2.5">Application Submitted!</div>
        <div className="text-[15px] text-[#7A94AD] leading-relaxed max-w-[400px] mx-auto mb-7">Your {productName} application has been received and is being processed. You'll receive your policy document within 24 hours.</div>
        <div className="font-mono text-sm bg-[#EBF1F7] px-5 py-2.5 rounded-lg inline-block text-[#0D1B2A] mb-7">{ref}</div>
        <div className="flex gap-3 justify-center">
          <button onClick={onViewPolicies} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnGhost}`}>View Policies</button>
          <button onClick={onGetAnother}  className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Get Another Policy</button>
        </div>
      </div>
    </div>
  );
}

export default function ApplyPage({ product, setPage }) {
  const [step, setStep]             = useState(0);
  const [formData, setFormData]     = useState({});
  const [coverageTier, setCoverage] = useState(null);
  const [submitted, setSubmitted]   = useState(false);

  const p = product || PRODUCTS[0];
  const update = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  if (submitted) return <ApplySuccess productName={p.name} onViewPolicies={() => setPage("policies")} onGetAnother={() => { setStep(0); setSubmitted(false); setPage("products"); }} />;

  return (
    <div className="p-8 flex-1">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
          <img src={p.icon} alt={p.name} className="w-6 h-6 object-contain" />
        </div>
        <div>
          <div className="font-['Playfair_Display'] text-xl font-bold text-[#0D1B2A]">{p.name}</div>
          <div className="text-[13px] text-[#7A94AD]">Complete the form below to get covered</div>
        </div>
        <button onClick={() => setPage("products")} className={`ml-auto h-9 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 ${btnGhost}`}>Back to Products</button>
      </div>

      <div className="max-w-[860px]">
        <Steps steps={APPLY_STEPS} current={step} />
        {step === 0 && <StepPersonal onChange={update} />}
        {step === 1 && <StepCoverage selectedTier={coverageTier} onSelect={setCoverage} />}
        {step === 2 && <StepDetails productId={p.id} />}
        {step === 3 && <StepReview product={p} formData={formData} coverageTier={coverageTier} />}
      </div>

      <div className="bg-white border-t border-[#D8E2EC] px-9 py-4 flex items-end justify-end sticky bottom-0 z-40">
        {/* <div className="text-[13px] text-[#7A94AD]">Step {step + 1} of {APPLY_STEPS.length} — {APPLY_STEPS[step]}</div> */}
        <div className="flex gap-3">
          {step > 0 && <button onClick={() => setStep((s) => s - 1)} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnGhost}`}>Back</button>}
          {step < APPLY_STEPS.length - 1
            ? <button onClick={() => setStep((s) => s + 1)} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Continue</button>
            : <button onClick={() => setSubmitted(true)} className={`px-7 py-3 text-sm font-bold rounded-lg ${btnPrimary}`}>Submit & Pay</button>}
        </div>
      </div>
    </div>
  );
}