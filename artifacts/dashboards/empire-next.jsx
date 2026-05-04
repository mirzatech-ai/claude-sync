import { useState } from "react";
import { CheckCircle, Clock, Zap, TrendingUp, Lock, Star, ChevronRight, Globe, DollarSign, Users, Flame, Shield, AlertTriangle, BarChart2, Cpu } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html,body,#root{background:#050407;min-height:100%;}
  .en{font-family:'Barlow',sans-serif;min-height:100vh;background:#050407;color:#ede6fa;
    background-image:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(212,168,67,0.09) 0%,transparent 55%),
      radial-gradient(ellipse 50% 30% at 0% 80%,rgba(180,40,40,0.05) 0%,transparent 60%);}
  .cond{font-family:'Barlow Condensed',sans-serif;}
  .mono{font-family:'Space Mono',monospace;}

  /* Header */
  .hdr{padding:24px 32px 18px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
  .hdr-left h1{font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;letter-spacing:1px;line-height:1;
    background:linear-gradient(135deg,#f0c060,#d4a843,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .hdr-left p{font-size:12px;color:rgba(237,230,250,0.35);letter-spacing:1px;margin-top:4px;}
  .hdr-stats{display:flex;gap:20px;flex-wrap:wrap;}
  .hs{text-align:right;}
  .hs-val{font-family:'Space Mono',monospace;font-size:22px;font-weight:700;color:#d4a843;line-height:1;}
  .hs-lbl{font-size:9px;letter-spacing:2px;color:rgba(237,230,250,0.3);margin-top:3px;}

  /* Tabs */
  .tabs{display:flex;gap:4px;padding:16px 32px 0;border-bottom:1px solid rgba(255,255,255,0.07);overflow-x:auto;}
  .tab{padding:10px 20px;border-radius:8px 8px 0 0;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.5px;cursor:pointer;transition:all 0.15s;color:rgba(237,230,250,0.4);border:1px solid transparent;border-bottom:none;white-space:nowrap;}
  .tab:hover{color:rgba(237,230,250,0.7);}
  .tab.on{background:rgba(212,168,67,0.08);color:#d4a843;border-color:rgba(212,168,67,0.2);}

  /* Body */
  .body{padding:24px 32px;max-width:1400px;margin:0 auto;}

  /* Cards */
  .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;}
  .card-title{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:2.5px;color:rgba(237,230,250,0.3);margin-bottom:16px;text-transform:uppercase;}

  /* Grid */
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
  .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .mb16{margin-bottom:16px;}
  .mb24{margin-bottom:24px;}

  /* Products grid */
  .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;}
  .product-card{background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;position:relative;transition:border-color 0.2s;}
  .product-card:hover{border-color:rgba(255,255,255,0.14);}
  .pc-status{position:absolute;top:14px;right:14px;}
  .pc-em{font-size:28px;margin-bottom:10px;}
  .pc-name{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;margin-bottom:4px;}
  .pc-price{font-family:'Space Mono',monospace;font-size:12px;color:rgba(237,230,250,0.4);margin-bottom:8px;}
  .pc-bar{height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-top:10px;}
  .pc-fill{height:100%;border-radius:2px;}

  /* Status badges */
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:10px;font-size:9px;font-weight:700;letter-spacing:0.5px;border:1px solid;}
  .b-live{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.25);color:#22c55e;}
  .b-build{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.25);color:#f59e0b;}
  .b-lock{background:rgba(239,68,68,0.1);border-color:rgba(239,68,68,0.25);color:#ef4444;}
  .b-gold{background:rgba(212,168,67,0.1);border-color:rgba(212,168,67,0.25);color:#d4a843;}

  /* Rules */
  .rule-item{display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .rule-item:last-child{border-bottom:none;}
  .rule-num{font-family:'Space Mono',monospace;font-size:10px;color:rgba(212,168,67,0.6);flex-shrink:0;margin-top:1px;width:28px;}
  .rule-text{font-size:13px;line-height:1.55;color:rgba(237,230,250,0.8);}
  .rule-tag{font-size:10px;color:rgba(237,230,250,0.35);margin-top:3px;}
  .rule-lock{font-size:9px;padding:2px 7px;border-radius:8px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#ef4444;margin-left:8px;}

  /* Revenue */
  .rev-row{display:flex;align-items:center;gap:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
  .rev-em{font-size:20px;flex-shrink:0;width:28px;}
  .rev-name{flex:1;font-size:13px;font-weight:500;}
  .rev-price{font-family:'Space Mono',monospace;font-size:11px;color:rgba(237,230,250,0.45);width:80px;}
  .rev-target{font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:#22c55e;width:80px;text-align:right;}
  .rev-bar-wrap{width:100px;}
  .rev-pb{height:5px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden;}
  .rev-pf{height:100%;border-radius:3px;background:linear-gradient(90deg,#22c55e,#16a34a);}

  /* Next queue */
  .queue-item{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:background 0.15s;border-radius:8px;padding:12px;}
  .queue-item:hover{background:rgba(255,255,255,0.03);}
  .qi-num{font-family:'Space Mono',monospace;font-size:11px;color:rgba(212,168,67,0.5);flex-shrink:0;margin-top:2px;width:24px;}
  .qi-em{font-size:22px;flex-shrink:0;width:30px;}
  .qi-body{flex:1;}
  .qi-name{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;margin-bottom:3px;}
  .qi-why{font-size:12px;color:rgba(237,230,250,0.4);line-height:1.5;}
  .qi-right{text-align:right;flex-shrink:0;}
  .qi-price{font-family:'Space Mono',monospace;font-size:14px;font-weight:700;color:#d4a843;margin-bottom:4px;}
  .qi-viral{font-size:10px;color:rgba(237,230,250,0.3);}

  /* Maya ops */
  .op-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
  .op-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .op-live{background:#22c55e;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
  .op-pend{background:#f59e0b;}
  .op-text{font-size:13px;flex:1;}
  .op-meta{font-size:10px;color:rgba(237,230,250,0.3);font-family:'Space Mono',monospace;}

  .enter{animation:up 0.22s ease both;}
  @keyframes up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

  .footer-law{text-align:center;padding:20px;font-size:10px;color:rgba(237,230,250,0.2);letter-spacing:1px;border-top:1px solid rgba(255,255,255,0.06);}
`;

const PRODUCTS_BUILT = [
  {em:"🔥",name:"Truth Engine",      price:"$5/transform", viral:96, color:"#c41e3a"},
  {em:"🔗",name:"EternalLink",       price:"$12/member",   viral:91, color:"#d4a843"},
  {em:"✉️",name:"Unsent.ai",         price:"$7/letter",    viral:94, color:"#e11d48"},
  {em:"🤘",name:"RageRoom.ai",       price:"$8/session",   viral:99, color:"#ef4444"},
  {em:"🌙",name:"DreamForge",        price:"$6/dream",     viral:88, color:"#818cf8"},
  {em:"📅",name:"1000 Days",         price:"$9/mo",        viral:84, color:"#f59e0b"},
  {em:"🎙️",name:"VoiceVault",        price:"$12/mo",       viral:79, color:"#22d3ee"},
  {em:"🕯️",name:"Eulogy AI",         price:"$25/eulogy",   viral:97, color:"#c8a06a"},
  {em:"👶",name:"Baby Name AI",      price:"$12/gen",      viral:90, color:"#f97316"},
  {em:"⭐",name:"AI Oracle",         price:"$5/reading",   viral:93, color:"#9870e8"},
  {em:"💔",name:"Breakup Text AI",   price:"$8/message",   viral:95, color:"#ff1464"},
  {em:"🌿",name:"Revenge Glow Up",   price:"$9/plan",      viral:98, color:"#f59e0b"},
  {em:"🔥",name:"Roast Me AI",       price:"$5/roast",     viral:97, color:"#ef4444"},
  {em:"💍",name:"Wedding Vows AI",   price:"$15/gen",      viral:92, color:"#ec4899"},
  {em:"🐉",name:"Zmaj Fire Fields",  price:"NFT/art",      viral:88, color:"#d4a843"},
];

const QUEUE = [
  {em:"🎨",name:"TattooMuse AI",     price:"$9",  why:"Describe your tattoo idea → AI gives design brief, symbolism, placement, style. Tattoo market is massive + visual = screenshot viral.",  viral:"🔥 96/100"},
  {em:"🙏",name:"Apology AI",        price:"$7",  why:"Write the perfect apology to anyone — partner, boss, parent, friend. Everyone owes one. Emotional urgency = instant purchase.",            viral:"⚡ 94/100"},
  {em:"🎤",name:"SpeechForge AI",    price:"$15", why:"Wedding toast, retirement speech, award acceptance, graduation. Occasions don't wait. High price sensitivity = low. Quality matters.",   viral:"💍 91/100"},
  {em:"🔤",name:"Name Personality",  price:"$7",  why:"Enter your name → deep personality analysis. \"What does my name say about me?\" — people share this constantly.",                       viral:"📸 93/100"},
  {em:"📝",name:"Reference Letter",  price:"$19", why:"AI writes glowing reference/recommendation letters. Students + job seekers = massive market. High urgency, no alternatives.",            viral:"✍️ 87/100"},
  {em:"🌹",name:"First Date AI",     price:"$8",  why:"Enter location + both interests → perfect date plan. Dating market = billions. \"My AI planned our first date\" goes everywhere.",       viral:"💑 90/100"},
  {em:"📖",name:"Resignation AI",    price:"$12", why:"Leave any job gracefully. \"I need to quit but don't know how to say it\" — searched millions of times daily.",                           viral:"⚡ 89/100"},
  {em:"💼",name:"AI Prenup Brief",   price:"$29", why:"Highest price, highest intent. Couples actively searching for prenup templates. Legal + emotional urgency. Premium tier.",               viral:"💰 85/100"},
  {em:"🎯",name:"Cover Letter AI",   price:"$9",  why:"Every job application needs one. Massive daily volume. The output IS the product — beautiful = shared.",                                  viral:"📋 88/100"},
  {em:"🌙",name:"Grief Journal AI",  price:"$6/mo", why:"Daily prompts for processing grief. Recurring revenue. People stay for months. The loneliest market with the highest need.",           viral:"🕯️ 92/100"},
];

const RULES = [
  {num:"KOVAČ",text:"PHP 7.4 ONLY — NO match() · str_contains() · str_starts_with() · fn()=> arrows · named args",tag:"Deploy law · baseline · APPEND-ONLY · never repeal",lock:true},
  {num:"KOVAČ",text:'Footer on EVERY page: "Powered by MirzaTech.ai · Property of Emaaa LLC"',tag:"Brand law · every product · every deploy",lock:true},
  {num:"KOVAČ",text:"Deploy flat into public_html — no nesting. Bookmark stable.html after every deploy.",tag:"Deploy law",lock:true},
  {num:"KOVAČ",text:"maya_nexus.php always verbatim · MD5: 9ae9a5231e98e8b1e2af693457b8c1c1 · NEVER modify",tag:"Maya law · verbatim forever",lock:true},
  {num:"RULE 91",text:"NIM / GLM-5 / Kimi-NIM / DeepSeek = empire-reserved · NEVER public-facing. Public products use free-tier only.",tag:"Provider stack law · LOCKED",lock:true},
  {num:"RULE 141",text:"Domain-to-family map NEVER on customer-facing pages. Private forever.",tag:"Family privacy law",lock:true},
  {num:"RULE 208",text:"eternalink.io = digital memorial · honors the dead · LOCKED · never commercialize carelessly",tag:"Sacred product law",lock:true},
  {num:"MOOSE",text:"MooseRiders = LOCKED · Mo-only · Runway AI only · NO agents ever · prestige franchise",tag:"Channel law · most sacred",lock:true},
  {num:"KIN",text:'"brat moj" ALWAYS · NEVER "brah moj" · old Maya files have a typo — ignore them',tag:"Language law · KIN protocol",lock:true},
  {num:"KIN",text:"Every reply to Mo ends with KIN JSON block: {ts, actor:Kin, op, files_changed, pending_mo, signature}",tag:"Communication protocol · LOCKED 2026-05-04",lock:true},
  {num:"DELIVER",text:"Every response: product file + support file + CLAUDE-SESSION-MO-CHAT.md as THIRD FILE always",tag:"Delivery law",lock:true},
  {num:"FORMAT",text:"ALL suggestions · roadmaps · instructions · improvements = JSX/HTML artifact · NEVER plaintext notepad",tag:"NEW LAW · locked today 2026-05-04",lock:true},
];

const REV = [
  {em:"🕯️",name:"Eulogy AI",     price:"$25/ea",  target:"$30K/mo",  pct:85},
  {em:"📅",name:"1000 Days",      price:"$9/mo",   target:"$28K/mo",  pct:78},
  {em:"🎙️",name:"VoiceVault",     price:"$12/mo",  target:"$26K/mo",  pct:72},
  {em:"✉️",name:"Unsent.ai",      price:"$7/ea",   target:"$22K/mo",  pct:65},
  {em:"🌿",name:"Glow Up AI",     price:"$9/ea",   target:"$20K/mo",  pct:60},
  {em:"⭐",name:"AI Oracle",      price:"$5/ea",   target:"$18K/mo",  pct:55},
  {em:"💔",name:"Breakup AI",     price:"$8/ea",   target:"$16K/mo",  pct:50},
  {em:"💍",name:"Wedding Vows",   price:"$15/ea",  target:"$15K/mo",  pct:45},
  {em:"👶",name:"Baby Name AI",   price:"$12/ea",  target:"$14K/mo",  pct:42},
  {em:"🤘",name:"RageRoom.ai",    price:"$8/ea",   target:"$12K/mo",  pct:38},
];

const MAYA_OPS = [
  {live:true,  text:"TikTok daily posts — Eulogy + Oracle + Glow Up rotating", meta:"FunFactPulse · TechBit TikTok"},
  {live:true,  text:"YouTube weekly upload — product showcase videos", meta:"TechBitReels"},
  {live:true,  text:"osman.is storefront — all 46 products live", meta:"osman.is · Hostinger"},
  {live:false, text:"ChimeraChannel Episode 1 — Fatima/Zmaj script → produce", meta:"Echo + Aria agents · Mo reviews"},
  {live:false, text:"MirzaTech.ai homepage — merged HTML deployed", meta:"mirza4040 account"},
  {live:false, text:"Stripe billing integration per product", meta:"Each subdomain.osman.is"},
  {live:false, text:"Private session repo per parallel Claude session", meta:"KIN boot prompt active"},
];

export default function EmpireNext() {
  const [tab, setTab] = useState("products");

  return (
    <>
      <style>{CSS}</style>
      <div className="en">
        <div className="hdr">
          <div className="hdr-left">
            <h1 className="cond">EMPIRE STATE · 2026-05-04</h1>
            <p className="mono">MIRZATECH.AI · EMAAA LLC · 237 DAYS · KIN ACTIVE</p>
          </div>
          <div className="hdr-stats">
            {[
              {val:"46",lbl:"PRODUCTS LIVE"},
              {val:"15",lbl:"BUILT TODAY"},
              {val:"136K+",lbl:"MAYA TOOLS"},
              {val:"10",lbl:"CHANNELS"},
            ].map((s,i) => (
              <div key={i} className="hs">
                <div className="hs-val mono">{s.val}</div>
                <div className="hs-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tabs">
          {[
            {id:"products",label:"✅ Products Built"},
            {id:"queue",   label:"🔥 Build Queue"},
            {id:"revenue", label:"💰 Revenue Map"},
            {id:"rules",   label:"🔒 Locked Rules"},
            {id:"maya",    label:"⚡ Maya Ops"},
          ].map(t => (
            <div key={t.id} className={`tab ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>{t.label}</div>
          ))}
        </div>

        <div className="body">
          {tab === "products" && (
            <div className="enter">
              <div className="card-title" style={{marginBottom:20}}>ALL PRODUCTS BUILT THIS SESSION — LIVE ON OSMAN.IS</div>
              <div className="products-grid">
                {PRODUCTS_BUILT.map((p,i) => (
                  <div key={i} className="product-card" style={{borderColor:p.color+"22"}}>
                    <div className="pc-status"><span className="badge b-live">✓ LIVE</span></div>
                    <div className="pc-em">{p.em}</div>
                    <div className="pc-name cond" style={{color:p.color}}>{p.name}</div>
                    <div className="pc-price">{p.price}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
                      <div style={{fontSize:10,color:"rgba(237,230,250,0.3)"}}>VIRAL</div>
                      <div className="pc-bar" style={{flex:1}}><div className="pc-fill" style={{width:p.viral+"%",background:p.color}}/></div>
                      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",color:p.color}}>{p.viral}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "queue" && (
            <div className="enter">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="card">
                  <div className="card-title">NEXT 10 TO BUILD — PRIORITY ORDER</div>
                  {QUEUE.map((q,i) => (
                    <div key={i} className="queue-item">
                      <div className="qi-num">{String(i+1).padStart(2,"0")}</div>
                      <div className="qi-em">{q.em}</div>
                      <div className="qi-body">
                        <div className="qi-name cond">{q.name}</div>
                        <div className="qi-why">{q.why}</div>
                      </div>
                      <div className="qi-right">
                        <div className="qi-price">{q.price}</div>
                        <div className="qi-viral">{q.viral}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="card mb16">
                    <div className="card-title">NEXT 3 TO BUILD RIGHT NOW</div>
                    {QUEUE.slice(0,3).map((q,i) => (
                      <div key={i} style={{padding:"14px 0",borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                          <span style={{fontSize:24}}>{q.em}</span>
                          <div className="cond" style={{fontSize:20,fontWeight:800,color:"#d4a843"}}>{q.name}</div>
                          <span className="badge b-gold" style={{marginLeft:"auto"}}>{q.price}</span>
                        </div>
                        <div style={{fontSize:12,color:"rgba(237,230,250,0.45)",lineHeight:1.6}}>{q.why}</div>
                      </div>
                    ))}
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:11,color:"rgba(212,168,67,0.6)",fontFamily:"'Space Mono',monospace",marginBottom:8}}>SAY THIS TO BUILD THEM:</div>
                      <div style={{padding:"12px 14px",background:"rgba(212,168,67,0.06)",border:"1px solid rgba(212,168,67,0.15)",borderRadius:8,fontSize:12,fontFamily:"'Space Mono',monospace",color:"rgba(237,230,250,0.7)",lineHeight:1.8}}>
                        "Build the next 3: TattooMuse, Apology AI, and SpeechForge. Same format as the others. Drop them in."
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-title">FORMATS FOR EVERY PRODUCT (NEW LAW)</div>
                    {["React JSX artifact with Claude API ✓","Distinct visual aesthetic per product ✓","Share card + burn option built in ✓","Powered by MirzaTech.ai footer ✓","osman.is subdomain ready ✓","Maya TikTok + YouTube scripts per product ✓"].map((r,i)=>(
                      <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:i<5?"1px solid rgba(255,255,255,0.04)":"none",fontSize:13,color:"rgba(237,230,250,0.7)"}}>
                        <CheckCircle size={13} style={{color:"#22c55e",flexShrink:0,marginTop:1}}/>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "revenue" && (
            <div className="enter">
              <div className="g2">
                <div className="card">
                  <div className="card-title">MONTHLY REVENUE PROJECTIONS (AT SCALE)</div>
                  {REV.map((r,i) => (
                    <div key={i} className="rev-row">
                      <div className="rev-em">{r.em}</div>
                      <div className="rev-name">{r.name}</div>
                      <div className="rev-price">{r.price}</div>
                      <div className="rev-bar-wrap"><div className="rev-pb"><div className="rev-pf" style={{width:r.pct+"%"}}/></div></div>
                      <div className="rev-target">{r.target}</div>
                    </div>
                  ))}
                  <div style={{marginTop:20,padding:"16px",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.15)",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800}}>COMBINED MONTHLY TARGET</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:26,fontWeight:700,color:"#22c55e"}}>$201K/mo</div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">TRAFFIC → REVENUE PATH</div>
                  {[
                    {label:"Maya posts TikTok daily",arrow:"→",result:"500–5K views/video",color:"#22d3ee"},
                    {label:"1% click link in bio",arrow:"→",result:"5–50 osman.is visits",color:"#d4a843"},
                    {label:"10% convert",arrow:"→",result:"$5–$250 per video",color:"#22c55e"},
                    {label:"10 videos/day",arrow:"→",result:"$50–$2,500/day",color:"#f59e0b"},
                    {label:"30 days",arrow:"→",result:"$1.5K–$75K/month",color:"#ef4444"},
                  ].map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:i<4?"1px solid rgba(255,255,255,0.05)":"none",alignItems:"center"}}>
                      <div style={{fontSize:13,flex:1,color:"rgba(237,230,250,0.7)"}}>{s.label}</div>
                      <div style={{color:s.color,fontWeight:700,fontSize:14}}>{s.arrow}</div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:s.color,width:140,textAlign:"right"}}>{s.result}</div>
                    </div>
                  ))}
                  <div style={{marginTop:20,padding:"14px",background:"rgba(212,168,67,0.05)",border:"1px solid rgba(212,168,67,0.15)",borderRadius:10}}>
                    <div style={{fontSize:11,color:"rgba(212,168,67,0.6)",fontFamily:"'Space Mono',monospace",marginBottom:6}}>NEXT UNLOCK</div>
                    <div style={{fontSize:14,fontWeight:600}}>Add Stripe to 3 products this week → first $$ in 48 hours</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "rules" && (
            <div className="enter">
              <div className="g2">
                <div className="card">
                  <div className="card-title">🔒 LOCKED RULES — KOVAČ + KIN · APPEND-ONLY · NEVER REPEAL</div>
                  {RULES.map((r,i) => (
                    <div key={i} className="rule-item">
                      <div className="rule-num">{r.num}</div>
                      <div>
                        <div className="rule-text">{r.text}{r.lock && <span className="rule-lock">LOCKED</span>}</div>
                        <div className="rule-tag">{r.tag}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="card mb16">
                    <div className="card-title">⚡ KIN SYSTEM STATE</div>
                    {[
                      {label:"VPS",value:"76.13.26.130 (Hostinger KVM4)"},
                      {label:"Maya brain",value:"iamsuperio.cloud/api/index"},
                      {label:"Tools cataloged",value:"136,683"},
                      {label:"Products on osman.is",value:"46"},
                      {label:"Claude Code persona",value:"TITAN (current)"},
                      {label:"Hostinger mirzatech.ai",value:"mirza4040 account"},
                      {label:"Hostinger iamsuperio",value:"iamsu3295 account"},
                      {label:"NVIDIA OLYMPUS",value:"42 keys × 18 NIM = 756 slots"},
                      {label:"Session MD",value:"3rd file · always · forever"},
                    ].map((item,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<8?"1px solid rgba(255,255,255,0.04)":"none",gap:20}}>
                        <div style={{fontSize:11,color:"rgba(237,230,250,0.35)",fontFamily:"'Space Mono',monospace",flexShrink:0}}>{item.label}</div>
                        <div style={{fontSize:12,color:"rgba(237,230,250,0.75)",textAlign:"right"}}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="card" style={{background:"rgba(212,168,67,0.04)",borderColor:"rgba(212,168,67,0.2)"}}>
                    <div className="card-title" style={{color:"rgba(212,168,67,0.7)"}}>🆕 NEW LAW — LOCKED TODAY</div>
                    <div style={{fontSize:15,fontWeight:600,color:"#d4a843",marginBottom:8}}>Format Law 2026-05-04</div>
                    <div style={{fontSize:13,lineHeight:1.7,color:"rgba(237,230,250,0.7)"}}>All suggestions, roadmaps, instructions, improvements, and next-step guidance must be delivered as <strong style={{color:"#d4a843"}}>JSX or HTML artifacts</strong> — never as plaintext / notepad.<br/><br/>No more walls of text. Everything visual. Everything beautiful.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "maya" && (
            <div className="enter">
              <div className="g2">
                <div className="card">
                  <div className="card-title">⚡ MAYA OPERATIONS STATUS</div>
                  {MAYA_OPS.map((op,i)=>(
                    <div key={i} className="op-row">
                      <div className={`op-dot ${op.live?"op-live":"op-pend"}`}/>
                      <div className="op-text">{op.text}</div>
                      <div className="op-meta">{op.meta}</div>
                    </div>
                  ))}
                </div>
                <div className="card">
                  <div className="card-title">📺 MAYA CONTENT SCHEDULE</div>
                  {[
                    {day:"MON",post:"🔥 Truth Engine TikTok",ch:"TechBit TikTok",status:"live"},
                    {day:"TUE",post:"🕯️ Eulogy AI TikTok",ch:"FunFact TikTok",status:"live"},
                    {day:"WED",post:"💔 Breakup AI TikTok",ch:"TechBit TikTok",status:"live"},
                    {day:"THU",post:"⭐ AI Oracle TikTok",ch:"FunFact TikTok",status:"live"},
                    {day:"FRI",post:"🌿 Glow Up TikTok",ch:"Both TikTok",status:"live"},
                    {day:"SAT",post:"👶 Baby Name TikTok",ch:"FunFact TikTok",status:"live"},
                    {day:"SUN",post:"▶️ YouTube Upload",ch:"TechBitReels",status:"pending"},
                  ].map((d,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<6?"1px solid rgba(255,255,255,0.04)":"none"}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"rgba(237,230,250,0.3)",width:30,flexShrink:0}}>{d.day}</div>
                      <div style={{flex:1,fontSize:13}}>{d.post}</div>
                      <div style={{fontSize:10,color:"rgba(237,230,250,0.35)"}}>{d.ch}</div>
                      <span className={`badge ${d.status==="live"?"b-live":"b-build"}`}>{d.status==="live"?"ACTIVE":"PENDING"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="footer-law">Powered by MirzaTech.ai · Property of Emaaa LLC · 237 days · KIN active · BANG BANG 🇧🇦</div>
      </div>
    </>
  );
}
