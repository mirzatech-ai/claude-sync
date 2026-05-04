import { useState, useEffect } from "react";
import { ArrowLeft, Share2, Copy, Check, RefreshCw, Trash2, Moon, Loader, Mic, Star, Film, Music, Brain, Sparkles } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #040612; min-height: 100%; }

  .df { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #040612; color: #e8e4f8;
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(79,70,229,0.14) 0%, transparent 65%),
      radial-gradient(ellipse 50% 40% at 90% 100%, rgba(124,58,237,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 30% 20% at 10% 50%, rgba(30,60,120,0.06) 0%, transparent 60%); }
  .cg { font-family: 'Cormorant Garamond', serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* Stars bg */
  .stars { position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0; }
  .star { position: absolute; width: 2px; height: 2px; background: #fff; border-radius: 50%; animation: twinkle var(--d) ease infinite; opacity: var(--o); }
  @keyframes twinkle { 0%,100%{opacity:var(--o)} 50%{opacity:0.1} }

  .layer { position: relative; z-index: 1; }

  /* Landing */
  .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }
  .moon-icon { font-size: 56px; margin-bottom: 20px; animation: moonFloat 4s ease infinite; }
  @keyframes moonFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .wordmark { font-family: 'Cormorant Garamond', serif; font-size: clamp(52px,9vw,96px); font-weight: 600; letter-spacing: -2px; line-height: 0.9;
    background: linear-gradient(160deg, #e8e4f8 0%, #818cf8 45%, #4f46e5 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 40px rgba(129,140,248,0.25)); }
  .wordmark-sub { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 4px; color: rgba(129,140,248,0.5); margin-top: 8px; }
  .tagline { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(16px, 2.2vw, 22px); color: rgba(232,228,248,0.45); margin: 20px 0 44px; max-width: 480px; line-height: 1.6; }

  /* Dream input */
  .dream-box { width: 100%; max-width: 640px; position: relative; }
  .db-border { position: absolute; inset: -1px; border-radius: 20px; background: linear-gradient(135deg, rgba(129,140,248,0.5), rgba(79,70,229,0.2), rgba(124,58,237,0.3)); animation: dreamGlow 6s ease infinite; }
  @keyframes dreamGlow { 0%,100%{opacity:0.3} 50%{opacity:0.8} }
  .db-inner { position: relative; background: rgba(8,6,24,0.97); border-radius: 20px; padding: 2px; }
  .db-ta { width: 100%; min-height: 200px; background: transparent; border: none; outline: none; resize: none; padding: 28px 28px 16px; font-family: 'Cormorant Garamond', serif; font-size: 18px; line-height: 1.75; color: #e8e4f8; caret-color: #818cf8; }
  .db-ta::placeholder { color: rgba(232,228,248,0.18); font-style: italic; }
  .db-foot { padding: 12px 24px 18px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }

  /* Symbol detector */
  .symbols { display: flex; gap: 8px; flex-wrap: wrap; }
  .sym { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: rgba(129,140,248,0.1); color: #818cf8; border: 1px solid rgba(129,140,248,0.2); }

  /* Mode cards */
  .modes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; width: 100%; max-width: 640px; margin: 16px 0; }
  .mode-card { padding: 22px 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); cursor: pointer; text-align: center; transition: all 0.25s; }
  .mode-card:hover { transform: translateY(-3px); }
  .me { font-size: 30px; margin-bottom: 10px; }
  .mn { font-size: 15px; font-weight: 700; margin-bottom: 5px; }
  .md { font-size: 11px; color: rgba(232,228,248,0.35); line-height: 1.5; }

  .btn-forge { width: 100%; max-width: 640px; padding: 17px; border: none; border-radius: 14px; background: linear-gradient(135deg, #4f46e5, #7c3aed); font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 700; color: #e8e4f8; cursor: pointer; transition: all 0.2s; }
  .btn-forge:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(79,70,229,0.35); }
  .btn-forge:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

  /* Loading */
  .load-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
  .dream-ring { position: relative; width: 110px; height: 110px; }
  .dr-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid; animation: dreamRing 2.5s ease infinite; }
  .dr1 { border-color: rgba(129,140,248,0.6); }
  .dr2 { inset: 14px; border-color: rgba(124,58,237,0.4); animation-delay: 0.5s; }
  .dr3 { inset: 28px; border-color: rgba(79,70,229,0.3); animation-delay: 1s; }
  @keyframes dreamRing { 0%{transform:scale(0.9);opacity:1} 50%{transform:scale(1.04);opacity:0.4} 100%{transform:scale(0.9);opacity:1} }
  .dr-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 36px; }
  .load-t { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: rgba(232,228,248,0.6); }

  /* Output */
  .out-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 24px; }
  .out-card { width: 100%; max-width: 700px; background: rgba(8,6,24,0.97); border: 1px solid rgba(129,140,248,0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 0 80px rgba(79,70,229,0.1); }
  .out-top { padding: 26px 34px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .out-top::before { content: ''; display: block; height: 2px; background: linear-gradient(90deg, #4f46e5, #7c3aed, #818cf8); border-radius: 2px; margin-bottom: 18px; }
  .out-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px; color: rgba(129,140,248,0.6); margin-bottom: 8px; }
  .out-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #818cf8; }
  .out-body { padding: 28px 34px; font-family: 'Cormorant Garamond', serif; font-size: 17px; line-height: 1.9; white-space: pre-wrap; color: rgba(232,228,248,0.88); max-height: 500px; overflow-y: auto; }
  .out-body::-webkit-scrollbar { width: 3px; }
  .out-body::-webkit-scrollbar-thumb { background: rgba(129,140,248,0.2); }
  .out-foot { padding: 16px 34px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; flex-wrap: wrap; }

  .act { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; border: 1px solid; }
  .a-s { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); color: #22c55e; }
  .a-c { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.09); color: rgba(232,228,248,0.5); }
  .a-r { background: rgba(129,140,248,0.08); border-color: rgba(129,140,248,0.2); color: #818cf8; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 8px 14px; cursor: pointer; font-size: 12px; color: rgba(232,228,248,0.35); margin-bottom: 28px; transition: all 0.2s; }
  .back-btn:hover { color: #e8e4f8; }
  .trust-row { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-top: 28px; }
  .ti { font-size: 11px; color: rgba(232,228,248,0.25); }
  .enter { animation: up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
`;

const SYMBOLS = [
  { word: /fly|fall|float|wing|sky|bird/, sym: "✈️ Flying" },
  { word: /water|ocean|drown|swim|flood|rain/, sym: "🌊 Water" },
  { word: /chase|run|escape|follow|hunt/, sym: "👁️ Being Chased" },
  { word: /house|room|door|building|corridor/, sym: "🏠 Architecture" },
  { word: /dead|death|die|funeral|ghost/, sym: "💀 Death/Ending" },
  { word: /teeth|tooth|fall out/, sym: "😬 Teeth Falling" },
  { word: /naked|exposed|embarrass/, sym: "😳 Vulnerability" },
  { word: /lost|maze|can't find|wandering/, sym: "🗺️ Being Lost" },
];

const MODES = [
  { id: "film",    emoji: "🎬", name: "Short Film Script",    desc: "Your dream as a cinematic 60-second script",          col: "#818cf8", border: "rgba(129,140,248,0.25)" },
  { id: "song",    emoji: "🎵", name: "Dream Song",           desc: "A song built from your dream's emotional frequency",  col: "#a78bfa", border: "rgba(167,139,250,0.25)" },
  { id: "insight", emoji: "🔮", name: "Psychological Insight", desc: "What your subconscious is actually saying",          col: "#22d3ee", border: "rgba(34,211,238,0.2)"  },
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

function Stars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    left: Math.random() * 100 + "%", top: Math.random() * 100 + "%",
    opacity: 0.1 + Math.random() * 0.5, duration: 2 + Math.random() * 4 + "s",
  }));
  return (
    <div className="stars">
      {stars.map((s, i) => (
        <div key={i} className="star" style={{ left: s.left, top: s.top, "--o": s.opacity, "--d": s.duration }} />
      ))}
    </div>
  );
}

export default function DreamForge() {
  const [screen, setScreen] = useState("landing");
  const [dream, setDream] = useState("");
  const [mode, setMode] = useState(null);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const detectedSymbols = SYMBOLS.filter(s => s.word.test(dream.toLowerCase())).map(s => s.sym);

  const forge = async (m) => {
    setMode(m); setScreen("loading");
    const SYSTEMS = {
      film: "You are DreamForge's film director. Transform dream descriptions into cinematic short film scripts (60-90 seconds). Include: [TITLE], [HOOK 0-3s — visual opening], [ACT 1 — establishing the dream world], [ACT 2 — the emotional core], [CLIMAX], [FADE]. Use sensory language. Make it visually stunning. Include camera directions.",
      song: "You are DreamForge's musician. Transform dream descriptions into complete songs that capture the emotional frequency of the dream. Include genre suggestion, [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro]. The melody should feel dreamlike. Give it a title.",
      insight: "You are DreamForge's dream psychologist — Jungian and modern. Analyze the dream symbols, emotional tone, and narrative arc. Provide: 🌙 The Core Symbol, 💭 What Your Subconscious Is Processing, 🔮 The Hidden Fear or Desire, ✨ The Gift in This Dream, 🌅 What This Dream Wants From You. Be specific, not generic.",
    };
    await callClaude(SYSTEMS[m.id], `Dream description:\n\n"${dream}"\n\nDetected symbols: ${detectedSymbols.join(", ") || "none detected"}\n\nTransform this into ${m.name}.`, (t) => setOutput(t));
    setScreen("output");
  };

  const reset = () => { setScreen("landing"); setDream(""); setMode(null); setOutput(""); };

  return (
    <>
      <style>{CSS}</style>
      <div className="df">
        <Stars />
        {screen === "landing" && (
          <div className="landing layer enter">
            <div className="moon-icon">🌙</div>
            <div className="wordmark">DreamForge</div>
            <div className="wordmark-sub">DREAMFORGE.AI · YOUR SUBCONSCIOUS, TRANSFORMED</div>
            <p className="tagline cg">"The dreams you wake from at 3am are trying to tell you something. We help you listen."</p>

            <div className="dream-box">
              <div className="db-border" />
              <div className="db-inner">
                <textarea className="db-ta"
                  placeholder="Describe your dream... I was in a house I didn't recognize, but it felt like mine. There was water coming under the door. Someone I loved was there but I couldn't see their face. I was trying to run but my legs wouldn't move..."
                  value={dream} onChange={e => setDream(e.target.value)} maxLength={2000} />
                <div className="db-foot">
                  <div className="symbols">
                    {detectedSymbols.slice(0, 3).map((s, i) => <span key={i} className="sym">{s}</span>)}
                    {detectedSymbols.length === 0 && dream.length > 20 && <span className="sym" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(232,228,248,0.3)", borderColor: "rgba(255,255,255,0.07)" }}>Analyzing symbols...</span>}
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: "rgba(232,228,248,0.25)" }}>{dream.length}/2000</span>
                </div>
              </div>
            </div>

            {dream.length > 30 && (
              <div className="modes-grid enter">
                {MODES.map(m => (
                  <div key={m.id} className="mode-card" onClick={() => forge(m)} style={{ borderColor: m.border }}>
                    <div className="me">{m.emoji}</div>
                    <div className="mn" style={{ color: m.col }}>{m.name}</div>
                    <div className="md">{m.desc}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="trust-row">
              {["🌙 Dreams analyzed by AI", "🔒 Private always", "✨ Perfectly viral", "🔮 Jungian + modern psychology"].map((t, i) => (
                <span key={i} className="ti">{t}</span>
              ))}
            </div>
          </div>
        )}

        {screen === "loading" && (
          <div className="load-screen layer enter">
            <div className="dream-ring">
              <div className="dr-ring dr1" /><div className="dr-ring dr2" /><div className="dr-ring dr3" />
              <div className="dr-center">{mode?.emoji}</div>
            </div>
            <div className="load-t cg" style={{ fontStyle: "italic" }}>Entering your dream world...</div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(129,140,248,0.5)", letterSpacing: 2 }}>DREAMFORGE.AI</div>
          </div>
        )}

        {screen === "output" && (
          <div className="out-screen layer enter">
            <button className="back-btn" onClick={reset}><ArrowLeft size={13} /> New Dream</button>
            <div className="out-card">
              <div className="out-top">
                <div className="out-lbl">{mode?.emoji} {mode?.name?.toUpperCase()} · DREAMFORGE.AI</div>
                <div className="out-title cg">{output.match(/(?:TITLE)[:\s"]+([^\n"]+)/i)?.[1] || "Your Dream, Forged"}</div>
              </div>
              <div className="out-body">{output}</div>
              <div className="out-foot">
                <button className="act a-s"><Share2 size={12} /> Share</button>
                <button className="act a-c" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
                <button className="act a-r" onClick={reset}><RefreshCw size={12} /> New Dream</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
