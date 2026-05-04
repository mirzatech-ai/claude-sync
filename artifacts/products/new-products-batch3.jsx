import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, Share2, Loader, Sparkles, Mic } from "lucide-react";

// ─── CLAUDE API ───────────────────────────────────────────────────
async function ai(sys, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true, system: sys, messages: [{ role: "user", content: user }] }),
  });
  const r = res.body.getReader(); const d = new TextDecoder(); let t = "";
  while (true) {
    const { done, value } = await r.read(); if (done) break;
    for (const line of d.decode(value).split("\n")) {
      if (line.startsWith("data: ")) { try { const j = JSON.parse(line.slice(6)); if (j.type === "content_block_delta" && j.delta?.text) { t += j.delta.text; onChunk(t); } } catch {} }
    }
  }
  return t;
}

// ═══════════════════════════════════════════════════════════
// 1. TATTOOMUSE AI — Dark ink, parlour aesthetic
// ═══════════════════════════════════════════════════════════
const TM_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:#070609;min-height:100%;}
  .tm{font-family:'DM Sans',sans-serif;min-height:100vh;background:#070609;color:#f0ecf8;
    background-image:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(80,20,120,0.12) 0%,transparent 60%);}
  .oswald{font-family:'Oswald',sans-serif;}
  .mono{font-family:'DM Mono',monospace;}
  .screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;}
  .title{font-family:'Oswald',sans-serif;font-size:clamp(52px,9vw,100px);font-weight:700;text-align:center;line-height:0.88;letter-spacing:2px;margin-bottom:14px;
    background:linear-gradient(160deg,#f0ecf8 0%,#9060d0 50%,#3a0060 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .price-tag{display:inline-block;font-family:'DM Mono',monospace;font-size:11px;padding:5px 14px;border-radius:20px;border:1px solid rgba(144,96,208,0.3);background:rgba(144,96,208,0.08);color:#9060d0;margin-bottom:12px;}
  .sub{font-size:clamp(14px,1.8vw,17px);color:rgba(240,236,248,0.4);max-width:480px;text-align:center;line-height:1.65;margin-bottom:44px;}
  .card{width:100%;max-width:620px;background:rgba(15,8,24,0.95);border:1px solid rgba(144,96,208,0.18);border-radius:18px;padding:24px;margin-bottom:14px;position:relative;overflow:hidden;}
  .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#9060d0,#6020a0,#9060d0);}
  .lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(144,96,208,0.5);margin-bottom:7px;}
  .inp{width:100%;background:rgba(144,96,208,0.05);border:1px solid rgba(144,96,208,0.15);border-radius:9px;padding:12px 14px;font-size:14px;font-family:'DM Sans',sans-serif;color:#f0ecf8;outline:none;resize:vertical;transition:border-color 0.2s;}
  .inp:focus{border-color:rgba(144,96,208,0.5);}
  .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
  .f{margin-bottom:14px;}
  .btn{width:100%;max-width:620px;padding:17px;border:none;border-radius:14px;background:linear-gradient(135deg,#9060d0,#3a0060);font-family:'Oswald',sans-serif;font-size:22px;font-weight:700;letter-spacing:2px;color:#f0ecf8;cursor:pointer;transition:all 0.2s;}
  .btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(144,96,208,0.35);}
  .btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
  .out-card{width:100%;max-width:700px;background:rgba(15,8,24,0.97);border:1px solid rgba(144,96,208,0.2);border-radius:20px;overflow:hidden;box-shadow:0 0 80px rgba(144,96,208,0.08);}
  .out-top{padding:22px 32px 18px;border-bottom:1px solid rgba(144,96,208,0.1);}
  .out-top::before{content:'';display:block;height:2px;background:linear-gradient(90deg,#9060d0,#6020a0,#9060d0);border-radius:2px;margin-bottom:16px;}
  .out-body{padding:24px 32px;font-size:14px;line-height:1.85;white-space:pre-wrap;color:rgba(240,236,248,0.88);max-height:500px;overflow-y:auto;}
  .out-body::-webkit-scrollbar{width:3px;} .out-body::-webkit-scrollbar-thumb{background:rgba(144,96,208,0.2);}
  .out-foot{display:flex;gap:10px;padding:14px 32px;border-top:1px solid rgba(144,96,208,0.1);flex-wrap:wrap;}
  .act{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600;transition:all 0.2s;border:1px solid rgba(144,96,208,0.2);background:rgba(144,96,208,0.07);color:#9060d0;}
  .act:hover{background:rgba(144,96,208,0.14);}
  .load-s{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:#070609;}
  .back-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:8px 14px;cursor:pointer;font-size:12px;color:rgba(240,236,248,0.35);margin-bottom:28px;}
  .back-btn:hover{color:#f0ecf8;}
  .ent{animation:up 0.25s ease both;}
  @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .spin{animation:spin 1s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg)}}
  .foot{text-align:center;padding:12px;font-size:10px;color:rgba(240,236,248,0.2);letter-spacing:1px;}
`;

function TattooMuse({ onBack }) {
  const [idea, setIdea] = useState(""); const [style, setStyle] = useState(""); const [placement, setPlacement] = useState(""); const [size, setSize] = useState("medium");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are TattooMuse AI — the world's best tattoo concept consultant. Given an idea, you create a detailed tattoo brief covering: CONCEPT & SYMBOLISM (what it means, why it's powerful), DESIGN DIRECTION (style, elements, composition), PLACEMENT RATIONALE (why that spot works + how it flows with the body), SIZE & DETAIL LEVEL, COLOR vs BLACK & GREY recommendation + why, ARTIST BRIEF (what to tell the artist), AFTERCARE NOTE (one line). Be specific and creative. Make them excited.",
      `Tattoo concept:\nIdea: "${idea}"\nStyle preference: ${style || "open"}\nPlacement: ${placement || "not decided"}\nSize: ${size}\n\nCreate a complete tattoo brief.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="tm"><style>{TM_CSS}</style>
      <div className="load-s"><div style={{fontSize:60}}>🎨</div>
        <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,letterSpacing:3,color:"rgba(240,236,248,0.5)"}}>DESIGNING YOUR STORY</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(144,96,208,0.5)",letterSpacing:3}}>TATTOOMUSE.AI</div>
      </div>
    </div>
  );

  return (
    <div className="tm"><style>{TM_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="title oswald">TATTOO<br/>MUSE</div>
        <div className="price-tag">🎨 $9 · VISUAL = SCREENSHOT VIRAL</div>
        <p className="sub">Describe your tattoo idea. We give you the full concept brief — symbolism, design, placement, artist notes.</p>
        <div className="card">
          <div className="f"><div className="lbl">YOUR TATTOO IDEA *</div>
            <textarea className="inp" style={{minHeight:100}} placeholder="e.g. A Bosnian dragon flying over mountains at dawn, but minimalist... or a moth with geometric patterns... or my grandmother's words in her handwriting..." value={idea} onChange={e=>setIdea(e.target.value)}/>
          </div>
          <div className="r2">
            <div><div className="lbl">STYLE</div><input className="inp" placeholder="e.g. fine line, blackwork, geometric, realism, Japanese" value={style} onChange={e=>setStyle(e.target.value)}/></div>
            <div><div className="lbl">SIZE</div>
              <select className="inp" value={size} onChange={e=>setSize(e.target.value)} style={{cursor:"pointer",background:"rgba(144,96,208,0.05)"}}>
                <option value="small">Small (palm-sized)</option><option value="medium">Medium (hand-sized)</option>
                <option value="large">Large (forearm/calf)</option><option value="sleeve">Sleeve / Back piece</option>
              </select>
            </div>
          </div>
          <div className="f"><div className="lbl">PLACEMENT</div><input className="inp" placeholder="e.g. inner forearm, behind ear, chest, full sleeve..." value={placement} onChange={e=>setPlacement(e.target.value)}/></div>
        </div>
        <button className="btn" onClick={gen} disabled={idea.trim().length < 15}>🎨 DESIGN MY TATTOO</button>
        <div className="foot">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back-btn" onClick={()=>setOut("")}><ArrowLeft size={13}/> New Concept</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl" style={{color:"rgba(144,96,208,0.6)"}}>🎨 YOUR TATTOO BRIEF · TATTOOMUSE.AI</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:24,fontWeight:700,color:"#9060d0",letterSpacing:1}}>YOUR CONCEPT, DESIGNED</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="out-foot">
            <button className="act"><Share2 size={12}/>Share Brief</button>
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy</>}</button>
            <button className="act" onClick={()=>setOut("")}><RefreshCw size={12}/>New Concept</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
        <div className="foot" style={{marginTop:16}}>Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. APOLOGY AI — Warm forgiveness, soft amber tones
// ═══════════════════════════════════════════════════════════
const AP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:#0e0a06;min-height:100%;}
  .ap{font-family:'DM Sans',sans-serif;min-height:100vh;background:#0e0a06;color:#f5ede0;
    background-image:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(200,140,40,0.1) 0%,transparent 60%);}
  .lora{font-family:'Lora',serif;}
  .mono{font-family:'DM Mono',monospace;}
  .screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;}
  .title{font-family:'Lora',serif;font-size:clamp(48px,8vw,88px);font-weight:700;text-align:center;line-height:0.9;font-style:italic;margin-bottom:14px;
    background:linear-gradient(160deg,#f5ede0 0%,#e8a840 50%,#a06018 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .price-tag{display:inline-block;font-family:'DM Mono',monospace;font-size:11px;padding:5px 14px;border-radius:20px;border:1px solid rgba(232,168,64,0.3);background:rgba(232,168,64,0.08);color:#e8a840;margin-bottom:12px;}
  .sub{font-family:'Lora',serif;font-style:italic;font-size:clamp(14px,1.8vw,18px);color:rgba(245,237,224,0.4);max-width:460px;text-align:center;line-height:1.65;margin-bottom:44px;}
  .card{width:100%;max-width:620px;background:rgba(20,12,4,0.95);border:1px solid rgba(232,168,64,0.15);border-radius:18px;padding:24px;margin-bottom:14px;}
  .lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(232,168,64,0.5);margin-bottom:7px;}
  .inp{width:100%;background:rgba(232,168,64,0.04);border:1px solid rgba(232,168,64,0.12);border-radius:9px;padding:12px 14px;font-size:14px;font-family:'DM Sans',sans-serif;color:#f5ede0;outline:none;resize:vertical;transition:border-color 0.2s;}
  .inp:focus{border-color:rgba(232,168,64,0.5);}
  .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
  .f{margin-bottom:14px;}
  .btn{width:100%;max-width:620px;padding:17px;border:none;border-radius:14px;background:linear-gradient(135deg,#e8a840,#a06018);font-family:'Lora',serif;font-size:20px;font-weight:700;font-style:italic;color:#1a0f04;cursor:pointer;transition:all 0.2s;}
  .btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(232,168,64,0.3);}
  .btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
  .out-card{width:100%;max-width:680px;background:rgba(20,12,4,0.97);border:1px solid rgba(232,168,64,0.2);border-radius:20px;overflow:hidden;}
  .out-top{padding:22px 32px 18px;border-bottom:1px solid rgba(232,168,64,0.1);}
  .out-top::before{content:'';display:block;height:2px;background:linear-gradient(90deg,#e8a840,#a06018,#e8a840);border-radius:2px;margin-bottom:16px;}
  .out-body{padding:24px 32px;font-family:'Lora',serif;font-size:16px;line-height:1.95;white-space:pre-wrap;color:rgba(245,237,224,0.9);max-height:480px;overflow-y:auto;}
  .out-body::-webkit-scrollbar{width:3px;}.out-body::-webkit-scrollbar-thumb{background:rgba(232,168,64,0.2);}
  .out-foot{display:flex;gap:10px;padding:14px 32px;border-top:1px solid rgba(232,168,64,0.1);flex-wrap:wrap;}
  .act{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600;border:1px solid rgba(232,168,64,0.2);background:rgba(232,168,64,0.07);color:#e8a840;transition:all 0.2s;}
  .act:hover{background:rgba(232,168,64,0.14);}
  .load-s{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:#0e0a06;}
  .back-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:8px 14px;cursor:pointer;font-size:12px;color:rgba(245,237,224,0.35);margin-bottom:28px;}
  .back-btn:hover{color:#f5ede0;}
  .ent{animation:up 0.25s ease both;}@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .spin{animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}
  .foot{text-align:center;padding:12px;font-size:10px;color:rgba(245,237,224,0.2);letter-spacing:1px;}
`;

const RECIP_AP = ["Partner / Spouse","Parent","Child","Best Friend","Boss / Manager","Colleague","Sibling","Ex","Friend Group","Mentor"];

function ApologyAI({ onBack }) {
  const [recipient, setRecipient] = useState(""); const [what, setWhat] = useState(""); const [feeling, setFeeling] = useState(""); const [tone, setTone] = useState("sincere");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are ApologyAI — a master of human reconciliation. Write apologies that are specific (no generic phrases), accountable (no 'if you were hurt'), genuine (no minimizing), and actionable (what changes). Give 2 versions: SHORT (3-4 sentences, text/verbal) and FULL (letter form, 3-4 paragraphs). Make the person feel truly seen and the wrongdoing truly acknowledged.",
      `Write an apology:\nTo: ${recipient || "someone important"}\nWhat happened: "${what}"\nHow I feel: ${feeling || "remorseful"}\nTone: ${tone}\n\nSHORT VERSION:\n[3-4 sentences]\n\nFULL LETTER:\n[3-4 paragraphs, starting with "Dear ${recipient.split(" ")[0] || "..."},"]`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="ap"><style>{AP_CSS}</style>
      <div className="load-s"><div style={{fontSize:60,animation:"up 1.5s ease infinite alternate"}}>🙏</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:20,fontStyle:"italic",color:"rgba(245,237,224,0.5)"}}>Finding the right words...</div>
      </div>
    </div>
  );

  return (
    <div className="ap"><style>{AP_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="title lora">Apology<br/>AI</div>
        <div className="price-tag">🙏 $7 · EVERYONE OWES ONE TO SOMEONE</div>
        <p className="sub">"The words you need. The accountability they deserve. The repair that's possible."</p>
        <div className="card">
          <div className="f"><div className="lbl">WHO ARE YOU APOLOGIZING TO?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {RECIP_AP.map(r=><div key={r} onClick={()=>setRecipient(r)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${recipient===r?"rgba(232,168,64,0.5)":"rgba(232,168,64,0.12)"}`,background:recipient===r?"rgba(232,168,64,0.1)":"rgba(232,168,64,0.03)",cursor:"pointer",fontSize:12,color:recipient===r?"#e8a840":"rgba(245,237,224,0.45)",transition:"all 0.15s"}}>{r}</div>)}
            </div>
          </div>
          <div className="f"><div className="lbl">WHAT HAPPENED — BE HONEST</div>
            <textarea className="inp" style={{minHeight:90}} placeholder="What did you do or not do? What was the impact? Be specific — the more honest you are here, the more real the apology will feel..." value={what} onChange={e=>setWhat(e.target.value)}/>
          </div>
          <div className="r2">
            <div><div className="lbl">HOW YOU FEEL</div><input className="inp" placeholder="e.g. guilty, ashamed, desperate to fix this..." value={feeling} onChange={e=>setFeeling(e.target.value)}/></div>
            <div><div className="lbl">TONE</div>
              <select className="inp" value={tone} onChange={e=>setTone(e.target.value)} style={{cursor:"pointer",background:"rgba(232,168,64,0.04)"}}>
                <option value="sincere">Deeply Sincere</option><option value="humble">Humble & Accountable</option>
                <option value="brief">Brief & Direct</option><option value="heartfelt">Heartfelt Letter</option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn lora" onClick={gen} disabled={what.trim().length < 20}>🙏 Write My Apology</button>
        <div className="foot">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back-btn" onClick={()=>setOut("")}><ArrowLeft size={13}/> Rewrite</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl" style={{color:"rgba(232,168,64,0.6)"}}>🙏 YOUR APOLOGY · APOLOGY AI</div>
            <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:600,fontStyle:"italic",color:"#e8a840"}}>To {recipient || "Someone Who Matters"}</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="out-foot">
            <button className="act"><Share2 size={12}/>Share</button>
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy</>}</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>Rewrite</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
        <div className="foot" style={{marginTop:16}}>Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. SPEECHFORGE AI — Elegant, stage-ready, editorial
