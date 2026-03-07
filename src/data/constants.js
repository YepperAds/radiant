// constant.js
import Dashboard from '../img/dashboard.png'
import Insurance from '../img/insurance.png'
import Shield from '../img/shield.png'
import File from '../img/file.png'
import Filing from '../img/writing.png'
import Card from '../img/whiteCard.png'
import Documents from '../img/documents-folder.png'
import User from '../img/user.png'

import Motor from '../img/sportbike.png'
import Heart from '../img/heart.png'
import House from '../img/home.png'
import Agriculture from '../img/sprout.png'
import Balance from '../img/balance.png'
import Construction from '../img/construction.png'
import Bonds from '../img/bonds.png'
import Marine from '../img/yacht.png'
import Star from '../img/star.png'

import Check from '../img/check.png'
import Bell from '../img/bell.png'
import Document from '../img/document.png'

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
export const NAV = [
  { id: "dashboard",  label: "Dashboard",     icon: Dashboard },
  { id: "products",   label: "Get Insurance", icon: Insurance, badge: "10+" },
  { id: "policies",   label: "My Policies",   icon: File },
  { id: "claims",     label: "File a Claim",  icon: Filing },
  { id: "payments",   label: "Payments",      icon: Card },
  { id: "documents",  label: "Documents",     icon: Documents },
  { id: "profile",    label: "My Profile",    icon: User },
];

// ─── INSURANCE PRODUCTS ───────────────────────────────────────────────────────
export const PRODUCTS = [
  {
    id: "motor",
    icon: Motor,
    name: "Motor Insurance",
    color: "#1E3148",
    bg: "#E3F2FD",
    desc: "Comprehensive or third-party cover for all vehicle types — cars, motorcycles, buses, trucks, and more.",
    from: "From RWF 15,000/yr",
    tags: ["Third Party", "Comprehensive", "Fleet"],
  },
  {
    id: "health",
    icon: Heart,
    name: "Health Insurance",
    color: "#1B5E20",
    bg: "#E8F5E9",
    desc: "Coverage against medical costs from illness or injury, including hospitalisation and outpatient care.",
    from: "From RWF 25,000/yr",
    tags: ["Individual", "Family", "Travel"],
  },
  {
    id: "fire",
    icon: House,
    name: "Fire & Property",
    color: "#B71C1C",
    bg: "#FFEBEE",
    desc: "Protect your home, buildings, and goods against fire, lightning, explosion, and related damage.",
    from: "From RWF 12,000/yr",
    tags: ["Houses", "Buildings", "Stocks"],
  },
  {
    id: "agriculture",
    icon: Agriculture,
    name: "Agriculture",
    color: "#33691E",
    bg: "#F1F8E9",
    desc: "Compensation for crop damage due to floods, droughts, and extreme weather events.",
    from: "From RWF 18,000/yr",
    tags: ["Floods", "Drought", "Crops"],
  },
  {
    id: "liability",
    icon: Balance,
    name: "Liability",
    color: "#4527A0",
    bg: "#EDE7F6",
    desc: "Cover for accidental damage or injury caused to third parties — school, professional, employer, and more.",
    from: "From RWF 30,000/yr",
    tags: ["Professional", "Employer", "Directors"],
  },
  {
    id: "construction",
    icon: Construction,
    name: "Construction",
    color: "#E65100",
    bg: "#FFF3E0",
    desc: "All-risk cover for construction and renovation projects — buildings, roads, bridges, and infrastructure.",
    from: "From RWF 50,000/yr",
    tags: ["Erection", "Machinery", "Infrastructure"],
  },
  {
    id: "bonds",
    icon: Bonds,
    name: "Bonds",
    color: "#1A237E",
    bg: "#E8EAF6",
    desc: "Bid bonds, performance bonds, advance payment bonds, customs bonds, and financial guarantees.",
    from: "From RWF 20,000",
    tags: ["Bid Bond", "Performance", "Customs"],
  },
  {
    id: "marine",
    icon: Marine,
    name: "Marine & Transport",
    color: "#006064",
    bg: "#E0F7FA",
    desc: "Freight and cargo insurance for sea, land, and air transport — goods in transit and boat cover.",
    from: "From RWF 22,000/yr",
    tags: ["Sea", "Land", "Air"],
  },
  {
    id: "gakegake",
    icon: Star,
    name: "Gake Gake",
    color: "#880E4F",
    bg: "#FCE4EC",
    desc: "Rwanda's most accessible micro-insurance product — affordable, simple, and easy for everyone.",
    from: "From RWF 5,000/yr",
    tags: ["Micro-Insurance", "Affordable", "Simple"],
  },
];

