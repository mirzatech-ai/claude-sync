import { useState } from "react";
import { ArrowLeft, Share2, Copy, Check, RefreshCw, Loader, Star, Heart, Flame, Sparkles, Moon, Sun, Baby, MessageSquare, Zap } from "lucide-react";

// ─── CLAUDE API ───────────────────────────────────────────────────
async function ai(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1100, stream: true, system, messages: [{ role: "user", content: user }] }),
  });
  const reader = res.body.getReader(); const dec = new TextDecoder(); let t = "";
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) { try { const j = JSON.parse(line.slice(6)); if (j.type === "content_block_delta" && j.delta?.text) { t += j.delta.text; onChunk(t); } } catch {} }
    }
  }
  return t;
}

// ═══════════════════════════════════════════════════════════════════
// 1. EULOGY AI — Candlelit warmth, parchment, grief with dignity
// ═══════════════════════════════════════════════════════════════════
const EULOGY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  .eulogy { font-family:'DM Sans',sans-serif; min-height:100vh; background:#13100d; color:#f0ead8;
    background-image: radial-gradient(ellipse 70% 50% at 50% 0%,rgba(180,120,40,0.12) 0%,transparent 60%),
      radial-gradient(ellipse 40% 30% at 20% 80%,rgba(120,80,30,0.08) 0%,transparent 60%); }
  .eulogy .screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }
  .eulogy .candle { font-size:56px; margin-bottom:24px; animation:flicker 3s ease infinite; }
  @keyframes flicker { 0%,100%{opacity:1;transform:scale(1)} 33%{opacity:0.85;transform:scale(1.03)} 66%{opacity:0.92;transform:scale(0.98)} }
  .eulogy .title { font-family:'Libre Baskerville',serif; font-size:clamp(36px,6vw,68px); font-weight:700; text-align:center; line-height:1; margin-bottom:10px;
    background:linear-gradient(160deg,#f0ead8 0%,#c8a06a 60%,#8a6030 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .eulogy .price-tag { display:inline-block; font-family:'DM Mono',monospace; font-size:12px; padding:5px 14px; border-radius:20px; border:1px solid rgba(200,160,106,0.3); background:rgba(200,160,106,0.08); color:#c8a06a; margin-bottom:12px; }
  .eulogy .sub { font-family:'Libre Baskerville',serif; font-style:italic; font-size:clamp(15px,2vw,19px); color:rgba(240,234,216,0.45); max-width:480px; text-align:center; line-height:1.65; margin-bottom:44px; }
  .eulogy .card { width:100%; max-width:600px; background:rgba(30,22,14,0.9); border:1px solid rgba(200,160,106,0.18); border-radius:18px; padding:28px; margin-bottom:14px; position:relative; overflow:hidden; }
  .eulogy .card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#c8a06a,#8a6030,#c8a06a); }
  .eulogy .lbl { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2.5px; color:rgba(200,160,106,0.55); margin-bottom:7px; }
  .eulogy .inp { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(200,160,106,0.15); border-radius:9px; padding:12px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:#f0ead8; outline:none; transition:border-color 0.2s; resize:vertical; }
  .eulogy .inp:focus { border-color:rgba(200,160,106,0.5); }
  .eulogy .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .eulogy .f { margin-bottom:14px; }
  .eulogy .btn { width:100%; max-width:600px; padding:17px; border:none; border-radius:14px; background:linear-gradient(135deg,#c8a06a,#8a6030); font-family:'Libre Baskerville',serif; font-size:18px; font-weight:700; color:#1a1208; cursor:pointer; transition:all 0.2s; }
  .eulogy .btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(200,160,106,0.3); }
  .eulogy .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
  .eulogy .out-body { font-family:'Libre Baskerville',serif; font-size:17px; line-height:2; white-space:pre-wrap; color:rgba(240,234,216,0.9); max-height:500px; overflow-y:auto; padding:28px 32px; }
  .eulogy .out-body::-webkit-scrollbar { width:3px; } .eulogy .out-body::-webkit-scrollbar-thumb { background:rgba(200,160,106,0.2); }
  .eulogy .actions { display:flex; gap:10px; padding:16px 32px; border-top:1px solid rgba(200,160,106,0.1); flex-wrap:wrap; }
  .eulogy .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; font-weight:600; border:1px solid; transition:all 0.2s; background:rgba(255,255,255,0.04); border-color:rgba(200,160,106,0.2); color:#c8a06a; }
  .eulogy .act:hover { background:rgba(200,160,106,0.1); }
  .eulogy .load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; }
  .eulogy .load-icon { font-size:60px; animation:flicker 2s ease infinite; }
  .eulogy .back { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(240,234,216,0.35); margin-bottom:32px; }
  .eulogy .back:hover { color:#f0ead8; }
  .eulogy .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .eulogy .spin { animation:spin 1s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

function EulogyAI({ onBack }) {
  const [name, setName] = useState(""); const [rel, setRel] = useState(""); const [age, setAge] = useState(""); const [passed, setPassed] = useState("");
  const [memories, setMemories] = useState(""); const [tone, setTone] = useState("warm");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are EulogyAI — a compassionate writer who helps people find the right words to honor their loved ones. You write eulogies that are specific, warm, and deeply moving. Every eulogy should feel handcrafted, not generic. Capture who this person truly was — their laugh, their habits, their love. Make the family feel seen and held.",
      `Write a eulogy for ${name}.\nRelationship to speaker: ${rel}\nAge: ${age || "unknown"}\nPassed: ${passed || "recently"}\nTone: ${tone}\nMemories and details: "${memories}"\n\nWrite a 4-5 paragraph eulogy that honors their life with dignity and love. Make it feel like it came from the heart.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="eulogy"><style>{EULOGY_CSS}</style>
      <div className="load"><div className="load-icon">🕯️</div>
        <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:20, color:"rgba(240,234,216,0.6)", fontStyle:"italic" }}>Honoring their memory...</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:3, color:"rgba(200,160,106,0.4)", animation:"up 1s ease infinite alternate" }}>EULOGY AI</div>
      </div>
    </div>
  );

  return (
    <div className="eulogy"><style>{EULOGY_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="candle">🕯️</div>
        <div className="title">Eulogy AI</div>
        <div className="price-tag">💛 $25 · HIGHEST URGENCY · PEOPLE SEARCH THIS AT 2AM</div>
        <p className="sub">"In the hardest moment, we find the right words together."</p>
        <div className="card">
          <div className="row2">
            <div className="f"><div className="lbl">THEIR NAME</div><input className="inp" placeholder="e.g. Robert Osmanović" value={name} onChange={e=>setName(e.target.value)}/></div>
            <div className="f"><div className="lbl">YOUR RELATIONSHIP</div><input className="inp" placeholder="e.g. Father, Best Friend" value={rel} onChange={e=>setRel(e.target.value)}/></div>
          </div>
          <div className="row2">
            <div className="f"><div className="lbl">THEIR AGE</div><input className="inp" placeholder="e.g. 72" value={age} onChange={e=>setAge(e.target.value)}/></div>
            <div className="f"><div className="lbl">DATE PASSED</div><input className="inp" placeholder="e.g. April 2025" value={passed} onChange={e=>setPassed(e.target.value)}/></div>
          </div>
          <div className="f"><div className="lbl">TONE</div>
            <select className="inp" value={tone} onChange={e=>setTone(e.target.value)} style={{background:"rgba(255,255,255,0.04)",cursor:"pointer"}}>
              <option value="warm">Warm & Loving</option><option value="celebration">Celebration of Life</option>
              <option value="religious">Religious / Spiritual</option><option value="gentle">Gentle & Quiet</option>
            </select>
          </div>
          <div className="f"><div className="lbl">MEMORIES, STORIES & WHO THEY WERE</div>
            <textarea className="inp" style={{minHeight:140}} placeholder="Share what made them irreplaceable. Their laugh. The way they cooked. What they always said. The moment you'll never forget. How they loved..." value={memories} onChange={e=>setMemories(e.target.value)}/>
          </div>
        </div>
        <button className="btn" onClick={gen} disabled={!name || memories.length < 30}>🕯️ Write the Eulogy</button>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back" onClick={()=>{setOut("");}}><ArrowLeft size={13}/> Start Over</button>
        <div className="card" style={{maxWidth:680,padding:0}}>
          <div style={{padding:"22px 32px 16px",borderBottom:"1px solid rgba(200,160,106,0.1)"}}>
            <div className="lbl">🕯️ EULOGY · EULOGY AI</div>
            <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:24,fontWeight:700,color:"#c8a06a"}}>In Loving Memory of {name}</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="actions">
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy</>}</button>
            <button className="act"><Share2 size={12}/>Share</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>Rewrite</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 2. BABY NAME AI — Organic, warm ivory, parents obsess & share
// ═══════════════════════════════════════════════════════════════════
const BABY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  .baby { font-family:'DM Sans',sans-serif; min-height:100vh; background:#fdf8f3; color:#2a1f14;
    background-image: radial-gradient(ellipse 80% 50% at 50% 0%,rgba(230,180,120,0.15) 0%,transparent 60%); }
  .baby .screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }
  .baby .icon { font-size:60px; margin-bottom:20px; animation:bounce 2s ease infinite; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .baby .title { font-family:'Playfair Display',serif; font-size:clamp(40px,7vw,80px); font-weight:700; text-align:center; line-height:0.9; margin-bottom:12px; color:#2a1f14; }
  .baby .price-tag { display:inline-block; font-family:'DM Mono',monospace; font-size:12px; padding:5px 14px; border-radius:20px; border:1px solid rgba(180,110,50,0.3); background:rgba(180,110,50,0.08); color:#b46e32; margin-bottom:12px; }
  .baby .sub { font-family:'Playfair Display',serif; font-style:italic; font-size:clamp(15px,2vw,18px); color:rgba(42,31,20,0.45); max-width:460px; text-align:center; line-height:1.65; margin-bottom:44px; }
  .baby .card { width:100%; max-width:600px; background:rgba(255,255,255,0.9); border:1px solid rgba(180,110,50,0.15); border-radius:20px; padding:28px; margin-bottom:14px; box-shadow:0 8px 32px rgba(42,31,20,0.08); }
  .baby .lbl { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2.5px; color:rgba(42,31,20,0.35); margin-bottom:7px; }
  .baby .inp { width:100%; background:#faf5ef; border:1px solid rgba(180,110,50,0.18); border-radius:10px; padding:12px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:#2a1f14; outline:none; transition:border-color 0.2s; resize:vertical; }
  .baby .inp:focus { border-color:rgba(180,110,50,0.5); }
  .baby .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .baby .f { margin-bottom:14px; }
  .baby .btn { width:100%; max-width:600px; padding:17px; border:none; border-radius:14px; background:linear-gradient(135deg,#e8a060,#b46e32); font-family:'Playfair Display',serif; font-size:18px; font-weight:700; color:#fff; cursor:pointer; transition:all 0.2s; }
  .baby .btn:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(180,110,50,0.3); }
  .baby .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
  .baby .out-card { width:100%; max-width:680px; background:#fff; border:1px solid rgba(180,110,50,0.15); border-radius:20px; overflow:hidden; box-shadow:0 8px 40px rgba(42,31,20,0.1); }
  .baby .name-result { padding:28px; }
  .baby .name-item { background:#fdf8f3; border:1px solid rgba(180,110,50,0.15); border-radius:14px; padding:20px 24px; margin-bottom:14px; }
  .baby .name-big { font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:#b46e32; margin-bottom:6px; }
  .baby .name-meaning { font-size:14px; line-height:1.65; color:rgba(42,31,20,0.7); }
  .baby .out-raw { padding:24px 28px; font-family:'Playfair Display',serif; font-size:16px; line-height:1.9; white-space:pre-wrap; color:rgba(42,31,20,0.85); max-height:500px; overflow-y:auto; }
  .baby .actions { display:flex; gap:10px; padding:14px 24px; border-top:1px solid rgba(180,110,50,0.1); flex-wrap:wrap; }
  .baby .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; font-weight:600; border:1px solid rgba(180,110,50,0.2); background:rgba(180,110,50,0.06); color:#b46e32; transition:all 0.2s; }
  .baby .act:hover { background:rgba(180,110,50,0.12); }
  .baby .load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; background:#fdf8f3; }
  .baby .back { display:inline-flex; align-items:center; gap:6px; background:rgba(42,31,20,0.06); border:1px solid rgba(42,31,20,0.1); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(42,31,20,0.4); margin-bottom:32px; }
  .baby .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .baby .spin { animation:spin 1s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

function BabyNameAI({ onBack }) {
  const [surname, setSurname] = useState(""); const [origin, setOrigin] = useState(""); const [gender, setGender] = useState("either");
  const [style, setStyle] = useState(""); const [avoid, setAvoid] = useState("");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are BabyNameAI — the world's most thoughtful baby name consultant. You suggest names that are beautiful, meaningful, and flow perfectly with the family name. For each name give: the name itself, its origin, its meaning, why it works with this family, and a nickname option. Suggest 5 names total. Format each as: 🌸 NAME\nOrigin: ...\nMeaning: ...\nWhy it works: ...\nNickname: ...",
      `Suggest baby names for:\nFamily surname: ${surname || "unknown"}\nHeritage/origin preference: ${origin || "open to anything"}\nGender: ${gender}\nStyle preference: ${style || "beautiful, timeless"}\nNames to avoid/not like: ${avoid || "none specified"}\n\nSuggest 5 perfect baby names with full details.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="baby"><style>{BABY_CSS}</style>
      <div className="load"><div style={{fontSize:60,animation:"bounce 2s ease infinite"}}>👶</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"rgba(42,31,20,0.6)",fontStyle:"italic"}}>Finding the perfect name...</div>
      </div>
    </div>
  );

  return (
    <div className="baby"><style>{BABY_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="icon">👶</div>
        <div className="title">Baby Name AI</div>
        <div className="price-tag">🌸 $12 · PARENTS SHARE THIS IN EVERY GROUP CHAT</div>
        <p className="sub">"The perfect name is already waiting — we'll help you find it."</p>
        <div className="card">
          <div className="row2">
            <div className="f"><div className="lbl">FAMILY SURNAME</div><input className="inp" placeholder="e.g. Osmanović" value={surname} onChange={e=>setSurname(e.target.value)}/></div>
            <div className="f"><div className="lbl">GENDER</div>
              <select className="inp" value={gender} onChange={e=>setGender(e.target.value)} style={{cursor:"pointer"}}>
                <option value="girl">Girl</option><option value="boy">Boy</option><option value="either">Either / Surprise</option>
              </select>
            </div>
          </div>
          <div className="f"><div className="lbl">HERITAGE OR ORIGIN (optional)</div><input className="inp" placeholder="e.g. Bosnian, Italian, mixed — whatever feels right" value={origin} onChange={e=>setOrigin(e.target.value)}/></div>
          <div className="f"><div className="lbl">NAME STYLE / FEEL</div><input className="inp" placeholder="e.g. classic & timeless, short & strong, poetic, royal, nature-inspired..." value={style} onChange={e=>setStyle(e.target.value)}/></div>
          <div className="f"><div className="lbl">NAMES YOU DON'T WANT (optional)</div><input className="inp" placeholder="e.g. nothing ending in -ayden, nothing too trendy..." value={avoid} onChange={e=>setAvoid(e.target.value)}/></div>
        </div>
        <button className="btn" onClick={gen}>🌸 Find Our Baby's Name</button>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back" onClick={()=>setOut("")}><ArrowLeft size={13}/> Redo</button>
        <div className="out-card">
          <div style={{padding:"22px 28px 14px",borderBottom:"1px solid rgba(180,110,50,0.1)"}}>
            <div className="lbl">👶 YOUR BABY NAMES · BABYNAME.AI</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#b46e32"}}>5 Perfect Names for Your Family</div>
          </div>
          <div className="out-raw">{out}</div>
          <div className="actions">
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy All</>}</button>
            <button className="act"><Share2 size={12}/>Share with Partner</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>More Names</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 3. AI HOROSCOPE — Dark celestial, zodiac, people screenshot & share
// ═══════════════════════════════════════════════════════════════════
const HORO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap');
  .horo { font-family:'DM Sans',sans-serif; min-height:100vh; background:#07050f; color:#e8e0f8;
    background-image: radial-gradient(ellipse 80% 60% at 50% -5%,rgba(88,50,200,0.14) 0%,transparent 65%),
      radial-gradient(ellipse 50% 40% at 85% 100%,rgba(50,20,100,0.1) 0%,transparent 60%); }
  .horo::before { content:''; position:fixed; inset:0; pointer-events:none;
    background-image: radial-gradient(circle 1px at var(--x,20%) var(--y,30%),rgba(255,255,255,0.6) 0px,transparent 1px);
    background-size:60px 60px; opacity:0.25; }
  .horo .screen { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }
  .horo .stars-top { font-size:14px; letter-spacing:12px; color:rgba(180,160,255,0.3); margin-bottom:20px; }
  .horo .title { font-family:'Cinzel',serif; font-size:clamp(36px,6vw,72px); font-weight:900; text-align:center; line-height:0.9; margin-bottom:12px;
    background:linear-gradient(160deg,#e8e0f8 0%,#b090f8 50%,#7050d0 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 0 40px rgba(140,100,255,0.3)); }
  .horo .price-tag { display:inline-block; font-family:'DM Mono',monospace; font-size:11px; padding:5px 14px; border-radius:20px; border:1px solid rgba(140,100,255,0.3); background:rgba(140,100,255,0.08); color:#9870e8; margin-bottom:12px; }
  .horo .sub { font-family:'Cinzel',serif; font-size:clamp(13px,1.8vw,17px); color:rgba(232,224,248,0.35); max-width:460px; text-align:center; line-height:1.7; margin-bottom:44px; font-weight:400; letter-spacing:0.5px; }
  .horo .sign-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; width:100%; max-width:620px; margin-bottom:28px; }
  .horo .sign-btn { padding:12px 8px; border-radius:12px; border:1px solid rgba(140,100,255,0.15); background:rgba(140,100,255,0.05); cursor:pointer; text-align:center; transition:all 0.2s; }
  .horo .sign-btn:hover, .horo .sign-btn.on { border-color:rgba(140,100,255,0.5); background:rgba(140,100,255,0.12); }
  .horo .sign-em { font-size:22px; margin-bottom:4px; }
  .horo .sign-nm { font-family:'Cinzel',serif; font-size:9px; letter-spacing:1px; color:rgba(232,224,248,0.5); }
  .horo .card { width:100%; max-width:580px; background:rgba(14,8,30,0.95); border:1px solid rgba(140,100,255,0.18); border-radius:18px; padding:24px; margin-bottom:14px; }
  .horo .lbl { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2.5px; color:rgba(140,100,255,0.5); margin-bottom:7px; }
  .horo .inp { width:100%; background:rgba(140,100,255,0.05); border:1px solid rgba(140,100,255,0.15); border-radius:9px; padding:12px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:#e8e0f8; outline:none; transition:border-color 0.2s; resize:vertical; }
  .horo .inp:focus { border-color:rgba(140,100,255,0.5); }
  .horo .f { margin-bottom:14px; }
  .horo .r2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .horo .btn { width:100%; max-width:580px; padding:17px; border:none; border-radius:14px; background:linear-gradient(135deg,#7050d0,#4020a0); font-family:'Cinzel',serif; font-size:18px; font-weight:700; letter-spacing:1px; color:#e8e0f8; cursor:pointer; transition:all 0.2s; }
  .horo .btn:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(112,80,208,0.4); }
  .horo .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
  .horo .out-card { width:100%; max-width:680px; background:rgba(14,8,30,0.97); border:1px solid rgba(140,100,255,0.25); border-radius:20px; overflow:hidden; box-shadow:0 0 80px rgba(112,80,208,0.12); }
  .horo .out-top { padding:24px 32px 18px; border-bottom:1px solid rgba(140,100,255,0.1); }
  .horo .out-top::before { content:''; display:block; height:2px; background:linear-gradient(90deg,#7050d0,#b090f8,#7050d0); border-radius:2px; margin-bottom:18px; }
  .horo .out-body { padding:26px 32px; font-family:'Cinzel',serif; font-size:15px; line-height:2; white-space:pre-wrap; color:rgba(232,224,248,0.9); max-height:500px; overflow-y:auto; }
  .horo .out-body::-webkit-scrollbar { width:3px; } .horo .out-body::-webkit-scrollbar-thumb { background:rgba(140,100,255,0.2); }
  .horo .actions { display:flex; gap:10px; padding:14px 32px; border-top:1px solid rgba(140,100,255,0.1); flex-wrap:wrap; }
  .horo .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; border:1px solid rgba(140,100,255,0.2); background:rgba(140,100,255,0.07); color:#9870e8; transition:all 0.2s; }
  .horo .act:hover { background:rgba(140,100,255,0.14); }
  .horo .load { position:relative; z-index:1; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px; }
  .horo .spin-star { font-size:60px; animation:spinStar 3s linear infinite; }
  @keyframes spinStar { to{transform:rotate(360deg)} }
  .horo .back { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(232,224,248,0.3); margin-bottom:32px; }
  .horo .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

const SIGNS = [
  {em:"♈",nm:"Aries"},{em:"♉",nm:"Taurus"},{em:"♊",nm:"Gemini"},{em:"♋",nm:"Cancer"},
  {em:"♌",nm:"Leo"},{em:"♍",nm:"Virgo"},{em:"♎",nm:"Libra"},{em:"♏",nm:"Scorpio"},
  {em:"♐",nm:"Sagitt."},{em:"♑",nm:"Capric."},{em:"♒",nm:"Aquarius"},{em:"♓",nm:"Pisces"},
];

function HoroscopeAI({ onBack }) {
  const [sign, setSign] = useState(""); const [name, setName] = useState(""); const [question, setQuestion] = useState(""); const [focus, setFocus] = useState("general");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are AstroAI — a mystical, deeply intuitive astrologer who gives eerily accurate personalized readings. Your readings feel like you know the person. Use celestial language, planetary references, and specific guidance. Format with sections: ✨ TODAY'S COSMIC ENERGY · 💫 LOVE & CONNECTION · 🔮 CAREER & PURPOSE · ⚡ WARNING FROM THE STARS · 🌙 THE MOON'S MESSAGE · 🌟 YOUR POWER MOVE TODAY. Make it specific enough that people screenshot and send to friends saying 'omg this is so accurate'.",
      `${name ? `Name: ${name}` : ""}\nZodiac: ${sign}\nFocus area: ${focus}\nPersonal question: ${question || "What should I know right now?"}\n\nWrite a deeply personal, eerily accurate horoscope reading.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="horo"><style>{HORO_CSS}</style>
      <div className="load"><div className="spin-star">⭐</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:"rgba(232,224,248,0.5)",letterSpacing:2}}>READING THE STARS</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(140,100,255,0.4)",letterSpacing:3}}>ASTRO AI · CONSULTING THE COSMOS</div>
      </div>
    </div>
  );

  return (
    <div className="horo"><style>{HORO_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="stars-top">✦ ✦ ✦ ✦ ✦</div>
        <div className="title">AI ORACLE</div>
        <div className="price-tag">⭐ $5 · PEOPLE SCREENSHOT & SHARE EVERY READING</div>
        <p className="sub">The stars have already written your story. We're just helping you read it.</p>
        <div className="sign-grid">
          {SIGNS.map(s => <div key={s.nm} className={`sign-btn ${sign===s.nm?"on":""}`} onClick={()=>setSign(s.nm)}><div className="sign-em">{s.em}</div><div className="sign-nm">{s.nm}</div></div>)}
        </div>
        {sign && <div className="card ent">
          <div className="r2">
            <div className="f"><div className="lbl">YOUR NAME (optional)</div><input className="inp" placeholder="First name..." value={name} onChange={e=>setName(e.target.value)}/></div>
            <div className="f"><div className="lbl">FOCUS AREA</div>
              <select className="inp" value={focus} onChange={e=>setFocus(e.target.value)} style={{cursor:"pointer",background:"rgba(140,100,255,0.05)"}}>
                <option value="general">General Life Reading</option><option value="love">Love & Relationships</option>
                <option value="career">Career & Money</option><option value="health">Health & Energy</option><option value="spiritual">Spiritual Path</option>
              </select>
            </div>
          </div>
          <div className="f"><div className="lbl">YOUR QUESTION FOR THE STARS</div><input className="inp" placeholder="e.g. Should I make this big decision? Why do I feel stuck? What's coming?" value={question} onChange={e=>setQuestion(e.target.value)}/></div>
        </div>}
        <button className="btn" onClick={gen} disabled={!sign}>✦ Reveal My Reading ✦</button>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back" onClick={()=>setOut("")}><ArrowLeft size={13}/> New Reading</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl">✦ YOUR COSMIC READING · AI ORACLE</div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:700,color:"#9870e8"}}>{sign} Reading {name ? `for ${name}` : ""}</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="actions">
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy & Share</>}</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>New Reading</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 4. BREAKUP TEXT AI — Bold Gen Z editorial, black/neon
// ═══════════════════════════════════════════════════════════════════
const BREAK_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  .break { font-family:'DM Sans',sans-serif; min-height:100vh; background:#080808; color:#f5f0ff;
    background-image: radial-gradient(ellipse 50% 30% at 50% 0%,rgba(255,20,100,0.1) 0%,transparent 60%); }
  .break .screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }
  .break .icon { font-size:56px; margin-bottom:20px; }
  .break .title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(56px,10vw,120px); font-weight:900; text-align:center; line-height:0.85; margin-bottom:12px; letter-spacing:-2px;
    background:linear-gradient(160deg,#f5f0ff 0%,#ff1464 60%,#8800ff 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .break .price-tag { display:inline-block; font-family:'DM Mono',monospace; font-size:11px; padding:5px 14px; border-radius:20px; border:1px solid rgba(255,20,100,0.3); background:rgba(255,20,100,0.08); color:#ff1464; margin-bottom:10px; }
  .break .sub { font-size:clamp(14px,1.8vw,17px); color:rgba(245,240,255,0.4); max-width:440px; text-align:center; line-height:1.6; margin-bottom:44px; }
  .break .card { width:100%; max-width:600px; background:rgba(20,10,20,0.95); border:1px solid rgba(255,20,100,0.15); border-radius:18px; padding:24px; margin-bottom:14px; }
  .break .lbl { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; color:rgba(255,20,100,0.5); margin-bottom:7px; }
  .break .inp { width:100%; background:rgba(255,20,100,0.04); border:1px solid rgba(255,20,100,0.12); border-radius:9px; padding:12px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:#f5f0ff; outline:none; resize:vertical; transition:border-color 0.2s; }
  .break .inp:focus { border-color:rgba(255,20,100,0.45); }
  .break .r2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .break .f { margin-bottom:14px; }
  .break .btn { width:100%; max-width:600px; padding:17px; border:none; border-radius:14px; background:linear-gradient(135deg,#ff1464,#8800ff); font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:900; letter-spacing:1px; color:#fff; cursor:pointer; transition:all 0.2s; }
  .break .btn:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(255,20,100,0.35); }
  .break .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
  .break .out-card { width:100%; max-width:660px; background:rgba(20,10,20,0.97); border:1px solid rgba(255,20,100,0.2); border-radius:20px; overflow:hidden; }
  .break .out-top { padding:22px 30px 16px; border-bottom:1px solid rgba(255,20,100,0.1); }
  .break .out-top::before { content:''; display:block; height:3px; background:linear-gradient(90deg,#ff1464,#8800ff,#ff1464); border-radius:2px; margin-bottom:16px; }
  .break .out-body { padding:24px 30px; font-size:16px; line-height:1.85; white-space:pre-wrap; color:rgba(245,240,255,0.9); max-height:460px; overflow-y:auto; }
  .break .out-body::-webkit-scrollbar { width:3px; } .break .out-body::-webkit-scrollbar-thumb { background:rgba(255,20,100,0.2); }
  .break .actions { display:flex; gap:10px; padding:14px 30px; border-top:1px solid rgba(255,20,100,0.1); flex-wrap:wrap; }
  .break .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; border:1px solid rgba(255,20,100,0.2); background:rgba(255,20,100,0.06); color:#ff1464; transition:all 0.2s; }
  .break .act:hover { background:rgba(255,20,100,0.12); }
  .break .load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; background:#080808; }
  .break .back { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(245,240,255,0.3); margin-bottom:32px; }
  .break .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .break .spin { animation:spin 1s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

function BreakupTextAI({ onBack }) {
  const [their, setTheir] = useState(""); const [duration, setDuration] = useState(""); const [reason, setReason] = useState("");
  const [tone, setTone] = useState("kind"); const [method, setMethod] = useState("text");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are BreakupAI — a compassionate communication expert who helps people end relationships with clarity, kindness, and dignity. Write breakup messages that are clear (no false hope), respectful (not cruel), honest (real reason without attack), and final (no ambiguity). Give 2-3 variations: SHORT (2-3 sentences), MEDIUM (full text/message), LONG (full conversation starter). Label each clearly.",
      `Write a breakup ${method} for:\nTheir name: ${their || "them"}\nRelationship length: ${duration || "some time"}\nReason (honest): ${reason}\nTone: ${tone}\n\nWrite SHORT, MEDIUM, and LONG versions. All should be clear that it's over with no false hope, but respectful.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="break"><style>{BREAK_CSS}</style>
      <div className="load"><div style={{fontSize:60}}>💔</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,letterSpacing:2,color:"rgba(245,240,255,0.5)"}}>FINDING THE WORDS...</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(255,20,100,0.4)",letterSpacing:3}}>BREAKUP AI</div>
      </div>
    </div>
  );

  return (
    <div className="break"><style>{BREAK_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="icon">💔</div>
        <div className="title">BREAKUP AI</div>
        <div className="price-tag">💔 $8 · HIGHEST EMOTIONAL URGENCY · NEEDED RIGHT NOW</div>
        <p className="sub">You know it's over. You just don't know how to say it. We do.</p>
        <div className="card">
          <div className="r2">
            <div className="f"><div className="lbl">THEIR NAME (optional)</div><input className="inp" placeholder="Their first name..." value={their} onChange={e=>setTheir(e.target.value)}/></div>
            <div className="f"><div className="lbl">HOW LONG TOGETHER</div><input className="inp" placeholder="e.g. 6 months, 2 years..." value={duration} onChange={e=>setDuration(e.target.value)}/></div>
          </div>
          <div className="r2">
            <div className="f"><div className="lbl">HOW TO SEND THIS</div>
              <select className="inp" value={method} onChange={e=>setMethod(e.target.value)} style={{cursor:"pointer",background:"rgba(255,20,100,0.04)"}}>
                <option value="text">Text Message</option><option value="letter">Letter / Long Message</option>
                <option value="conversation">In-Person Conversation</option><option value="email">Email</option>
              </select>
            </div>
            <div className="f"><div className="lbl">TONE</div>
              <select className="inp" value={tone} onChange={e=>setTone(e.target.value)} style={{cursor:"pointer",background:"rgba(255,20,100,0.04)"}}>
                <option value="kind">Kind & Gentle</option><option value="direct">Direct & Clear</option>
                <option value="closure">Seeking Closure</option><option value="firm">Firm & Final</option>
              </select>
            </div>
          </div>
          <div className="f"><div className="lbl">THE REAL REASON (honest — it stays private)</div>
            <textarea className="inp" style={{minHeight:90}} placeholder="Be honest here — it helps us write something real. We fell apart. I'm not in love anymore. The timing is wrong. We want different things..." value={reason} onChange={e=>setReason(e.target.value)}/>
          </div>
        </div>
        <button className="btn" onClick={gen} disabled={reason.length < 10}>💔 Write My Message</button>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back" onClick={()=>setOut("")}><ArrowLeft size={13}/> Redo</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl">💔 YOUR MESSAGE · BREAKUP AI</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#ff1464",letterSpacing:1}}>3 VERSIONS — CHOOSE YOURS</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="actions">
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy</>}</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>Rewrite</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 5. REVENGE GLOW UP AI — Fire transformation, cinematic, gold/dark
// ═══════════════════════════════════════════════════════════════════
const GLOW_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  .glow { font-family:'DM Sans',sans-serif; min-height:100vh; background:#080600; color:#fdf0d0;
    background-image: radial-gradient(ellipse 70% 50% at 50% -5%,rgba(200,140,20,0.14) 0%,transparent 60%),
      radial-gradient(ellipse 40% 30% at 80% 100%,rgba(200,60,10,0.08) 0%,transparent 55%); }
  .glow .screen { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }
  .glow .fire-row { font-size:40px; letter-spacing:8px; margin-bottom:20px; animation:firerow 2s ease infinite; }
  @keyframes firerow { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  .glow .title { font-family:'Anton',sans-serif; font-size:clamp(44px,8vw,96px); text-align:center; line-height:0.85; margin-bottom:12px; letter-spacing:2px;
    background:linear-gradient(160deg,#fdf0d0 0%,#f59e0b 45%,#ef4444 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 0 40px rgba(245,158,11,0.25)); }
  .glow .price-tag { display:inline-block; font-family:'DM Mono',monospace; font-size:11px; padding:5px 14px; border-radius:20px; border:1px solid rgba(245,158,11,0.3); background:rgba(245,158,11,0.08); color:#f59e0b; margin-bottom:10px; }
  .glow .sub { font-size:clamp(14px,1.8vw,17px); color:rgba(253,240,208,0.4); max-width:460px; text-align:center; line-height:1.65; margin-bottom:44px; }
  .glow .card { width:100%; max-width:600px; background:rgba(20,14,4,0.95); border:1px solid rgba(245,158,11,0.15); border-radius:18px; padding:24px; margin-bottom:14px; }
  .glow .lbl { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; color:rgba(245,158,11,0.5); margin-bottom:7px; }
  .glow .inp { width:100%; background:rgba(245,158,11,0.04); border:1px solid rgba(245,158,11,0.12); border-radius:9px; padding:12px 14px; font-size:14px; font-family:'DM Sans',sans-serif; color:#fdf0d0; outline:none; resize:vertical; transition:border-color 0.2s; }
  .glow .inp:focus { border-color:rgba(245,158,11,0.5); }
  .glow .r2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .glow .f { margin-bottom:14px; }
  .glow .btn { width:100%; max-width:600px; padding:17px; border:none; border-radius:14px; background:linear-gradient(135deg,#f59e0b,#ef4444,#7f1d1d); font-family:'Anton',sans-serif; font-size:22px; letter-spacing:2px; color:#fdf0d0; cursor:pointer; transition:all 0.2s; }
  .glow .btn:hover { transform:translateY(-2px); box-shadow:0 10px 40px rgba(245,158,11,0.3); }
  .glow .btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
  .glow .out-card { width:100%; max-width:700px; background:rgba(20,14,4,0.97); border:1px solid rgba(245,158,11,0.2); border-radius:20px; overflow:hidden; box-shadow:0 0 80px rgba(245,158,11,0.07); }
  .glow .out-top { padding:24px 32px 18px; border-bottom:1px solid rgba(245,158,11,0.1); }
  .glow .out-top::before { content:''; display:block; height:3px; background:linear-gradient(90deg,#f59e0b,#ef4444,#f59e0b); border-radius:2px; margin-bottom:16px; }
  .glow .out-body { padding:24px 32px; font-size:15px; line-height:1.9; white-space:pre-wrap; color:rgba(253,240,208,0.9); max-height:500px; overflow-y:auto; }
  .glow .out-body::-webkit-scrollbar { width:3px; } .glow .out-body::-webkit-scrollbar-thumb { background:rgba(245,158,11,0.2); }
  .glow .actions { display:flex; gap:10px; padding:14px 32px; border-top:1px solid rgba(245,158,11,0.1); flex-wrap:wrap; }
  .glow .act { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:9px; cursor:pointer; font-size:12px; border:1px solid rgba(245,158,11,0.2); background:rgba(245,158,11,0.06); color:#f59e0b; transition:all 0.2s; }
  .glow .act:hover { background:rgba(245,158,11,0.12); }
  .glow .load { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px; background:#080600; }
  .glow .back { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.07); border-radius:9px; padding:8px 14px; cursor:pointer; font-size:12px; color:rgba(253,240,208,0.3); margin-bottom:32px; }
  .glow .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .glow .spin { animation:spin 1s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

function GlowUpAI({ onBack }) {
  const [situation, setSituation] = useState(""); const [timeline, setTimeline] = useState("30");
  const [areas, setAreas] = useState([]); const [goal, setGoal] = useState("");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const toggleArea = (a) => setAreas(prev => prev.includes(a) ? prev.filter(x=>x!==a) : [...prev, a]);
  const AREA_OPTS = ["Body & Fitness","Style & Appearance","Career & Money","Social Life","Mental Health","Dating & Love","Skills & Hobbies","Travel & Adventure"];

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are GlowUpAI — the most motivating transformation coach on earth. You create detailed, specific, achievable revenge glow up plans. The energy is 'you're about to become the main character.' Be specific, tactical, and hype them up. Format: 🔥 THE MISSION STATEMENT · 📅 WEEK 1 (Days 1-7) · 📅 WEEK 2 (Days 8-14) · 📅 WEEK 3 (Days 15-21) · 📅 WEEK 4 (Days 22-30) · ⚡ THE SECRET WEAPON · 🏆 SUCCESS VISION. Each week has 5-6 specific daily actions. Make them feel UNSTOPPABLE.",
      `Create a ${timeline}-day revenge glow up plan.\nSituation (why they need this): "${situation}"\nFocus areas: ${areas.join(", ") || "all areas"}\nEnd goal: ${goal || "become unrecognizable"}\n\nMake this plan so specific and motivating they'll post it publicly and tag us.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="glow"><style>{GLOW_CSS}</style>
      <div className="load"><div style={{fontSize:64,animation:"firerow 1.5s ease infinite"}}>🔥</div>
        <div style={{fontFamily:"'Anton',sans-serif",fontSize:24,letterSpacing:3,color:"rgba(253,240,208,0.5)"}}>BUILDING YOUR TRANSFORMATION</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(245,158,11,0.4)",letterSpacing:3}}>GLOW UP AI</div>
      </div>
    </div>
  );

  return (
    <div className="glow"><style>{GLOW_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="fire-row">🔥🔥🔥</div>
        <div className="title">REVENGE GLOW UP</div>
        <div className="price-tag">🔥 $9 · PEOPLE POST THEIR PLAN ON SOCIAL MEDIA</div>
        <p className="sub">They thought you'd fall apart. Let's build the version of you that makes them regret everything.</p>
        <div className="card">
          <div className="f"><div className="lbl">WHAT HAPPENED (the situation)</div>
            <textarea className="inp" style={{minHeight:90}} placeholder="Breakup? Job loss? Betrayal? Humiliation? Rock bottom? Tell us what lit the fire — the more honest, the more powerful the plan..." value={situation} onChange={e=>setSituation(e.target.value)}/>
          </div>
          <div className="f"><div className="lbl">GLOW UP TIMELINE</div>
            <select className="inp" value={timeline} onChange={e=>setTimeline(e.target.value)} style={{cursor:"pointer",background:"rgba(245,158,11,0.04)"}}>
              <option value="30">30 Days — The Classic</option><option value="60">60 Days — Deep Transformation</option><option value="90">90 Days — Full Reinvention</option>
            </select>
          </div>
          <div className="f"><div className="lbl">FOCUS AREAS (select all that apply)</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>
              {AREA_OPTS.map(a => <div key={a} onClick={()=>toggleArea(a)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${areas.includes(a)?"rgba(245,158,11,0.5)":"rgba(245,158,11,0.12)"}`,background:areas.includes(a)?"rgba(245,158,11,0.1)":"rgba(245,158,11,0.03)",cursor:"pointer",fontSize:12,color:areas.includes(a)?"#f59e0b":"rgba(253,240,208,0.45)",transition:"all 0.15s"}}>{a}</div>)}
            </div>
          </div>
          <div className="f"><div className="lbl">THE VISION (what does winning look like?)</div>
            <input className="inp" placeholder="e.g. They see me in 30 days and can't believe what I've become..." value={goal} onChange={e=>setGoal(e.target.value)}/>
          </div>
        </div>
        <button className="btn" onClick={gen} disabled={situation.length < 20}>🔥 BUILD MY GLOW UP PLAN</button>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back" onClick={()=>setOut("")}><ArrowLeft size={13}/> Redo</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl">🔥 YOUR TRANSFORMATION PLAN · GLOW UP AI</div>
            <div style={{fontFamily:"'Anton',sans-serif",fontSize:26,letterSpacing:2,color:"#f59e0b"}}>{timeline}-DAY REVENGE GLOW UP</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="actions">
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy Plan</>}</button>
            <button className="act"><Share2 size={12}/>Post on Social</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>Rebuild Plan</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN HUB — Sells itself with the lineup
// ═══════════════════════════════════════════════════════════════════
const HUB_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  .hub-page { font-family:'DM Sans',sans-serif; min-height:100vh; background:#070509; color:#f0eaf8;
    background-image: radial-gradient(ellipse 60% 40% at 30% 0%,rgba(120,60,200,0.07) 0%,transparent 55%),
      radial-gradient(ellipse 50% 35% at 70% 100%,rgba(200,100,20,0.06) 0%,transparent 55%); }
  .hub-page .inner { max-width:760px; margin:0 auto; padding:64px 24px; }
  .hub-page .eyebrow { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:4px; color:rgba(240,234,248,0.25); margin-bottom:20px; text-align:center; }
  .hub-page .hub-title { font-family:'Syne',sans-serif; font-size:clamp(36px,6vw,72px); font-weight:900; text-align:center; line-height:0.9; margin-bottom:16px; }
  .hub-page .hub-sub { font-size:15px; color:rgba(240,234,248,0.4); text-align:center; margin-bottom:56px; line-height:1.6; }
  .hub-page .products { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:48px; }
  .hub-page .p-card { padding:28px 24px; border-radius:18px; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.025); cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden; }
  .hub-page .p-card::before { content:''; position:absolute; inset:0; opacity:0; transition:opacity 0.25s; }
  .hub-page .p-card:hover { transform:translateY(-3px); }
  .hub-page .p-card:hover::before { opacity:1; }
  .hub-page .p-em { font-size:40px; margin-bottom:12px; display:block; }
  .hub-page .p-price { font-family:'DM Mono',monospace; font-size:11px; font-weight:700; padding:4px 12px; border-radius:20px; margin-bottom:14px; display:inline-block; }
  .hub-page .p-name { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; margin-bottom:7px; }
  .hub-page .p-why { font-size:12px; color:rgba(240,234,248,0.4); line-height:1.55; }
  .hub-page .law { text-align:center; font-size:10px; color:rgba(240,234,248,0.18); letter-spacing:1px; margin-top:40px; }
  .hub-page .ent { animation:up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
`;

const PRODUCTS_HUB = [
  { id:"eulogy",   em:"🕯️", name:"Eulogy AI",          price:"$25", why:"Person is grieving at 2am. No alternatives exist. Highest urgency purchase on earth.",         priceBg:"rgba(200,160,106,0.1)", priceCol:"#c8a06a", border:"rgba(200,160,106,0.2)", glow:"rgba(200,160,106,0.06)", textCol:"#c8a06a" },
  { id:"baby",     em:"👶", name:"Baby Name AI",        price:"$12", why:"Parents obsess & share in group chats. Spreadword = free marketing. Zero price sensitivity.",   priceBg:"rgba(180,110,50,0.1)",  priceCol:"#b46e32", border:"rgba(180,110,50,0.2)",  glow:"rgba(180,110,50,0.05)",  textCol:"#b46e32" },
  { id:"horoscope",em:"⭐", name:"AI Oracle",           price:"$5",  why:"People screenshot & send to friends: 'omg this is SO accurate'. Every read = 3 new customers.", priceBg:"rgba(140,100,255,0.1)", priceCol:"#9870e8", border:"rgba(140,100,255,0.2)", glow:"rgba(140,100,255,0.05)", textCol:"#9870e8" },
  { id:"breakup",  em:"💔", name:"Breakup Text AI",     price:"$8",  why:"Emotional urgency, needed RIGHT NOW. The eloquent message makes the recipient ask how.",         priceBg:"rgba(255,20,100,0.1)",  priceCol:"#ff1464", border:"rgba(255,20,100,0.18)", glow:"rgba(255,20,100,0.05)",  textCol:"#ff1464" },
  { id:"glow",     em:"🔥", name:"Revenge Glow Up AI",  price:"$9",  why:"People POST their plan publicly & tag the app. Every post = free viral reach.",                 priceBg:"rgba(245,158,11,0.1)",  priceCol:"#f59e0b", border:"rgba(245,158,11,0.2)", glow:"rgba(245,158,11,0.05)",  textCol:"#f59e0b" },
];

export default function SelfSellingHub() {
  const [active, setActive] = useState(null);
  if (active === "eulogy")   return <EulogyAI   onBack={()=>setActive(null)}/>;
  if (active === "baby")     return <BabyNameAI  onBack={()=>setActive(null)}/>;
  if (active === "horoscope")return <HoroscopeAI onBack={()=>setActive(null)}/>;
  if (active === "breakup")  return <BreakupTextAI onBack={()=>setActive(null)}/>;
  if (active === "glow")     return <GlowUpAI    onBack={()=>setActive(null)}/>;

  return (
    <>
      <style>{HUB_CSS}</style>
      <div className="hub-page">
        <div className="inner ent">
          <div className="eyebrow">MIRZATECH.AI · SELF-SELLING PRODUCT SUITE</div>
          <div className="hub-title">
            Products that<br/>
            <span style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>sell themselves.</span>
          </div>
          <p className="hub-sub">5 micro-products. Each one targets a moment of peak emotional urgency. <br/>People don't think — they just buy.</p>

          <div className="products">
            {PRODUCTS_HUB.map((p) => (
              <div key={p.id} className="p-card" onClick={()=>setActive(p.id)}
                style={{borderColor:p.border}}>
                <div className="p-card" style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${p.glow},transparent 70%)`,borderRadius:18,border:"none",pointerEvents:"none"}}/>
                <span className="p-em">{p.em}</span>
                <div className="p-price" style={{background:p.priceBg,color:p.priceCol,border:`1px solid ${p.border}`}}>{p.price} PER USE</div>
                <div className="p-name" style={{color:p.textCol}}>{p.name}</div>
                <p className="p-why">{p.why}</p>
              </div>
            ))}

            <div className="p-card" style={{borderColor:"rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.015)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",opacity:0.6}}>
              <div style={{fontSize:28,marginBottom:10}}>＋</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,marginBottom:6}}>More Coming</div>
              <p style={{fontSize:11,color:"rgba(240,234,248,0.3)",lineHeight:1.5}}>Eulogy companion · Tattoo meaning · Name personality · First date plan · Reference letter AI</p>
            </div>
          </div>

          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"20px 24px",marginBottom:20}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,color:"rgba(240,234,248,0.25)",marginBottom:12}}>COMBINED MONTHLY TARGET</div>
            <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
              {[["Eulogy","$25 × 40/day","$30K/mo"],["Baby Names","$12 × 80/day","$28.8K/mo"],["AI Oracle","$5 × 200/day","$30K/mo"],["Breakup","$8 × 120/day","$28.8K/mo"],["Glow Up","$9 × 100/day","$27K/mo"]].map(([n,v,mo],i)=>(
                <div key={i}><div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(240,234,248,0.3)",marginBottom:3}}>{n}</div><div style={{fontSize:12,color:"rgba(240,234,248,0.6)",marginBottom:2}}>{v}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:14,fontWeight:700,color:"#f59e0b"}}>{mo}</div></div>
              ))}
            </div>
          </div>

          <div className="law">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
        </div>
      </div>
    </>
  );
}
