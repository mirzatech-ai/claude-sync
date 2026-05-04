import { useState, useRef } from "react";
import { Mic, Upload, FileText, Calendar, DollarSign, Zap, Brain, ArrowLeft, Share2, Copy, Check, Download, Loader, Plus, Sparkles, ChevronRight, BarChart2, Target, Layers, RefreshCw, CheckCircle, Clock, Star } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #050a0d; min-height: 100%; }

  .vv { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #050a0d; color: #e4f0f5;
    background-image: radial-gradient(ellipse 60% 40% at 50% -5%, rgba(14,116,144,0.12) 0%, transparent 60%); }
  .syne { font-family: 'Syne', sans-serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* ── Layout ── */
  .shell { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 260px; background: #070e12; border-right: 1px solid rgba(14,116,144,0.15); display: flex; flex-direction: column; flex-shrink: 0; }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── Brand ── */
  .brand { padding: 22px 18px 16px; border-bottom: 1px solid rgba(14,116,144,0.15); }
  .brand-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #e4f0f5, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand-sub { font-size: 10px; letter-spacing: 2.5px; color: rgba(34,211,238,0.4); margin-top: 3px; }
  .brand-tag { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; padding: 4px 10px; border-radius: 20px; background: rgba(34,211,238,0.08); color: rgba(34,211,238,0.7); border: 1px solid rgba(34,211,238,0.15); margin-top: 8px; }

  /* ── Vault list ── */
  .vault-list { flex: 1; overflow-y: auto; }
  .vault-list::-webkit-scrollbar { width: 3px; }
  .vault-list::-webkit-scrollbar-thumb { background: rgba(14,116,144,0.2); }
  .vl-section { padding: 12px 16px 4px; }
  .vl-label { font-size: 10px; letter-spacing: 2px; color: rgba(228,240,245,0.3); font-family: 'DM Mono', monospace; margin-bottom: 8px; }
  .vault-item { padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; align-items: flex-start; gap: 10px; }
  .vault-item:hover { background: rgba(14,116,144,0.06); }
  .vault-item.active { background: rgba(34,211,238,0.07); }
  .vi-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.15); }
  .vi-title { font-size: 12px; font-weight: 600; color: rgba(228,240,245,0.8); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .vi-meta { font-size: 10px; color: rgba(228,240,245,0.3); font-family: 'DM Mono', monospace; }

  /* ── Stats ── */
  .sidebar-stats { padding: 14px 16px; border-top: 1px solid rgba(14,116,144,0.15); }
  .ss-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .ss-item { background: rgba(14,116,144,0.08); border: 1px solid rgba(14,116,144,0.15); border-radius: 8px; padding: 9px 10px; }
  .ss-val { font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 700; color: #22d3ee; }
  .ss-lbl { font-size: 9px; color: rgba(228,240,245,0.3); letter-spacing: 1.5px; margin-top: 2px; }

  /* ── Topbar ── */
  .topbar { height: 50px; background: #070e12; border-bottom: 1px solid rgba(14,116,144,0.15); display: flex; align-items: center; padding: 0 28px; gap: 12px; flex-shrink: 0; }
  .tb-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; }

  /* ── Input area ── */
  .input-area { flex: 1; padding: 36px 40px; overflow-y: auto; }
  .input-area::-webkit-scrollbar { width: 4px; }
  .input-area::-webkit-scrollbar-thumb { background: rgba(14,116,144,0.2); }

  .input-card { background: rgba(7,14,18,0.95); border: 1px solid rgba(14,116,144,0.2); border-radius: 16px; padding: 28px; margin-bottom: 20px; max-width: 760px; position: relative; overflow: hidden; }
  .input-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #0e7490, #22d3ee, #0e7490); }
  .ic-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 6px; }
  .ic-sub { font-size: 12px; color: rgba(228,240,245,0.4); margin-bottom: 20px; line-height: 1.5; }
  .inp { width: 100%; background: rgba(5,10,13,0.8); border: 1px solid rgba(14,116,144,0.2); border-radius: 9px; padding: 12px 14px; font-size: 14px; color: #e4f0f5; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .inp:focus { border-color: #22d3ee; }
  .txta { resize: vertical; min-height: 140px; line-height: 1.7; }

  /* Output type grid */
  .out-types { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .ot-card { padding: 16px 12px; border-radius: 12px; border: 1px solid rgba(14,116,144,0.15); background: rgba(14,116,144,0.04); cursor: pointer; text-align: center; transition: all 0.2s; }
  .ot-card:hover, .ot-card.on { border-color: rgba(34,211,238,0.4); background: rgba(34,211,238,0.07); }
  .ot-emoji { font-size: 24px; margin-bottom: 8px; }
  .ot-name { font-size: 12px; font-weight: 700; color: rgba(228,240,245,0.8); margin-bottom: 3px; }
  .ot-desc { font-size: 10px; color: rgba(228,240,245,0.3); line-height: 1.4; }

  .btn-p { display: inline-flex; align-items: center; gap: 7px; padding: 11px 22px; background: linear-gradient(135deg, #0e7490, #22d3ee); border: none; border-radius: 9px; font-size: 14px; font-weight: 700; color: #000; cursor: pointer; transition: all 0.2s; font-family: 'Syne', sans-serif; }
  .btn-p:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(34,211,238,0.25); }
  .btn-p:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-s { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; background: transparent; border: 1px solid rgba(14,116,144,0.2); border-radius: 9px; font-size: 12px; font-weight: 600; color: rgba(228,240,245,0.5); cursor: pointer; transition: all 0.2s; }
  .btn-s:hover { border-color: rgba(34,211,238,0.4); color: #22d3ee; }
  .act { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; border: 1px solid; }
  .a-p { background: rgba(34,211,238,0.08); border-color: rgba(34,211,238,0.2); color: #22d3ee; }
  .a-c { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.09); color: rgba(228,240,245,0.45); }
  .a-s { background: rgba(34,197,94,0.07); border-color: rgba(34,197,94,0.18); color: #22c55e; }

  /* Output */
  .output-block { background: rgba(14,116,144,0.05); border: 1px solid rgba(34,211,238,0.15); border-radius: 12px; padding: 24px; max-width: 760px; }
  .ob-label { font-size: 10px; letter-spacing: 2.5px; color: #22d3ee; font-family: 'DM Mono', monospace; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
  .ob-body { font-size: 14px; line-height: 1.8; white-space: pre-wrap; color: rgba(228,240,245,0.88); }
  .ob-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }

  .enter { animation: up 0.22s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .footer-law { padding: 8px 18px; font-size: 9px; color: rgba(228,240,245,0.2); border-top: 1px solid rgba(14,116,144,0.1); text-align: center; letter-spacing: 0.5px; }
`;

const OUTPUT_TYPES = [
  { id: "plan",     emoji: "📋", name: "Business Plan",    desc: "Structured 1-page plan from your idea" },
  { id: "calendar", emoji: "📅", name: "Content Calendar", desc: "30-day content schedule from your topics" },
  { id: "pitch",    emoji: "💼", name: "Investor Pitch",   desc: "Capital-ready pitch deck outline" },
  { id: "tasks",    emoji: "✅", name: "Action List",      desc: "Prioritized next steps and tasks" },
];

const SAMPLE_MEMOS = [
  { title: "YouTube Strategy Q2", type: "📅 Calendar", date: "Today", preview: "Okay so I was thinking about the channel..." },
  { title: "AI Tool SaaS Idea", type: "📋 Business Plan", date: "Yesterday", preview: "What if we built something that..." },
  { title: "Investor Pitch Draft", type: "💼 Pitch", date: "3 days ago", preview: "The problem is massive, every creator..." },
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

export default function VoiceVault() {
  const [memo, setMemo] = useState("");
  const [outputType, setOutputType] = useState(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState([...SAMPLE_MEMOS]);

  const process = async () => {
    if (!memo || !outputType) return;
    setLoading(true); setOutput("");
    const SYSTEMS = {
      plan: "You are VoiceVault's business architect. Transform raw voice memo transcriptions into clean, structured 1-page business plans. Format: 🎯 PROBLEM, 💡 SOLUTION, 🎯 TARGET MARKET, 💰 REVENUE MODEL, 📊 KEY METRICS TO TRACK, ⚡ 30-DAY ACTION PLAN, 🚀 UNFAIR ADVANTAGE. Be specific, not generic.",
      calendar: "You are VoiceVault's content strategist. Transform raw voice memo ideas into a structured 30-day content calendar. Format as: WEEK 1 (Days 1-7), WEEK 2 (Days 8-14), WEEK 3 (Days 15-21), WEEK 4 (Days 22-30). Each day: platform, content type, topic, hook line. Be specific and actionable.",
      pitch: "You are VoiceVault's pitch writer. Transform raw voice memo ideas into a capital-ready investor pitch outline. Structure: 🎯 PROBLEM (market pain), 💡 SOLUTION (your product), 📊 MARKET SIZE (TAM/SAM/SOM), 💰 BUSINESS MODEL, 📈 TRACTION/MILESTONES, 🏆 COMPETITIVE ADVANTAGE, 👥 TEAM (if mentioned), 💵 THE ASK. Be specific and compelling.",
      tasks: "You are VoiceVault's execution engine. Transform raw voice memo ideas into a prioritized action list. Format: 🔴 DO THIS WEEK (high impact, urgent), 🟡 DO THIS MONTH (high impact, not urgent), 🟢 DELEGATE OR AUTOMATE, 📋 TRACK & MEASURE. Each item: specific action + estimated time + expected outcome.",
    };
    await callClaude(SYSTEMS[outputType.id], `Process this voice memo / idea dump:\n\n"${memo}"\n\nGenerate a ${outputType.name}.`, (t) => setOutput(t));
    setLoading(false);
    setSaved(prev => [{ title: memo.slice(0, 40) + "...", type: outputType.emoji + " " + outputType.name, date: "Just now", preview: memo.slice(0, 60) + "..." }, ...prev]);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="vv">
        <div className="shell">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-name">VoiceVault</div>
              <div className="brand-sub">ENTREPRENEUR AI · VOICE → ACTION</div>
              <div className="brand-tag"><Mic size={9} /> Ideas don't wait. Neither should you.</div>
            </div>

            <div className="vault-list">
              <div className="vl-section">
                <div className="vl-label">RECENT MEMOS</div>
                {saved.map((item, i) => (
                  <div key={i} className="vault-item">
                    <div className="vi-icon"><FileText size={13} style={{ color: "#22d3ee" }} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="vi-title">{item.title}</div>
                      <div className="vi-meta">{item.type} · {item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-stats">
              <div className="ss-grid">
                {[
                  { val: saved.length, lbl: "MEMOS" },
                  { val: "4", lbl: "OUTPUT TYPES" },
                  { val: "AI", lbl: "POWERED" },
                  { val: "∞", lbl: "IDEAS" },
                ].map((s, i) => (
                  <div key={i} className="ss-item">
                    <div className="ss-val mono">{s.val}</div>
                    <div className="ss-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="footer-law">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
          </aside>

          {/* MAIN */}
          <div className="main">
            <div className="topbar">
              <Mic size={16} style={{ color: "#22d3ee" }} />
              <div className="tb-title syne">Process a Voice Memo</div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(34,211,238,0.5)", fontFamily: "'DM Mono',monospace" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "spin 2s linear infinite" }} /> AI READY
                </div>
              </div>
            </div>

            <div className="input-area">
              <div className="input-card enter">
                <div className="ic-title syne">📝 Paste Your Voice Memo or Raw Idea</div>
                <div className="ic-sub">Dump everything — your voice transcript, random thoughts, half-formed ideas. The messier the better. VoiceVault organizes chaos.</div>
                <textarea className="inp txta" placeholder="Okay so I was thinking about this idea right... basically what if we built a platform that... the market is huge because every entrepreneur has this problem... I think we could charge like $29 a month and... the three main features would be..."
                  value={memo} onChange={e => setMemo(e.target.value)} />
              </div>

              {memo.length > 30 && (
                <div className="input-card enter">
                  <div className="ic-title syne">⚡ What Do You Need?</div>
                  <div className="ic-sub">Choose your output type — AI will structure your raw idea into this exact format.</div>
                  <div className="out-types">
                    {OUTPUT_TYPES.map(t => (
                      <div key={t.id} className={`ot-card ${outputType?.id === t.id ? "on" : ""}`} onClick={() => setOutputType(t)}>
                        <div className="ot-emoji">{t.emoji}</div>
                        <div className="ot-name">{t.name}</div>
                        <div className="ot-desc">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn-p" onClick={process} disabled={!outputType || loading}>
                    {loading ? <><Loader size={14} className="spin" /> Processing...</> : <><Zap size={14} /> Process Memo</>}
                  </button>
                </div>
              )}

              {output && (
                <div className="output-block enter">
                  <div className="ob-label"><Sparkles size={11} /> {outputType?.emoji} {outputType?.name?.toUpperCase()} · VOICEVAULT AI</div>
                  <div className="ob-body">{output}</div>
                  <div className="ob-actions">
                    <button className="act a-s"><Share2 size={12} /> Share</button>
                    <button className="act a-c" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                    <button className="act a-p" onClick={() => { setMemo(""); setOutput(""); setOutputType(null); }}><RefreshCw size={12} /> New Memo</button>
                    <button className="act a-p"><Download size={12} /> Export</button>
                  </div>
                </div>
              )}

              {!memo && (
                <div style={{ maxWidth: 760, padding: "48px 0", textAlign: "center", color: "rgba(228,240,245,0.25)" }}>
                  <div style={{ fontSize: 40, marginBottom: 16 }}>🎙️</div>
                  <div className="syne" style={{ fontSize: 18, color: "rgba(228,240,245,0.5)", marginBottom: 8 }}>Your next big idea is waiting</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                    Paste any voice memo transcript, brain dump, or raw idea above. VoiceVault turns chaos into business plans, content calendars, investor pitches, and action lists.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
