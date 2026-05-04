import { useState } from "react";
import { Flame, Mic, Heart, Moon, Mail, Zap, DollarSign, TrendingUp, Users, Star, ChevronRight, ArrowRight, Lock, Globe, Sparkles, Coffee, BookOpen, Radio, Eye, Shield } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Syne+Mono&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #060409; }

  .port {
    font-family: 'Syne', sans-serif; min-height: 100vh;
    background: #060409; color: #ede8f5;
    background-image:
      radial-gradient(ellipse 80% 40% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 0% 100%, rgba(245,158,11,0.04) 0%, transparent 60%);
  }

  .hero { padding: 64px 40px 48px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .hero-eyebrow { font-family: 'Syne Mono', monospace; font-size: 11px; letter-spacing: 4px; color: rgba(139,92,246,0.8); margin-bottom: 20px; }
  .hero-title { font-family: 'Instrument Serif', serif; font-size: clamp(36px,5vw,64px); font-weight: 400; line-height: 1.1; margin-bottom: 16px; }
  .hero-title em { font-style: italic; color: #f59e0b; }
  .hero-sub { font-size: 16px; color: rgba(237,232,245,0.5); max-width: 560px; margin: 0 auto 32px; line-height: 1.6; }

  .stats-bar { display: flex; align-items: center; justify-content: center; gap: 40px; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-val { font-family: 'Syne Mono', monospace; font-size: 28px; font-weight: 700; color: #f59e0b; }
  .stat-lbl { font-size: 11px; color: rgba(237,232,245,0.4); letter-spacing: 1px; margin-top: 4px; }

  .products { padding: 48px 32px; max-width: 1100px; margin: 0 auto; }

  .section-label { font-family: 'Syne Mono', monospace; font-size: 10px; letter-spacing: 3px; color: rgba(237,232,245,0.3); margin-bottom: 32px; }

  .product-card {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px; margin-bottom: 24px; overflow: hidden;
    transition: border-color 0.3s;
  }
  .product-card:hover { border-color: rgba(255,255,255,0.14); }

  .pc-top {
    padding: 32px 36px 28px; display: flex; align-items: flex-start; gap: 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;
  }
  .pc-icon {
    width: 56px; height: 56px; border-radius: 14px; display: flex;
    align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0;
  }
  .pc-meta { flex: 1; min-width: 0; }
  .pc-number { font-family: 'Syne Mono', monospace; font-size: 10px; color: rgba(237,232,245,0.3); letter-spacing: 2px; margin-bottom: 6px; }
  .pc-name { font-family: 'Instrument Serif', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 400; margin-bottom: 8px; }
  .pc-tagline { font-size: 14px; color: rgba(237,232,245,0.55); line-height: 1.5; margin-bottom: 14px; }
  .pc-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .pc-tag { font-size: 10px; padding: 4px 10px; border-radius: 20px; font-weight: 600; letter-spacing: 0.5px; }

  .pc-revenue {
    display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;
  }
  .rev-val { font-family: 'Syne Mono', monospace; font-size: 22px; font-weight: 700; }
  .rev-lbl { font-size: 10px; color: rgba(237,232,245,0.4); letter-spacing: 1px; text-align: right; }
  .rev-timing { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; }

  .pc-body { padding: 28px 36px; }
  .pc-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .pc-col-title { font-size: 10px; letter-spacing: 2px; color: rgba(237,232,245,0.35); margin-bottom: 12px; font-family: 'Syne Mono', monospace; }
  .pc-item { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; font-size: 13px; color: rgba(237,232,245,0.75); line-height: 1.5; }
  .pc-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 7px; }

  .pricing-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .price-tier {
    flex: 1; min-width: 140px; padding: 16px; border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03);
  }
  .tier-name { font-size: 10px; letter-spacing: 2px; color: rgba(237,232,245,0.4); margin-bottom: 8px; font-family:'Syne Mono',monospace; }
  .tier-price { font-family: 'Syne Mono', monospace; font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  .tier-desc { font-size: 12px; color: rgba(237,232,245,0.5); line-height: 1.5; }

  .viral-bar { display: flex; align-items: center; gap: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
  .viral-label { font-size: 11px; color: rgba(237,232,245,0.4); font-family: 'Syne Mono', monospace; flex-shrink: 0; }
  .viral-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
  .viral-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
  .viral-score { font-family: 'Syne Mono', monospace; font-size: 13px; font-weight: 700; flex-shrink: 0; }

  .expand-btn { background: none; border: none; cursor: pointer; color: rgba(237,232,245,0.3); padding: 8px; margin-top: 4px; transition: color 0.2s; }
  .expand-btn:hover { color: rgba(237,232,245,0.7); }

  .build-banner {
    background: linear-gradient(135deg, rgba(245,158,11,0.08), rgba(139,92,246,0.08));
    border: 1px solid rgba(245,158,11,0.2); border-radius: 16px;
    padding: 28px 32px; display: flex; align-items: center; gap: 20px;
    margin-top: 40px; flex-wrap: wrap;
  }
  .build-text { flex: 1; min-width: 200px; }
  .build-title { font-family: 'Instrument Serif', serif; font-size: 22px; margin-bottom: 6px; }
  .build-sub { font-size: 13px; color: rgba(237,232,245,0.5); line-height: 1.5; }
  .build-btn { padding: 14px 28px; background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: #000; cursor: pointer; font-family: 'Syne', sans-serif; white-space: nowrap; transition: all 0.2s; }
  .build-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
`;

const PRODUCTS = [
  {
    id: "unsent",
    emoji: "✉️",
    name: "Unsent.ai",
    tagline: "Write the letters you'll never send. To your ex. Your father. Your younger self. Your dead grandmother. AI turns them into something beautiful — or burns them forever.",
    icon_bg: "#1a0a1e",
    accent: "#c084fc",
    monthly: "$180K",
    timing: "12-MO TARGET",
    timing_bg: "rgba(192,132,252,0.15)",
    timing_col: "#c084fc",
    viral: 97,
    viral_color: "#c084fc",
    tags: [
      { label: "VIRAL CONCEPT", bg: "rgba(192,132,252,0.12)", col: "#c084fc" },
      { label: "DAILY USE", bg: "rgba(34,197,94,0.1)", col: "#22c55e" },
      { label: "EMOTIONAL", bg: "rgba(239,68,68,0.1)", col: "#ef4444" },
    ],
    why: [
      "Unsent letters are already viral on TikTok — millions of people write them, this gives it a home",
      "The \"burn it\" mechanic creates FOMO and social sharing",
      "Grief, regret, love, anger — universal emotions = global market",
      "People come back daily. Sticky as a journal, viral as a meme",
    ],
    features: [
      "Recipient types: Ex, Parent, Deceased, Future Self, Past Self, Boss, God",
      "Transform into: poem, song, voice note script, short film",
      "Scheduled delivery (to yourself in 1 year)",
      "Community: Anonymous published letters wall",
      "Daily prompt: \"Write to someone today\"",
    ],
    pricing: [
      { name: "FREE", price: "$0", desc: "3 letters/mo, basic transform, burn always free" },
      { name: "SOUL", price: "$7/mo", desc: "Unlimited letters, all transforms, voice input, share cards" },
      { name: "LEGACY", price: "$19/mo", desc: "Archive, scheduled delivery, printed letter book annually" },
    ],
  },
  {
    id: "ancestor",
    emoji: "🌿",
    name: "AncestorAI",
    tagline: "Record your grandmother's stories before they're gone forever. AI transforms family memories into illustrated books, audio memoirs, and living archives your children can talk to.",
    icon_bg: "#0f1a0a",
    accent: "#86efac",
    monthly: "$240K",
    timing: "18-MO TARGET",
    timing_bg: "rgba(134,239,172,0.12)",
    timing_col: "#86efac",
    viral: 91,
    viral_color: "#86efac",
    tags: [
      { label: "GENERATIONAL", bg: "rgba(134,239,172,0.1)", col: "#86efac" },
      { label: "BLUE OCEAN", bg: "rgba(59,130,246,0.1)", col: "#60a5fa" },
      { label: "GIFT MARKET", bg: "rgba(245,158,11,0.1)", col: "#f59e0b" },
    ],
    why: [
      "Every family has stories that die when elders die — 100% of humans feel this fear",
      "\"I wish I had recorded my grandmother\" is one of the most shared sentiments on earth",
      "Gift market: people will pay $200+ for a grandfather's memoir as a Christmas gift",
      "Mo's Nana Fatima Zmaj story is the PERFECT demo — it sells itself",
    ],
    features: [
      "Voice recording → AI transcribes and beautifies into narrative prose",
      "Photo upload → AI generates illustrated storybook pages",
      "\"Living Memorial\" — chat with an AI trained on the person's stories",
      "Annual printed hardcover memoir shipped to family",
      "Multi-generation family tree with story nodes",
    ],
    pricing: [
      { name: "STORY", price: "$12/mo", desc: "3 recordings/mo, text memoir, family sharing" },
      { name: "LEGACY", price: "$29/mo", desc: "Unlimited, illustrated book, living memorial AI" },
      { name: "GIFT BOX", price: "$149 one-time", desc: "Printed hardcover memoir, framed cover, shipped" },
    ],
  },
  {
    id: "dreamforge",
    emoji: "🌙",
    name: "DreamForge",
    tagline: "Voice memo your dream when you wake up. AI turns it into a short film script, a song, an illustrated story, or a psychological insight report. Your subconscious is a goldmine.",
    icon_bg: "#07080f",
    accent: "#818cf8",
    monthly: "$95K",
    timing: "6-MO TARGET",
    timing_bg: "rgba(129,140,248,0.12)",
    timing_col: "#818cf8",
    viral: 88,
    viral_color: "#818cf8",
    tags: [
      { label: "FAST TO BUILD", bg: "rgba(34,197,94,0.1)", col: "#22c55e" },
      { label: "DAILY RITUAL", bg: "rgba(245,158,11,0.1)", col: "#f59e0b" },
      { label: "WEIRD = VIRAL", bg: "rgba(239,68,68,0.1)", col: "#ef4444" },
    ],
    why: [
      "Dream journaling is a huge existing habit — no app does it with AI this way",
      "\"My dream became a movie script\" is social media gold — people share outputs constantly",
      "Builds a dataset of your dream patterns over time — becomes more valuable the longer you use it",
      "Morning ritual apps (Headspace, etc.) are billion-dollar businesses",
    ],
    features: [
      "30-second voice memo on wake → instant AI processing",
      "Output: film script, song, short story, or psych insight",
      "Dream pattern tracking: recurring symbols, emotions, people",
      "Weekly dream report: \"Your subconscious this week\"",
      "Community: Anonymous dream wall (wildly viral)",
    ],
    pricing: [
      { name: "DREAMER", price: "$0", desc: "3 dreams/mo, basic transform" },
      { name: "DEEP SLEEP", price: "$6/mo", desc: "Unlimited, all formats, pattern tracking" },
      { name: "ORACLE", price: "$14/mo", desc: "+ Weekly report, dream library export, community" },
    ],
  },
  {
    id: "rageroom",
    emoji: "🔥",
    name: "RageRoom.ai",
    tagline: "Type your absolute worst. The thoughts you can't say out loud. AI processes your rage into metal lyrics, a diss track, a letter you'll never send — or burns it completely.",
    icon_bg: "#180808",
    accent: "#f87171",
    monthly: "$110K",
    timing: "8-MO TARGET",
    timing_bg: "rgba(248,113,113,0.12)",
    timing_col: "#f87171",
    viral: 99,
    viral_color: "#f87171",
    tags: [
      { label: "🔥 HIGHEST VIRAL", bg: "rgba(239,68,68,0.12)", col: "#ef4444" },
      { label: "GEN Z MARKET", bg: "rgba(192,132,252,0.1)", col: "#c084fc" },
      { label: "MENTAL HEALTH", bg: "rgba(34,197,94,0.1)", col: "#22c55e" },
    ],
    why: [
      "People have no safe place for their ugliest thoughts — this IS that place",
      "The burn mechanic makes it safe + creates massive emotional relief (people will evangelize it)",
      "\"Turn my rage into a diss track\" is TikTok gold — the outputs will go viral constantly",
      "Mental health angle = press coverage, therapist recommendations, B2B to clinics",
    ],
    features: [
      "Rage modes: Vent, Destroy, Transform, Burn",
      "Transform into: metal lyrics, rap diss track, dark poetry, letter, comedy roast",
      "Rage meter: visual intensity tracker, anonymous national rage map",
      "\"Cool down\" mode: AI walks you back from the edge after processing",
      "Anonymous community: rage posts without identity (like PostSecret)",
    ],
    pricing: [
      { name: "FREE RAGE", price: "$0", desc: "5 rages/mo, burn always free" },
      { name: "UNLEASHED", price: "$8/mo", desc: "Unlimited, all transforms, community" },
      { name: "THERAPY PRO", price: "$49/mo", desc: "B2B — clinics use it for patient emotional processing" },
    ],
  },
  {
    id: "thousand",
    emoji: "📅",
    name: "1000 Days",
    tagline: "One truth. Every day. After 30 days, AI writes your chapter. After 365, your year becomes a book. After 1000 days, you have a memoir no ghostwriter could match.",
    icon_bg: "#0a0a08",
    accent: "#fbbf24",
    monthly: "$320K",
    timing: "24-MO TARGET",
    timing_bg: "rgba(251,191,36,0.12)",
    timing_col: "#fbbf24",
    viral: 84,
    viral_color: "#fbbf24",
    tags: [
      { label: "HIGHEST LTV", bg: "rgba(245,158,11,0.12)", col: "#f59e0b" },
      { label: "IMPOSSIBLE CHURN", bg: "rgba(34,197,94,0.1)", col: "#22c55e" },
      { label: "TRUST AT SCALE", bg: "rgba(59,130,246,0.1)", col: "#60a5fa" },
    ],
    why: [
      "Day streaks create the strongest retention loop in apps — people do NOT cancel when they're on day 400",
      "The longer someone uses it, the MORE valuable their data becomes to them — anti-churn by design",
      "The output (a real memoir) has $200+ perceived value — justifies premium pricing",
      "\"Building my memoir\" is a daily identity — people post their streak publicly",
    ],
    features: [
      "Daily single-sentence or paragraph truth entry (60 seconds max)",
      "AI auto-compiles: 30-day chapter, 90-day arc, yearly volume",
      "Streak system with beautiful milestones: Day 7, 30, 100, 365, 1000",
      "Annual printed memoir option — hardcover shipped to door",
      "Family sharing: your children see your 1000-day memoir when you're gone",
    ],
    pricing: [
      { name: "FREE", price: "$0", desc: "Unlimited entries, basic AI chapter every 90 days" },
      { name: "AUTHOR", price: "$9/mo", desc: "Monthly chapters, year book, share cards, voice entry" },
      { name: "LEGACY", price: "$19/mo", desc: "+ Annual printed book, family sharing, forever archive" },
    ],
  },
  {
    id: "voicevault",
    emoji: "🎙️",
    name: "VoiceVault",
    tagline: "Every entrepreneur's best ideas live in voice memos nobody ever processes. VoiceVault turns your voice memos into structured business plans, content calendars, or capital-ready pitches.",
    icon_bg: "#060f0f",
    accent: "#22d3ee",
    monthly: "$280K",
    timing: "10-MO TARGET",
    timing_bg: "rgba(34,211,238,0.1)",
    timing_col: "#22d3ee",
    viral: 79,
    viral_color: "#22d3ee",
    tags: [
      { label: "B2B GOLD", bg: "rgba(34,211,238,0.1)", col: "#22d3ee" },
      { label: "ENTREPRENEUR", bg: "rgba(245,158,11,0.1)", col: "#f59e0b" },
      { label: "DAILY VALUE", bg: "rgba(34,197,94,0.1)", col: "#22c55e" },
    ],
    why: [
      "Every founder/creator has 100s of unprocessed voice memos — this is a real daily pain",
      "Direct competitor to Otter.ai but with AI ACTION instead of just transcription",
      "B2B: agencies, content teams, VCs pay $100+/mo per seat without blinking",
      "Mo's own empire uses this — dogfood it, testimonial is instant",
    ],
    features: [
      "Upload any voice memo — AI extracts: ideas, action items, business concepts",
      "\"Mo Mode\": optimized for content creators (extracts video ideas, channel strategies)",
      "Output formats: business plan, pitch deck outline, content calendar, tweet thread",
      "Connect to Notion, Google Docs, email auto-send to team",
      "Weekly \"Genius Report\" — your best ideas from the week, organized",
    ],
    pricing: [
      { name: "SOLO", price: "$12/mo", desc: "20 memos/mo, all output formats" },
      { name: "FOUNDER", price: "$29/mo", desc: "Unlimited, team sharing, integrations" },
      { name: "AGENCY", price: "$99/mo", desc: "10 seats, white-label, custom outputs, API" },
    ],
  },
];

function ProductCard({ p, idx }) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <div className="product-card" style={{ borderColor: open ? p.accent + "30" : undefined }}>
      <div className="pc-top" onClick={() => setOpen(!open)}>
        <div className="pc-icon" style={{ background: p.icon_bg, border: `1px solid ${p.accent}25` }}>
          {p.emoji}
        </div>
        <div className="pc-meta">
          <div className="pc-number">PRODUCT {String(idx + 1).padStart(2, "0")} / 06</div>
          <div className="pc-name" style={{ color: p.accent }}>{p.name}</div>
          <div className="pc-tagline">{p.tagline}</div>
          <div className="pc-tags">
            {p.tags.map((t, i) => (
              <span key={i} className="pc-tag" style={{ background: t.bg, color: t.col, border: `1px solid ${t.col}30` }}>{t.label}</span>
            ))}
          </div>
        </div>
        <div className="pc-revenue">
          <div>
            <div className="rev-val" style={{ color: p.accent }}>{p.monthly}</div>
            <div className="rev-lbl">EST. MONTHLY</div>
          </div>
          <span className="rev-timing" style={{ background: p.timing_bg, color: p.timing_col, border: `1px solid ${p.accent}25` }}>
            {p.timing}
          </span>
          <button className="expand-btn" style={{ color: open ? p.accent : undefined }}>
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {open && (
        <div className="pc-body">
          <div className="pc-grid">
            <div>
              <div className="pc-col-title">WHY IT SELLS</div>
              {p.why.map((w, i) => (
                <div key={i} className="pc-item">
                  <div className="pc-dot" style={{ background: p.accent }} />
                  <span>{w}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="pc-col-title">KEY FEATURES</div>
              {p.features.map((f, i) => (
                <div key={i} className="pc-item">
                  <div className="pc-dot" style={{ background: "rgba(237,232,245,0.3)" }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="pc-col-title">PRICING TIERS</div>
              <div className="pricing-row" style={{ flexDirection: "column", gap: 8 }}>
                {p.pricing.map((tier, i) => (
                  <div key={i} className="price-tier" style={{ borderColor: i === 1 ? p.accent + "40" : undefined, background: i === 1 ? p.accent + "08" : undefined }}>
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-price" style={{ color: i === 1 ? p.accent : "#ede8f5" }}>{tier.price}</div>
                    <div className="tier-desc">{tier.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="viral-bar">
            <div className="viral-label">VIRAL POTENTIAL</div>
            <div className="viral-track">
              <div className="viral-fill" style={{ width: p.viral + "%", background: `linear-gradient(90deg, ${p.accent}88, ${p.accent})` }} />
            </div>
            <div className="viral-score" style={{ color: p.accent }}>{p.viral}/100</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Portfolio() {
  const totalMonthly = 1225; // $1.225M combined target

  return (
    <>
      <style>{CSS}</style>
      <div className="port">
        <div className="hero">
          <div className="hero-eyebrow">EMAAA LLC · MIRZATECH.AI · PRIVATE PRODUCT PORTFOLIO</div>
          <h1 className="hero-title">
            Six Products.<br />
            <em>One Financial Empire.</em>
          </h1>
          <p className="hero-sub">
            Each built on emotion, trust, and daily ritual. Each designed to be impossible to quit. 
            Truth Engine is Product #0 — this is the rest of the lineup.
          </p>
          <div className="stats-bar">
            {[
              { val: "6", lbl: "PRODUCTS" },
              { val: "$1.2M+", lbl: "COMBINED MO. TARGET" },
              { val: "99/100", lbl: "PEAK VIRAL SCORE" },
              { val: "DAILY", lbl: "RITUAL DESIGN" },
            ].map((s, i) => (
              <div key={i} className="stat">
                <div className="stat-val">{s.val}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="products">
          <div className="section-label">FINANCIAL PRODUCT PORTFOLIO — SORTED BY VIRAL POTENTIAL</div>
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} idx={i} />)}

          <div className="build-banner">
            <div style={{ fontSize: 32 }}>⚡</div>
            <div className="build-text">
              <div className="build-title">Truth Engine is Product Zero.</div>
              <div className="build-sub">
                All 6 share the same DNA: emotion → transformation → trust. They can cross-promote each other, share one brand umbrella, and funnel into each other. Build in this order: Truth Engine → Unsent.ai → RageRoom → DreamForge → VoiceVault → 1000 Days → AncestorAI.
              </div>
            </div>
            <button className="build-btn">Build Next Product →</button>
          </div>
        </div>
      </div>
    </>
  );
}
