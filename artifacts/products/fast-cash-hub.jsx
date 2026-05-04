import { useState } from "react";
import { Flame, Heart, Loader, Copy, Check, Share2, RefreshCw, ArrowLeft, DollarSign, Zap, Star, ChevronRight } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100%; background: #08060a; }

  .app { font-family: 'DM Sans', sans-serif; min-height: 100vh; color: #f0eaf8; }

  /* ── Hub ── */
  .hub {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; padding: 40px 24px;
    background: #08060a;
    background-image: radial-gradient(ellipse 70% 50% at 50% 0%, rgba(180,40,40,0.1) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 80% 100%, rgba(200,160,40,0.07) 0%, transparent 55%);
  }
  .hub-eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 4px; color: rgba(240,234,248,0.3); margin-bottom: 20px; }
  .hub-title { font-family: 'Syne', sans-serif; font-size: clamp(40px, 7vw, 80px); font-weight: 900; line-height: 0.9; text-align: center; margin-bottom: 16px; }
  .hub-sub { font-size: 15px; color: rgba(240,234,248,0.45); text-align: center; margin-bottom: 52px; max-width: 420px; line-height: 1.6; }

  .products-hub { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 680px; }
  .product-hub-card {
    padding: 32px 28px; border-radius: 20px; border: 1px solid;
    cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
    background: rgba(255,255,255,0.03);
  }
  .product-hub-card::before { content: ''; position: absolute; inset: 0; opacity: 0; transition: opacity 0.25s; }
  .product-hub-card:hover { transform: translateY(-3px); }
  .product-hub-card:hover::before { opacity: 1; }
  .phc-roast { border-color: rgba(239,68,68,0.25); }
  .phc-roast::before { background: radial-gradient(circle at 50% 0%, rgba(239,68,68,0.1), transparent 70%); }
  .phc-roast:hover { border-color: rgba(239,68,68,0.6); box-shadow: 0 16px 48px rgba(239,68,68,0.12); }
  .phc-vows { border-color: rgba(236,72,153,0.25); }
  .phc-vows::before { background: radial-gradient(circle at 50% 0%, rgba(236,72,153,0.1), transparent 70%); }
  .phc-vows:hover { border-color: rgba(236,72,153,0.6); box-shadow: 0 16px 48px rgba(236,72,153,0.1); }

  .phc-emoji { font-size: 44px; margin-bottom: 14px; display: block; }
  .phc-price { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; display: inline-block; }
  .phc-price-roast { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
  .phc-price-vows { background: rgba(236,72,153,0.12); color: #ec4899; border: 1px solid rgba(236,72,153,0.25); }
  .phc-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .phc-desc { font-size: 13px; color: rgba(240,234,248,0.45); line-height: 1.55; }

  /* ── Shared product chrome ── */
  .product-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px 24px; }
  .back-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09); border-radius: 9px; padding: 8px 14px; cursor: pointer; font-size: 12px; color: rgba(240,234,248,0.4); margin-bottom: 32px; transition: all 0.2s; }
  .back-btn:hover { color: #f0eaf8; }
  .product-header { text-align: center; margin-bottom: 40px; }
  .ph-emoji { font-size: 52px; margin-bottom: 14px; }
  .ph-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 900; margin-bottom: 8px; }
  .ph-sub { font-size: 15px; color: rgba(240,234,248,0.4); max-width: 460px; margin: 0 auto; line-height: 1.6; }

  /* ── Input card ── */
  .input-card { width: 100%; max-width: 620px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 28px; margin-bottom: 16px; }
  .ic-label { font-size: 11px; letter-spacing: 2px; color: rgba(240,234,248,0.35); margin-bottom: 8px; font-family: 'DM Mono', monospace; }
  .ic-ta { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #f0eaf8; outline: none; resize: vertical; min-height: 100px; line-height: 1.7; transition: border-color 0.2s; }
  .ic-ta:focus { border-color: rgba(255,255,255,0.25); }
  .ic-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #f0eaf8; outline: none; cursor: pointer; }
  .ic-select option { background: #1a1020; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
  .field { margin-bottom: 14px; }

  /* ── Buttons ── */
  .btn-roast { width: 100%; max-width: 620px; padding: 17px; border: none; border-radius: 14px; background: linear-gradient(135deg, #ef4444, #7f1d1d); font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; color: #fff; cursor: pointer; transition: all 0.2s; }
  .btn-roast:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(239,68,68,0.35); }
  .btn-roast:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-vows { width: 100%; max-width: 620px; padding: 17px; border: none; border-radius: 14px; background: linear-gradient(135deg, #ec4899, #9d174d); font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; color: #fff; cursor: pointer; transition: all 0.2s; }
  .btn-vows:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(236,72,153,0.35); }
  .btn-vows:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  /* ── Loading ── */
  .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; background: #08060a; }
  .ld-icon { font-size: 60px; animation: ld 1.5s ease infinite; }
  @keyframes ld { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
  .ld-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: rgba(240,234,248,0.6); }
  .ld-sub { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 3px; color: rgba(240,234,248,0.25); animation: blink 1s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  /* ── Output ── */
  .output-card { width: 100%; max-width: 680px; border-radius: 20px; overflow: hidden; box-shadow: 0 0 80px rgba(0,0,0,0.5); margin-bottom: 16px; }
  .oc-top { padding: 24px 32px 20px; }
  .oc-top::before { content: ''; display: block; height: 3px; border-radius: 2px; margin-bottom: 18px; }
  .oc-top-roast::before { background: linear-gradient(90deg, #ef4444, #7f1d1d, #ef4444); background-color: rgba(20,6,6,0.97); }
  .oc-top-vows::before { background: linear-gradient(90deg, #ec4899, #9d174d, #ec4899); background-color: rgba(20,6,14,0.97); }
  .oc-top-roast { background: rgba(20,6,6,0.97); border: 1px solid rgba(239,68,68,0.2); border-bottom: none; }
  .oc-top-vows { background: rgba(20,6,14,0.97); border: 1px solid rgba(236,72,153,0.2); border-bottom: none; }
  .oc-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px; margin-bottom: 6px; }
  .oc-label-roast { color: rgba(239,68,68,0.7); }
  .oc-label-vows { color: rgba(236,72,153,0.7); }
  .oc-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
  .oc-title-roast { color: #ef4444; }
  .oc-title-vows { color: #ec4899; }
  .oc-body-roast { background: rgba(20,6,6,0.97); border: 1px solid rgba(239,68,68,0.2); border-top: none; padding: 24px 32px; font-size: 16px; line-height: 1.85; white-space: pre-wrap; color: rgba(240,234,248,0.9); max-height: 480px; overflow-y: auto; }
  .oc-body-vows { background: rgba(20,6,14,0.97); border: 1px solid rgba(236,72,153,0.2); border-top: none; padding: 24px 32px; font-family: 'Lora', serif; font-size: 17px; line-height: 1.95; white-space: pre-wrap; color: rgba(240,234,248,0.9); max-height: 480px; overflow-y: auto; }
  .oc-body-roast::-webkit-scrollbar, .oc-body-vows::-webkit-scrollbar { width: 3px; }
  .oc-body-roast::-webkit-scrollbar-thumb, .oc-body-vows::-webkit-scrollbar-thumb { border-radius: 3px; }
  .oc-footer { display: flex; gap: 10px; padding: 16px 32px; flex-wrap: wrap; }
  .oc-footer-roast { background: rgba(20,6,6,0.97); border: 1px solid rgba(239,68,68,0.2); border-top: none; border-radius: 0 0 20px 20px; }
  .oc-footer-vows { background: rgba(20,6,14,0.97); border: 1px solid rgba(236,72,153,0.2); border-top: none; border-radius: 0 0 20px 20px; }

  .act { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; border: 1px solid; }
  .a-share-r { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); color: #22c55e; }
  .a-copy { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.09); color: rgba(240,234,248,0.5); }
  .a-again-r { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #ef4444; }
  .a-again-v { background: rgba(236,72,153,0.08); border-color: rgba(236,72,153,0.2); color: #ec4899; }

  .enter { animation: up 0.25s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

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

// ─── ROAST ME ─────────────────────────────────────────────────────
function RoastMeApp({ onBack }) {
  const [bio, setBio] = useState("");
  const [roastType, setRoastType] = useState("linkedin");
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [copied, setCopied] = useState(false);

  const roast = async () => {
    setLoading(true); setOutput("");
    await callClaude(
      "You are RoastMe.ai — the most savage, witty, and clever AI roaster on earth. You roast people based on their bio/resume/LinkedIn with surgical precision. You're like a Comedy Central Roast writer crossed with a ruthless career coach. Be brutal but brilliant. Find the specific, ironic, and funny truths. Never be generic. 6-8 hits max. End with one genuine compliment so they don't cry.",
      `Roast this person's ${roastType}:\n\n"${bio}"\n\nDo NOT hold back. Be devastatingly specific and funny. Each roast should be its own paragraph. End with ONE genuine compliment labeled 💛 THE ONE GOOD THING:`,
      (t) => { setOutput(t); setLoading(false); }
    );
  };

  if (loading) return (
    <div className="loading-screen enter">
      <div className="ld-icon">🔥</div>
      <div className="ld-text">Loading the heat...</div>
      <div className="ld-sub">ROASTME.AI PROCESSING</div>
    </div>
  );

  return (
    <div className="product-screen enter" style={{ background: "linear-gradient(180deg, #0d0404, #08060a)" }}>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Back</button>
      {!output ? (
        <>
          <div className="product-header">
            <div className="ph-emoji">🔥</div>
            <div className="ph-title" style={{ color: "#ef4444" }}>Roast Me</div>
            <p className="ph-sub">Paste your LinkedIn, resume, or bio. We'll roast you into self-awareness. Brutally. Brilliantly.</p>
            <div style={{ marginTop: 14, display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)", fontSize: 12, fontWeight: 700 }}>⚡ $5 PER ROAST · VIRAL GUARANTEED</div>
          </div>
          <div className="input-card">
            <div className="field">
              <div className="ic-label">WHAT ARE WE ROASTING?</div>
              <select className="ic-select" value={roastType} onChange={e => setRoastType(e.target.value)}>
                <option value="linkedin">LinkedIn Profile</option>
                <option value="resume">Resume / CV</option>
                <option value="bio">Instagram / Twitter Bio</option>
                <option value="dating">Dating Profile</option>
                <option value="startup">Startup Pitch</option>
                <option value="youtube">YouTube Channel Description</option>
              </select>
            </div>
            <div className="field">
              <div className="ic-label">PASTE YOUR {roastType.toUpperCase()} HERE</div>
              <textarea className="ic-ta" placeholder={`Paste your ${roastType} content here. The more you give us, the harder we hit. Don't be shy — we've seen worse.`}
                value={bio} onChange={e => setBio(e.target.value)} style={{ minHeight: 150 }} />
            </div>
          </div>
          <button className="btn-roast" onClick={roast} disabled={bio.trim().length < 20}>
            🔥 ROAST ME (I Can Handle It)
          </button>
        </>
      ) : (
        <>
          <div className="output-card enter">
            <div className={`oc-top oc-top-roast`}>
              <div className="oc-label oc-label-roast">🔥 THE ROAST · ROASTME.AI</div>
              <div className="oc-title oc-title-roast">You Asked For This.</div>
            </div>
            <div className="oc-body-roast">{output}</div>
            <div className="oc-footer oc-footer-roast">
              <button className="act a-share-r"><Share2 size={12} /> Share the Pain</button>
              <button className="act a-copy" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button className="act a-again-r" onClick={() => { setOutput(""); setBio(""); }}><RefreshCw size={12} /> Roast Someone Else</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── WEDDING VOWS ─────────────────────────────────────────────────
function WeddingVowsApp({ onBack }) {
  const [name1, setName1] = useState(""); const [name2, setName2] = useState("");
  const [story, setStory] = useState(""); const [tone, setTone] = useState("romantic");
  const [whoFor, setWhoFor] = useState("both");
  const [output, setOutput] = useState(""); const [loading, setLoading] = useState(false); const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true); setOutput("");
    await callClaude(
      "You are WeddingVows.ai — the most gifted vow writer on earth. You write vows that make everyone in the room cry tears of joy. You find the specific, authentic, beautiful details in every love story and turn them into poetry that sounds like it came from the heart of the person saying them. Never generic. Always specific. Always moving.",
      `Write wedding vows for:\nPerson 1: ${name1 || "Partner 1"}\nPerson 2: ${name2 || "Partner 2"}\nFor: ${whoFor === "both" ? "Both partners" : whoFor === "person1" ? name1 : name2}\nTone: ${tone}\nTheir story: "${story}"\n\n${whoFor === "both" ? `Write BOTH sets of vows:\n\n${name1}'s VOWS TO ${name2}:\n[vows]\n\n${name2}'s VOWS TO ${name1}:\n[vows]` : "Write one set of vows that feels completely personal and genuine."}\n\nMake them cry (happy tears). Be specific to their story. Keep each set to 3-4 paragraphs.`,
      (t) => { setOutput(t); setLoading(false); }
    );
  };

  if (loading) return (
    <div className="loading-screen enter" style={{ background: "linear-gradient(180deg, #0d0408, #08060a)" }}>
      <div className="ld-icon">💍</div>
      <div className="ld-text" style={{ color: "rgba(236,72,153,0.8)" }}>Writing your forever...</div>
      <div className="ld-sub">WEDDINGVOWS.AI</div>
    </div>
  );

  return (
    <div className="product-screen enter" style={{ background: "linear-gradient(180deg, #0d0408, #08060a)" }}>
      <button className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Back</button>
      {!output ? (
        <>
          <div className="product-header">
            <div className="ph-emoji">💍</div>
            <div className="ph-title" style={{ color: "#ec4899" }}>Wedding Vows AI</div>
            <p className="ph-sub">Tell us your love story. We'll write vows that make everyone cry — the good kind.</p>
            <div style={{ marginTop: 14, display: "inline-block", padding: "6px 16px", borderRadius: 20, background: "rgba(236,72,153,0.1)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.25)", fontSize: 12, fontWeight: 700 }}>💍 $15 PER GENERATION · HIGH PURCHASE INTENT</div>
          </div>
          <div className="input-card">
            <div className="row">
              <div>
                <div className="ic-label">PARTNER 1 NAME</div>
                <textarea className="ic-ta" style={{ minHeight: 44, resize: "none" }} placeholder="Name..." value={name1} onChange={e => setName1(e.target.value)} />
              </div>
              <div>
                <div className="ic-label">PARTNER 2 NAME</div>
                <textarea className="ic-ta" style={{ minHeight: 44, resize: "none" }} placeholder="Name..." value={name2} onChange={e => setName2(e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div>
                <div className="ic-label">VOWS FOR</div>
                <select className="ic-select" value={whoFor} onChange={e => setWhoFor(e.target.value)}>
                  <option value="both">Both Partners</option>
                  <option value="person1">Just {name1 || "Partner 1"}</option>
                  <option value="person2">Just {name2 || "Partner 2"}</option>
                </select>
              </div>
              <div>
                <div className="ic-label">TONE</div>
                <select className="ic-select" value={tone} onChange={e => setTone(e.target.value)}>
                  <option value="romantic">Deeply Romantic</option>
                  <option value="funny">Funny + Heartfelt</option>
                  <option value="short">Short + Powerful</option>
                  <option value="poetic">Poetic + Literary</option>
                  <option value="religious">Spiritual / Religious</option>
                </select>
              </div>
            </div>
            <div className="field">
              <div className="ic-label">YOUR LOVE STORY *</div>
              <textarea className="ic-ta" style={{ minHeight: 140 }}
                placeholder="How did you meet? What makes your relationship special? Any inside jokes, pivotal moments, things they do that drive you crazy (in the best way)? How did they change your life? The more you share, the more personal and moving the vows will be..."
                value={story} onChange={e => setStory(e.target.value)} />
            </div>
          </div>
          <button className="btn-vows" onClick={generate} disabled={story.trim().length < 20}>
            💍 Write Our Vows
          </button>
        </>
      ) : (
        <div className="output-card enter">
          <div className="oc-top oc-top-vows">
            <div className="oc-label oc-label-vows">💍 YOUR VOWS · WEDDINGVOWS.AI</div>
            <div className="oc-title oc-title-vows">{name1 || "Partner 1"} & {name2 || "Partner 2"}</div>
          </div>
          <div className="oc-body-vows">{output}</div>
          <div className="oc-footer oc-footer-vows">
            <button className="act a-share-r"><Share2 size={12} /> Share</button>
            <button className="act a-copy" onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
              {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
            </button>
            <button className="act a-again-v" onClick={() => { setOutput(""); }}><RefreshCw size={12} /> Rewrite Vows</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN HUB ─────────────────────────────────────────────────────
export default function FastCashHub() {
  const [active, setActive] = useState(null);

  if (active === "roast") return <RoastMeApp onBack={() => setActive(null)} />;
  if (active === "vows") return <WeddingVowsApp onBack={() => setActive(null)} />;

  return (
    <>
      <style>{CSS}</style>
      <div className="hub">
        <div className="hub-eyebrow">MIRZATECH.AI · FAST CASH PRODUCTS</div>
        <div className="hub-title">
          <span style={{ color: "#ef4444" }}>Roast.</span><br />
          <span style={{ color: "#ec4899" }}>Love.</span><br />
          <span style={{ color: "rgba(240,234,248,0.6)", fontSize: "0.6em" }}>Get Paid.</span>
        </div>
        <p className="hub-sub">Two viral AI products that make money from day one. No waiting. No subscriptions needed to start.</p>

        <div className="products-hub">
          <div className="product-hub-card phc-roast" onClick={() => setActive("roast")}>
            <span className="phc-emoji">🔥</span>
            <div className="phc-price phc-price-roast">$5 PER ROAST</div>
            <div className="phc-name">Roast Me AI</div>
            <p className="phc-desc">Paste your LinkedIn, resume, or bio. Get brutally roasted. People SHARE roasts — that's free marketing.</p>
          </div>
          <div className="product-hub-card phc-vows" onClick={() => setActive("vows")}>
            <span className="phc-emoji">💍</span>
            <div className="phc-price phc-price-vows">$15 PER GENERATION</div>
            <div className="phc-name">Wedding Vows AI</div>
            <p className="phc-desc">Tell your love story. AI writes vows that make everyone cry. High purchase intent — weddings don't wait.</p>
          </div>
        </div>

        <div style={{ marginTop: 48, width: "100%", maxWidth: 680 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "rgba(240,234,248,0.2)", textAlign: "center", marginBottom: 20, fontFamily: "'DM Mono',monospace" }}>
            6 MORE FAST-CASH PRODUCTS READY TO BUILD
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { emoji: "✉️", name: "Eulogy AI", price: "$25", color: "#a78bfa" },
              { emoji: "🎨", name: "Tattoo Muse", price: "$9", color: "#f59e0b" },
              { emoji: "🏷️", name: "Name Forge", price: "$7", color: "#22d3ee" },
              { emoji: "📜", name: "AI Prenup", price: "$29", color: "#ef4444" },
              { emoji: "🌙", name: "Horoscope AI", price: "$5", color: "#c084fc" },
              { emoji: "💔", name: "Breakup AI", price: "$8", color: "#f43f5e" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "14px", borderRadius: 12, border: `1px solid ${p.color}20`, background: `${p.color}08`, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{p.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "rgba(240,234,248,0.4)", fontFamily: "'DM Mono',monospace" }}>{p.price}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 10, color: "rgba(240,234,248,0.2)", textAlign: "center" }}>
          Powered by MirzaTech.ai · Property of Emaaa LLC
        </div>
      </div>
    </>
  );
}
