import { useState } from "react";
import { Play, Tv, Youtube, Copy, Check, ChevronDown, ChevronUp, Zap, Hash, Clock, Eye, Loader } from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { background: #060409; min-height: 100%; }
  .mc { font-family:'DM Sans',sans-serif; min-height:100vh; background:#060409; color:#ede8f5;
    background-image: radial-gradient(ellipse 60% 40% at 50% 0%,rgba(212,168,67,0.07) 0%,transparent 60%); }

  /* ── Topbar ── */
  .topbar { height:58px; background:#0a0710; border-bottom:1px solid rgba(255,255,255,0.07); display:flex; align-items:center; padding:0 28px; gap:14px; position:sticky; top:0; z-index:20; }
  .tb-logo { font-family:'Syne',sans-serif; font-size:18px; font-weight:900; background:linear-gradient(135deg,#f0c060,#d4a843); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .tb-sub { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; color:rgba(237,232,245,0.3); }
  .maya-dot { display:flex; align-items:center; gap:6px; margin-left:auto; }
  .dot-live { width:7px; height:7px; border-radius:50%; background:#22c55e; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }

  /* ── Layout ── */
  .shell { display:flex; height:calc(100vh - 58px); }
  .sidebar { width:240px; background:#0a0710; border-right:1px solid rgba(255,255,255,0.07); overflow-y:auto; flex-shrink:0; padding:12px 0; }
  .sidebar::-webkit-scrollbar { width:3px; } .sidebar::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); }
  .main { flex:1; overflow-y:auto; padding:28px; }
  .main::-webkit-scrollbar { width:4px; } .main::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); }

  /* ── Sidebar items ── */
  .sb-label { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:3px; color:rgba(237,232,245,0.2); padding:12px 16px 6px; }
  .sb-item { display:flex; align-items:center; gap:10px; padding:10px 16px; cursor:pointer; transition:background 0.15s; border-left:2px solid transparent; }
  .sb-item:hover { background:rgba(255,255,255,0.03); }
  .sb-item.on { background:rgba(212,168,67,0.07); border-left-color:#d4a843; }
  .sb-em { font-size:18px; flex-shrink:0; }
  .sb-name { font-size:12px; font-weight:500; color:rgba(237,232,245,0.7); }
  .sb-price { font-family:'DM Mono',monospace; font-size:10px; color:rgba(237,232,245,0.3); }

  /* ── Content card ── */
  .content-header { margin-bottom:28px; }
  .ch-top { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
  .ch-emoji { font-size:44px; }
  .ch-name { font-family:'Syne',sans-serif; font-size:28px; font-weight:900; margin-bottom:4px; }
  .ch-meta { display:flex; gap:10px; flex-wrap:wrap; }
  .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:20px; font-size:10px; font-weight:700; letter-spacing:0.5px; border:1px solid; }
  .b-gold { background:rgba(212,168,67,0.1); border-color:rgba(212,168,67,0.25); color:#d4a843; }
  .b-red { background:rgba(255,0,0,0.08); border-color:rgba(255,0,0,0.2); color:#ff5555; }
  .b-green { background:rgba(34,197,94,0.08); border-color:rgba(34,197,94,0.2); color:#22c55e; }
  .b-blue { background:rgba(34,211,238,0.08); border-color:rgba(34,211,238,0.2); color:#22d3ee; }

  /* ── Platform tabs ── */
  .platform-tabs { display:flex; gap:10px; margin-bottom:24px; }
  .ptab { display:flex; align-items:center; gap:7px; padding:10px 20px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); cursor:pointer; font-size:13px; font-weight:600; color:rgba(237,232,245,0.4); transition:all 0.2s; }
  .ptab:hover { color:rgba(237,232,245,0.8); }
  .ptab.on-tk { background:rgba(0,0,0,0.4); border-color:rgba(255,255,255,0.15); color:#fff; }
  .ptab.on-yt { background:rgba(255,0,0,0.1); border-color:rgba(255,0,0,0.25); color:#ff5555; }

  /* ── Script box ── */
  .script-box { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; overflow:hidden; margin-bottom:16px; }
  .sb-head { padding:14px 20px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:space-between; }
  .sb-head-left { display:flex; align-items:center; gap:8px; }
  .sb-head-title { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:2px; color:rgba(237,232,245,0.4); }
  .script-content { padding:20px; font-size:14px; line-height:1.85; color:rgba(237,232,245,0.85); white-space:pre-wrap; font-family:'DM Sans',sans-serif; }
  .script-content .beat { color:#d4a843; font-weight:700; }
  .script-content .hook { color:#f59e0b; font-weight:600; }
  .script-content .cta { color:#22c55e; font-weight:600; }

  /* ── Hashtags ── */
  .hashtag-row { display:flex; gap:8px; flex-wrap:wrap; padding:14px 20px; border-top:1px solid rgba(255,255,255,0.05); background:rgba(0,0,0,0.2); }
  .ht { font-family:'DM Mono',monospace; font-size:11px; color:rgba(34,211,238,0.7); }

  /* ── YT Outline ── */
  .yt-outline { background:rgba(255,0,0,0.05); border:1px solid rgba(255,0,0,0.15); border-radius:14px; overflow:hidden; }
  .yt-head { padding:14px 20px; border-bottom:1px solid rgba(255,0,0,0.1); display:flex; align-items:center; gap:8px; }
  .yt-section { padding:16px 20px; border-bottom:1px solid rgba(255,255,255,0.04); }
  .yt-section:last-child { border-bottom:none; }
  .yt-sec-title { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; color:rgba(255,80,80,0.6); margin-bottom:8px; }
  .yt-sec-content { font-size:13px; line-height:1.7; color:rgba(237,232,245,0.75); }

  /* ── Schedule ── */
  .schedule-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; }
  .sched-day { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:12px 8px; text-align:center; }
  .sched-day-name { font-family:'DM Mono',monospace; font-size:9px; letter-spacing:1.5px; color:rgba(237,232,245,0.3); margin-bottom:6px; }
  .sched-day-post { font-size:16px; margin-bottom:4px; }
  .sched-day-label { font-size:9px; color:rgba(237,232,245,0.35); line-height:1.4; }
  .sched-day.hot { border-color:rgba(212,168,67,0.3); background:rgba(212,168,67,0.06); }

  .copy-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.09); border-radius:7px; font-size:11px; color:rgba(237,232,245,0.45); cursor:pointer; transition:all 0.15s; }
  .copy-btn:hover { color:rgba(237,232,245,0.8); }

  .footer-law { padding:10px 20px; border-top:1px solid rgba(255,255,255,0.06); font-size:9px; color:rgba(237,232,245,0.15); text-align:center; letter-spacing:1px; }
  .ent { animation:up 0.22s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
`;

const PRODUCTS = [
  {
    id:"eulogy",em:"🕯️",name:"Eulogy AI",price:"$25",url:"eulogyai.osman.is",color:"#d4a843",
    viral:"HIGHEST URGENCY",channel:"TechBitReels / All Channels",
    tiktok:{
      hook:"POV: It's 2am and you have to write your father's eulogy tomorrow and you don't know what to say.",
      script:`[HOOK - 0-3s]
POV: It's 2am. Your loved one's funeral is tomorrow. You need to write the eulogy and the screen is blank.

[PROBLEM - 3-8s]
Everyone's counting on you to find the words — and you just... can't. You're grieving. You're exhausted.

[SOLUTION - 8-18s]
Eulogy AI exists for exactly this moment. You tell us about the person — their laugh, their habits, their love — and we write something beautiful, specific, and real. In minutes.

[SOCIAL PROOF - 18-25s]
Hundreds of people have used this at 2am. Every single one said "this is exactly what I would have written if I had more time."

[CTA - 25-30s]
🕯️ Link in bio. $25. Because they deserve to be remembered right.`,
      hashtags:["#eulogy","#grief","#funeral","#RIP","#AItools","#WritingHelp","#FYP","#viral"],
      duration:"30s",bestTime:"Tue-Thu 7pm-10pm",
    },
    youtube:{
      title:"I Used AI to Write My Father's Eulogy — Here's What Happened",
      hook:"What do you say about someone who meant everything? I had 12 hours to figure that out.",
      sections:[
        {title:"THE MOMENT",content:"Personal story: 2am, blank page, funeral in 8 hours. The pressure of needing to honor someone perfectly."},
        {title:"THE PROBLEM WITH GENERIC EULOGIES",content:"Most eulogies are forgettable. Generic phrases. No specifics. This person deserved better."},
        {title:"SCREEN DEMO",content:"Live walkthrough of Eulogy AI — showing the input fields, what happens when you submit, the actual output."},
        {title:"THE REACTION",content:"Read the eulogy aloud. Show the emotional response. The specificity that made it real."},
        {title:"WHO NEEDS THIS",content:"Anyone who's ever had to speak at a funeral. Pastors, family members, friends. $25 is nothing for this moment."},
        {title:"CTA",content:"Link in description. Try Eulogy AI at eulogyai.osman.is. 🕯️"},
      ],
      duration:"5-7 min",thumbnail:"Person at desk, 2am glow, tear, phone screen visible",
    }
  },
  {
    id:"truth",em:"🔥",name:"Truth Engine",price:"$5",url:"truthengine.osman.is",color:"#c41e3a",
    viral:"VIRAL BY DESIGN",channel:"TechBitReels",
    tiktok:{
      hook:"I typed out everything I was feeling and an AI turned it into a song. I cried.",
      script:`[HOOK - 0-3s]
"I just typed everything I was feeling into this app and it wrote me a song. I'm crying right now."

[SHOW THE PRODUCT - 3-12s]
[Screen recording] Watch me type a raw, messy emotion into Truth Engine. Watch it transform in real time.

[THE REVEAL - 12-22s]
[Read the output] "okay this actually hits different—"

[THE OPTIONS - 22-27s]
You can turn it into a song, a video script, a book chapter — or burn it forever and it never existed. $5.

[CTA - 27-30s]
🔥 Link in bio. Your truth deserves to become something.`,
      hashtags:["#truthengine","#AIart","#emotional","#songwriting","#mentalhealth","#FYP","#viral","#aigenerated"],
      duration:"30s",bestTime:"Fri-Sun 8pm-11pm",
    },
    youtube:{
      title:"I Let AI Transform My Darkest Emotions Into Art — The Results Were Shocking",
      hook:"What if everything you felt but couldn't say could become music? I tested it.",
      sections:[
        {title:"THE CONCEPT",content:"Truth Engine explained — emotion in, art out. No therapy needed. No judgment."},
        {title:"LIVE TEST #1 — SONG",content:"Type a real emotion. Show the transformation. Play the output."},
        {title:"LIVE TEST #2 — VIDEO SCRIPT",content:"Different emotion, different output. Show the range."},
        {title:"THE BURN FEATURE",content:"Show what happens when you hit 'Burn It' — the animation, the permanent deletion. This is what privacy looks like."},
        {title:"WHO IS THIS FOR",content:"Anyone with feelings they can't articulate. Creators. Grieving people. Angry people. Anyone."},
        {title:"CTA",content:"Try Truth Engine at truthengine.osman.is — $5 per transform. Link below. 🔥"},
      ],
      duration:"6-8 min",thumbnail:"Dark screen, glowing text being typed, emotional face",
    }
  },
  {
    id:"glowup",em:"🔥",name:"Revenge Glow Up AI",price:"$9",url:"glowup.osman.is",color:"#f59e0b",
    viral:"PEOPLE POST THEIR PLAN",channel:"FunFactPulse / TechBitReels",
    tiktok:{
      hook:"I just got my 30-day Revenge Glow Up plan from AI and I am NOT the same person I was an hour ago.",
      script:`[HOOK - 0-3s]
"Just got my revenge glow up plan from AI and I am NOT the same person I was an hour ago."

[SHOW THE PLAN - 3-15s]
[Screen scroll] Week 1: Day 1 — Wake up 5am, cold shower, don't text them. Day 2 — Delete every photo. Day 3 — Book that appointment you've been putting off...

[EMOTIONAL HOOK - 15-23s]
"This AI knows exactly what I needed to hear. It's not generic. It's specific to MY situation. MY story."

[THE OFFER - 23-28s]
$9. You describe what happened. You choose your areas. You get a 30-90 day plan so good you'll post it publicly.

[CTA - 28-30s]
🔥 Link in bio. They'll regret it. Let's make sure of that.`,
      hashtags:["#glowup","#revengeglowup","#breakup","#transformation","#selfimprovement","#maincharacter","#FYP","#viral"],
      duration:"30s",bestTime:"Mon-Wed 6pm-10pm",
    },
    youtube:{
      title:"AI Built My 30-Day Revenge Glow Up Plan — I'm Posting the Results",
      hook:"My ex thought I'd fall apart. I got an AI to build the exact plan to prove them wrong.",
      sections:[
        {title:"THE SITUATION",content:"Relatable breakup/setback story. The moment you decide to become the main character."},
        {title:"LIVE DEMO",content:"Show filling in the Glow Up AI — situation, timeline, focus areas. Build the suspense."},
        {title:"READING THE PLAN",content:"Read the full plan aloud. React to each week. Show why it's specific, not generic."},
        {title:"WEEK 1 UPDATE",content:"(If filming over time) Show actual Day 1-7 progress following the plan."},
        {title:"THE MATH",content:"$9 vs. $200/hr therapist. The AI plan vs. spiral alone. It's not even close."},
        {title:"CTA",content:"Get yours at glowup.osman.is — Link below. 🔥 Tag me when you post your plan."},
      ],
      duration:"8-10 min",thumbnail:"Before/after split, fire background, bold text overlay",
    }
  },
  {
    id:"oracle",em:"⭐",name:"AI Oracle",price:"$5",url:"aioracle.osman.is",color:"#9870e8",
    viral:"SCREENSHOT SPREADS ITSELF",channel:"FunFactPulse / TikTok",
    tiktok:{
      hook:"I paid $5 for an AI horoscope and it knew things about me that I haven't told anyone.",
      script:`[HOOK - 0-3s]
"This AI horoscope knew things about me I haven't told ANYONE."

[THE READING - 3-18s]
[Read your actual reading on camera — react as you go]
"Your Scorpio energy this month is—" wait WHAT
"The relationship you're avoiding..." okay how
"Your power move: stop waiting for permission" — I'm going to cry.

[THE SHAREABILITY - 18-25s]
I screenshotted this and sent it to 6 people. They all said "this is exactly me." That's not a coincidence.

[OFFER - 25-28s]
⭐ $5. Pick your sign. Get your reading. Screenshot it. Send it to someone who needs it.

[CTA - 28-30s]
Link in bio. Try it. Then text the screenshot to whoever needs to see it.`,
      hashtags:["#horoscope","#astrology","#zodiac","#AIreading","#mystical","#FYP","#capricorn","#scorpio","#virgo"],
      duration:"30s",bestTime:"Daily 12pm + 9pm",
    },
    youtube:{
      title:"I Got an AI Horoscope Reading — It Was Eerily Accurate",
      hook:"I don't believe in astrology. But this AI reading made me question everything.",
      sections:[
        {title:"THE SETUP",content:"Skeptic intro — 'I don't usually do this.' Set up the test. Make it relatable."},
        {title:"LIVE READING — YOUR SIGN",content:"Full screen demo. Read every section aloud. React genuinely."},
        {title:"TEST OTHER SIGNS",content:"Get readings for 3-4 different signs. Compare. Show range and accuracy."},
        {title:"SEND TO FRIENDS",content:"Film reactions of sending the readings to friends. Their responses = social proof."},
        {title:"THE SCIENCE",content:"Why AI pattern recognition + personality archetypes = eerily accurate readings."},
        {title:"CTA",content:"$5 at aioracle.osman.is — Link in description. Share yours in the comments. ⭐"},
      ],
      duration:"7-9 min",thumbnail:"Dark celestial background, zodiac symbols, shocked face overlay",
    }
  },
  {
    id:"breakup",em:"💔",name:"Breakup Text AI",price:"$8",url:"breakup.osman.is",color:"#ff1464",
    viral:"URGENCY IS THE MARKETING",channel:"TechBitReels / FunFact TikTok",
    tiktok:{
      hook:"I've been trying to write this breakup text for 3 days. AI wrote it perfectly in 30 seconds.",
      script:`[HOOK - 0-3s]
"I've been trying to write this breakup text for THREE DAYS. AI wrote it perfectly in 30 seconds."

[THE PROBLEM - 3-8s]
You know it's over. But every time you start typing, it comes out wrong. Too harsh. Too soft. Too confusing. False hope creeping in.

[THE SOLUTION - 8-20s]
[Screen recording] Tell Breakup AI what happened, how long you were together, and the real reason. Watch it write 3 versions — short, medium, and full conversation.

[THE OUTPUT - 20-26s]
[Read the short version] "This is kind. This is clear. This leaves no false hope. I would have never written this myself."

[CTA - 26-30s]
💔 $8. Link in bio. You already know it's over — let's find the words.`,
      hashtags:["#breakup","#relationship","#textmessage","#AItools","#relationshipadvice","#FYP","#viral","#communication"],
      duration:"30s",bestTime:"Sun-Mon 7pm-11pm",
    },
    youtube:{
      title:"Using AI to Write the Hardest Text Message of My Life",
      hook:"I'd been avoiding this conversation for two weeks. I finally used AI to help me say what I needed to say.",
      sections:[
        {title:"THE SITUATION",content:"Relatable 'I know it's over but I can't say it' story. Build empathy."},
        {title:"THE DEMO",content:"Live walkthrough. Show the input. Show the 3 outputs. Compare them."},
        {title:"THE PSYCHOLOGY",content:"Why clarity is kindness. Why vague breakups hurt more. Why this AI gets it right."},
        {title:"REAL REACTIONS",content:"(Optional) Show friends reading the outputs and reacting."},
        {title:"IT WORKS BOTH WAYS",content:"Also works for ending friendships, work relationships, family distance."},
        {title:"CTA",content:"$8 at breakup.osman.is — Link below. 💔"},
      ],
      duration:"6-8 min",thumbnail:"Phone screen, notification bubble, dramatic lighting, red tones",
    }
  },
  {
    id:"baby",em:"👶",name:"Baby Name AI",price:"$12",url:"babyname.osman.is",color:"#f97316",
    viral:"PARENTS SHARE IMMEDIATELY",channel:"FunFactPulse / IG",
    tiktok:{
      hook:"We let AI name our baby. These suggestions were actually BEAUTIFUL.",
      script:`[HOOK - 0-3s]
"We let AI suggest names for our baby. These results were actually beautiful."

[SHOW THE PROCESS - 3-12s]
[Screen recording] Enter surname, heritage (Bosnian + American), gender (girl), style (classic, strong, poetic). Hit generate.

[REVEAL THE NAMES - 12-24s]
[One by one, react to each name]
"Okay... Leila — meaning 'night' in Arabic, flows perfectly with our last name..."
"Nora — simple, timeless, she can't outgrow it..."
"Amira — oh that's beautiful—"

[THE MOMENT - 24-28s]
"We actually love one of these. I'm not telling you which one until she's born."

[CTA - 28-30s]
👶 $12. Link in bio. Tag a pregnant friend.`,
      hashtags:["#babynames","#pregnancy","#babyname","#pregnant","#newborn","#AItools","#FYP","#viral","#expecting"],
      duration:"30s",bestTime:"Tue-Sat 10am-2pm + 7pm",
    },
    youtube:{
      title:"We Let AI Suggest Baby Names — Our Honest Reaction",
      hook:"We spent weeks arguing about baby names. Then we tried AI and found 5 we actually love.",
      sections:[
        {title:"THE NAME STRUGGLE",content:"Relatable: every name you love, your partner hates. The pressure of naming a human forever."},
        {title:"LIVE DEMO — OUR DETAILS",content:"Enter real family details. Show the thought that goes into each suggestion."},
        {title:"REACTION TO EACH NAME",content:"Read each name aloud. Both partners react. Genuine conversation."},
        {title:"THE DETAILS MATTER",content:"Show the meaning, origin, nickname, and 'why it works' for each — this is the product's secret weapon."},
        {title:"FINAL VERDICT",content:"Which names made the shortlist. Why this is better than random lists online."},
        {title:"CTA",content:"$12 at babyname.osman.is — Link below. 👶 Tag expecting parents."},
      ],
      duration:"8-12 min",thumbnail:"Couple with baby items, expectant energy, warm light, name written out",
    }
  },
];

export default function MayaContentSystem() {
  const [active, setActive] = useState(PRODUCTS[0]);
  const [platform, setPlatform] = useState("tiktok");
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  const p = active;

  return (
    <>
      <style>{CSS}</style>
      <div className="mc">
        <div className="topbar">
          <div>
            <div className="tb-logo">⚡ MAYA CONTENT SYSTEM</div>
            <div className="tb-sub">TIKTOK + YOUTUBE AUTOMATION · OSMAN.IS</div>
          </div>
          <div className="maya-dot">
            <div className="dot-live"/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#22c55e",letterSpacing:1}}>MAYA ONLINE</span>
          </div>
        </div>

        <div className="shell">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sb-label">ALL PRODUCTS</div>
            {PRODUCTS.map(prod => (
              <div key={prod.id} className={`sb-item ${active.id===prod.id?"on":""}`} onClick={()=>{ setActive(prod); setPlatform("tiktok"); }}>
                <div className="sb-em">{prod.em}</div>
                <div>
                  <div className="sb-name">{prod.name}</div>
                  <div className="sb-price">{prod.price}</div>
                </div>
              </div>
            ))}
            <div className="sb-label" style={{marginTop:12}}>CHANNELS</div>
            {["TechBitReels","FunFactPulse","FunFact TikTok","MirzaTech IG"].map(ch => (
              <div key={ch} className="sb-item" style={{opacity:0.5}}>
                <div className="sb-em">{ch.includes("TikTok")?"📱":ch.includes("IG")?"📸":"▶️"}</div>
                <div className="sb-name" style={{fontSize:11}}>{ch}</div>
              </div>
            ))}
            <div className="footer-law">MirzaTech.ai · Emaaa LLC</div>
          </aside>

          {/* MAIN */}
          <div className="main">
            <div className="content-header ent" key={p.id}>
              <div className="ch-top">
                <div className="ch-emoji">{p.em}</div>
                <div>
                  <div className="ch-name" style={{color: p.color}}>{p.name}</div>
                  <div className="ch-meta">
                    <span className="badge b-gold">{p.price} per use</span>
                    <span className="badge b-green">⚡ {p.viral}</span>
                    <span className="badge b-blue">📺 {p.channel}</span>
                  </div>
                </div>
              </div>

              {/* Platform tabs */}
              <div className="platform-tabs">
                <div className={`ptab ${platform==="tiktok"?"on-tk":""}`} onClick={()=>setPlatform("tiktok")}>
                  <span>📱</span> TikTok Script
                </div>
                <div className={`ptab ${platform==="youtube"?"on-yt":""}`} onClick={()=>setPlatform("youtube")}>
                  <Youtube size={14}/> YouTube Outline
                </div>
                <div className={`ptab ${platform==="schedule"?"on-tk":""}`} onClick={()=>setPlatform("schedule")}>
                  <Clock size={14}/> Post Schedule
                </div>
              </div>

              {/* TIKTOK */}
              {platform==="tiktok" && (
                <div className="ent">
                  <div className="script-box">
                    <div className="sb-head">
                      <div className="sb-head-left">
                        <span>📱</span>
                        <div className="sb-head-title">TIKTOK SCRIPT · {p.tiktok.duration.toUpperCase()}</div>
                        <span className="badge b-green" style={{fontSize:9}}>{p.tiktok.bestTime}</span>
                      </div>
                      <button className="copy-btn" onClick={()=>copy(p.tiktok.script,"script")}>
                        {copied==="script"?<><Check size={11}/>Copied!</>:<><Copy size={11}/>Copy Script</>}
                      </button>
                    </div>
                    <div className="script-content">
                      <div style={{marginBottom:14,padding:"10px 14px",background:"rgba(212,168,67,0.06)",borderRadius:8,border:"1px solid rgba(212,168,67,0.15)"}}>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:"rgba(212,168,67,0.6)",marginBottom:6}}>HOOK</div>
                        <div style={{fontSize:15,fontWeight:600,color:"#f0c060"}}>"{p.tiktok.hook}"</div>
                      </div>
                      {p.tiktok.script}
                    </div>
                    <div className="hashtag-row">
                      {p.tiktok.hashtags.map(h=><span key={h} className="ht">{h}</span>)}
                      <button className="copy-btn" style={{marginLeft:"auto"}} onClick={()=>copy(p.tiktok.hashtags.join(" "),"tags")}>
                        {copied==="tags"?<><Check size={11}/>Copied!</>:<><Copy size={11}/>Copy Tags</>}
                      </button>
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:4}}>
                    {[
                      {label:"BEST TIME TO POST",value:p.tiktok.bestTime,icon:"⏰"},
                      {label:"VIDEO DURATION",value:p.tiktok.duration,icon:"⏱️"},
                      {label:"CHANNEL",value:p.channel,icon:"📺"},
                      {label:"LINK IN BIO",value:"osman.is → "+p.url,icon:"🔗"},
                    ].map((item,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"12px 16px"}}>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:"rgba(237,232,245,0.3)",marginBottom:5}}>{item.label}</div>
                        <div style={{fontSize:13,color:"rgba(237,232,245,0.75)"}}>{item.icon} {item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* YOUTUBE */}
              {platform==="youtube" && (
                <div className="ent">
                  <div style={{marginBottom:16,padding:"16px 20px",background:"rgba(255,0,0,0.06)",border:"1px solid rgba(255,0,0,0.15)",borderRadius:12}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:"rgba(255,80,80,0.5)",marginBottom:6}}>VIDEO TITLE</div>
                    <div style={{fontSize:16,fontWeight:600,color:"#fff",marginBottom:8}}>{p.youtube.title}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:"rgba(255,80,80,0.5)",marginBottom:6}}>OPENING HOOK</div>
                    <div style={{fontSize:14,color:"rgba(237,232,245,0.7)",fontStyle:"italic"}}>"{p.youtube.hook}"</div>
                    <div style={{marginTop:12,display:"flex",gap:10}}>
                      <span className="badge b-red">⏱️ {p.youtube.duration}</span>
                      <span className="badge" style={{background:"rgba(255,255,255,0.05)",borderColor:"rgba(255,255,255,0.1)",color:"rgba(237,232,245,0.5)"}}>🖼️ {p.youtube.thumbnail}</span>
                    </div>
                  </div>
                  <div className="yt-outline">
                    <div className="yt-head">
                      <Youtube size={16} style={{color:"#ff5555"}}/>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,color:"rgba(255,80,80,0.6)"}}>VIDEO OUTLINE · {p.youtube.duration.toUpperCase()}</span>
                      <button className="copy-btn" style={{marginLeft:"auto"}} onClick={()=>copy(p.youtube.sections.map(s=>s.title+": "+s.content).join("\n\n"),"yt")}>
                        {copied==="yt"?<><Check size={11}/>Copied!</>:<><Copy size={11}/>Copy Outline</>}
                      </button>
                    </div>
                    {p.youtube.sections.map((s,i)=>(
                      <div key={i} className="yt-section">
                        <div className="yt-sec-title">SECTION {String(i+1).padStart(2,"0")} · {s.title}</div>
                        <div className="yt-sec-content">{s.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCHEDULE */}
              {platform==="schedule" && (
                <div className="ent">
                  <div style={{marginBottom:20}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,color:"rgba(237,232,245,0.3)",marginBottom:14}}>MAYA AUTO-POST SCHEDULE — WEEKLY</div>
                    <div className="schedule-grid">
                      {[
                        {day:"MON",post:"🔥",label:"Truth Engine TikTok",hot:false},
                        {day:"TUE",post:"🕯️",label:"Eulogy AI TikTok",hot:true},
                        {day:"WED",post:"💔",label:"Breakup AI TikTok",hot:false},
                        {day:"THU",post:"⭐",label:"AI Oracle TikTok",hot:true},
                        {day:"FRI",post:"🌿",label:"Glow Up AI TikTok",hot:true},
                        {day:"SAT",post:"👶",label:"Baby Name TikTok",hot:false},
                        {day:"SUN",post:"▶️",label:"YouTube Upload",hot:true},
                      ].map(d=>(
                        <div key={d.day} className={`sched-day ${d.hot?"hot":""}`}>
                          <div className="sched-day-name">{d.day}</div>
                          <div className="sched-day-post">{d.post}</div>
                          <div className="sched-day-label">{d.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{background:"rgba(212,168,67,0.05)",border:"1px solid rgba(212,168,67,0.15)",borderRadius:12,padding:"20px"}}>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,color:"rgba(212,168,67,0.5)",marginBottom:12}}>MAYA AUTO-POST INSTRUCTIONS</div>
                    {[
                      "Generate TikTok video using the script above",
                      "Post to assigned channel (TechBitReels for tech, FunFactPulse for viral)",
                      "Add all hashtags from the script",
                      "Link in bio → osman.is/"+p.id,
                      "Post at optimal time window for maximum reach",
                      "Create YouTube video using the outline — upload Sunday",
                      "Cross-post to MirzaTech IG as Reels",
                    ].map((step,i)=>(
                      <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:p.color,flexShrink:0,marginTop:1}}>{String(i+1).padStart(2,"0")}</div>
                        <div style={{fontSize:13,color:"rgba(237,232,245,0.65)"}}>{step}</div>
                      </div>
                    ))}
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
