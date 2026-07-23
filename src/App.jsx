import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid, AreaChart, Area,
} from "recharts";
import {
  Copy, Share2, Trophy, Flame, Zap, Users, Award, Bell, Sun, Moon, Search,
  LayoutDashboard, ListChecks, Megaphone, Gift, FileBadge2, UserPlus, Medal,
  User, Settings, LifeBuoy, LogOut, TrendingUp, TrendingDown, Minus, Instagram,
  Linkedin, Youtube, Twitter, Facebook, CheckCircle2, Clock, XCircle, Lock,
  Download, ChevronRight, Star, Crown, Sparkles, ShieldCheck, MapPin, GraduationCap,
  Rocket, Target, Calendar, ChevronDown, Menu, X, PlayCircle,
} from "lucide-react";

/* ---------------------------------- TOKENS ---------------------------------- */
const BRAND = {
  primary: "#5B3DF5",
  primaryLight: "#8B7CFA",
  blue: "#3B82F6",
  gold: "#F5B301",
  green: "#1FBF6C",
  orange: "#FB923C",
  red: "#F04848",
};

const THEME = {
  dark: {
    bg: "radial-gradient(circle at 15% 0%, #17123A 0%, #0A0812 45%, #060509 100%)",
    panel: "rgba(255,255,255,0.045)",
    panelBorder: "1px solid rgba(255,255,255,0.09)",
    panelSolid: "#12101C",
    text: "#F4F2FF",
    sub: "#9A93B8",
    faint: "#burnt",
    track: "rgba(255,255,255,0.08)",
    chartGrid: "rgba(255,255,255,0.06)",
  },
  light: {
    bg: "radial-gradient(circle at 15% 0%, #F1EEFF 0%, #F8F7FC 45%, #FFFFFF 100%)",
    panel: "rgba(255,255,255,0.75)",
    panelBorder: "1px solid rgba(91,61,245,0.12)",
    panelSolid: "#FFFFFF",
    text: "#1B1730",
    sub: "#655F80",
    track: "rgba(91,61,245,0.08)",
    chartGrid: "rgba(27,23,48,0.06)",
  },
};

/* ---------------------------------- DATA ---------------------------------- */
const USER = {
  name: "Ananya Sharma",
  college: "Delhi Technological University",
  caId: "CA-2024-08471",
  level: 7,
  rankGlobal: 142,
  xp: 2450,
  badge: "Silver Influencer",
  streak: 18,
  referral: "ANANYA24",
};

const TIERS = [
  { name: "Bronze", min: 0, color: "#B4753F" },
  { name: "Silver", min: 500, color: "#9AA3B2" },
  { name: "Gold", min: 3000, color: BRAND.gold },
  { name: "Platinum", min: 6000, color: BRAND.primary },
  { name: "Diamond", min: 10000, color: "#38BDF8" },
];

function tierInfo(xp) {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) if (xp >= TIERS[i].min) idx = i;
  const current = TIERS[idx];
  const next = TIERS[idx + 1];
  const span = next ? next.min - current.min : 1;
  const into = next ? xp - current.min : span;
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return { current, next, pct, remaining: next ? next.min - xp : 0 };
}

const DAILY_MISSIONS = [
  { id: 1, title: "Refer 3 friends", icon: UserPlus, points: 150, done: 2, total: 3 },
  { id: 2, title: "Post LinkedIn content", icon: Linkedin, points: 100, done: 0, total: 1 },
  { id: 3, title: "Upload Instagram story", icon: Instagram, points: 50, done: 1, total: 1 },
  { id: 4, title: "Share WhatsApp status", icon: Share2, points: 30, done: 1, total: 1 },
  { id: 5, title: "Upload YouTube video", icon: Youtube, points: 200, done: 0, total: 1 },
  { id: 6, title: "Attend webinar", icon: PlayCircle, points: 80, done: 0, total: 1 },
];

const ACTIVITY_FEED = [
  { day: "Today", items: [
    { title: "Referral verified — Kabir Mehta", points: 50, status: "Verified", time: "2:14 PM" },
    { title: "Instagram story proof uploaded", points: 50, status: "Pending", time: "11:02 AM" },
    { title: "Daily login streak bonus", points: 10, status: "Verified", time: "9:00 AM" },
  ]},
  { day: "Yesterday", items: [
    { title: "LinkedIn post proof rejected — blurry image", points: 0, status: "Rejected", time: "6:45 PM" },
    { title: "Referral registered — Priya Nair", points: 20, status: "Verified", time: "3:30 PM" },
  ]},
  { day: "Last week", items: [
    { title: "Webinar attendance confirmed", points: 80, status: "Verified", time: "Mon, 5:00 PM" },
    { title: "Referral verified — Rohit Sen", points: 50, status: "Verified", time: "Mon, 1:12 PM" },
    { title: "WhatsApp status proof uploaded", points: 30, status: "Verified", time: "Sun, 8:20 PM" },
  ]},
];

