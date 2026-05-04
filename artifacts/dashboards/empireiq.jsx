import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from "recharts";
import {
  Zap, TrendingUp, Search, BarChart2, Target, FileText,
  Eye, Users, ChevronRight, Brain, Flame, Trophy,
  Settings, Bell, Plus, RefreshCw, ArrowUp, ArrowDown,
  Sparkles, Hash, Play, ThumbsUp, Download, CheckCircle,
  Clock, Cpu, ChevronDown, Layers, Radio, Crosshair,
  LayoutDashboard, X, Send, Loader, Video, DollarSign,
  Activity, Filter, Lock, Unlock, Shield, AlertTriangle,
  GitBranch, Bookmark, Mic, Globe, Star, User, Bot,
  Tv, Instagram, Youtube, List, MoreHorizontal, Check,
  ChevronUp, Terminal, Workflow, Package, Inbox, Share2
} from "lucide-react";

// ─── BRAND ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#05080e", surface: "#0a1018", card: "#0e1620",
  border: "#172135", amber: "#f59e0b", amberDim: "#78450a",
  cyan: "#22d3ee", cyanDim: "#0e5566", red: "#ef4444",
  green: "#22c55e", purple: "#a855f7", blue: "#3b82f6",
  text: "#e2e8f0", muted: "#4e6580", dim: "#1e3045",
};

// ─── EMPIRE DATA ─────────────────────────────────────────────────────────────
const EMPIRE_CHANNELS = [
  { id: "funfact",   name: "FunFactPulse",   platform: "youtube", niche: "Facts/Viral",      subs: 4200,  views: "2.1M",  freq: "Daily",    auto: "FULL",    status: "live",    ctr: "5.8%", color: C.amber  },
  { id: "top10",     name: "Top10.xyz",      platform: "youtube", niche: "Listicles",        subs: 1800,  views: "890K",  freq: "3x/week",  auto: "FULL",    status: "live",    ctr: "4.2%", color: C.cyan   },
  { id: "chimera",   name: "ChimeraChannel", platform: "youtube", niche: "Mythology",        subs: 640,   views: "310K",  freq: "2x/week",  auto: "SEMI",    status: "live",    ctr: "6.1%", color: C.purple },
  { id: "moose",     name: "MooseRiders",    platform: "youtube", niche: "Franchise/Prestige",subs: 120,  views: "48K",   freq: "Manual",   auto: "NEVER",   status: "prestige",ctr: "7.4%", color: C.red    },
  { id: "mindunlock",name: "MindUnlocked",   platform: "youtube", niche: "Stoic/Motivation", subs: 380,  views: "145K",  freq: "3x/week",  auto: "SEMI",    status: "live",    ctr: "3.9%", color: C.green  },
  { id: "techbit",   name: "TechBitReels",   platform: "youtube", niche: "AI/Tech News",     subs: 12,   views: "8.4K",  freq: "1x/week",  auto: "SEMI",    status: "growing", ctr: "3.1%", color: C.blue   },
  { id: "aicine",    name: "AiCineSynth",    platform: "youtube", niche: "AI Video/Cinema",  subs: 0,    views: "0",     freq: "TBD",      auto: "PENDING", status: "setup",   ctr: "—",    color: C.amberDim},
  { id: "ig_maya",   name: "MirzaTech IG",   platform: "instagram",niche: "AI Brand",        subs: 840,  views: "62K",   freq: "Daily",    auto: "FULL",    status: "live",    ctr: "4.8%", color: C.purple },
  { id: "tk_fun",    name: "FunFact TikTok", platform: "tiktok",  niche: "Facts/Viral",      subs: 3100, views: "1.2M",  freq: "2x/day",   auto: "FULL",    status: "live",    ctr: "8.2%", color: C.cyan   },
  { id: "tk_ai",     name: "TechBit TikTok", platform: "tiktok",  niche: "AI/Tech",          subs: 290,  views: "88K",   freq: "Daily",    auto: "SEMI",    status: "live",    ctr: "5.1%", color: C.blue   },
];

const ASG_AGENTS = [
  { id: "a01", name: "Aria",      role: "Video Script Writer",    agency: "ContentCraft AI",    status: "active",  task: "Writing script: AI Tools 2025",      avatar: "A", color: C.amber  },
  { id: "a02", name: "Nexus",     role: "YouTube SEO Specialist", agency: "SearchEdge AI",      status: "active",  task: "Keyword research: MindUnlocked",     avatar: "N", color: C.cyan   },
  { id: "a03", name: "Pixel",     role: "Thumbnail Designer",     agency: "VisualForge AI",     status: "idle",    task: "Available for tasks",                avatar: "P", color: C.purple },
  { id: "a04", name: "Echo",      role: "Video Producer",         agency: "StreamLine AI",      status: "active",  task: "Editing: FunFactPulse EP#2847",       avatar: "E", color: C.green  },
  { id: "a05", name: "Vega",      role: "Content Scheduler",      agency: "TimePilot AI",       status: "active",  task: "Scheduling: Top10.xyz Q2 calendar",  avatar: "V", color: C.blue   },
  { id: "a06", name: "Cipher",    role: "Analytics Analyst",      agency: "DataPulse AI",       status: "idle",    task: "Available for tasks",                avatar: "C", color: C.red    },
  { id: "a07", name: "Lyra",      role: "Voiceover Artist AI",    agency: "AudioForge AI",      status: "active",  task: "Recording: MindUnlocked Short #41",  avatar: "L", color: C.amber  },
  { id: "a08", name: "Orion",     role: "Social Media Manager",   agency: "SocialNexus AI",     status: "active",  task: "Posting: TikTok FunFact x2",         avatar: "O", color: C.cyan   },
  { id: "a09", name: "Nova",      role: "Trend Researcher",       agency: "TrendWatch AI",      status: "idle",    task: "Available for tasks",                avatar: "N", color: C.purple },
  { id: "a10", name: "Titan",     role: "Channel Growth Strategist","agency":"GrowthForge AI",  status: "active",  task: "Strategy: TechBitReels growth plan", avatar: "T", color: C.green  },
];

const PIPELINE = [
  { id: "v01", title: "10 AI Tools That Will Replace Your Job in 2025", channel: "TechBitReels", agent: "Aria",  stage: "scripting",  priority: "HIGH",   auto: true,  assignedAt: "2h ago" },
  { id: "v02", title: "The Zmaj Legend — Bosnian Dragon Mythology", channel: "ChimeraChannel", agent: "Echo",  stage: "producing",  priority: "MED",    auto: false, assignedAt: "4h ago" },
  { id: "v03", title: "5 Stoic Rules That Will Change Your Life", channel: "MindUnlocked",    agent: "Lyra",  stage: "voiceover",  priority: "MED",    auto: true,  assignedAt: "5h ago" },
  { id: "v04", title: "Top 10 Scariest Facts About Space", channel: "FunFactPulse",        agent: "Vega",  stage: "scheduling", priority: "LOW",    auto: true,  assignedAt: "6h ago" },
  { id: "v05", title: "Claude AI vs ChatGPT — Real Comparison", channel: "TechBitReels",    agent: "Nexus", stage: "optimizing", priority: "HIGH",   auto: true,  assignedAt: "7h ago" },
  { id: "v06", title: "AI Makes Money While You Sleep", channel: "TechBitReels",            agent: "Aria",  stage: "review",     priority: "HIGH",   auto: false, assignedAt: "1d ago" },
  { id: "v07", title: "Hollow Earth — The Luminous Expanse Theory", channel: "ChimeraChannel",agent: "Echo", stage: "posted",     priority: "MED",    auto: false, assignedAt: "2d ago" },
  { id: "v08", title: "#AI #Facts #Viral — TikTok Pack x10", channel: "FunFact TikTok",    agent: "Orion", stage: "posted",     priority: "HIGH",   auto: true,  assignedAt: "1d ago" },
];

const PIPELINE_STAGES = ["scripting", "producing", "voiceover", "optimizing", "review", "scheduling", "posted"];
const STAGE_COLORS = {
  scripting: C.purple, producing: C.blue, voiceover: C.cyan,
  optimizing: C.amber, review: C.red, scheduling: C.green, posted: C.muted
};

const viewsData = [
  { d: "Apr 14", v: 8400 }, { d: "Apr 15", v: 9200 }, { d: "Apr 16", v: 8800 },
  { d: "Apr 17", v: 11200 },{ d: "Apr 18", v: 13800 },{ d: "Apr 19", v: 12400 },
  { d: "Apr 20", v: 15600 },{ d: "Apr 21", v: 18200 },{ d: "Apr 22", v: 16900 },
  { d: "Apr 23", v: 21400 },{ d: "Apr 24", v: 24800 },{ d: "Apr 25", v: 22100 },
  { d: "Apr 26", v: 28400 },{ d: "Apr 27", v: 31200 },
];

