import { useState, useRef, useEffect } from "react";
import { Flame, ArrowLeft, Send, Trash2, Share2, Copy, Check, Download, Lock, Heart, RefreshCw, Loader, X, Sparkles, Mail, BookOpen, Music, Video, ChevronRight } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #0d0906; min-height: 100%; }

  .ua {
    font-family: 'DM Sans', sans-serif; min-height: 100vh;
    background: #0d0906; color: #f0e8dc;
    background-image:
      radial-gradient(ellipse 70% 50% at 50% -5%, rgba(180,120,60,0.12) 0%, transparent 65%),
      radial-gradient(ellipse 40% 30% at 5% 95%, rgba(120,60,80,0.07) 0%, transparent 60%);
  }
  .lora { font-family: 'Lora', serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* ── Landing ── */
  .landing { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; }
  .wordmark { font-family: 'Lora', serif; font-size: clamp(56px, 9vw, 96px); font-weight: 700; letter-spacing: -2px; line-height: 0.9;
    background: linear-gradient(160deg, #f0e8dc 0%, #c8974a 50%, #8a5030 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(200,151,74,0.2)); }
  .tagline { font-family: 'Lora', serif; font-style: italic; font-size: clamp(16px, 2.2vw, 22px); color: rgba(240,232,220,0.55); margin: 20px 0 48px; max-width: 500px; line-height: 1.6; }

  /* Recipient selector */
  .recip-label { font-size: 11px; letter-spacing: 3px; color: rgba(200,151,74,0.7); margin-bottom: 20px; font-family: 'DM Mono', monospace; }
  .recip-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 680px; margin-bottom: 32px; }
  .recip-btn { padding: 16px 12px; border-radius: 14px; border: 1px solid rgba(200,151,74,0.15); background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.2s; text-align: center; }
  .recip-btn:hover, .recip-btn.on { border-color: rgba(200,151,74,0.5); background: rgba(200,151,74,0.08); }
  .recip-emoji { font-size: 28px; margin-bottom: 8px; }
  .recip-name { font-size: 12px; font-weight: 600; color: rgba(240,232,220,0.8); }
  .recip-desc { font-size: 10px; color: rgba(240,232,220,0.35); margin-top: 3px; }

  /* Letter box */
  .letter-box { width: 100%; max-width: 640px; position: relative; }
  .letter-border { position: absolute; inset: -1px; border-radius: 18px; background: linear-gradient(135deg, rgba(200,151,74,0.5), rgba(120,60,80,0.3), rgba(200,151,74,0.2)); animation: borderGlow 5s ease infinite; }
  @keyframes borderGlow { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
  .letter-inner { position: relative; background: rgba(20,14,10,0.97); border-radius: 18px; padding: 2px; }
  .letter-dear { padding: 24px 28px 0; font-family: 'Lora', serif; font-size: 18px; color: rgba(200,151,74,0.8); font-style: italic; }
  .letter-ta { width: 100%; min-height: 220px; background: transparent; border: none; outline: none; resize: none; padding: 16px 28px 16px; font-family: 'Lora', serif; font-size: 17px; line-height: 1.8; color: #f0e8dc; caret-color: #c8974a; }
  .letter-ta::placeholder { color: rgba(240,232,220,0.2); font-style: italic; }
  .letter-footer { padding: 12px 24px 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
  .letter-sign { font-family: 'Lora', serif; font-style: italic; font-size: 15px; color: rgba(200,151,74,0.6); }

  .btn-send { width: 100%; max-width: 640px; margin-top: 14px; padding: 17px; border: none; border-radius: 14px; font-family: 'Lora', serif; font-size: 18px; font-weight: 700; color: #1a0f08; background: linear-gradient(135deg, #c8974a, #a06030); cursor: pointer; transition: all 0.2s; }
  .btn-send:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(200,151,74,0.3); }
  .btn-send:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* Mode select */
  .mode-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; }
  .mode-q { font-family: 'Lora', serif; font-size: clamp(24px, 3.5vw, 38px); text-align: center; margin-bottom: 10px; }
  .mode-q em { font-style: italic; color: rgba(200,151,74,0.9); }
  .mode-sub { font-size: 14px; color: rgba(240,232,220,0.4); text-align: center; margin-bottom: 40px; }
  .modes-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; width: 100%; max-width: 560px; }
  .mode-card { padding: 24px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); cursor: pointer; text-align: center; transition: all 0.2s; }
  .mode-card:hover { transform: translateY(-2px); }
  .mode-emoji { font-size: 32px; margin-bottom: 10px; }
  .mode-name { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; margin-bottom: 5px; }
  .mode-desc { font-size: 12px; color: rgba(240,232,220,0.45); line-height: 1.5; }
  .burn-full { grid-column: 1 / -1; border-color: rgba(200,60,60,0.2) !important; }
  .burn-full:hover { border-color: rgba(200,60,60,0.5) !important; box-shadow: 0 0 30px rgba(200,60,60,0.1); }

  /* Loading */
  .load-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
  .quill { font-size: 56px; animation: quillFloat 2s ease infinite; }
  @keyframes quillFloat { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-10px) rotate(5deg)} }
  .load-text { font-family: 'Lora', serif; font-size: 20px; color: rgba(240,232,220,0.6); }

  /* Output */
  .out-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 24px; }
  .out-card { width: 100%; max-width: 680px; background: rgba(20,14,10,0.95); border: 1px solid rgba(200,151,74,0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 0 60px rgba(200,151,74,0.08); }
  .out-top { padding: 28px 36px 22px; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
  .out-top::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #c8974a, #8a5030, #c8974a); }
  .out-type { font-size: 10px; letter-spacing: 3px; color: rgba(200,151,74,0.7); margin-bottom: 10px; font-family: 'DM Mono', monospace; }
  .out-to { font-family: 'Lora', serif; font-size: 26px; font-style: italic; font-weight: 600; color: #c8974a; }
  .out-body { padding: 30px 36px; font-family: 'Lora', serif; font-size: 17px; line-height: 1.9; white-space: pre-wrap; color: rgba(240,232,220,0.9); max-height: 500px; overflow-y: auto; }
  .out-body::-webkit-scrollbar { width: 3px; }
  .out-body::-webkit-scrollbar-thumb { background: rgba(200,151,74,0.2); }
  .out-foot { padding: 18px 36px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; flex-wrap: wrap; }

  /* Burn */
  .burn-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
  .burn-em { font-size: 72px; animation: bp 1.2s ease infinite; }
  @keyframes bp { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  .burn-t { font-family: 'Lora', serif; font-size: clamp(28px,5vw,48px); color: #ef4444; margin-bottom: 10px; }
  .burn-s { color: rgba(240,232,220,0.4); font-size: 14px; max-width: 400px; line-height: 1.6; margin-bottom: 36px; }
  .btn-burn { padding: 15px 40px; background: linear-gradient(135deg, #ef4444, #b91c1c); border: none; border-radius: 12px; font-size: 15px; font-weight: 700; color: #fff; cursor: pointer; display: block; width: 100%; max-width: 320px; margin-bottom: 12px; transition: all 0.2s; }
  .btn-burn:hover { box-shadow: 0 8px 28px rgba(239,68,68,0.4); }
  .btn-back { background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 28px; color: rgba(240,232,220,0.4); cursor: pointer; font-size: 13px; }

  /* Actions */
  .act { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; border: 1px solid; }
  .act-share { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); color: #22c55e; }
  .act-share:hover { background: rgba(34,197,94,0.15); }
  .act-copy { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: rgba(240,232,220,0.6); }
  .act-copy:hover { color: #f0e8dc; }
  .act-reset { background: rgba(200,151,74,0.08); border-color: rgba(200,151,74,0.2); color: #c8974a; }
  .act-reset:hover { background: rgba(200,151,74,0.15); }
  .act-burn { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #ef4444; }
  .act-burn:hover { background: rgba(239,68,68,0.15); }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 9px; padding: 8px 14px; cursor: pointer; font-size: 12px; color: rgba(240,232,220,0.4); transition: all 0.2s; margin-bottom: 28px; }
  .back-btn:hover { color: #f0e8dc; }
  .priv { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; color: rgba(240,232,220,0.3); padding: 4px 10px; border-radius: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); }

  .enter { animation: up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .trust-row { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; margin-top: 28px; }
  .trust-item { font-size: 12px; color: rgba(240,232,220,0.3); display: flex; align-items: center; gap: 6px; }
`;

const RECIPIENTS = [
  { id: "ex",      emoji: "💔", name: "An Ex",         desc: "Someone you loved & lost"    },
  { id: "parent",  emoji: "🙏", name: "A Parent",      desc: "Things you couldn't say"     },
  { id: "self",    emoji: "🪞", name: "Your Past Self", desc: "What you wish you knew"     },
  { id: "future",  emoji: "⭐", name: "Future You",    desc: "A letter forward in time"    },
  { id: "deceased",emoji: "🕊️", name: "Gone Too Soon", desc: "Someone no longer here"     },
  { id: "friend",  emoji: "🤝", name: "A Friend",      desc: "Words left unspoken"         },
  { id: "enemy",   emoji: "⚡", name: "An Enemy",      desc: "Release what they cost you"  },
  { id: "god",     emoji: "✨", name: "The Universe",  desc: "Your biggest question"       },
];

const MODES = [
  { id: "poem",   emoji: "📜", name: "Turn Into Poetry",       desc: "Your letter becomes a poem they'd read forever", col: "#c8974a" },
  { id: "song",   emoji: "🎵", name: "Turn Into a Song",       desc: "Your words set to music — verse, chorus, bridge", col: "#b5566a" },
  { id: "story",  emoji: "📖", name: "Turn Into a Short Story", desc: "A literary narrative based on your truth",       col: "#5a8a6a" },
  { id: "raw",    emoji: "💌", name: "Keep It As A Letter",    desc: "Beautified but preserved in letter form",        col: "#7c4f9e" },
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

export default function UnsentAI() {
  const [screen, setScreen] = useState("landing");
  const [recipient, setRecipient] = useState(null);
  const [letter, setLetter] = useState("");
  const [mode, setMode] = useState(null);
  const [output, setOutput] = useState("");
  const [burning, setBurning] = useState(false);
  const [copied, setCopied] = useState(false);

  const reset = () => { setScreen("landing"); setRecipient(null); setLetter(""); setMode(null); setOutput(""); };

  const transform = async () => {
    setScreen("loading");
    const recip = RECIPIENTS.find(r => r.id === recipient);
    const SYSTEMS = {
      poem: "You are Unsent.ai's poet. Transform raw emotional letters into deeply resonant poetry. Capture the unsaid truth. Be visceral, specific, not generic. Use imagery. Could be free verse or structured.",
      song: "You are Unsent.ai's songwriter. Transform unsent letters into complete songs: [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro]. Make it emotionally devastating in the best way. Name the song.",
      story: "You are Unsent.ai's literary writer. Transform an unsent letter into a short literary narrative — 3rd person, present tense, cinematic. The reader should feel every word.",
      raw: "You are Unsent.ai's editor. Take this raw letter and make it the most beautiful, powerful version of itself. Keep the voice authentic, heighten the emotion, remove clichés, add specificity.",
    };
    await callClaude(
      SYSTEMS[mode.id] || SYSTEMS.raw,
      `This is an unsent letter to: ${recip?.name || "Someone important"}\n\n"${letter}"\n\nTransform this into ${mode.name.toLowerCase()}. Make it unforgettable.`,
      (t) => { setOutput(t); }
    );
    setScreen("output");
  };

  const burn = () => {
    setBurning(true);
    setTimeout(() => { reset(); setBurning(false); }, 2000);
  };

  const recip = RECIPIENTS.find(r => r.id === recipient);

  return (
    <>
      <style>{CSS}</style>
      <div className="ua">
        {screen === "landing" && (
          <div className="landing enter">
            <div className="wordmark">Unsent.</div>
            <p className="tagline">"Some letters were never meant to be delivered. They were meant to be felt."</p>

            <div className="recip-label">WHO IS THIS LETTER FOR?</div>
            <div className="recip-grid">
              {RECIPIENTS.map(r => (
                <div key={r.id} className={`recip-btn ${recipient === r.id ? "on" : ""}`} onClick={() => setRecipient(r.id)}>
                  <div className="recip-emoji">{r.emoji}</div>
                  <div className="recip-name">{r.name}</div>
                  <div className="recip-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            {recipient && (
              <div className="letter-box enter">
                <div className="letter-border" />
                <div className="letter-inner">
                  <div className="letter-dear">Dear {recip?.name},</div>
                  <textarea className="letter-ta"
                    placeholder={`Write everything you never said. No one will read this unless you decide they should. You can burn it when you're done.`}
                    value={letter} onChange={e => setLetter(e.target.value)} maxLength={3000} />
                  <div className="letter-footer">
                    <div className="letter-sign">— Yours, always</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="mono" style={{ fontSize: 11, color: "rgba(240,232,220,0.3)" }}>{letter.length}/3000</span>
                      <span className="priv"><Lock size={9} /> Private</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {letter.length > 20 && (
              <button className="btn-send enter" onClick={() => setScreen("modes")}>
                What should we do with this? →
              </button>
            )}

            <div className="trust-row">
              {["💔 Never stored", "🔒 Always private", "🔥 Burn anytime", "✨ Perfectly viral"].map((t, i) => (
                <div key={i} className="trust-item">{t}</div>
              ))}
            </div>
          </div>
        )}

        {screen === "modes" && (
          <div className="mode-screen enter">
            <button className="back-btn" onClick={() => setScreen("landing")}><ArrowLeft size={13} /> Back to letter</button>
            <div className="mode-q">What should happen<br /><em>to your letter?</em></div>
            <p className="mode-sub">Transform it into something beautiful — or burn it completely.</p>
            <div className="modes-row">
              {MODES.map(m => (
                <div key={m.id} className="mode-card" onClick={() => { setMode(m); transform(); }}
                  style={{ borderColor: `${m.col}25` }}>
                  <div className="mode-emoji">{m.emoji}</div>
                  <div className="mode-name" style={{ color: m.col }}>{m.name}</div>
                  <div className="mode-desc">{m.desc}</div>
                </div>
              ))}
              <div className="mode-card burn-full" onClick={() => setScreen("burn")} style={{ background: "rgba(200,60,60,0.04)" }}>
                <div className="mode-emoji">🔥</div>
                <div className="mode-name" style={{ color: "#ef4444" }}>Burn It — Delete Everything</div>
                <div className="mode-desc">Erase this letter permanently. It never existed.</div>
              </div>
            </div>
          </div>
        )}

        {screen === "loading" && (
          <div className="load-screen enter">
            <div className="quill">✍️</div>
            <div className="load-text lora" style={{ fontStyle: "italic" }}>Transforming your truth...</div>
            <div className="mono" style={{ fontSize: 11, color: "rgba(240,232,220,0.3)", letterSpacing: 2, animation: "up 1s ease infinite alternate" }}>UNSENT.AI PROCESSING</div>
          </div>
        )}

        {screen === "output" && (
          <div className="out-screen enter">
            <button className="back-btn" onClick={reset}><ArrowLeft size={13} /> Write another</button>
            <div className="out-card">
              <div className="out-top">
                <div className="out-type">{mode?.emoji} {mode?.name.toUpperCase()} · UNSENT.AI</div>
                <div className="out-to">To {recip?.name}</div>
              </div>
              <div className="out-body">{output}</div>
              <div className="out-foot">
                <button className="act act-share"><Share2 size={12} /> Share Card</button>
                <button className="act act-copy" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
                <button className="act act-reset" onClick={reset}><RefreshCw size={12} /> New Letter</button>
                <button className="act act-burn" onClick={() => setScreen("burn")}><Trash2 size={12} /> Burn It</button>
              </div>
            </div>
          </div>
        )}

        {screen === "burn" && (
          <div className="burn-screen enter">
            <div className="burn-em">{burning ? "💨" : "🔥"}</div>
            <div className="burn-t lora">{burning ? "Burning..." : "Burn This Letter?"}</div>
            <p className="burn-s">{burning ? "Gone forever. Like it never happened." : "This will permanently erase your letter and everything created from it. No trace left."}</p>
            {!burning && <>
              <button className="btn-burn" onClick={burn}>🔥 Yes, Burn It All</button>
              <button className="btn-back" onClick={() => setScreen(output ? "output" : "modes")}>Keep It — Go Back</button>
            </>}
          </div>
        )}
      </div>
    </>
  );
}