const CAMPAIGNS = [
  { platform: "Instagram", icon: Instagram, color: "#E1306C", instructions: "Post a reel using #UnstopCA and tag @unstop", points: 120, deadline: "26 Jul", status: "In progress" },
  { platform: "LinkedIn", icon: Linkedin, color: "#0A66C2", instructions: "Share your ambassador journey with 3 hashtags", points: 100, deadline: "28 Jul", status: "Not started" },
  { platform: "YouTube", icon: Youtube, color: "#FF0000", instructions: "Upload a 60s campus hiring-drive recap", points: 200, deadline: "31 Jul", status: "Not started" },
  { platform: "Twitter", icon: Twitter, color: "#1D9BF0", instructions: "Tweet your referral link with a personal note", points: 60, deadline: "25 Jul", status: "Submitted" },
  { platform: "Facebook", icon: Facebook, color: "#1877F2", instructions: "Share the hiring drive poster on your timeline", points: 60, deadline: "29 Jul", status: "Not started" },
];

const COLLEGE_DATA = [
  { name: "DTU", val: 142 }, { name: "NSUT", val: 118 }, { name: "IIT-D", val: 96 },
  { name: "IP Uni", val: 84 }, { name: "Amity", val: 71 }, { name: "JMI", val: 58 },
];

const STATE_DATA = [
  { name: "Delhi", value: 34 }, { name: "UP", value: 22 }, { name: "Maharashtra", value: 18 },
  { name: "Karnataka", value: 14 }, { name: "Others", value: 12 },
];
const PIE_COLORS = [BRAND.primary, BRAND.blue, BRAND.gold, BRAND.green, "#94A3B8"];

const WEEKLY_TREND = [
  { week: "W1", refs: 18 }, { week: "W2", refs: 26 }, { week: "W3", refs: 21 },
  { week: "W4", refs: 34 }, { week: "W5", refs: 29 }, { week: "W6", refs: 41 }, { week: "W7", refs: 38 },
];

const XP_TREND = [
  { d: "Mon", xp: 120 }, { d: "Tue", xp: 90 }, { d: "Wed", xp: 210 }, { d: "Thu", xp: 60 },
  { d: "Fri", xp: 260 }, { d: "Sat", xp: 340 }, { d: "Sun", xp: 180 },
];

const BADGES = [
  { name: "First Referral", icon: UserPlus, unlocked: true },
  { name: "100 Referrals", icon: Users, unlocked: true },
  { name: "500 Referrals", icon: Trophy, unlocked: false },
  { name: "Campus Leader", icon: Crown, unlocked: true },
  { name: "Social Influencer", icon: Sparkles, unlocked: true },
  { name: "Event Organizer", icon: Calendar, unlocked: false },
  { name: "Content Creator", icon: PlayCircle, unlocked: true },
  { name: "Top Performer", icon: Star, unlocked: false },
  { name: "Hackathon Champion", icon: Rocket, unlocked: false },
  { name: "Community Builder", icon: ShieldCheck, unlocked: false },
];

const LEADERBOARD = {
  Global: [
    { rank: 1, name: "Ishaan Kapoor", college: "IIT Bombay", pts: 8420, trend: "up" },
    { rank: 2, name: "Meera Iyer", college: "BITS Pilani", pts: 7980, trend: "same" },
    { rank: 3, name: "Arjun Rao", college: "NIT Trichy", pts: 7510, trend: "up" },
    { rank: 4, name: "Sana Sheikh", college: "VIT Vellore", pts: 6890, trend: "down" },
    { rank: 142, name: "Ananya Sharma", college: "DTU", pts: 2450, trend: "up", isMe: true },
  ],
  College: [
    { rank: 1, name: "Rahul Vig", college: "DTU", pts: 3980, trend: "up" },
    { rank: 2, name: "Ananya Sharma", college: "DTU", pts: 2450, trend: "up", isMe: true },
    { rank: 3, name: "Simran Kaur", college: "DTU", pts: 2100, trend: "down" },
    { rank: 4, name: "Yash Malhotra", college: "DTU", pts: 1870, trend: "same" },
  ],
  City: [
    { rank: 1, name: "Dev Chauhan", college: "IIT Delhi", pts: 5210, trend: "up" },
    { rank: 2, name: "Ananya Sharma", college: "DTU", pts: 2450, trend: "same", isMe: true },
    { rank: 3, name: "Naina Kapoor", college: "NSUT", pts: 2210, trend: "up" },
  ],
  State: [
    { rank: 1, name: "Karan Bedi", college: "NSUT", pts: 6120, trend: "up" },
    { rank: 2, name: "Priyansh Jain", college: "IP Uni", pts: 4990, trend: "down" },
    { rank: 8, name: "Ananya Sharma", college: "DTU", pts: 2450, trend: "up", isMe: true },
  ],
  Friends: [
    { rank: 1, name: "Kabir Mehta", college: "DTU", pts: 2980, trend: "up" },
    { rank: 2, name: "Ananya Sharma", college: "DTU", pts: 2450, trend: "up", isMe: true },
    { rank: 3, name: "Priya Nair", college: "Amity", pts: 1760, trend: "down" },
  ],
};