// ═══════════════════════════════════════════════════════════
const SF_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:#07090e;min-height:100%;}
  .sf{font-family:'DM Sans',sans-serif;min-height:100vh;background:#07090e;color:#e8f0fa;
    background-image:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(30,80,180,0.1) 0%,transparent 60%);}
  .playfair{font-family:'Playfair Display',serif;}
  .mono{font-family:'DM Mono',monospace;}
  .screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;}
  .title{font-family:'Playfair Display',serif;font-size:clamp(48px,8vw,90px);font-weight:900;text-align:center;line-height:0.9;margin-bottom:14px;
    background:linear-gradient(160deg,#e8f0fa 0%,#6090e8 50%,#2040a0 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .price-tag{display:inline-block;font-family:'DM Mono',monospace;font-size:11px;padding:5px 14px;border-radius:20px;border:1px solid rgba(96,144,232,0.3);background:rgba(96,144,232,0.08);color:#6090e8;margin-bottom:12px;}
  .sub{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(14px,1.8vw,18px);color:rgba(232,240,250,0.4);max-width:460px;text-align:center;line-height:1.65;margin-bottom:44px;}
  .card{width:100%;max-width:620px;background:rgba(8,12,20,0.95);border:1px solid rgba(96,144,232,0.15);border-radius:18px;padding:24px;margin-bottom:14px;}
  .lbl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:2px;color:rgba(96,144,232,0.5);margin-bottom:7px;}
  .inp{width:100%;background:rgba(96,144,232,0.04);border:1px solid rgba(96,144,232,0.12);border-radius:9px;padding:12px 14px;font-size:14px;font-family:'DM Sans',sans-serif;color:#e8f0fa;outline:none;resize:vertical;transition:border-color 0.2s;}
  .inp:focus{border-color:rgba(96,144,232,0.5);}
  .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
  .f{margin-bottom:14px;}
  .occ-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;}
  .occ-btn{padding:10px;border-radius:10px;border:1px solid rgba(96,144,232,0.12);background:rgba(96,144,232,0.04);cursor:pointer;text-align:center;font-size:12px;color:rgba(232,240,250,0.45);transition:all 0.15s;}
  .occ-btn:hover,.occ-btn.on{border-color:rgba(96,144,232,0.4);background:rgba(96,144,232,0.1);color:#6090e8;}
  .btn{width:100%;max-width:620px;padding:17px;border:none;border-radius:14px;background:linear-gradient(135deg,#4070d0,#2040a0);font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#e8f0fa;cursor:pointer;transition:all 0.2s;}
  .btn:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(96,144,232,0.3);}
  .btn:disabled{opacity:0.35;cursor:not-allowed;transform:none;}
  .out-card{width:100%;max-width:700px;background:rgba(8,12,20,0.97);border:1px solid rgba(96,144,232,0.2);border-radius:20px;overflow:hidden;}
  .out-top{padding:22px 32px 18px;border-bottom:1px solid rgba(96,144,232,0.1);}
  .out-top::before{content:'';display:block;height:2px;background:linear-gradient(90deg,#4070d0,#6090e8,#4070d0);border-radius:2px;margin-bottom:16px;}
  .out-body{padding:24px 32px;font-family:'Playfair Display',serif;font-size:16px;line-height:2;white-space:pre-wrap;color:rgba(232,240,250,0.9);max-height:480px;overflow-y:auto;}
  .out-body::-webkit-scrollbar{width:3px;}.out-body::-webkit-scrollbar-thumb{background:rgba(96,144,232,0.2);}
  .out-foot{display:flex;gap:10px;padding:14px 32px;border-top:1px solid rgba(96,144,232,0.1);flex-wrap:wrap;}
  .act{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600;border:1px solid rgba(96,144,232,0.2);background:rgba(96,144,232,0.07);color:#6090e8;transition:all 0.2s;}
  .act:hover{background:rgba(96,144,232,0.14);}
  .load-s{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:#07090e;}
  .back-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:9px;padding:8px 14px;cursor:pointer;font-size:12px;color:rgba(232,240,250,0.35);margin-bottom:28px;}
  .ent{animation:up 0.25s ease both;}@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .spin{animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}
  .foot{text-align:center;padding:12px;font-size:10px;color:rgba(232,240,250,0.2);letter-spacing:1px;}
`;

const OCCASIONS = ["Wedding Toast","Best Man / Maid of Honor","Retirement Speech","Graduation Address","Award Acceptance","Eulogy","Birthday Toast","Job Promotion","Farewell Speech","Commencement"];

function SpeechForge({ onBack }) {
  const [occasion, setOccasion] = useState(""); const [person, setPerson] = useState(""); const [story, setStory] = useState(""); const [duration, setDuration] = useState("3"); const [tone, setTone] = useState("heartfelt");
  const [out, setOut] = useState(""); const [load, setLoad] = useState(false); const [copied, setCopied] = useState(false);

  const gen = async () => {
    setLoad(true); setOut("");
    await ai(
      "You are SpeechForge AI — the world's finest speechwriter. Write speeches that earn standing ovations. Your speeches are: specific (real details, not generic platitudes), emotionally intelligent (know when to be funny, when to be moving), structurally perfect (strong open, rising middle, powerful close), and memorable (one line they'll quote forever). Format: [OPENING], [THE STORY], [THE TRIBUTE], [THE TOAST/CLOSE]. Include delivery notes in [brackets].",
      `Write a ${duration}-minute ${occasion} speech.\nAbout/for: ${person || "the honoree"}\nTone: ${tone}\nDetails/stories: "${story}"\n\nWrite a complete, stage-ready speech with delivery notes.`,
      (t) => { setOut(t); setLoad(false); }
    );
  };

  if (load) return (
    <div className="sf"><style>{SF_CSS}</style>
      <div className="load-s"><div style={{fontSize:60}}>🎤</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontStyle:"italic",color:"rgba(232,240,250,0.5)"}}>Writing your words...</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"rgba(96,144,232,0.4)",letterSpacing:3}}>SPEECHFORGE.AI</div>
      </div>
    </div>
  );

  return (
    <div className="sf"><style>{SF_CSS}</style>
    {!out ? (
      <div className="screen ent">
        <div className="title playfair">Speech<br/>Forge</div>
        <div className="price-tag">🎤 $15 · HIGH-VALUE OCCASIONS · NO PRICE SENSITIVITY</div>
        <p className="sub">"The speech they'll remember. The words you'll be proud of. The moment you'll own."</p>
        <div className="card">
          <div className="f"><div className="lbl">OCCASION *</div>
            <div className="occ-grid">
              {OCCASIONS.map(o=><div key={o} className={`occ-btn ${occasion===o?"on":""}`} onClick={()=>setOccasion(o)}>{o}</div>)}
            </div>
          </div>
          <div className="r2">
            <div className="f"><div className="lbl">WHO IS THIS FOR/ABOUT</div><input className="inp" placeholder="Name, relationship to you..." value={person} onChange={e=>setPerson(e.target.value)}/></div>
            <div className="f"><div className="lbl">SPEECH LENGTH</div>
              <select className="inp" value={duration} onChange={e=>setDuration(e.target.value)} style={{cursor:"pointer",background:"rgba(96,144,232,0.04)"}}>
                <option value="1">1 minute (toast)</option><option value="3">3 minutes (classic)</option>
                <option value="5">5 minutes (full speech)</option><option value="8">8 minutes (keynote)</option>
              </select>
            </div>
          </div>
          <div className="r2">
            <div><div className="lbl">TONE</div>
              <select className="inp" value={tone} onChange={e=>setTone(e.target.value)} style={{cursor:"pointer",background:"rgba(96,144,232,0.04)"}}>
                <option value="heartfelt">Heartfelt & Moving</option><option value="funny">Funny First, Then Touching</option>
                <option value="formal">Formal & Dignified</option><option value="roast">Roast-Style (light)</option>
              </select>
            </div>
            <div></div>
          </div>
          <div className="f"><div className="lbl">STORIES, MEMORIES, DETAILS *</div>
            <textarea className="inp" style={{minHeight:110}} placeholder="Tell us what makes this person or moment special. Real stories, inside jokes, specific moments, their best qualities, how they changed your life..." value={story} onChange={e=>setStory(e.target.value)}/>
          </div>
        </div>
        <button className="btn playfair" onClick={gen} disabled={!occasion || story.trim().length < 20}>🎤 Write My Speech</button>
        <div className="foot">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    ) : (
      <div className="screen ent" style={{justifyContent:"flex-start",paddingTop:40}}>
        <button className="back-btn" onClick={()=>setOut("")}><ArrowLeft size={13}/> Rewrite</button>
        <div className="out-card">
          <div className="out-top">
            <div className="lbl" style={{color:"rgba(96,144,232,0.6)"}}>🎤 YOUR SPEECH · SPEECHFORGE.AI</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#6090e8"}}>{occasion}{person ? ` · ${person}` : ""}</div>
          </div>
          <div className="out-body">{out}</div>
          <div className="out-foot">
            <button className="act"><Share2 size={12}/>Share</button>
            <button className="act" onClick={()=>{navigator.clipboard.writeText(out);setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?<><Check size={12}/>Copied</>:<><Copy size={12}/>Copy</>}</button>
            <button className="act" onClick={gen}><RefreshCw size={12}/>Rewrite</button>
            <button className="act" onClick={onBack}><ArrowLeft size={12}/>Hub</button>
          </div>
        </div>
        <div className="foot" style={{marginTop:16}}>Powered by MirzaTech.ai · Property of Emaaa LLC</div>
      </div>
    )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HUB
// ═══════════════════════════════════════════════════════════
const HUB_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:#06050a;min-height:100%;}
  .hub{font-family:'DM Sans',sans-serif;min-height:100vh;background:#06050a;color:#f0eaf8;
    background-image:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(212,168,67,0.07) 0%,transparent 55%);}
  .hub-inner{max-width:740px;margin:0 auto;padding:64px 24px;}
  .hub-ey{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:4px;color:rgba(240,234,248,0.25);margin-bottom:20px;text-align:center;}
  .hub-title{font-family:'Barlow Condensed',sans-serif;font-size:clamp(40px,7vw,80px);font-weight:900;text-align:center;line-height:0.88;margin-bottom:14px;letter-spacing:1px;}
  .hub-sub{font-size:15px;color:rgba(240,234,248,0.4);text-align:center;margin-bottom:52px;line-height:1.6;}
  .hub-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:40px;}
  .hc{padding:28px 22px;border-radius:18px;border:1px solid;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.025);}
  .hc:hover{transform:translateY(-3px);}
  .hc-em{font-size:44px;margin-bottom:12px;display:block;}
  .hc-price{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;margin-bottom:14px;display:inline-block;}
  .hc-name{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:900;margin-bottom:7px;}
  .hc-why{font-size:12px;color:rgba(240,234,248,0.4);line-height:1.55;}
  .law{text-align:center;font-size:10px;color:rgba(240,234,248,0.18);letter-spacing:1px;margin-top:20px;}
  .ent{animation:up 0.25s ease both;}@keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;

const PRODS = [
  {id:"tattoo", em:"🎨", name:"TattooMuse AI",   price:"$9",  why:"Tattoo concept brief, symbolism, placement, artist notes. Visual = screenshot viral.",     col:"#9060d0", bg:"rgba(144,96,208,", border:"rgba(144,96,208,0.25)"},
  {id:"apology",em:"🙏", name:"Apology AI",       price:"$7",  why:"Write the perfect apology. Everyone owes one. Emotional urgency = instant buy.",            col:"#e8a840", bg:"rgba(232,168,64,",  border:"rgba(232,168,64,0.25)"},
  {id:"speech", em:"🎤", name:"SpeechForge AI",   price:"$15", why:"Wedding toasts, retirement speeches, graduation. High occasion = high willingness to pay.", col:"#6090e8", bg:"rgba(96,144,232,", border:"rgba(96,144,232,0.25)"},
];

export default function NewProductsHub() {
  const [active, setActive] = useState(null);
  if (active === "tattoo")  return <TattooMuse  onBack={()=>setActive(null)}/>;
  if (active === "apology") return <ApologyAI   onBack={()=>setActive(null)}/>;
  if (active === "speech")  return <SpeechForge onBack={()=>setActive(null)}/>;

  return (
    <>
      <style>{HUB_CSS}</style>
      <div className="hub">
        <div className="hub-inner ent">
          <div className="hub-ey">MIRZATECH.AI · BATCH 3 · OSMAN.IS</div>
          <div className="hub-title">
            Three more.<br/>
            <span style={{background:"linear-gradient(135deg,#d4a843,#f0c060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>All self-selling.</span>
          </div>
          <p className="hub-sub">New products. Same DNA — peak emotional moment, instant delivery, visual output that shares itself.</p>
          <div className="hub-grid">
            {PRODS.map(p => (
              <div key={p.id} className="hc" onClick={()=>setActive(p.id)}
                style={{borderColor:p.border}}>
                <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 0%,${p.bg}0.07),transparent 70%)`,borderRadius:18,pointerEvents:"none"}}/>
                <span className="hc-em">{p.em}</span>
                <div className="hc-price" style={{background:p.bg+"0.1)",color:p.col,border:`1px solid ${p.border}`}}>{p.price} PER USE</div>
                <div className="hc-name" style={{color:p.col}}>{p.name}</div>
                <p className="hc-why">{p.why}</p>
              </div>
            ))}
          </div>
          <div className="law">Powered by MirzaTech.ai · Property of Emaaa LLC · BANG BANG 🇧🇦</div>
        </div>
      </div>
    </>
  );
}