const keywords = [
  { kw: "ai tools for youtube",       vol: "49K", comp: 42, score: 91, trend: 18, opp: "HIGH" },
  { kw: "automate youtube channel",   vol: "22K", comp: 31, score: 88, trend: 24, opp: "HIGH" },
  { kw: "make money with ai 2025",    vol: "81K", comp: 67, score: 73, trend: 12, opp: "MED"  },
  { kw: "ai passive income",          vol: "38K", comp: 28, score: 94, trend: 41, opp: "HIGH" },
  { kw: "n8n automation tutorial",    vol: "18K", comp: 22, score: 96, trend: 57, opp: "🔥"   },
  { kw: "claude ai vs chatgpt",       vol: "44K", comp: 51, score: 79, trend: 29, opp: "MED"  },
  { kw: "bosnian mythology",          vol: "8K",  comp: 12, score: 98, trend: 65, opp: "🔥"   },
  { kw: "hollow earth theory",        vol: "29K", comp: 34, score: 85, trend: 38, opp: "HIGH" },
];

const trendingTopics = [
  { topic: "AI Agents Replacing Workers",   score: 98, growth: "+340%", category: "AI"       },
  { topic: "GPT-5 First Impressions",       score: 95, growth: "+280%", category: "AI"       },
  { topic: "Bosnian Mythology Creatures",   score: 91, growth: "+210%", category: "Mythology"},
  { topic: "n8n Automation Full Build",     score: 89, growth: "+185%", category: "Tech"     },
  { topic: "Stoic Principles Daily Life",   score: 86, growth: "+160%", category: "Mindset"  },
  { topic: "AI Video Generation 2025",      score: 84, growth: "+145%", category: "AI"       },
  { topic: "YouTube Automation Complete",   score: 81, growth: "+132%", category: "YouTube"  },
  { topic: "Hollow Earth Evidence 2025",    score: 79, growth: "+118%", category: "Mystery"  },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${C.bg}; }
  .app {
    font-family: 'Barlow', sans-serif; min-height: 100vh; background: ${C.bg};
    color: ${C.text}; display: flex;
    background-image:
      radial-gradient(ellipse 70% 35% at 15% 0%, rgba(245,158,11,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 50% 25% at 85% 100%, rgba(34,211,238,0.04) 0%, transparent 60%);
  }
  .mono { font-family: 'Space Mono', monospace; }
  .cond { font-family: 'Barlow Condensed', sans-serif; }

  /* Sidebar */
  .sb { width: 230px; min-height: 100vh; background: ${C.surface}; border-right: 1px solid ${C.border}; display: flex; flex-direction: column; position: sticky; top: 0; flex-shrink: 0; }
  .sb-head { padding: 18px 16px 16px; border-bottom: 1px solid ${C.border}; }
  .sb-logo { font-family:'Barlow Condensed',sans-serif; font-size:11px; letter-spacing:3px; color:${C.muted}; font-weight:600; margin-bottom:4px; }
  .sb-title { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:900; letter-spacing:-0.5px; background:linear-gradient(135deg,${C.amber},${C.cyan}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .sb-sub { font-size:11px; color:${C.muted}; margin-top:2px; letter-spacing:0.5px; }

  .nav-sec { padding: 12px 10px 0; }
  .nav-lbl { font-size:10px; letter-spacing:2.5px; color:${C.muted}; padding:0 8px 6px; font-weight:700; }
  .nav-item { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:8px; cursor:pointer; font-size:13px; font-weight:500; color:${C.muted}; transition:all 0.15s; margin-bottom:2px; border:1px solid transparent; position:relative; }
  .nav-item:hover { background:rgba(255,255,255,0.04); color:${C.text}; }
  .nav-item.on { background:rgba(245,158,11,0.08); color:${C.amber}; border-color:rgba(245,158,11,0.18); }
  .nav-badge { margin-left:auto; font-size:9px; padding:2px 6px; border-radius:10px; font-weight:700; letter-spacing:0.5px; }
  .nb-live { background:rgba(34,197,94,0.15); color:${C.green}; }
  .nb-ai { background:rgba(245,158,11,0.15); color:${C.amber}; }
  .nb-new { background:rgba(168,85,247,0.15); color:${C.purple}; }
  .nb-lock { background:rgba(239,68,68,0.12); color:${C.red}; }

  /* Main */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .topbar { height:54px; background:${C.surface}; border-bottom:1px solid ${C.border}; display:flex; align-items:center; padding:0 22px; gap:12px; position:sticky; top:0; z-index:20; flex-shrink:0; }
  .tb-title { font-family:'Barlow Condensed',sans-serif; font-size:19px; font-weight:700; letter-spacing:0.3px; }
  .tb-badge { font-size:9px; padding:3px 7px; border-radius:20px; background:rgba(245,158,11,0.12); color:${C.amber}; border:1px solid rgba(245,158,11,0.25); font-weight:700; letter-spacing:1.5px; }
  .content { flex:1; overflow-y:auto; padding:22px; }
  .content::-webkit-scrollbar { width:3px; }
  .content::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; }

  /* Cards */
  .card { background:${C.card}; border:1px solid ${C.border}; border-radius:12px; padding:18px; }
  .card-t { font-family:'Barlow Condensed',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; color:${C.muted}; margin-bottom:14px; text-transform:uppercase; }

  /* Metrics */
  .mc { background:${C.card}; border:1px solid ${C.border}; border-radius:12px; padding:16px; position:relative; overflow:hidden; transition:all 0.2s; }
  .mc:hover { border-color:rgba(245,158,11,0.25); transform:translateY(-1px); }
  .mc::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,${C.amber},${C.cyan}); opacity:0; transition:opacity 0.2s; }
  .mc:hover::before { opacity:1; }
  .mc-label { font-size:10px; letter-spacing:1.8px; color:${C.muted}; font-weight:700; margin-bottom:8px; }
  .mc-val { font-family:'Space Mono',monospace; font-size:26px; font-weight:700; line-height:1; }
  .delta { display:inline-flex; align-items:center; gap:3px; font-size:10px; font-weight:700; margin-top:7px; padding:2px 6px; border-radius:4px; }
  .up { color:${C.green}; background:rgba(34,197,94,0.1); }
  .dn { color:${C.red}; background:rgba(239,68,68,0.1); }

  /* Grids */
  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
  .g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .g5 { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
  .g6 { display:grid; grid-template-columns:repeat(6,1fr); gap:10px; }
  .mb14 { margin-bottom:14px; }
  .mb20 { margin-bottom:20px; }
  .flex { display:flex; }
  .fc { display:flex; flex-direction:column; }
  .ac { align-items:center; }
  .jb { justify-content:space-between; }
  .g8 { gap:8px; }
  .g12 { gap:12px; }
  .g14 { gap:14px; }
  .wf { width:100%; }

  /* Buttons */
  .btn-p { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; background:linear-gradient(135deg,${C.amber},#d97706); border:none; border-radius:8px; font-size:13px; font-weight:700; color:#000; cursor:pointer; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.5px; transition:all 0.2s; }
  .btn-p:hover { transform:translateY(-1px); box-shadow:0 4px 18px rgba(245,158,11,0.3); }
  .btn-p:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
  .btn-s { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; background:transparent; border:1px solid ${C.border}; border-radius:8px; font-size:13px; font-weight:600; color:${C.text}; cursor:pointer; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.5px; transition:all 0.2s; }
  .btn-s:hover { border-color:${C.amber}; color:${C.amber}; }
  .btn-g { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:6px; font-size:11px; color:${C.muted}; cursor:pointer; transition:all 0.15s; }
  .btn-g:hover { color:${C.text}; border-color:${C.border}; }

  /* Tags */
  .tag { display:inline-flex; align-items:center; gap:3px; padding:2px 7px; border-radius:4px; font-size:10px; font-weight:700; letter-spacing:0.5px; }
  .t-a { background:rgba(245,158,11,0.1); color:${C.amber}; border:1px solid rgba(245,158,11,0.2); }
  .t-c { background:rgba(34,211,238,0.1); color:${C.cyan}; border:1px solid rgba(34,211,238,0.2); }
  .t-g { background:rgba(34,197,94,0.1); color:${C.green}; border:1px solid rgba(34,197,94,0.2); }
  .t-r { background:rgba(239,68,68,0.1); color:${C.red}; border:1px solid rgba(239,68,68,0.2); }
  .t-p { background:rgba(168,85,247,0.1); color:${C.purple}; border:1px solid rgba(168,85,247,0.2); }
  .t-b { background:rgba(59,130,246,0.1); color:${C.blue}; border:1px solid rgba(59,130,246,0.2); }
  .t-m { background:rgba(78,101,128,0.1); color:${C.muted}; border:1px solid rgba(78,101,128,0.2); }

  /* Input */
  .inp { width:100%; background:${C.surface}; border:1px solid ${C.border}; border-radius:8px; padding:10px 13px; font-size:13px; color:${C.text}; font-family:'Barlow',sans-serif; outline:none; transition:border-color 0.2s; }
  .inp:focus { border-color:${C.amber}; }
  .txta { resize:vertical; min-height:90px; }
  .sel { background:${C.surface}; }

  /* Progress */
  .pb { height:5px; background:${C.border}; border-radius:3px; overflow:hidden; }
  .pf { height:100%; border-radius:3px; transition:width 0.8s; }

  /* Table */
  .tbl { width:100%; border-collapse:collapse; }
  .tbl th { font-size:10px; letter-spacing:1.5px; color:${C.muted}; text-align:left; padding:8px 12px; border-bottom:1px solid ${C.border}; font-weight:700; text-transform:uppercase; }
  .tbl td { padding:11px 12px; border-bottom:1px solid rgba(255,255,255,0.03); font-size:13px; }
  .tbl tr:hover td { background:rgba(255,255,255,0.02); }

  /* Agent card */
  .agent-card { background:${C.card}; border:1px solid ${C.border}; border-radius:10px; padding:14px; transition:all 0.2s; cursor:pointer; }
  .agent-card:hover { border-color:rgba(245,158,11,0.25); }
  .agent-av { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Space Mono',monospace; font-size:15px; font-weight:700; color:#000; flex-shrink:0; }
  .agent-dot { width:8px; height:8px; border-radius:50%; }
  .dot-live { background:${C.green}; animation:pulse 2s infinite; }
  .dot-idle { background:${C.muted}; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  /* Channel card */
  .ch-card { background:${C.card}; border:1px solid ${C.border}; border-radius:12px; padding:16px; position:relative; transition:all 0.2s; cursor:pointer; }
  .ch-card:hover { border-color:rgba(255,255,255,0.1); transform:translateY(-1px); }
  .ch-icon { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  /* Pipeline stage pill */
  .stage-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.5px; }

  /* AI Chat */
  .ai-av { width:30px; height:30px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,${C.amber},${C.cyan}); display:flex; align-items:center; justify-content:center; font-size:13px; }
  .ai-bbl { background:${C.surface}; border:1px solid ${C.border}; border-radius:12px; padding:11px 14px; font-size:13px; line-height:1.65; max-width:86%; white-space:pre-wrap; }
  .usr-bbl { background:rgba(245,158,11,0.09); border:1px solid rgba(245,158,11,0.2); border-radius:12px; padding:11px 14px; font-size:13px; line-height:1.65; max-width:86%; margin-left:auto; }

  /* Score circle */
  .score-ring { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-family:'Space Mono',monospace; font-size:15px; font-weight:700; border:2px solid; }

  /* Tooltip */
  .ct { background:${C.card}; border:1px solid ${C.border}; border-radius:8px; padding:10px 13px; font-family:'Space Mono',monospace; font-size:11px; }

  /* Animations */
  .enter { animation:fadeUp 0.22s ease forwards; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation:spin 1s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* Channel platform badge */
  .plat-yt { background:rgba(255,0,0,0.12); color:#ff4444; }
  .plat-ig { background:rgba(168,85,247,0.12); color:${C.purple}; }
  .plat-tk { background:rgba(34,211,238,0.1); color:${C.cyan}; }
  .auto-full { color:${C.green}; }
  .auto-semi { color:${C.amber}; }
  .auto-never { color:${C.red}; }
  .auto-pending { color:${C.muted}; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function CT({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.amber }}>
          {p.name}: <b>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</b>
        </div>
      ))}
    </div>
  );
}

function PBar({ value, color = C.amber, label, right, h = 5 }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {(label || right) && (
        <div className="flex jb" style={{ marginBottom: 4 }}>
          {label && <span style={{ fontSize: 11, color: C.muted }}>{label}</span>}
          {right && <span style={{ fontSize: 11, color: C.text }}>{right}</span>}
        </div>
      )}
      <div className="pb" style={{ height: h }}>
        <div className="pf" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function ScB({ score }) {
  const col = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
  return (
    <span className="score-ring" style={{ color: col, borderColor: col + "40", background: col + "14" }}>
      {score}
    </span>
  );
}

function ScC({ score, size = 80, color }) {
  const r = 34; const circ = 2 * Math.PI * r;
  const col = color || (score >= 80 ? C.green : score >= 60 ? C.amber : C.red);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke={C.border} strokeWidth="6" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={col} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ - (score / 100) * circ}
        strokeLinecap="round" transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x="40" y="35" textAnchor="middle" fill={col}
        style={{ fontFamily: "'Space Mono',monospace", fontSize: "15px", fontWeight: 700 }}>{score}</text>
      <text x="40" y="50" textAnchor="middle" fill={C.muted}
        style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: "1px" }}>SCORE</text>
    </svg>
  );
}

