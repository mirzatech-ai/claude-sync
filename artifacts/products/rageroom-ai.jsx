import { useState } from "react";
import { ArrowLeft, Trash2, Share2, Copy, Check, RefreshCw, Loader, Flame, Zap, Music, FileText, X } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #090406; min-height: 100%; }

  .rr { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #090406; color: #f5e8e8;
    background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(180,20,20,0.15) 0%, transparent 65%); }
  .bebas { font-family: 'Bebas Neue', cursive; }
  .mono { font-family: 'DM Mono', monospace; }

  .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; }

  .wordmark { font-family: 'Bebas Neue', cursive; font-size: clamp(64px, 12vw, 128px); letter-spacing: 4px; line-height: 0.85;
    background: linear-gradient(160deg, #f5e8e8 0%, #ef4444 40%, #7f1d1d 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 40px rgba(239,68,68,0.3)); }
  .wordmark-sub { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 5px; color: rgba(239,68,68,0.5); margin-top: 6px; }
  .tagline { font-size: clamp(15px, 2vw, 19px); color: rgba(245,232,232,0.45); margin: 24px 0 40px; max-width: 480px; line-height: 1.6; }

  /* Rage meter */
  .rage-meter-wrap { width: 100%; max-width: 640px; margin-bottom: 16px; }
  .rm-label { display: flex; justify-content: space-between; font-size: 11px; color: rgba(245,232,232,0.35); margin-bottom: 8px; font-family: 'DM Mono', monospace; }
  .rm-track { height: 8px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; }
  .rm-fill { height: 100%; border-radius: 4px; transition: width 0.3s; background: linear-gradient(90deg, #ef4444, #dc2626, #7f1d1d); }

  /* Input box */
  .rage-box { width: 100%; max-width: 640px; position: relative; }
  .rb-border { position: absolute; inset: -1px; border-radius: 16px; background: linear-gradient(135deg, rgba(239,68,68,0.7), rgba(120,0,0,0.3)); animation: rageGlow 3s ease infinite; }
  @keyframes rageGlow { 0%,100%{opacity:0.3} 50%{opacity:1} }
  .rb-inner { position: relative; background: rgba(12,4,4,0.98); border-radius: 16px; padding: 2px; }
  .rb-ta { width: 100%; min-height: 200px; background: transparent; border: none; outline: none; resize: none; padding: 24px; font-size: 17px; font-family: 'DM Sans', sans-serif; color: #f5e8e8; line-height: 1.7; caret-color: #ef4444; }
  .rb-ta::placeholder { color: rgba(245,232,232,0.18); }
  .rb-foot { padding: 12px 20px 18px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }

  /* Rage intensity */
  .intensity-row { display: flex; gap: 8px; margin-bottom: 20px; }
  .int-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.2s; font-family: 'DM Mono', monospace; letter-spacing: 1px; }

  /* Modes */
  .modes-wrap { width: 100%; max-width: 640px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; }
  .m-card { padding: 18px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); cursor: pointer; text-align: center; transition: all 0.2s; }
  .m-card:hover { transform: translateY(-2px); }
  .m-em { font-size: 28px; margin-bottom: 8px; }
  .m-nm { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .m-ds { font-size: 11px; color: rgba(245,232,232,0.35); line-height: 1.4; }
  .burn-card { border-color: rgba(239,68,68,0.2) !important; grid-column: 1 / -1; padding: 14px; }
  .burn-card:hover { border-color: rgba(239,68,68,0.6) !important; }

  .btn-unleash { width: 100%; max-width: 640px; padding: 18px; border: none; border-radius: 14px; background: linear-gradient(135deg, #ef4444, #7f1d1d); font-family: 'Bebas Neue', cursive; font-size: 24px; letter-spacing: 3px; color: #fff; cursor: pointer; transition: all 0.2s; }
  .btn-unleash:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(239,68,68,0.4); }
  .btn-unleash:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  /* Loading */
  .load-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
  .rage-ring { width: 100px; height: 100px; border-radius: 50%; border: 3px solid rgba(239,68,68,0.3); display: flex; align-items: center; justify-content: center; font-size: 40px; animation: ragePulse 1s ease infinite; }
  @keyframes ragePulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{transform:scale(1.05);box-shadow:0 0 0 20px rgba(239,68,68,0)} }
  .load-t { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 3px; color: rgba(245,232,232,0.6); }
  .load-s { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(239,68,68,0.6); letter-spacing: 3px; animation: blink 0.8s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* Output */
  .out-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 24px; }
  .out-card { width: 100%; max-width: 700px; background: rgba(12,4,4,0.97); border: 1px solid rgba(239,68,68,0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 0 80px rgba(239,68,68,0.07); }
  .out-top { padding: 24px 32px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .out-top::before { content: ''; display: block; height: 3px; background: linear-gradient(90deg, #ef4444, #7f1d1d, #ef4444); border-radius: 2px; margin-bottom: 18px; }
  .out-type { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px; color: rgba(239,68,68,0.6); margin-bottom: 6px; }
  .out-title { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 2px; color: #ef4444; }
  .out-body { padding: 28px 32px; font-size: 16px; line-height: 1.85; white-space: pre-wrap; color: rgba(245,232,232,0.88); max-height: 500px; overflow-y: auto; }
  .out-body::-webkit-scrollbar { width: 3px; }
  .out-body::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.2); }
  .out-foot { padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; flex-wrap: wrap; }

  /* Burn screen */
  .burn-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
  .burn-big { font-size: 80px; animation: bp 1s ease infinite; }
  @keyframes bp { 0%,100%{transform:scale(1)rotate(-3deg)} 50%{transform:scale(1.1)rotate(3deg)} }
  .burn-t { font-family: 'Bebas Neue', cursive; font-size: 52px; letter-spacing: 4px; color: #ef4444; margin-bottom: 8px; }
  .burn-s { color: rgba(245,232,232,0.35); font-size: 14px; max-width: 380px; line-height: 1.6; margin-bottom: 32px; }
  .btn-b { padding: 15px 40px; background: linear-gradient(135deg,#ef4444,#7f1d1d); border:none; border-radius:12px; font-family:'Bebas Neue',cursive; font-size:22px; letter-spacing:3px; color:#fff; cursor:pointer; display:block; width:100%; max-width:300px; margin:0 auto 12px; transition:all 0.2s; }
  .btn-b:hover { box-shadow:0 8px 28px rgba(239,68,68,0.4); }
  .btn-cancel { background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:11px 28px; color:rgba(245,232,232,0.35); cursor:pointer; font-size:13px; }

  .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; font-weight:700; transition:all 0.2s; border:1px solid; }
  .a-s { background:rgba(34,197,94,0.08); border-color:rgba(34,197,94,0.2); color:#22c55e; }
  .a-c { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.1); color:rgba(245,232,232,0.5); }
  .a-r { background:rgba(239,68,68,0.08); border-color:rgba(239,68,68,0.2); color:#ef4444; }
  .a-b { background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.3); color:#ef4444; }
  .back-btn { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(245,232,232,0.35); margin-bottom:28px; transition:all 0.2s; }
  .back-btn:hover { color:#f5e8e8; }
  .enter { animation: up 0.22s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
`;

const RAGE_MODES = [
  { id: "metal",  emoji: "🤘", name: "Metal Lyrics",  desc: "Scream it in verse and chorus", col: "#ef4444", border: "rgba(239,68,68,0.25)" },
  { id: "rap",    emoji: "🎤", name: "Diss Track",    desc: "Bars that hit where it hurts",   col: "#f59e0b", border: "rgba(245,158,11,0.25)" },
  { id: "dark",   emoji: "🖤", name: "Dark Poetry",   desc: "Raw, literary, devastating",     col: "#a855f7", border: "rgba(168,85,247,0.25)" },
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

export default function RageRoom() {
  const [screen, setScreen] = useState("landing");
  const [rage, setRage] = useState("");
  const [mode, setMode] = useState(null);
  const [output, setOutput] = useState("");
  const [burning, setBurning] = useState(false);
  const [copied, setCopied] = useState(false);

  const rageLevel = Math.min(100, Math.floor((rage.length / 500) * 100) + (rage.match(/[!?]/g) || []).length * 3);
  const rageColor = rageLevel > 70 ? "#ef4444" : rageLevel > 40 ? "#f59e0b" : "#6b7280";

  const unleash = async (m) => {
    setMode(m); setScreen("loading");
    const SYSTEMS = {
      metal: "You are RageRoom.ai's metal lyricist. Transform raw human rage into devastating metal lyrics. Structure: [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Breakdown], [Outro]. Heavy, visceral, specific. Give it a band name and song title. Make it feel like it could headline Download Festival.",
      rap: "You are RageRoom.ai's ghostwriter. Transform raw rage into a savage diss track. Structure: [Intro], [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge/Outro]. Sharp bars, wordplay, rhymes that actually work. Give it a title. Make it something Eminem would nod to.",
      dark: "You are RageRoom.ai's dark poet. Transform raw rage into dark, literary poetry. Free verse, visceral imagery, specific detail. Not generic sadness — focused rage turned into art. Make it something Sylvia Plath and NIN would collaborate on.",
    };
    await callClaude(SYSTEMS[m.id], `Transform this rage:\n\n"${rage}"\n\nMake it ${m.name}. Make it unforgettable.`, (t) => setOutput(t));
    setScreen("output");
  };

  const burn = () => { setBurning(true); setTimeout(() => { setScreen("landing"); setRage(""); setOutput(""); setMode(null); setBurning(false); }, 1800); };

  return (
    <>
      <style>{CSS}</style>
      <div className="rr">
        {screen === "landing" && (
          <div className="landing enter">
            <div className="wordmark">RAGE<br />ROOM</div>
            <div className="wordmark-sub">RAGEROOM.AI · TRANSFORM OR DESTROY</div>
            <p className="tagline">"Type your absolute worst. We'll turn it into art — or burn it like it never happened."</p>

            {rage.length > 0 && (
              <div className="rage-meter-wrap enter">
                <div className="rm-label"><span>RAGE LEVEL</span><span style={{ color: rageColor }}>{rageLevel}%</span></div>
                <div className="rm-track"><div className="rm-fill" style={{ width: rageLevel + "%" }} /></div>
              </div>
            )}

            <div className="rage-box">
              <div className="rb-border" />
              <div className="rb-inner">
                <textarea className="rb-ta"
                  placeholder="Type it all out. The ugliest thoughts. What they did. What you felt. What you can't say out loud. No judgment. No filters. This is your rage room."
                  value={rage} onChange={e => setRage(e.target.value)} maxLength={3000} />
                <div className="rb-foot">
                  <span className="mono" style={{ fontSize: 11, color: "rgba(245,232,232,0.25)" }}>{rage.length}/3000</span>
                  <span style={{ fontSize: 11, color: rageColor, fontFamily: "'DM Mono',monospace" }}>
                    {rageLevel > 80 ? "🔥 MAXIMUM RAGE" : rageLevel > 50 ? "⚡ INTENSE" : rageLevel > 20 ? "😤 BUILDING" : "START TYPING"}
                  </span>
                </div>
              </div>
            </div>

            {rage.length > 20 && (
              <div style={{ width: "100%", maxWidth: 640 }} className="enter">
                <div style={{ fontSize: 11, letterSpacing: 2, color: "rgba(245,232,232,0.3)", textAlign: "center", margin: "20px 0 12px", fontFamily: "'DM Mono',monospace" }}>
                  WHAT DO YOU WANT TO DO WITH THIS?
                </div>
                <div className="modes-wrap" style={{ maxWidth: "100%", margin: "0 0 14px" }}>
                  {RAGE_MODES.map(m => (
                    <div key={m.id} className="m-card" onClick={() => unleash(m)} style={{ borderColor: m.border }}>
                      <div className="m-em">{m.emoji}</div>
                      <div className="m-nm" style={{ color: m.col }}>{m.name}</div>
                      <div className="m-ds">{m.desc}</div>
                    </div>
                  ))}
                  <div className="m-card burn-card" onClick={() => setScreen("burn")}>
                    <span style={{ fontSize: 20, marginRight: 8 }}>🔥</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>Burn It — Delete Everything</span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
              {["🔒 Zero storage", "🔥 Burn anytime", "🎤 Real AI", "⚡ Gen Z approved"].map((t, i) => (
                <span key={i} style={{ fontSize: 11, color: "rgba(245,232,232,0.25)" }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {screen === "loading" && (
          <div className="load-screen enter">
            <div className="rage-ring">{mode?.emoji}</div>
            <div className="load-t">CHANNELING THE RAGE</div>
            <div className="load-s">RAGEROOM.AI PROCESSING...</div>
          </div>
        )}

        {screen === "output" && (
          <div className="out-screen enter">
            <button className="back-btn" onClick={() => setScreen("landing")}><ArrowLeft size={13} /> New Rage</button>
            <div className="out-card">
              <div className="out-top">
                <div className="out-type">{mode?.emoji} {mode?.name?.toUpperCase()} · RAGEROOM.AI</div>
                <div className="out-title">{output.match(/(?:TITLE|SONG|POEM)[:\s"]+([^\n"]+)/i)?.[1] || "YOUR RAGE, TRANSFORMED"}</div>
              </div>
              <div className="out-body">{output}</div>
              <div className="out-foot">
                <button className="act a-s"><Share2 size={12} /> Share</button>
                <button className="act a-c" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
                <button className="act a-r" onClick={() => setScreen("landing")}><RefreshCw size={12} /> New Rage</button>
                <button className="act a-b" onClick={() => setScreen("burn")}><Trash2 size={12} /> Burn It</button>
              </div>
            </div>
          </div>
        )}

        {screen === "burn" && (
          <div className="burn-screen enter">
            <div className="burn-big">{burning ? "💨" : "🔥"}</div>
            <div className="burn-t bebas">{burning ? "BURNING..." : "BURN IT?"}</div>
            <p className="burn-s">{burning ? "Destroyed. Like it never existed." : "Delete your rage and everything created from it. No logs. No trace."}</p>
            {!burning && <><button className="btn-b" onClick={burn}>🔥 BURN EVERYTHING</button><button className="btn-cancel" onClick={() => setScreen(output ? "output" : "landing")}>Keep It — Go Back</button></>}
          </div>
        )}
      </div>
    </>
  );
}
