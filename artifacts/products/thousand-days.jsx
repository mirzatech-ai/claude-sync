import { useState, useEffect } from "react";
import { ArrowLeft, Plus, BookOpen, Share2, Copy, Check, Loader, Flame, Star, Calendar, Sparkles, ChevronRight, Award, Heart } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #08070a; min-height: 100%; }

  .td { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #08070a; color: #ede8e0;
    background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(180,140,60,0.07) 0%, transparent 60%); }
  .lb { font-family: 'Libre Baskerville', serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* ── Layout ── */
  .shell { display: flex; height: 100vh; overflow: hidden; }
  .left { width: 280px; background: #0c0b0f; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; flex-shrink: 0; }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── Brand ── */
  .brand { padding: 20px 18px 16px; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .brand-name { font-family: 'Libre Baskerville', serif; font-size: 20px; font-weight: 700;
    background: linear-gradient(135deg, #ede8e0, #c8a84a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand-tagline { font-size: 10px; letter-spacing: 2px; color: rgba(237,232,224,0.35); margin-top: 3px; }

  /* ── Streak ── */
  .streak-box { padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: center; }
  .streak-num { font-family: 'DM Mono', monospace; font-size: 52px; font-weight: 700; line-height: 1;
    background: linear-gradient(135deg, #f59e0b, #c8a84a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .streak-lbl { font-size: 10px; letter-spacing: 3px; color: rgba(237,232,224,0.35); margin-top: 4px; }
  .progress-wrap { margin-top: 12px; }
  .progress-to { display: flex; justify-content: space-between; font-size: 10px; color: rgba(237,232,224,0.3); margin-bottom: 6px; font-family: 'DM Mono', monospace; }
  .p-track { height: 5px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
  .p-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #f59e0b, #c8a84a); transition: width 0.8s; }

  /* ── Entry list ── */
  .entry-list { flex: 1; overflow-y: auto; padding: 8px 0; }
  .entry-list::-webkit-scrollbar { width: 3px; }
  .entry-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }
  .entry-item { padding: 10px 18px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .entry-item:hover { background: rgba(255,255,255,0.03); }
  .entry-item.active { background: rgba(200,168,74,0.07); }
  .ei-day { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(200,168,74,0.7); margin-bottom: 3px; }
  .ei-preview { font-size: 12px; color: rgba(237,232,224,0.5); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* ── Milestones ── */
  .milestones { padding: 12px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
  .ms-label { font-size: 10px; letter-spacing: 2px; color: rgba(237,232,224,0.3); margin-bottom: 10px; }
  .ms-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .ms-badge { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; border: 1px solid; }
  .ms-locked { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: rgba(237,232,224,0.25); }
  .ms-unlocked { background: rgba(200,168,74,0.1); border-color: rgba(200,168,74,0.3); color: #c8a84a; }

  /* ── Write area ── */
  .write-area { flex: 1; display: flex; flex-direction: column; padding: 40px; overflow-y: auto; }
  .write-area::-webkit-scrollbar { width: 4px; }
  .write-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }
  .wa-day { font-family: 'DM Mono', monospace; font-size: 12px; color: rgba(200,168,74,0.5); letter-spacing: 2px; margin-bottom: 8px; }
  .wa-date { font-family: 'Libre Baskerville', serif; font-size: 30px; font-weight: 700; margin-bottom: 6px; }
  .wa-prompt { font-family: 'Libre Baskerville', serif; font-style: italic; font-size: 16px; color: rgba(237,232,224,0.35); margin-bottom: 32px; border-left: 2px solid rgba(200,168,74,0.3); padding-left: 16px; }
  .wa-ta { width: 100%; min-height: 180px; background: transparent; border: none; outline: none; resize: none; font-family: 'Libre Baskerville', serif; font-size: 19px; line-height: 1.85; color: #ede8e0; caret-color: #c8a84a; max-width: 700px; }
  .wa-ta::placeholder { color: rgba(237,232,224,0.2); font-style: italic; }
  .wa-footer { margin-top: 24px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; max-width: 700px; }
  .char-count { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(237,232,224,0.25); }

  /* ── Chapter screen ── */
  .chapter-screen { flex: 1; padding: 40px; overflow-y: auto; }
  .chapter-screen::-webkit-scrollbar { width: 4px; }
  .chapter-screen::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); }
  .ch-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px; color: rgba(200,168,74,0.5); margin-bottom: 16px; }
  .ch-title { font-family: 'Libre Baskerville', serif; font-size: 32px; font-weight: 700; margin-bottom: 8px; color: #c8a84a; }
  .ch-period { font-size: 13px; color: rgba(237,232,224,0.35); margin-bottom: 32px; }
  .ch-body { font-family: 'Libre Baskerville', serif; font-size: 18px; line-height: 2; white-space: pre-wrap; color: rgba(237,232,224,0.88); max-width: 680px; }

  /* Stats bar */
  .stats-bar { height: 46px; background: #0c0b0f; border-bottom: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; padding: 0 40px; gap: 28px; flex-shrink: 0; }
  .stat { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(237,232,224,0.35); }
  .stat span { color: #c8a84a; }

  .btn-p { display: inline-flex; align-items: center; gap: 7px; padding: 10px 20px; background: linear-gradient(135deg, #c8a84a, #a08030); border: none; border-radius: 9px; font-size: 13px; font-weight: 700; color: #1a1408; cursor: pointer; transition: all 0.2s; }
  .btn-p:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,168,74,0.3); }
  .btn-p:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-s { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; font-size: 12px; font-weight: 600; color: rgba(237,232,224,0.5); cursor: pointer; transition: all 0.2s; }
  .btn-s:hover { border-color: rgba(200,168,74,0.4); color: #c8a84a; }
  .tab-btn { padding: 8px 16px; background: transparent; border: none; font-size: 13px; font-weight: 500; cursor: pointer; color: rgba(237,232,224,0.4); border-bottom: 2px solid transparent; transition: all 0.15s; }
  .tab-btn.on { color: #c8a84a; border-bottom-color: #c8a84a; }
  .act { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; border: 1px solid; }
  .a-p { background: rgba(200,168,74,0.08); border-color: rgba(200,168,74,0.25); color: #c8a84a; }
  .a-c { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); color: rgba(237,232,224,0.45); }
  .a-s { background: rgba(34,197,94,0.07); border-color: rgba(34,197,94,0.2); color: #22c55e; }
  .enter { animation: up 0.22s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .footer-law { padding: 8px 18px; font-size: 9px; color: rgba(237,232,224,0.2); border-top: 1px solid rgba(255,255,255,0.05); text-align: center; letter-spacing: 0.5px; }
`;

const PROMPTS = [
  "What truth did today teach you?",
  "What are you afraid to admit right now?",
  "What moment today will you remember in 10 years?",
  "Write one thing you're grateful for and one thing you're not.",
  "What would your future self want you to know today?",
  "Describe today in three words. Now expand the most interesting one.",
  "What did you want today that you didn't let yourself have?",
  "What conversation do you keep replaying in your head?",
  "What are you becoming?",
  "Write the thing you would never say out loud.",
];

const MILESTONES = [
  { days: 7,    label: "7 Days",     emoji: "🌱" },
  { days: 30,   label: "30 Days",    emoji: "📖" },
  { days: 100,  label: "100 Days",   emoji: "⭐" },
  { days: 365,  label: "1 Year",     emoji: "🏆" },
  { days: 1000, label: "1000 Days",  emoji: "👑" },
];

async function callClaude(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true, system, messages: [{ role: "user", content: user }] }),
  });
  const reader = res.body.getReader(); const dec = new TextDecoder(); let text = "";
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) { try { const j = JSON.parse(line.slice(6)); if (j.type === "content_block_delta" && j.delta?.text) { text += j.delta.text; onChunk(text); } } catch {} }
    }
  }
  return text;
}

const TODAY = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
const PROMPT = PROMPTS[new Date().getDay() % PROMPTS.length];

const SAMPLE_ENTRIES = [
  { day: 1, date: "Day 1", text: "Today I decided to start. That's the whole truth — I decided, and I actually did it. Most days I decide and don't. This one counts." },
  { day: 2, date: "Day 2", text: "I'm more tired than I want to admit. Not body tired. Soul tired. The kind that sleep doesn't fix." },
  { day: 3, date: "Day 3", text: "Something small made me happy today. I noticed it, which is new." },
];

export default function ThousandDays() {
  const [entries, setEntries] = useState(SAMPLE_ENTRIES);
  const [todayText, setTodayText] = useState("");
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("write"); // write | entries | chapter
  const [chapter, setChapter] = useState(""); const [chapterLoading, setChapterLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const streak = entries.length;
  const nextMilestone = MILESTONES.find(m => m.days > streak) || MILESTONES[MILESTONES.length - 1];
  const progress = (streak / nextMilestone.days) * 100;

  const saveEntry = () => {
    if (!todayText.trim()) return;
    const newEntry = { day: streak + 1, date: `Day ${streak + 1}`, text: todayText.trim() };
    setEntries(prev => [...prev, newEntry]);
    setTodayText(""); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const generateChapter = async () => {
    setChapterLoading(true); setChapter(""); setTab("chapter");
    const recent = entries.slice(-10).map(e => `Day ${e.day}: "${e.text}"`).join("\n\n");
    await callClaude(
      "You are 1000 Days' literary architect. Transform a series of daily truth entries into a beautiful memoir chapter. Use literary prose. Find the emotional arc across the entries. Give the chapter a title. Make it feel like published memoir — something between Cheryl Strayed and David Sedaris. Start with a powerful opening line.",
      `Transform these daily truth entries into a memoir chapter:\n\n${recent}\n\n Current streak: Day ${streak}. Write a compelling chapter from these truths.`,
      (t) => { setChapter(t); setChapterLoading(false); }
    );
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="td">
        <div className="shell">
          {/* LEFT */}
          <aside className="left">
            <div className="brand">
              <div className="brand-name">1000 Days</div>
              <div className="brand-tagline">ONE TRUTH. EVERY DAY. FOREVER.</div>
            </div>

            <div className="streak-box">
              <div className="streak-num">{streak}</div>
              <div className="streak-lbl">DAY STREAK 🔥</div>
              <div className="progress-wrap">
                <div className="progress-to">
                  <span>Toward {nextMilestone.emoji} {nextMilestone.label}</span>
                  <span>{nextMilestone.days - streak} days left</span>
                </div>
                <div className="p-track"><div className="p-fill" style={{ width: Math.min(100, progress) + "%" }} /></div>
              </div>
            </div>

            <div className="entry-list">
              {[...entries].reverse().map((e, i) => (
                <div key={i} className="entry-item" onClick={() => setTab("entries")}>
                  <div className="ei-day">{e.date}</div>
                  <div className="ei-preview">{e.text}</div>
                </div>
              ))}
            </div>

            <div className="milestones">
              <div className="ms-label">MILESTONES</div>
              <div className="ms-row">
                {MILESTONES.map(m => (
                  <div key={m.days} className={`ms-badge ${streak >= m.days ? "ms-unlocked" : "ms-locked"}`}>
                    {m.emoji} {m.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-law">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
          </aside>

          {/* MAIN */}
          <div className="main">
            <div className="stats-bar">
              <div className="stat"><span>{streak}</span> entries written</div>
              <div className="stat"><span>{entries.reduce((a, e) => a + e.text.split(" ").length, 0)}</span> words of truth</div>
              <div className="stat"><span>{Math.round((streak / 1000) * 100)}%</span> to 1000 days</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 0 }}>
                {["write", "entries", "chapter"].map(t => (
                  <button key={t} className={`tab-btn ${tab === t ? "on" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t === "chapter" ? "📖 My Chapter" : t === "write" ? "✍️ Today" : "📅 All Entries"}</button>
                ))}
              </div>
            </div>

            {tab === "write" && (
              <div className="write-area enter">
                <div className="wa-day mono">DAY {streak + 1} · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}</div>
                <div className="wa-date lb">{TODAY.split(",")[0]}</div>
                <div className="wa-prompt lb">"{PROMPT}"</div>
                <textarea className="wa-ta lb" placeholder="Write your truth for today. One sentence or a thousand words — it all counts."
                  value={todayText} onChange={e => setTodayText(e.target.value)} />
                <div className="wa-footer">
                  <button className="btn-p" onClick={saveEntry} disabled={!todayText.trim()}>
                    {saved ? <><Check size={13} /> Saved! Day {streak}</> : <><Plus size={13} /> Save Today's Truth</>}
                  </button>
                  {entries.length >= 3 && (
                    <button className="btn-s" onClick={generateChapter}>
                      <BookOpen size={12} /> Generate Chapter
                    </button>
                  )}
                  <span className="char-count mono">{todayText.length} chars</span>
                </div>
                {saved && (
                  <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, fontSize: 13, color: "#22c55e", maxWidth: 700 }} className="enter">
                    🔥 Day {streak} complete! {streak >= 7 ? "You're building something real." : "Keep going — the habit is forming."}
                  </div>
                )}
              </div>
            )}

            {tab === "entries" && (
              <div className="write-area enter">
                <div style={{ maxWidth: 700 }}>
                  <div className="wa-day mono" style={{ marginBottom: 20 }}>ALL {entries.length} ENTRIES</div>
                  {[...entries].reverse().map((e, i) => (
                    <div key={i} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="mono" style={{ fontSize: 11, color: "rgba(200,168,74,0.6)", marginBottom: 8 }}>{e.date}</div>
                      <div className="lb" style={{ fontSize: 18, lineHeight: 1.8, color: "rgba(237,232,224,0.85)" }}>{e.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "chapter" && (
              <div className="chapter-screen enter">
                <div className="ch-label">YOUR MEMOIR CHAPTER · AI GENERATED</div>
                {chapterLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(237,232,224,0.4)", fontSize: 14, marginBottom: 24 }}>
                    <Loader size={14} className="spin" style={{ color: "#c8a84a" }} /> Writing your chapter...
                  </div>
                )}
                {chapter ? (
                  <>
                    <div className="ch-title lb">{chapter.match(/(?:CHAPTER|TITLE)[:\s"]+([^\n"]+)/i)?.[1] || "Your Story So Far"}</div>
                    <div className="ch-period" style={{ marginBottom: 28 }}>Days 1 – {streak}</div>
                    <div className="ch-body lb">{chapter}</div>
                    <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                      <button className="act a-s"><Share2 size={12} /> Share Chapter</button>
                      <button className="act a-c" onClick={() => { navigator.clipboard.writeText(chapter); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                      <button className="act a-p" onClick={generateChapter}><BookOpen size={12} /> Regenerate</button>
                    </div>
                  </>
                ) : !chapterLoading && (
                  <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(237,232,224,0.3)" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📖</div>
                    <div className="lb" style={{ fontSize: 22, color: "rgba(237,232,224,0.6)", marginBottom: 8 }}>Your chapter awaits</div>
                    <div style={{ fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Write at least 3 entries, then AI will compile them<br />into a beautiful memoir chapter.</div>
                    {entries.length >= 3 && <button className="btn-p" onClick={generateChapter}><BookOpen size={13} /> Generate My Chapter</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