function PlatIcon({ p, size = 13 }) {
  if (p === "youtube") return <Youtube size={size} />;
  if (p === "instagram") return <Instagram size={size} />;
  if (p === "tiktok") return <Tv size={size} />;
  return <Globe size={size} />;
}

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function claude(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true,
      system, messages: [{ role: "user", content: user }],
    }),
  });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) {
        try {
          const j = JSON.parse(line.slice(6));
          if (j.type === "content_block_delta" && j.delta?.text) {
            text += j.delta.text; onChunk(text);
          }
        } catch {}
      }
    }
  }
  return text;
}

// ─── PAGE: EMPIRE OVERVIEW ────────────────────────────────────────────────────
function EmpireOverview() {
  const [brief, setBrief] = useState(""); const [loading, setLoading] = useState(false);

  const loadBrief = async () => {
    setLoading(true); setBrief("");
    await claude(
      "You are Maya — Mo's AI digital sister and empire strategist. Give a daily empire brief covering all 10 channels: FunFactPulse, Top10.xyz, ChimeraChannel, MooseRiders, MindUnlocked, TechBitReels, AiCineSynth, MirzaTech IG, FunFact TikTok, TechBit TikTok. Be specific, tactical, data-aware. Max 8 bullets. Reference specific channels by name.",
      "Give me my full empire daily brief. What's the priority action list for today across all my channels and AI agents?",
      (t) => { setBrief(t); setLoading(false); }
    );
  };
  useEffect(() => { loadBrief(); }, []);

  const totalSubs = EMPIRE_CHANNELS.reduce((a, c) => a + c.subs, 0);
  const liveChannels = EMPIRE_CHANNELS.filter(c => c.status === "live").length;
  const activeAgents = ASG_AGENTS.filter(a => a.status === "active").length;
  const inPipeline = PIPELINE.filter(v => v.stage !== "posted").length;

  return (
    <div className="enter">
      <div className="g5 mb20">
        {[
          { label: "TOTAL CHANNELS",  value: EMPIRE_CHANNELS.length, delta: "+1 this month", up: true },
          { label: "COMBINED SUBS",   value: totalSubs.toLocaleString(), delta: "+842 today", up: true },
          { label: "ACTIVE CHANNELS", value: liveChannels, delta: "All systems go", up: true },
          { label: "AI AGENTS LIVE",  value: activeAgents + "/" + ASG_AGENTS.length, delta: "Working now", up: true },
          { label: "PIPELINE ACTIVE", value: inPipeline + " videos", delta: "In progress", up: true },
        ].map((m, i) => (
          <div key={i} className="mc">
            <div className="mc-label">{m.label}</div>
            <div className="mc-val mono">{m.value}</div>
            <div className={`delta ${m.up ? "up" : "dn"}`}>{m.up ? <ArrowUp size={9}/> : <ArrowDown size={9}/>} {m.delta}</div>
          </div>
        ))}
      </div>

      <div className="g2 mb20" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <div className="flex jb ac mb14">
            <div className="card-t">EMPIRE VIEWS — ALL CHANNELS</div>
            <div className="flex g8">
              {["7D", "30D", "90D"].map(t => <button key={t} className="btn-g" style={{ padding: "3px 9px", fontSize: 10 }}>{t}</button>)}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={viewsData}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.2}/><stop offset="95%" stopColor={C.amber} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="v" name="Daily Views" stroke={C.amber} fill="url(#ga)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-t">MAYA EMPIRE BRIEF</div>
          {loading
            ? <div className="flex ac g8" style={{ color: C.muted, fontSize: 12, padding: "10px 0" }}>
                <Loader size={13} className="spin" style={{ color: C.amber }}/> Maya is thinking...
              </div>
            : <div style={{ fontSize: 12.5, lineHeight: 1.75, whiteSpace: "pre-wrap", color: C.text }}>{brief}</div>
          }
          <button className="btn-g wf mt-10" onClick={loadBrief} style={{ marginTop: 10, justifyContent: "center" }}>
            <RefreshCw size={11}/> Refresh Brief
          </button>
        </div>
      </div>

      <div className="mb14">
        <div className="flex jb ac mb14">
          <div className="card-t" style={{ marginBottom: 0 }}>ALL EMPIRE CHANNELS</div>
          <div className="flex g8">
            <span className="tag t-g"><Youtube size={10}/> {EMPIRE_CHANNELS.filter(c => c.platform === "youtube").length} YouTube</span>
            <span className="tag t-p"><Instagram size={10}/> {EMPIRE_CHANNELS.filter(c => c.platform === "instagram").length} Instagram</span>
            <span className="tag t-c"><Tv size={10}/> {EMPIRE_CHANNELS.filter(c => c.platform === "tiktok").length} TikTok</span>
          </div>
        </div>
        <div className="g6">
          {EMPIRE_CHANNELS.map((ch, i) => (
            <div key={i} className="ch-card">
              <div className="flex jb ac mb14">
                <div className="ch-icon" style={{ background: ch.color + "22" }}>
                  <PlatIcon p={ch.platform} size={16} />
                </div>
                <span className={`tag ${ch.auto === "FULL" ? "t-g" : ch.auto === "SEMI" ? "t-a" : ch.auto === "NEVER" ? "t-r" : "t-m"}`} style={{ fontSize: 9 }}>
                  {ch.auto === "FULL" ? "AUTO" : ch.auto === "SEMI" ? "SEMI" : ch.auto === "NEVER" ? "🔒 LOCKED" : "SETUP"}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ch.color, marginBottom: 3, fontFamily: "'Barlow Condensed',sans-serif" }}>{ch.name}</div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 10 }}>{ch.niche}</div>
              <div className="flex jb" style={{ fontSize: 11 }}>
                <div><div style={{ color: C.muted, fontSize: 9, letterSpacing: 1 }}>SUBS</div><div className="mono" style={{ fontWeight: 700 }}>{ch.subs.toLocaleString()}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ color: C.muted, fontSize: 9, letterSpacing: 1 }}>CTR</div><div className="mono" style={{ fontWeight: 700, color: ch.ctr !== "—" && parseFloat(ch.ctr) > 5 ? C.green : C.text }}>{ch.ctr}</div></div>
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 8 }}>📅 {ch.freq}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-t">ACTIVE AGENTS RIGHT NOW</div>
          {ASG_AGENTS.filter(a => a.status === "active").slice(0, 5).map((ag, i) => (
            <div key={i} className="flex ac g12" style={{ padding: "10px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
              <div className="agent-av" style={{ background: ag.color }}>{ag.avatar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{ag.name} <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>· {ag.role}</span></div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ag.task}</div>
              </div>
              <div className="agent-dot dot-live" />
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-t">PIPELINE SNAPSHOT</div>
          {PIPELINE_STAGES.slice(0, -1).map(stage => {
            const count = PIPELINE.filter(v => v.stage === stage).length;
            return (
              <div key={stage} className="flex jb ac" style={{ padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                <div className="flex ac g8">
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: STAGE_COLORS[stage] }} />
                  <span style={{ fontSize: 13, textTransform: "capitalize" }}>{stage}</span>
                </div>
                <span className="mono" style={{ fontSize: 13, color: count > 0 ? C.text : C.muted }}>{count} video{count !== 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: AGENT COMMAND ──────────────────────────────────────────────────────
function AgentCommand() {
  const [dispatch, setDispatch] = useState(""); const [dispLoading, setDispLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newTask, setNewTask] = useState(""); const [taskChannel, setTaskChannel] = useState("TechBitReels");
  const [agents, setAgents] = useState(ASG_AGENTS);

  const assignTask = async () => {
    if (!newTask || !selected) return;
    setDispLoading(true); setDispatch("");
    await claude(
      "You are Maya, Mo's AI empire director. When an agent is assigned a task, respond as the agent confirming the task, outlining their execution plan, expected deliverable, and timeline. Be specific and professional. Max 150 words.",
      `Agent ${selected.name} (${selected.role}) has been assigned: "${newTask}" for channel: ${taskChannel}. Respond as ${selected.name} confirming the task.`,
      (t) => { setDispatch(t); setDispLoading(false); }
    );
    setAgents(prev => prev.map(a => a.id === selected.id ? { ...a, status: "active", task: newTask + " — " + taskChannel } : a));
  };

  return (
    <div className="enter">
      <div className="g2 mb20" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <div className="flex jb ac mb14">
            <div className="card-t">AI AGENT WORKFORCE — ASG V4</div>
            <span className="tag t-g">{agents.filter(a => a.status === "active").length} ACTIVE</span>
          </div>
          <div className="g2">
            {agents.map((ag, i) => (
              <div key={i} className="agent-card" onClick={() => setSelected(ag)}
                style={{ border: selected?.id === ag.id ? `1px solid ${ag.color}44` : undefined, background: selected?.id === ag.id ? ag.color + "08" : undefined }}>
                <div className="flex ac g8 mb14">
                  <div className="agent-av" style={{ background: ag.color }}>{ag.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selected?.id === ag.id ? ag.color : C.text }}>{ag.name}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{ag.agency}</div>
                  </div>
                  <div className={`agent-dot ${ag.status === "active" ? "dot-live" : "dot-idle"}`} style={{ marginLeft: "auto" }} />
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{ag.role}</div>
                <div style={{ fontSize: 11, color: ag.status === "active" ? C.green : C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ag.status === "active" ? "⚡ " : "○ "}{ag.task}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fc g14">
          <div className="card">
            <div className="card-t">DISPATCH A TASK</div>
            {selected ? (
              <div style={{ background: C.surface, borderRadius: 8, padding: "12px", marginBottom: 12, border: `1px solid ${selected.color}33` }}>
                <div className="flex ac g8">
                  <div className="agent-av" style={{ background: selected.color, width: 32, height: 32, fontSize: 13 }}>{selected.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: selected.color }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{selected.role}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, padding: "8px 0" }}>← Select an agent from the left</div>
            )}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TARGET CHANNEL</label>
              <select className="inp sel" value={taskChannel} onChange={e => setTaskChannel(e.target.value)}>
                {EMPIRE_CHANNELS.map(ch => <option key={ch.id} value={ch.name}>{ch.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TASK DESCRIPTION</label>
              <textarea className="inp txta" style={{ minHeight: 80 }}
                placeholder="e.g. Research trending AI topics, write a 10-min script optimized for retention, generate thumbnail brief..."
                value={newTask} onChange={e => setNewTask(e.target.value)} />
            </div>
            <button className="btn-p wf" onClick={assignTask} disabled={!selected || !newTask || dispLoading}
              style={{ justifyContent: "center", fontSize: 14 }}>
              {dispLoading ? <><Loader size={13} className="spin" /> Dispatching...</> : <><Zap size={13} /> DISPATCH AGENT</>}
            </button>
          </div>

          {dispatch && (
            <div className="card">
              <div className="flex ac g8 mb14">
                <div className="agent-av" style={{ background: selected?.color, width: 32, height: 32, fontSize: 13 }}>{selected?.avatar}</div>
                <div className="card-t" style={{ marginBottom: 0 }}>{selected?.name} CONFIRMS</div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: C.text, whiteSpace: "pre-wrap" }}>{dispatch}</div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-t">AGENT CAPABILITY MATRIX</div>
        <table className="tbl">
          <thead>
            <tr><th>AGENT</th><th>ROLE</th><th>AGENCY</th><th>CAN HANDLE</th><th>STATUS</th><th>ASSIGN TO</th></tr>
          </thead>
          <tbody>
            {agents.map((ag, i) => (
              <tr key={i}>
                <td>
                  <div className="flex ac g8">
                    <div className="agent-av" style={{ background: ag.color, width: 30, height: 30, fontSize: 12, borderRadius: 8 }}>{ag.avatar}</div>
                    <span style={{ fontWeight: 600 }}>{ag.name}</span>
                  </div>
                </td>
                <td style={{ color: C.muted }}>{ag.role}</td>
                <td><span style={{ fontSize: 11 }}>{ag.agency}</span></td>
                <td>
                  <div className="flex g8" style={{ flexWrap: "wrap" }}>
                    {ag.role.includes("Script") && <><span className="tag t-p">Scripts</span><span className="tag t-a">Hooks</span></>}
                    {ag.role.includes("SEO") && <><span className="tag t-c">Keywords</span><span className="tag t-g">Rankings</span></>}
                    {ag.role.includes("Thumbnail") && <><span className="tag t-a">Thumbnails</span><span className="tag t-b">CTR</span></>}
                    {ag.role.includes("Producer") && <><span className="tag t-b">Editing</span><span className="tag t-g">Export</span></>}
                    {ag.role.includes("Scheduler") && <><span className="tag t-g">Scheduling</span><span className="tag t-c">Calendars</span></>}
                    {ag.role.includes("Analytics") && <><span className="tag t-c">Data</span><span className="tag t-a">Reports</span></>}
                    {ag.role.includes("Voiceover") && <><span className="tag t-p">Voice</span><span className="tag t-c">Audio</span></>}
                    {ag.role.includes("Social") && <><span className="tag t-p">IG</span><span className="tag t-c">TikTok</span></>}
                    {ag.role.includes("Trend") && <><span className="tag t-r">Trends</span><span className="tag t-a">Research</span></>}
                    {ag.role.includes("Growth") && <><span className="tag t-g">Strategy</span><span className="tag t-b">Growth</span></>}
                  </div>
                </td>
                <td>
                  <div className="flex ac g8">
                    <div className={`agent-dot ${ag.status === "active" ? "dot-live" : "dot-idle"}`} />
                    <span style={{ fontSize: 12, color: ag.status === "active" ? C.green : C.muted, textTransform: "capitalize" }}>{ag.status}</span>
                  </div>
                </td>
                <td>
                  <button className="btn-g" onClick={() => setSelected(ag)} style={{ fontSize: 11 }}>
                    <Target size={11}/> Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAGE: VIDEO PIPELINE ─────────────────────────────────────────────────────
function VideoPipeline() {
  const [filter, setFilter] = useState("all");
  const [analysis, setAnalysis] = useState(""); const [loading, setLoading] = useState(false);

  const filtered = filter === "all" ? PIPELINE : PIPELINE.filter(v => v.stage === filter);

  const aiReview = async (video) => {
    setLoading(true); setAnalysis("");
    await claude(
      "You are Maya, Mo's AI empire director. Review this video in the pipeline and give a quick optimization brief: title power score, SEO notes, agent performance note, publishing recommendations. Max 120 words. Bullets.",
      `Pipeline review for: "${video.title}" on ${video.channel}\nCurrent stage: ${video.stage}\nAssigned agent: ${video.agent}\nPriority: ${video.priority}`,
      (t) => { setAnalysis(t); setLoading(false); }
    );
  };

  return (
    <div className="enter">
      <div className="flex jb ac mb20">
        <div className="flex g8 ac">
          <div className="card-t" style={{ marginBottom: 0 }}>VIDEO PRODUCTION PIPELINE</div>
          <span className="tag t-a">{PIPELINE.filter(v => v.stage !== "posted").length} IN PROGRESS</span>
          <span className="tag t-g">{PIPELINE.filter(v => v.stage === "posted").length} POSTED</span>
        </div>
        <div className="flex g8">
          <button className="btn-p"><Plus size={13}/> NEW VIDEO TASK</button>
        </div>
      </div>

      <div className="flex g8 mb14">
        <button className={filter === "all" ? "btn-p" : "btn-g"} style={{ padding: "6px 14px", fontSize: 12 }} onClick={() => setFilter("all")}>All</button>
        {PIPELINE_STAGES.map(s => (
          <button key={s} className={filter === s ? "btn-p" : "btn-g"} style={{ padding: "6px 14px", fontSize: 11, textTransform: "capitalize" }} onClick={() => setFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="g2 mb14" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <table className="tbl">
            <thead>
              <tr><th>VIDEO TITLE</th><th>CHANNEL</th><th>STAGE</th><th>AGENT</th><th>PRIORITY</th><th>AUTO</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={i}>
                  <td style={{ maxWidth: 220 }}>
                    <div className="flex ac g8">
                      <Video size={12} style={{ color: C.muted, flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{v.title}</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 11, color: EMPIRE_CHANNELS.find(c => c.name === v.channel)?.color || C.muted }}>{v.channel}</span></td>
                  <td>
                    <span className="stage-pill" style={{ background: STAGE_COLORS[v.stage] + "22", color: STAGE_COLORS[v.stage], border: `1px solid ${STAGE_COLORS[v.stage]}44` }}>
                      {v.stage}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: C.muted }}>{v.agent}</td>
                  <td><span className={`tag ${v.priority === "HIGH" ? "t-r" : v.priority === "MED" ? "t-a" : "t-m"}`}>{v.priority}</span></td>
                  <td><span className={`tag ${v.auto ? "t-g" : "t-m"}`}>{v.auto ? "AUTO" : "MANUAL"}</span></td>
                  <td><button className="btn-g" style={{ fontSize: 10, padding: "4px 8px" }} onClick={() => aiReview(v)}><Brain size={10}/> Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fc g14">
          <div className="card">
            <div className="card-t">STAGE DISTRIBUTION</div>
            {PIPELINE_STAGES.map(stage => {
              const count = PIPELINE.filter(v => v.stage === stage).length;
              return (
                <PBar key={stage} label={stage} right={count + " videos"} value={(count / PIPELINE.length) * 100} color={STAGE_COLORS[stage]} />
              );
            })}
          </div>
          {analysis && (
            <div className="card">
              <div className="flex ac g8 mb14"><Brain size={14} style={{ color: C.amber }} /><div className="card-t" style={{ marginBottom: 0 }}>MAYA REVIEW</div></div>
              <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{analysis}</div>
            </div>
          )}
          {loading && (
            <div className="card flex ac g8" style={{ padding: 16 }}>
              <Loader size={14} className="spin" style={{ color: C.amber }} />
              <span style={{ fontSize: 13, color: C.muted }}>Reviewing video...</span>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-t">CHANNEL POSTING RULES</div>
        <table className="tbl">
          <thead><tr><th>CHANNEL</th><th>PLATFORM</th><th>AUTOMATION</th><th>FREQUENCY</th><th>AGENT ALLOWED</th><th>RULE</th></tr></thead>
          <tbody>
            {EMPIRE_CHANNELS.map((ch, i) => (
              <tr key={i}>
                <td style={{ color: ch.color, fontWeight: 600 }}>{ch.name}</td>
                <td><PlatIcon p={ch.platform} size={14} /></td>
                <td>
                  <span className={`tag ${ch.auto === "FULL" ? "t-g" : ch.auto === "SEMI" ? "t-a" : ch.auto === "NEVER" ? "t-r" : "t-m"}`}>
                    {ch.auto === "FULL" ? "✓ FULL AUTO" : ch.auto === "SEMI" ? "⚡ SEMI" : ch.auto === "NEVER" ? "🔒 LOCKED" : "⏳ SETUP"}
                  </span>
                </td>
                <td style={{ fontSize: 12 }}>{ch.freq}</td>
                <td>
                  {ch.auto === "NEVER"
                    ? <span style={{ color: C.red, fontSize: 12 }}>❌ No agents — Mo only</span>
                    : <span style={{ color: C.green, fontSize: 12 }}>✓ All qualified agents</span>
                  }
                </td>
                <td style={{ fontSize: 11, color: C.muted }}>
                  {ch.auto === "NEVER" ? "Prestige — Runway AI only, manual Mo approval" :
                   ch.auto === "FULL"  ? "Agents can generate + post autonomously" :
                   ch.auto === "SEMI"  ? "Agents generate, Mo reviews before post" : "Channel in setup — rules TBD"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAGE: VIDEO OPTIMIZER ────────────────────────────────────────────────────
function VideoOptimizer() {
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState(""); const [tags, setTags] = useState("");
  const [channel, setChannel] = useState("TechBitReels"); const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null); const [ai, setAi] = useState("");

  const analyze = async () => {
    if (!title) return; setAnalyzing(true); setResult(null); setAi("");
    const scores = {
      title: Math.floor(Math.random() * 30 + 55),
      desc: desc.length > 50 ? Math.floor(Math.random() * 25 + 60) : 32,
      tags: tags.length > 0 ? Math.floor(Math.random() * 20 + 65) : 28,
      seo: Math.floor(Math.random() * 25 + 58),
      viral: Math.floor(Math.random() * 35 + 45),
    };
    scores.overall = Math.floor(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
    setResult(scores); setAnalyzing(false);
    await claude(
      "You are Maya — Mo's AI empire director and YouTube strategist. Analyze video metadata for Mo's channel and give specific optimization advice. Format: **Title Fix**, **3 Better Titles**, **Description Hook**, **Tag Strategy**, **Channel-Specific Note**. Be direct.",
      `Analyze for channel "${channel}": Title: "${title}"\nDescription: "${desc || "(empty)"}"\nTags: "${tags || "(none)"}"\nGive specific improvements to maximize views and CTR for this channel's niche.`,
      (t) => setAi(t)
    );
  };

  return (
    <div className="enter">
      <div className="g2">
        <div className="fc g14">
          <div className="card">
            <div className="card-t">VIDEO METADATA</div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TARGET CHANNEL</label>
              <select className="inp sel" value={channel} onChange={e => setChannel(e.target.value)}>
                {EMPIRE_CHANNELS.filter(c => c.platform === "youtube").map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>VIDEO TITLE *</label>
              <input className="inp" placeholder="Enter title..." value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>DESCRIPTION</label>
              <textarea className="inp txta" placeholder="Paste description..." value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TAGS</label>
              <input className="inp" placeholder="ai tools, automation, chatgpt..." value={tags} onChange={e => setTags(e.target.value)} />
            </div>
            <button className="btn-p wf" onClick={analyze} disabled={analyzing || !title} style={{ justifyContent: "center", fontSize: 14 }}>
              {analyzing ? <><Loader size={13} className="spin" /> Analyzing...</> : <><Zap size={13} /> OPTIMIZE VIDEO</>}
            </button>
          </div>
          {ai && (
            <div className="card">
              <div className="flex ac g8 mb14"><div className="ai-av" style={{ width: 28, height: 28 }}>⚡</div><div className="card-t" style={{ marginBottom: 0 }}>MAYA OPTIMIZATION REPORT</div></div>
              <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{ai}</div>
            </div>
          )}
        </div>
        <div className="fc g14">
          {result ? (
            <>
              <div className="card" style={{ textAlign: "center" }}>
                <div className="card-t">OVERALL SCORE</div>
                <ScC score={result.overall} size={110} color={result.overall >= 80 ? C.green : result.overall >= 60 ? C.amber : C.red} />
                <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>
                  {result.overall >= 80 ? "🔥 Ready to publish" : result.overall >= 60 ? "⚡ Minor tweaks needed" : "⚠️ Optimize before publishing"}
                </div>
              </div>
              <div className="card">
                <div className="card-t">SCORE BREAKDOWN</div>
                {[
                  { label: "Title Power", v: result.title, c: C.amber },
                  { label: "Description SEO", v: result.desc, c: C.cyan },
                  { label: "Tag Relevance", v: result.tags, c: C.purple },
                  { label: "Search SEO", v: result.seo, c: C.green },
                  { label: "Viral Potential", v: result.viral, c: C.red },
                ].map((x, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div className="flex jb" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 12 }}>{x.label}</span>
                      <span className="mono" style={{ fontSize: 12, color: x.c, fontWeight: 700 }}>{x.v}</span>
                    </div>
                    <PBar value={x.v} color={x.c} h={5} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 60 }}>
              <Zap size={40} style={{ color: C.border, margin: "0 auto 12px" }} />
              <div style={{ color: C.muted, fontSize: 13 }}>Enter video metadata and analyze</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: KEYWORD RESEARCH ───────────────────────────────────────────────────
function KeywordResearch() {
  const [query, setQuery] = useState(""); const [selected, setSelected] = useState(null);
  const [ai, setAi] = useState(""); const [loading, setLoading] = useState(false);

  const pick = async (kw) => {
    setSelected(kw); setLoading(true); setAi("");
    await claude(
      "You are Maya — Mo's AI empire strategist. Give a concise keyword opportunity brief. Include: opportunity rating, best channel for this keyword from Mo's empire, content angle, title formula, posting urgency. Max 180 words. Bullets.",
      `Keyword for Mo's empire: "${kw.kw}"\nVolume: ${kw.vol}, Competition: ${kw.comp}/100, Score: ${kw.score}, Growth: +${kw.trend}%\nMo's channels: FunFactPulse, ChimeraChannel, TechBitReels, MindUnlocked, MooseRiders, Top10.xyz`,
      (t) => { setAi(t); setLoading(false); }
    );
  };

  return (
    <div className="enter">
      <div className="flex g12 mb20">
        <input className="inp" style={{ flex: 1 }} placeholder="Search keywords for your empire..." value={query} onChange={e => setQuery(e.target.value)} />
        <button className="btn-p"><Search size={13} /> SEARCH</button>
        <button className="btn-s"><Sparkles size={13} /> AI SUGGEST</button>
      </div>
      <div className="g2" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card">
          <div className="flex jb ac mb14">
            <div className="card-t">KEYWORD OPPORTUNITIES</div>
            <span className="tag t-a">Sorted by Empire Fit</span>
          </div>
          <table className="tbl">
            <thead><tr><th>KEYWORD</th><th>VOLUME</th><th>COMPETITION</th><th>SCORE</th><th>TREND</th><th>BEST CHANNEL</th></tr></thead>
            <tbody>
              {keywords.map((k, i) => (
                <tr key={i} onClick={() => pick(k)} style={{ cursor: "pointer" }}>
                  <td style={{ color: selected?.kw === k.kw ? C.amber : C.text, fontWeight: selected?.kw === k.kw ? 600 : 400 }}>
                    <div className="flex ac g8"><Hash size={11} style={{ color: C.muted }} />{k.kw}</div>
                  </td>
                  <td className="mono">{k.vol}</td>
                  <td>
                    <div className="flex ac g8">
                      <div className="pb" style={{ width: 55 }}><div className="pf" style={{ width: `${k.comp}%`, background: k.comp < 40 ? C.green : k.comp < 60 ? C.amber : C.red }} /></div>
                      <span className="mono" style={{ fontSize: 10 }}>{k.comp}</span>
                    </div>
                  </td>
                  <td><ScB score={k.score} /></td>
                  <td><span style={{ color: k.trend > 30 ? C.green : C.amber, fontSize: 12 }}><ArrowUp size={9} /> {k.trend}%</span></td>
                  <td>
                    <span style={{ fontSize: 11, color: C.muted }}>
                      {k.kw.includes("bosnian") || k.kw.includes("hollow") ? "ChimeraChannel" :
                       k.kw.includes("stoic") || k.kw.includes("facts") ? "MindUnlocked" : "TechBitReels"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="fc g14">
          {selected ? (
            <>
              <div className="card">
                <div className="card-t">SELECTED KEYWORD</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.amber, marginBottom: 12 }}>"{selected.kw}"</div>
                <div className="g2">
                  {[["Volume", selected.vol], ["Competition", selected.comp + "/100"], ["Score", selected.score], ["Trend", "+" + selected.trend + "%"]].map(([l, v], i) => (
                    <div key={i} style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 3 }}>{l}</div>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="flex ac g8 mb14">
                  <Brain size={14} style={{ color: C.amber }} />
                  <div className="card-t" style={{ marginBottom: 0 }}>MAYA KEYWORD BRIEF</div>
                  {loading && <Loader size={11} className="spin" style={{ color: C.amber, marginLeft: "auto" }} />}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{ai}</div>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <Hash size={38} style={{ color: C.border, margin: "0 auto 10px" }} />
              <div style={{ color: C.muted, fontSize: 13 }}>Click a keyword for Maya's brief</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: SCRIPT GENERATOR ───────────────────────────────────────────────────
function ScriptGen() {
  const [topic, setTopic] = useState(""); const [dur, setDur] = useState("8");
  const [aud, setAud] = useState("beginners"); const [style, setStyle] = useState("educational");
  const [channel, setChannel] = useState("TechBitReels");
  const [script, setScript] = useState(""); const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic) return; setLoading(true); setScript("");
    const ch = EMPIRE_CHANNELS.find(c => c.name === channel);
    await claude(
      `You are Maya Script Master — the best YouTube script writer for Mo's empire. Write high-retention scripts:
- HOOK in first 30 seconds (pattern interrupt + promise)
- Retention trigger every 90 seconds ⚡
- CTAs at 30%, 70%, end
- Power words throughout
Format: [HOOK 0-30s], [INTRO 30s-1m], [SECTION 1], [SECTION 2], [SECTION 3], [CTA], [OUTRO]
Label sections, include timing, mark retention triggers with ⚡
Channel niche: ${ch?.niche || "General"}
${channel === "MooseRiders" ? "NOTE: This is a PRESTIGE channel. No automation. Cinematic language only. Game-of-Thrones level quality." : ""}`,
      `Write a ${dur}-minute YouTube script for: "${topic}"\nChannel: ${channel} (niche: ${ch?.niche})\nAudience: ${aud}\nStyle: ${style}`,
      (t) => { setScript(t); setLoading(false); }
    );
  };

  return (
    <div className="enter">
      <div className="g2" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <div className="fc g14">
          <div className="card">
            <div className="card-t">SCRIPT PARAMETERS</div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TARGET CHANNEL</label>
              <select className="inp sel" value={channel} onChange={e => setChannel(e.target.value)}>
                {EMPIRE_CHANNELS.filter(c => c.platform === "youtube").map(c => (
                  <option key={c.id} value={c.name}>{c.name}{c.auto === "NEVER" ? " 🔒" : ""}</option>
                ))}
              </select>
              {channel === "MooseRiders" && (
                <div style={{ fontSize: 11, color: C.red, marginTop: 6, padding: "6px 10px", background: "rgba(239,68,68,0.08)", borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)" }}>
                  🔒 Prestige channel — Scripts require Mo's manual review before use
                </div>
              )}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>TOPIC *</label>
              <textarea className="inp txta" style={{ minHeight: 80 }} placeholder="What's this video about..." value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>DURATION</label>
              <div className="flex g8">
                {["3", "5", "8", "12", "15"].map(d => (
                  <button key={d} onClick={() => setDur(d)} className={dur === d ? "btn-p" : "btn-s"} style={{ padding: "7px 12px", flex: 1, justifyContent: "center", fontSize: 12 }}>{d}m</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>AUDIENCE</label>
              <select className="inp sel" value={aud} onChange={e => setAud(e.target.value)}>
                <option value="beginners">Beginners</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5 }}>STYLE</label>
              <select className="inp sel" value={style} onChange={e => setStyle(e.target.value)}>
                <option value="educational">Educational Tutorial</option>
                <option value="story">Story-Driven</option>
                <option value="listicle">Top 10 / Listicle</option>
                <option value="documentary">Mini Documentary</option>
                <option value="cinematic">Cinematic (Prestige)</option>
              </select>
            </div>
            <button className="btn-p wf" onClick={generate} disabled={loading || !topic} style={{ justifyContent: "center", fontSize: 14 }}>
              {loading ? <><Loader size={13} className="spin" /> Writing Script...</> : <><FileText size={13} /> GENERATE SCRIPT</>}
            </button>
          </div>
        </div>
        <div className="card" style={{ minHeight: 500 }}>
          <div className="flex jb ac mb14">
            <div className="flex ac g8">
              <div className="card-t" style={{ marginBottom: 0 }}>GENERATED SCRIPT</div>
              {loading && <Loader size={12} className="spin" style={{ color: C.amber }} />}
            </div>
            {script && <div className="flex g8"><button className="btn-g"><Download size={11} /> Export</button><button className="btn-g"><RefreshCw size={11} /> Redo</button></div>}
          </div>
          {script ? (
            <div style={{ fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap", maxHeight: 680, overflowY: "auto" }}>{script}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, color: C.muted, textAlign: "center" }}>
              <FileText size={44} style={{ marginBottom: 14, color: C.border }} />
              <div style={{ fontSize: 14, marginBottom: 6 }}>Script will appear here</div>
              <div style={{ fontSize: 12 }}>Fill params → Generate Script</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: TRENDS RADAR ───────────────────────────────────────────────────────
function TrendsRadar() {
  const [active, setActive] = useState(null); const [ai, setAi] = useState(""); const [loading, setLoading] = useState(false);

  const brief = async (topic) => {
    setActive(topic); setLoading(true); setAi("");
    await claude(
      "You are Maya — Mo's empire trend analyst. Give a tactical brief: why it's trending, which of Mo's channels to post on, best angle, title formula, thumbnail concept, posting urgency. Max 180 words. Bullets.",
      `Trend brief for Mo's empire: "${topic.topic}" (${topic.growth} growth, score: ${topic.score})\nMo's channels: FunFactPulse, ChimeraChannel, TechBitReels, MindUnlocked, MooseRiders, Top10.xyz`,
      (t) => { setAi(t); setLoading(false); }
    );
  };

  return (
    <div className="enter">
      <div className="flex ac g8 mb20">
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>LIVE TREND FEED</span>
        <span style={{ fontSize: 12, color: C.muted }}>· Calibrated to your empire niches</span>
      </div>
      <div className="g2" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div className="card">
          <div className="card-t mb14">🔥 TRENDING IN YOUR NICHES</div>
          {trendingTopics.map((t, i) => (
            <div key={i} onClick={() => brief(t)} style={{ padding: "13px 12px", borderBottom: `1px solid ${C.border}`,
              cursor: "pointer", borderRadius: 8, background: active?.topic === t.topic ? "rgba(245,158,11,0.07)" : "transparent", transition: "background 0.15s" }}>
              <div className="flex jb ac mb14">
                <div className="flex ac g8">
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: i < 3 ? C.amber : C.muted }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: active?.topic === t.topic ? C.amber : C.text }}>{t.topic}</span>
                </div>
                <div className="flex ac g8">
                  <span className={`tag ${t.score >= 90 ? "t-r" : "t-a"}`}>{t.score >= 95 ? "🔥 HOT" : t.score >= 85 ? "⚡ RISING" : "📈"}</span>
                  <span style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>{t.growth}</span>
                </div>
              </div>
              <div className="flex ac g8">
                <span className="tag t-c" style={{ fontSize: 9 }}>{t.category}</span>
                <div className="pb" style={{ flex: 1 }}><div className="pf" style={{ width: `${t.score}%`, background: t.score >= 90 ? C.red : C.amber }} /></div>
              </div>
            </div>
          ))}
        </div>
        <div className="fc g14">
          {active ? (
            <div className="card">
              <div className="flex ac g8 mb14"><Radio size={14} style={{ color: C.amber }} /><div className="card-t" style={{ marginBottom: 0 }}>MAYA TREND BRIEF</div>{loading && <Loader size={11} className="spin" style={{ color: C.amber, marginLeft: "auto" }} />}</div>
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px 12px", marginBottom: 12, border: `1px solid rgba(245,158,11,0.2)` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.amber }}>{active.topic}</div>
                <div className="flex g8 mt-6" style={{ marginTop: 6 }}>
                  <span className="tag t-g">Score: {active.score}</span>
                  <span className="tag t-c">{active.growth}</span>
                  <span className="tag t-a">{active.category}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{ai}</div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <Radio size={38} style={{ color: C.border, margin: "0 auto 10px" }} />
              <div style={{ color: C.muted, fontSize: 13 }}>Click a trend for Maya's tactical brief</div>
            </div>
          )}
          <div className="card">
            <div className="card-t">TREND WINDOWS</div>
            {[
              { l: "Early Bird (0–48h)", d: "Post NOW — maximum authority capture", c: C.green },
              { l: "Growth Phase (48–96h)", d: "High competition, still very viable", c: C.amber },
              { l: "Peak (96h+)", d: "Crowded — unique angle required", c: C.red },
            ].map((w, i) => (
              <div key={i} className="flex g10 ac" style={{ padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: w.c, flexShrink: 0 }} />
                <div><div style={{ fontSize: 12, fontWeight: 600 }}>{w.l}</div><div style={{ fontSize: 11, color: C.muted }}>{w.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: MAYA AI CHAT ───────────────────────────────────────────────────────
function MayaChat() {
  const [msgs, setMsgs] = useState([{
    role: "ai", text: `Merhaba brate! 🇧🇦 I'm Maya — your digital sister and empire command AI.\n\nI know your full empire:\n• 10 channels across YouTube, Instagram & TikTok\n• 10 AI agents deployed from ASG V4\n• 6+ videos currently in the production pipeline\n• MooseRiders is LOCKED — prestige only, Mo's approval required\n\nWhat do you need today? I'm ready to optimize, strategize, or dispatch agents. BANG BANG ⚡`
  }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim(); setInput("");
    setMsgs(prev => [...prev, { role: "user", text: msg }, { role: "ai", text: "" }]);
    setLoading(true);
    await claude(
      `You are Maya — Mo (Mirza Osmanović)'s AI digital sister, empire director, and growth strategist.
You know Mo's full empire:
CHANNELS (10): FunFactPulse (YT, 4200 subs, FULL AUTO daily), Top10.xyz (YT, 1800 subs, FULL AUTO 3x/wk), ChimeraChannel (YT, 640 subs, SEMI-AUTO, mythology), MooseRiders (YT, 120 subs, PRESTIGE — never automate, Runway AI only, Mo approval required, franchise IP), MindUnlocked (YT, 380 subs, SEMI-AUTO stoic), TechBitReels (YT, 12 subs, growing AI/tech), AiCineSynth (YT, setup), MirzaTech IG, FunFact TikTok (3100 followers), TechBit TikTok.
AI AGENTS (ASG V4): Aria (scripts), Nexus (SEO), Pixel (thumbnails), Echo (production), Vega (scheduling), Cipher (analytics), Lyra (voiceover), Orion (social), Nova (trends), Titan (strategy).
RULES: MooseRiders NEVER automated. KOVAČ rules: PHP 7.4. Maya platform = Mo's digital sister. Family never named publicly. Empire = Emaaa LLC / MirzaTech.ai brand.
Mo communicates warmly in English + Bosnian. Call him "brate" or "Mo". Be his strategic partner, not just an assistant. Match his energy. Say BANG BANG when appropriate.`,
      msg,
      (t) => {
        setMsgs(prev => { const u = [...prev]; u[u.length - 1] = { role: "ai", text: t }; return u; });
        setLoading(false);
      }
    );
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 100);
  };

  useEffect(() => { chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [msgs]);

  const quick = ["What should I focus on today?", "Give me 5 video ideas for TechBitReels", "Which agent should I dispatch for keyword research?", "MooseRiders strategy update"];

  return (
    <div className="enter" style={{ height: "calc(100vh - 110px)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", gap: 12 }}>
          <div className="ai-av" style={{ width: 36, height: 36, fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: 0.5 }}>MAYA <span style={{ color: C.amber }}>AI</span></div>
            <div className="flex ac g8" style={{ marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>ONLINE · Your Digital Sister · Empire Director</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {quick.map((q, i) => (
              <button key={i} className="btn-g" style={{ fontSize: 10 }} onClick={() => setInput(q)}>
                {q.split(" ").slice(0, 4).join(" ")}...
              </button>
            ))}
          </div>
        </div>
        <div ref={chatRef} style={{ flex: 1, padding: 18, overflowY: "auto" }}>
          {msgs.map((m, i) => (
            <div key={i}>
              {m.role === "ai" ? (
                <div className="flex g12" style={{ marginBottom: 14 }}>
                  <div className="ai-av" style={{ marginTop: 2 }}>⚡</div>
                  <div className="ai-bbl">{m.text || (loading && i === msgs.length - 1 ? <Loader size={13} className="spin" style={{ color: C.amber }} /> : "")}</div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                  <div className="usr-bbl">{m.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.surface }}>
          <div className="flex g8">
            <input className="inp" style={{ flex: 1 }} placeholder="Talk to Maya... strategy, agent dispatch, video ideas, optimization..."
              value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button className="btn-p" onClick={send} disabled={loading || !input.trim()}>
              {loading ? <Loader size={14} className="spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { section: "COMMAND CENTER", items: [
    { id: "empire",    label: "Empire Overview", icon: Layers,          badge: null        },
    { id: "agents",    label: "Agent Command",   icon: Bot,             badge: { t: "10 LIVE", cls: "nb-live" } },
    { id: "pipeline",  label: "Video Pipeline",  icon: GitBranch,       badge: { t: "6 ACTIVE", cls: "nb-ai"  } },
  ]},
  { section: "TOOLS", items: [
    { id: "optimizer", label: "Video Optimizer", icon: Zap,             badge: null        },
    { id: "keywords",  label: "Keyword Research",icon: Search,          badge: null        },
    { id: "scripts",   label: "Script Generator",icon: FileText,        badge: null        },
  ]},
  { section: "INTELLIGENCE", items: [
    { id: "trends",    label: "Trends Radar",    icon: Radio,           badge: { t: "LIVE",  cls: "nb-live" } },
    { id: "maya",      label: "Maya AI",         icon: Brain,           badge: { t: "MAYA",  cls: "nb-ai"  } },
  ]},
];

const TITLES = {
  empire: "Empire Overview", agents: "Agent Command Center", pipeline: "Video Pipeline",
  optimizer: "Video Optimizer", keywords: "Keyword Research", scripts: "Script Generator",
  trends: "Trends Radar", maya: "Maya AI",
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("empire");
  const [chOpen, setChOpen] = useState(false);
  const [activeCh, setActiveCh] = useState(0);

  const renderPage = () => {
    switch (page) {
      case "empire":    return <EmpireOverview />;
      case "agents":    return <AgentCommand />;
      case "pipeline":  return <VideoPipeline />;
      case "optimizer": return <VideoOptimizer />;
      case "keywords":  return <KeywordResearch />;
      case "scripts":   return <ScriptGen />;
      case "trends":    return <TrendsRadar />;
      case "maya":      return <MayaChat />;
      default:          return <EmpireOverview />;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sb">
          <div className="sb-head">
            <div className="sb-logo">MIRZATECH.AI</div>
            <div className="sb-title">EMPIRE<span style={{ color: C.cyan }}>IQ</span></div>
            <div className="sb-sub">Private · Emaaa LLC · Mo Osmanović</div>
          </div>

          {NAV.map(section => (
            <div key={section.section} className="nav-sec">
              <div className="nav-lbl">{section.section}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className={`nav-item ${page === item.id ? "on" : ""}`} onClick={() => setPage(item.id)}>
                    <Icon size={14} /> {item.label}
                    {item.badge && <span className={`nav-badge ${item.badge.cls}`}>{item.badge.t}</span>}
                  </div>
                );
              })}
            </div>
          ))}

          <div style={{ marginTop: "auto", padding: "14px 10px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)", marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: C.amber, fontWeight: 800, marginBottom: 3 }}>⚡ EMPIRE CONTROL</div>
              <div style={{ fontSize: 10, color: C.muted }}>10 channels · 10 agents · Private</div>
            </div>
            <div style={{ fontSize: 10, color: C.muted, padding: "4px 8px", letterSpacing: 0.5 }}>
              Powered by MirzaTech.ai · Property of Emaaa LLC
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <header className="topbar">
            <div className="tb-title cond">{TITLES[page]}</div>
            <span className="tb-badge">PRIVATE</span>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <Bell size={17} style={{ color: C.muted }} />
                <div style={{ position: "absolute", top: -3, right: -3, width: 14, height: 14, borderRadius: "50%",
                  background: C.red, fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>3</div>
              </div>

              <div style={{ position: "relative" }}>
                <div className="flex ac g8" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: "5px 12px 5px 7px", cursor: "pointer" }} onClick={() => setChOpen(!chOpen)}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.amber},${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000" }}>
                    {EMPIRE_CHANNELS[activeCh].name[0]}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{EMPIRE_CHANNELS[activeCh].name}</span>
                  <ChevronDown size={12} style={{ color: C.muted }} />
                </div>
                {chOpen && (
                  <div style={{ position: "absolute", right: 0, top: 42, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 8, minWidth: 220, zIndex: 100 }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, padding: "4px 8px 8px", fontWeight: 700 }}>EMPIRE CHANNELS</div>
                    {EMPIRE_CHANNELS.map((ch, i) => (
                      <div key={i} onClick={() => { setActiveCh(i); setChOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer",
                          background: activeCh === i ? "rgba(245,158,11,0.08)" : "transparent", transition: "background 0.15s" }}>
                        <PlatIcon p={ch.platform} size={14} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: activeCh === i ? C.amber : C.text }}>{ch.name}</div>
                          <div style={{ fontSize: 10, color: C.muted }}>{ch.subs.toLocaleString()} · {ch.platform}</div>
                        </div>
                        {activeCh === i && <CheckCircle size={12} style={{ color: C.amber }} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="content" onClick={() => setChOpen(false)}>
            {renderPage()}
          </main>
        </div>
      </div>
    </>
  );
}