const REWARDS = [
  { name: "Amazon Voucher ₹500", points: 1000, icon: Gift, available: true },
  { name: "Swiggy Voucher ₹300", points: 700, icon: Gift, available: true },
  { name: "Unstop T-Shirt", points: 1500, icon: Award, available: true },
  { name: "Unstop Hoodie", points: 2800, icon: Award, available: true },
  { name: "Merit Certificate", points: 500, icon: FileBadge2, available: true },
  { name: "LinkedIn Recommendation", points: 3200, icon: Linkedin, available: false },
  { name: "Exclusive Internship", points: 6000, icon: Rocket, available: false },
  { name: "Meet the Founders", points: 8000, icon: Crown, available: false },
  { name: "Laptop Lucky Draw Entry", points: 4000, icon: Star, available: true },
];

const CERTIFICATES = [
  { name: "Campus Ambassador — Season 6", date: "12 Jun 2026", verified: true },
  { name: "Top Referrer — DTU Chapter", date: "02 May 2026", verified: true },
  { name: "Social Campaign Champion", date: "18 Mar 2026", verified: false },
];

const NOTIFICATIONS = [
  { type: "campaign", text: "New campaign: Instagram Reel Blast is live", time: "10m ago" },
  { type: "points", text: "+50 XP added for verified referral", time: "1h ago" },
  { type: "reward", text: "Swiggy Voucher redeemed successfully", time: "3h ago" },
  { type: "referral", text: "Referral for Kabir Mehta approved", time: "5h ago" },
  { type: "leaderboard", text: "You climbed 6 ranks on the College leaderboard", time: "1d ago" },
];

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, target: "section-dashboard" },
  { label: "My Tasks", icon: ListChecks, target: "section-tasks" },
  { label: "Campaigns", icon: Megaphone, target: "section-campaigns" },
  { label: "Leaderboard", icon: Trophy, target: "section-leaderboard" },
  { label: "Rewards", icon: Gift, target: "section-rewards" },
  { label: "Certificates", icon: FileBadge2, target: "section-certificates" },
  { label: "Referrals", icon: UserPlus, target: "section-referrals" },
  { label: "Achievements", icon: Medal, target: "section-achievements" },
  { label: "Profile", icon: User, target: null },
  { label: "Settings", icon: Settings, target: null },
  { label: "Support", icon: LifeBuoy, target: null },
];

function genHeatmap() {
  const weeks = 26;
  const grid = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const r = Math.random();
      col.push(r > 0.82 ? 3 : r > 0.6 ? 2 : r > 0.35 ? 1 : 0);
    }
    grid.push(col);
  }
  return grid;
}

/* ---------------------------------- ATOMS ---------------------------------- */
function SectionHeader({ eyebrow, title, action, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
      <div>
        {eyebrow && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: BRAND.primaryLight, marginBottom: 6 }}>
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>{title}</h2>
        {sub && <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Verified: { c: BRAND.green, bg: "rgba(31,191,108,0.14)", Icon: CheckCircle2 },
    Pending: { c: BRAND.gold, bg: "rgba(245,179,1,0.14)", Icon: Clock },
    Rejected: { c: BRAND.red, bg: "rgba(240,72,72,0.14)", Icon: XCircle },
    Submitted: { c: BRAND.blue, bg: "rgba(59,130,246,0.14)", Icon: CheckCircle2 },
    "In progress": { c: BRAND.gold, bg: "rgba(245,179,1,0.14)", Icon: Clock },
    "Not started": { c: "#9A93B8", bg: "rgba(154,147,184,0.14)", Icon: Minus },
  };
  const s = map[status] || map["Not started"];
  const I = s.Icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 700, color: s.c, background: s.bg, padding: "4px 10px", borderRadius: 999 }}>
      <I size={12} strokeWidth={2.5} /> {status}
    </span>
  );
}

function TrendIcon({ trend }) {
  if (trend === "up") return <TrendingUp size={15} color={BRAND.green} />;
  if (trend === "down") return <TrendingDown size={15} color={BRAND.red} />;
  return <Minus size={15} color="#9A93B8" />;
}