// ─── USER POLICIES ────────────────────────────────────────────────────────────
export const MY_POLICIES = [
  {
    id: "RAD-2024-M0421",
    type: "Motor Insurance",
    vehicle: "RAB 234A",
    status: "active",
    premium: "RWF 85,000/yr",
    start: "Jan 2025",
    end: "Jan 2026",
    progress: 60,
    icon: Motor,
    bg: "#E3F2FD",
  },
  {
    id: "RAD-2024-H0108",
    type: "Health Insurance",
    plan: "Family Plus",
    status: "active",
    premium: "RWF 240,000/yr",
    start: "Mar 2025",
    end: "Mar 2026",
    progress: 30,
    icon: Heart,
    bg: "#E8F5E9",
  },
  {
    id: "RAD-2023-F0055",
    type: "Fire & Property",
    property: "KG 14 Ave",
    status: "pending",
    premium: "RWF 48,000/yr",
    start: "Aug 2025",
    end: "Aug 2026",
    progress: 0,
    icon: House,
    bg: "#FFEBEE",
  },
];

// ─── CLAIMS ───────────────────────────────────────────────────────────────────
export const CLAIMS = [
  {
    id: "CLM-2025-0042",
    policy: "Motor – RAB 234A",
    date: "15 Feb 2025",
    amount: "RWF 320,000",
    status: "approved",
    desc: "Collision damage repair",
  },
  {
    id: "CLM-2024-0198",
    policy: "Health – Family Plus",
    date: "03 Nov 2024",
    amount: "RWF 85,000",
    status: "paid",
    desc: "Hospitalisation claim",
  },
  {
    id: "CLM-2025-0061",
    policy: "Motor – RAB 234A",
    date: "28 Feb 2025",
    amount: "RWF 150,000",
    status: "processing",
    desc: "Windscreen replacement",
  },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────
export const ACTIVITIES = [
  { icon: Check, color: "#E8F5E9", text: "Health premium payment received",    sub: "RWF 240,000 — Family Plus",                 time: "2h ago" },
  { icon: Bell, color: "#FFF8E1", text: "Motor policy renewal due in 30 days", sub: "RAD-2024-M0421 • RAB 234A",                 time: "1d ago" },
  { icon: Document, color: "#E3F2FD", text: "Claim CLM-2025-0042 approved",        sub: "RWF 320,000 disbursement initiated",        time: "3d ago" },
  { icon: Shield,  color: "#EDE7F6", text: "Fire & Property policy activated",   sub: "RAD-2023-F0055 • KG 14 Ave",               time: "1w ago" },
];

// ─── COVERAGE TIERS ───────────────────────────────────────────────────────────
export const COVERAGE_TIERS = [
  {
    id: "basic",
    name: "Basic Cover",
    price: "RWF 15,000/yr",
    desc: "Essential third-party protection for legal compliance",
    features: ["Third-party liability", "Legal minimum cover"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "RWF 38,000/yr",
    desc: "Balanced protection for everyday drivers",
    features: ["Third-party + Fire & Theft", "Windscreen cover", "Emergency roadside"],
  },
  {
    id: "comprehensive",
    name: "Comprehensive",
    price: "RWF 85,000/yr",
    desc: "Full protection for complete peace of mind",
    features: ["Own damage cover", "Third-party", "Fire & Theft", "Courtesy car", "Free towing"],
  },
];

// ─── PAGE METADATA ────────────────────────────────────────────────────────────
export const PAGE_META = {
  dashboard: { title: "Dashboard",        sub: "Welcome back, Jean-Pierre" },
  products:  { title: "Get Insurance",    sub: "Choose from 9 comprehensive coverage options" },
  apply:     { title: "Apply for Coverage", sub: "Complete your application in minutes" },
  policies:  { title: "My Policies",      sub: "Manage and track all your active coverage" },
  claims:    { title: "Claims Centre",    sub: "File and track insurance claims" },
  payments:  { title: "Payments",         sub: "Manage premiums and payment history" },
  documents: { title: "Documents",        sub: "Download certificates, policies, and receipts" },
  profile:   { title: "My Profile",       sub: "Manage your account and preferences" },
};