/* ---------------------------------- MAIN APP ---------------------------------- */
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [tab, setTab] = useState("Global");
  const [copied, setCopied] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const goToSection = (item) => {
    setActiveNav(item.label);
    if (item.target) {
      const el = document.getElementById(item.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const T = THEME[theme];
  const dark = theme === "dark";
  const heat = useMemo(genHeatmap, []);
  const tier = tierInfo(USER.xp);

  const cardStyle = {
    background: T.panel,
    border: T.panelBorder,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  const heatColor = (v) => {
    if (v === 0) return dark ? "rgba(255,255,255,0.06)" : "rgba(91,61,245,0.07)";
    if (v === 1) return "rgba(91,61,245,0.35)";
    if (v === 2) return "rgba(91,61,245,0.65)";
    return BRAND.primary;
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter', sans-serif", transition: "background 0.3s, color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(91,61,245,0.4); border-radius: 8px; }
        .hoverlift { transition: transform 0.22s ease, box-shadow 0.22s ease; }
        .hoverlift:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -12px rgba(91,61,245,0.35); }
        .btn-primary { background: linear-gradient(135deg, ${BRAND.primary}, #8A5CF6); color: white; border: none; cursor: pointer; transition: filter .2s, transform .2s; }
        .btn-primary:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .btn-ghost { background: transparent; cursor: pointer; transition: background .2s; }
        .navrow:hover { background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(91,61,245,0.07)"}; }
        .missionrow:hover { background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(91,61,245,0.03)"}; }
        @keyframes pulseGlow { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
        .streakflame { animation: pulseGlow 1.8s ease-in-out infinite; }
        @media (max-width: 900px) { .sidebar-desktop { display: none !important; } .content-wrap { margin-left: 0 !important; } }
        @media (min-width: 901px) { .mobile-topbar-menu { display: none !important; } }
      `}</style>

      <div style={{ display: "flex" }}>
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="sidebar-desktop" style={{
          width: 226, position: "fixed", top: 0, bottom: 0, left: 0, padding: "26px 14px",
          borderRight: T.panelBorder, background: dark ? "rgba(10,8,18,0.7)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", zIndex: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px 24px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#fff" }}>U</div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16 }}>Unstop <span style={{ color: BRAND.primaryLight, fontWeight: 800 }}>CA</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.label;
              return (
                <div key={item.label} className="navrow" onClick={() => goToSection(item)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, cursor: "pointer",
                  background: isActive ? (dark ? "rgba(91,61,245,0.22)" : "rgba(91,61,245,0.1)") : "transparent",
                  color: isActive ? BRAND.primaryLight : T.text, fontWeight: isActive ? 700 : 500, fontSize: 13.5,
                }}>
                  <item.icon size={17} strokeWidth={2.2} />
                  {item.label}
                </div>
              );
            })}
          </div>
          <div className="navrow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, cursor: "pointer", fontSize: 13.5, opacity: 0.75 }}>
            <LogOut size={17} /> Logout
          </div>
        </aside>

        {/* ---------------- CONTENT ---------------- */}
        <div className="content-wrap" style={{ marginLeft: 226, flex: 1, minWidth: 0 }}>
          {/* TOPBAR */}
          <div style={{
            position: "sticky", top: 0, zIndex: 15, display: "flex", alignItems: "center", gap: 14,
            padding: "14px 28px", borderBottom: T.panelBorder, background: dark ? "rgba(10,8,18,0.6)" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
          }}>
            <button className="mobile-topbar-menu btn-ghost" onClick={() => setMobileNav(!mobileNav)} style={{ border: "none", color: T.text, padding: 6 }}>
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: 10, opacity: 0.5 }} />
              <input placeholder="Search tasks, campaigns, rewards…" style={{
                width: "100%", padding: "9px 12px 9px 34px", borderRadius: 12, border: T.panelBorder,
                background: T.panel, color: T.text, fontSize: 13, outline: "none",
              }} />
            </div>
            <div style={{ flex: 1 }} />
            <button onClick={() => setTheme(dark ? "light" : "dark")} className="btn-ghost hoverlift" style={{ border: T.panelBorder, borderRadius: 10, padding: 8, color: T.text }}>
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="btn-ghost hoverlift" style={{ border: T.panelBorder, borderRadius: 10, padding: 8, color: T.text, position: "relative" }}>
                <Bell size={17} />
                <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: 99, background: BRAND.red }} />
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 46, width: 300, ...cardStyle, borderRadius: 16, padding: 10, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.35)" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, padding: "6px 8px 10px" }}>Recent updates</div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} style={{ padding: "8px", borderRadius: 10, fontSize: 12.5, display: "flex", gap: 8 }} className="navrow">
                      <div style={{ width: 6, height: 6, borderRadius: 99, background: BRAND.primary, marginTop: 5, flexShrink: 0 }} />
                      <div><div>{n.text}</div><div style={{ opacity: 0.5, fontSize: 11, marginTop: 2 }}>{n.time}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 6 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.orange})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#1B1730" }}>AS</div>
            </div>
          </div>

          <div style={{ padding: "26px 28px 80px", maxWidth: 1320, margin: "0 auto" }}>
            {/* ---------------- HERO ---------------- */}
            <div id="section-dashboard" className="hoverlift" style={{ ...cardStyle, borderRadius: 28, padding: "30px 32px", position: "relative", overflow: "hidden", marginBottom: 22 }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 90% -10%, rgba(91,61,245,0.28), transparent 55%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", position: "relative" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: 22, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.blue})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Sora',sans-serif",
                    fontSize: 30, fontWeight: 800, color: "#fff", border: "3px solid rgba(255,255,255,0.15)",
                  }}>AS</div>
                  <div style={{ position: "absolute", bottom: -8, right: -8, background: BRAND.gold, borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${dark ? "#12101C" : "#fff"}` }}>
                    <Crown size={14} color="#1B1730" fill="#1B1730" />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 25, fontWeight: 800 }}>{USER.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, opacity: 0.65, marginTop: 4 }}>
                    <GraduationCap size={14} /> {USER.college} <span style={{ opacity: 0.4 }}>•</span> {USER.caId}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    <Chip icon={Zap} color={BRAND.gold} label={`${USER.xp.toLocaleString()} XP`} />
                    <Chip icon={Trophy} color={BRAND.primary} label={`Level ${USER.level} • Rank #${USER.rankGlobal}`} />
                    <Chip icon={Award} color={BRAND.blue} label={USER.badge} />
                    <Chip icon={Flame} color={BRAND.red} label={`${USER.streak}-day streak`} pulse />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 210 }}>
                  <div style={{ fontSize: 11, opacity: 0.55, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Referral code</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 15, background: T.track, padding: "8px 12px", borderRadius: 10, flex: 1 }}>{USER.referral}</div>
                    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }} className="btn-ghost hoverlift" style={{ border: T.panelBorder, borderRadius: 10, padding: "8px 10px", color: T.text }}>
                      <Copy size={15} />
                    </button>
                  </div>
                  {copied && <div style={{ fontSize: 11, color: BRAND.green, fontWeight: 600 }}>Link copied ✓</div>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }} className="btn-primary hoverlift" style={{ flex: 1, borderRadius: 10, padding: "10px 8px", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Share2 size={14} /> Share link
                    </button>
                    <button onClick={() => goToSection({ label: "Leaderboard", target: "section-leaderboard" })} className="btn-ghost hoverlift" style={{ border: T.panelBorder, borderRadius: 10, padding: "10px 12px", fontSize: 12.5, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", gap: 6 }}>
                      <Trophy size={14} /> Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- PROGRESS + DAILY MISSIONS ---------------- */}
            <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 20, marginBottom: 22 }}>
              {/* Progress Card */}
              <div className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: 26, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: BRAND.primaryLight }}>XP Journey</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, opacity: 0.6 }}>{tier.remaining} XP to {tier.next?.name}</div>
                </div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 14 }}>
                  {USER.xp.toLocaleString()} <span style={{ fontSize: 14, opacity: 0.5, fontWeight: 500 }}>XP</span>
                </div>
                <div style={{ height: 14, borderRadius: 99, background: T.track, overflow: "hidden", marginBottom: 20, position: "relative" }}>
                  <div style={{ height: "100%", width: `${tier.pct}%`, borderRadius: 99, background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.blue})`, transition: "width 1s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  <div style={{ position: "absolute", top: 9, left: 9, right: 9, height: 2, background: T.track, zIndex: 0 }} />
                  {TIERS.map((t) => {
                    const reached = USER.xp >= t.min;
                    return (
                      <div key={t.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", zIndex: 1, flex: 1 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 99, background: reached ? t.color : T.track,
                          border: reached ? "none" : `2px solid ${T.track}`, boxShadow: reached ? `0 0 0 4px ${t.color}22` : "none",
                        }} />
                        <div style={{ fontSize: 10.5, fontWeight: reached ? 700 : 500, opacity: reached ? 1 : 0.45 }}>{t.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Missions */}
              <div id="section-tasks" className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: "22px 20px", minWidth: 0 }}>
                <SectionHeader eyebrow="Today's mission" title="Daily tasks" />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {DAILY_MISSIONS.map((m) => {
                    const complete = m.done >= m.total;
                    return (
                      <div key={m.id} className="missionrow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 8px", borderRadius: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: T.track, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <m.icon size={16} color={BRAND.primaryLight} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{m.title}</div>
                          <div style={{ height: 5, borderRadius: 99, background: T.track, marginTop: 5, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${(m.done / m.total) * 100}%`, background: complete ? BRAND.green : BRAND.primary, borderRadius: 99 }} />
                          </div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.gold, width: 44, textAlign: "right" }}>+{m.points}</div>
                        <button disabled={complete} style={{
                          border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 10.5, fontWeight: 700, cursor: complete ? "default" : "pointer",
                          background: complete ? "rgba(31,191,108,0.15)" : `linear-gradient(135deg, ${BRAND.primary}, #8A5CF6)`,
                          color: complete ? BRAND.green : "#fff",
                        }}>{complete ? "Done" : "Complete"}</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ---------------- WEEKLY CHALLENGES ---------------- */}
            <div style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Level up faster" title="Weekly & monthly challenges" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <ChallengeCard T={T} icon={Target} color={BRAND.blue} label="Weekly goal" title="Refer 15 friends" done={9} total={15} points={300} />
                <ChallengeCard T={T} icon={Calendar} color={BRAND.primary} label="Monthly goal" title="Earn 5,000 XP" done={2450} total={5000} points={1000} />
                <ChallengeCard T={T} icon={Sparkles} color={BRAND.gold} label="Bonus mission" title="2x points this weekend" done={0} total={1} points={0} customRight="2X" />
                <div className="hoverlift" style={{ ...cardStyle, borderRadius: 20, padding: 18, background: `linear-gradient(135deg, ${BRAND.primary}, #7C3AED)`, color: "#fff", border: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, textTransform: "uppercase", letterSpacing: "0.08em" }}>Special campaign</div>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 16, marginTop: 4 }}>Hiring Drive Blast</div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>Refer 5 verified students this week for a bonus reward pack.</div>
                  </div>
                  <button style={{ marginTop: 12, background: "rgba(255,255,255,0.18)", border: "none", color: "#fff", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, alignSelf: "flex-start", cursor: "pointer" }}>View reward →</button>
                </div>
              </div>
            </div>

            {/* ---------------- ACTIVITY FEED ---------------- */}
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 22 }}>
              <div className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: "22px 20px" }}>
                <SectionHeader eyebrow="Timeline" title="Activity feed" />
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {ACTIVITY_FEED.map((group) => (
                    <div key={group.day}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: 8 }}>{group.day}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {group.items.map((it, i) => (
                          <div key={i} className="missionrow" style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px", borderRadius: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: 99, background: BRAND.primary, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{it.title}</div>
                              <div style={{ fontSize: 11, opacity: 0.5 }}>{it.time}</div>
                            </div>
                            <StatusPill status={it.status} />
                            <div style={{ fontSize: 12, fontWeight: 700, color: it.points ? BRAND.gold : "inherit", opacity: it.points ? 1 : 0.4, width: 42, textAlign: "right" }}>{it.points ? `+${it.points}` : "—"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications inline card */}
              <div className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: "22px 20px" }}>
                <SectionHeader eyebrow="Stay in the loop" title="Notifications" />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className="missionrow" style={{ display: "flex", gap: 10, padding: "10px 8px", borderRadius: 12 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 9, background: T.track, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Bell size={14} color={BRAND.primaryLight} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12.5 }}>{n.text}</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------------- SOCIAL CAMPAIGNS ---------------- */}
            <div id="section-campaigns" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Amplify your reach" title="Social campaigns" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                {CAMPAIGNS.map((c) => (
                  <div key={c.platform} className="hoverlift" style={{ ...cardStyle, borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${c.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <c.icon size={16} color={c.color} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.platform}</div>
                    </div>
                    <div style={{ fontSize: 11.5, opacity: 0.65, lineHeight: 1.45, minHeight: 46 }}>{c.instructions}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: BRAND.gold }}>+{c.points} XP</span>
                      <span style={{ opacity: 0.55 }}>Due {c.deadline}</span>
                    </div>
                    <StatusPill status={c.status} />
                    <button className="btn-primary hoverlift" style={{ borderRadius: 9, padding: "8px", fontSize: 11.5, fontWeight: 700 }}>Upload proof</button>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- REFERRAL ANALYTICS ---------------- */}
            <div id="section-referrals" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Referral link performance" title="Referral analytics" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <StatCard T={T} icon={ChevronRight} color={BRAND.blue} label="Total clicks" value="3,240" />
                <StatCard T={T} icon={UserPlus} color={BRAND.primary} label="Registrations" value="812" />
                <StatCard T={T} icon={ShieldCheck} color={BRAND.green} label="Verified users" value="634" />
                <StatCard T={T} icon={TrendingUp} color={BRAND.gold} label="Conversion rate" value="19.6%" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <ChartCard T={T} dark={dark} title="Weekly referral trend">
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={WEEKLY_TREND}>
                      <defs>
                        <linearGradient id="refGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BRAND.primary} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={BRAND.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={T.chartGrid} vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                      <Area type="monotone" dataKey="refs" stroke={BRAND.primary} strokeWidth={2.5} fill="url(#refGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard T={T} dark={dark} title="College-wise referrals">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={COLLEGE_DATA}>
                      <CartesianGrid stroke={T.chartGrid} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="val" fill={BRAND.blue} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard T={T} dark={dark} title="State-wise referrals">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={STATE_DATA} dataKey="value" nameKey="name" innerRadius={42} outerRadius={64} paddingAngle={3}>
                        {STATE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            {/* ---------------- PERFORMANCE DASHBOARD ---------------- */}
            <div style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Overview" title="Performance dashboard" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
                <StatCard T={T} icon={ListChecks} color={BRAND.blue} label="Total activities" value="128" />
                <StatCard T={T} icon={CheckCircle2} color={BRAND.green} label="Completed" value="96" />
                <StatCard T={T} icon={Clock} color={BRAND.gold} label="Pending" value="21" />
                <StatCard T={T} icon={XCircle} color={BRAND.red} label="Rejected" value="11" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <StatCard T={T} icon={ShieldCheck} color={BRAND.primary} label="Approved" value="96" />
                <StatCard T={T} icon={Zap} color={BRAND.gold} label="Total earnings" value="₹8,200" />
                <StatCard T={T} icon={Gift} color={BRAND.orange} label="Rewards earned" value="6" />
                <StatCard T={T} icon={FileBadge2} color={BRAND.blue} label="Certificates" value="3" />
              </div>
            </div>

            {/* ---------------- ACHIEVEMENT BADGES ---------------- */}
            <div id="section-achievements" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Collection" title="Achievement badges" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                {BADGES.map((b) => (
                  <div key={b.name} className="hoverlift" style={{
                    ...cardStyle, borderRadius: 20, padding: "20px 12px", textAlign: "center",
                    opacity: b.unlocked ? 1 : 0.45, filter: b.unlocked ? "none" : "grayscale(1)",
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 16, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center",
                      background: b.unlocked ? `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.orange})` : T.track,
                    }}>
                      {b.unlocked ? <b.icon size={22} color="#1B1730" /> : <Lock size={20} color={T.sub} />}
                    </div>
                    <div style={{ fontSize: 11.5, fontWeight: 700 }}>{b.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- LEADERBOARD ---------------- */}
            <div id="section-leaderboard" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Where you stand" title="Leaderboard" action={
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.keys(LEADERBOARD).map((k) => (
                    <button key={k} onClick={() => setTab(k)} style={{
                      border: "none", borderRadius: 999, padding: "6px 13px", fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                      background: tab === k ? `linear-gradient(135deg, ${BRAND.primary}, #8A5CF6)` : T.track,
                      color: tab === k ? "#fff" : T.text,
                    }}>{k}</button>
                  ))}
                </div>
              } />
              <div className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: 8 }}>
                {LEADERBOARD[tab].map((row) => (
                  <div key={row.rank + row.name} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 16,
                    background: row.isMe ? (dark ? "rgba(91,61,245,0.18)" : "rgba(91,61,245,0.08)") : "transparent",
                    border: row.isMe ? `1px solid ${BRAND.primary}55` : "1px solid transparent",
                  }}>
                    <div style={{ width: 28, textAlign: "center", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: row.rank <= 3 ? BRAND.gold : T.sub }}>
                      {row.rank <= 3 ? <Medal size={16} color={BRAND.gold} /> : `#${row.rank}`}
                    </div>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                      {row.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: row.isMe ? 800 : 600 }}>{row.name} {row.isMe && <span style={{ color: BRAND.primaryLight, fontSize: 11 }}>(You)</span>}</div>
                      <div style={{ fontSize: 11, opacity: 0.55 }}>{row.college}</div>
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13 }}>{row.pts.toLocaleString()} XP</div>
                    <TrendIcon trend={row.trend} />
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- REWARDS STORE ---------------- */}
            <div id="section-rewards" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow={`Your balance — ${USER.xp.toLocaleString()} XP`} title="Rewards store" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {REWARDS.map((r) => {
                  const can = USER.xp >= r.points && r.available;
                  return (
                    <div key={r.name} className="hoverlift" style={{ ...cardStyle, borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: T.track, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <r.icon size={19} color={BRAND.primaryLight} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, minHeight: 34 }}>{r.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 13, color: BRAND.gold }}>{r.points.toLocaleString()} XP</div>
                      <button disabled={!can} className={can ? "btn-primary" : ""} style={{
                        borderRadius: 9, padding: "8px", fontSize: 11.5, fontWeight: 700, border: can ? "none" : T.panelBorder,
                        background: can ? undefined : "transparent", color: can ? "#fff" : T.sub, cursor: can ? "pointer" : "not-allowed",
                      }}>{r.available ? (can ? "Redeem" : "Not enough XP") : "Unavailable"}</button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ---------------- CERTIFICATES ---------------- */}
            <div id="section-certificates" style={{ marginBottom: 22 }}>
              <SectionHeader eyebrow="Proof of impact" title="Certificates" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {CERTIFICATES.map((c) => (
                  <div key={c.name} className="hoverlift" style={{ ...cardStyle, borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${BRAND.gold}, ${BRAND.orange})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileBadge2 size={19} color="#1B1730" />
                      </div>
                      {c.verified ? <StatusPill status="Verified" /> : <StatusPill status="Pending" />}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, opacity: 0.55 }}>{c.date}</div>
                    <button className="btn-ghost hoverlift" style={{ border: T.panelBorder, borderRadius: 9, padding: "8px", fontSize: 11.5, fontWeight: 700, color: T.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Download size={13} /> Download PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- PERFORMANCE CHARTS ---------------- */}
            <div style={{ marginBottom: 10 }}>
              <SectionHeader eyebrow="Momentum" title="Performance charts" />
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16, marginBottom: 16 }}>
                <ChartCard T={T} dark={dark} title="Activity heatmap">
                  <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
                    {heat.map((col, ci) => (
                      <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {col.map((v, ri) => (
                          <div key={ri} style={{ width: 10, height: 10, borderRadius: 3, background: heatColor(v) }} />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 10.5, opacity: 0.5, marginTop: 10 }}>Last 26 weeks of ambassador activity</div>
                </ChartCard>
                <ChartCard T={T} dark={dark} title="Weekly XP earned">
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart data={XP_TREND}>
                      <CartesianGrid stroke={T.chartGrid} vertical={false} />
                      <XAxis dataKey="d" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                      <Line type="monotone" dataKey="xp" stroke={BRAND.gold} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <ChartCard T={T} dark={dark} title="Campaign performance">
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={CAMPAIGNS.map((c) => ({ name: c.platform, pts: c.points }))}>
                      <CartesianGrid stroke={T.chartGrid} vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="pts" radius={[6, 6, 0, 0]}>
                        {CAMPAIGNS.map((c, i) => <Cell key={i} fill={c.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard T={T} dark={dark} title="Leaderboard rank growth">
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={[{ w: "W1", r: 310 }, { w: "W2", r: 268 }, { w: "W3", r: 240 }, { w: "W4", r: 195 }, { w: "W5", r: 170 }, { w: "W6", r: 142 }]}>
                      <CartesianGrid stroke={T.chartGrid} vertical={false} />
                      <XAxis dataKey="w" tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} />
                      <YAxis reversed tick={{ fontSize: 10, fill: T.sub }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip contentStyle={{ background: T.panelSolid, border: T.panelBorder, borderRadius: 10, fontSize: 12 }} />
                      <Line type="monotone" dataKey="r" stroke={BRAND.green} strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>

            {/* ---------------- ADMIN PREVIEW ---------------- */}
            <div style={{ marginTop: 24 }}>
              <SectionHeader eyebrow="For chapter admins" title="Admin controls" sub="Preview only — full admin console lives in a separate workspace" />
              <div className="hoverlift" style={{ ...cardStyle, borderRadius: 24, padding: 20, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { l: "Create activities", i: ListChecks }, { l: "Assign points", i: Zap },
                  { l: "Approve proof", i: CheckCircle2 }, { l: "Reject submission", i: XCircle },
                  { l: "View analytics", i: TrendingUp }, { l: "Manage rewards", i: Gift },
                  { l: "Manage leaderboard", i: Trophy }, { l: "Manage ambassadors", i: Users },
                ].map((a) => (
                  <div key={a.l} className="navrow" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", borderRadius: 14, cursor: "pointer", border: T.panelBorder }}>
                    <a.i size={16} color={BRAND.primaryLight} />
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{a.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- MORE ATOMS ---------------------------------- */
function Chip({ icon: Icon, color, label, pulse }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${color}1E`, color, padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
      <Icon size={13} className={pulse ? "streakflame" : ""} /> {label}
    </div>
  );
}

function StatCard({ T, icon: Icon, color, label, value }) {
  return (
    <div className="hoverlift" style={{ background: T.panel, border: T.panelBorder, backdropFilter: "blur(18px)", borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{value}</div>
        <div style={{ fontSize: 11, opacity: 0.55 }}>{label}</div>
      </div>
    </div>
  );
}

function ChartCard({ T, title, children }) {
  return (
    <div className="hoverlift" style={{ background: T.panel, border: T.panelBorder, backdropFilter: "blur(18px)", borderRadius: 20, padding: 18 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function ChallengeCard({ T, icon: Icon, color, label, title, done, total, points, customRight }) {
  const pct = Math.min(100, Math.round((done / total) * 100));
  return (
    <div className="hoverlift" style={{ background: T.panel, border: T.panelBorder, backdropFilter: "blur(18px)", borderRadius: 20, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={color} />
        </div>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.55 }}>{label}</div>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {customRight ? (
        <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Sora',sans-serif" }}>{customRight}</div>
      ) : (
        <>
          <div style={{ height: 8, borderRadius: 99, background: T.track, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.65 }}>
            <span>{done}/{total}</span>
            <span style={{ fontWeight: 700, color: BRAND.gold }}>+{points} XP</span>
          </div>
        </>
      )}
    </div>
  );
}
