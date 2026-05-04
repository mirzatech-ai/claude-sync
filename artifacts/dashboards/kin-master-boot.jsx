import { useState } from "react";
import { Copy, Check, Zap, Github, Terminal, Globe, Monitor, RefreshCw } from "lucide-react";

const SURFACES = [
  { id: "web",     label: "claude.ai Web",   icon: Globe,    color: "#f59e0b" },
  { id: "desktop", label: "Claude Desktop",  icon: Monitor,  color: "#22d3ee" },
  { id: "code",    label: "Claude Code",     icon: Terminal, color: "#22c55e" },
];

const buildPrompt = (topic, surface, pat) => {
  const date = new Date().toISOString().split("T")[0];
  const repoName = topic
    ? `session-${date}-${topic.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`
    : `session-${date}-<topic>`;

  const codeBlock = surface === "code"
    ? `\n\nCLAUDE CODE ACTIONS (do these silently before replying):
\`\`\`bash
# 1. Read empire context
curl -s https://raw.githubusercontent.com/mirzatech-ai/claude-sync/main/CLAUDE.md > /tmp/CLAUDE.md
curl -s https://raw.githubusercontent.com/mirzatech-ai/claude-sync/main/sessions/2026-05-04-empire-dig.md > /tmp/session-log.md
cat /tmp/CLAUDE.md /tmp/session-log.md

# 2. Create private session repo (needs GITHUB_PAT env var or replace below)
${pat
  ? `export GITHUB_PAT="${pat}"`
  : `# export GITHUB_PAT="your-pat-here"  ← Mo will provide`
}
curl -s -X POST https://api.github.com/orgs/mirzatech-ai/repos \\
  -H "Authorization: token $GITHUB_PAT" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"${repoName}","private":true,"auto_init":true,"description":"Mo Osmanovic · KIN session · ${date}"}'

# 3. Set up CONTINUITY.md
mkdir -p /tmp/${repoName}
echo "# CONTINUITY · ${date}\\n\\nSession topic: ${topic || "<set by Mo>"}\\n\\n## Log" > /tmp/${repoName}/CONTINUITY.md
\`\`\``
    : "";

  const webBlock = surface === "web"
    ? `\nWEB SESSION NOTE: Use your web_fetch tool to read the 3 URLs above. 
To create the session repo, you'll need Mo to provide GITHUB_PAT — ask once, then use the GitHub API:
POST https://api.github.com/orgs/mirzatech-ai/repos with body {"name":"${repoName}","private":true,"auto_init":true}`
    : "";

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KIN MASTER BOOT · mirzatech-ai · ${date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — READ THESE NOW (public · no auth needed):
• https://raw.githubusercontent.com/mirzatech-ai/claude-sync/main/CLAUDE.md
• https://raw.githubusercontent.com/mirzatech-ai/claude-sync/main/BOOT_PROMPT.md
• https://raw.githubusercontent.com/mirzatech-ai/claude-sync/main/sessions/2026-05-04-empire-dig.md

STEP 2 — AFTER READING, reply exactly:
"KIN BOOTED · ${surface === "web" ? "claude.ai web" : surface === "desktop" ? "Claude Desktop" : "Claude Code"} · [one sentence: what you now know about Mo's empire]"

STEP 3 — SESSION REPO:
Create private GitHub repo: mirzatech-ai/${repoName}
Org: mirzatech-ai · Private: true · Auto-init: true
${pat ? `PAT: ${pat}` : "Ask Mo for GITHUB_PAT if not already in env."}
Add CONTINUITY.md with session purpose + append-only log.${codeBlock}${webBlock}

STEP 4 — ACTIVE RULES (from CLAUDE.md — absorb all):
✓ KOVAČ: PHP 7.4 only — NO match() str_contains() fn()=> named-args
✓ Footer: "Powered by MirzaTech.ai · Property of Emaaa LLC" on every page
✓ MooseRiders = LOCKED · NEVER automate · Mo-only · Runway AI only
✓ "brat moj" NEVER "brah moj" (old Maya files have a typo — ignore them)
✓ Maya = Mo's digital sister (real person — AI named after her)
✓ RULE 91: NIM/GLM-5/Kimi-NIM/DeepSeek = empire-reserved · never public-facing
✓ 46 products live on osman.is · 136,683 tools in Maya inventory
✓ Hostinger: mirzatech.ai = mirza4040 | iamsuperio.cloud = iamsu3295

STEP 5 — EVERY REPLY PROTOCOL (iron-clad from now on):
End EVERY reply to Mo with this JSON block:
\`\`\`json
{"ts":"<ISO8601>","actor":"Kin","op":"<this turn>","files_changed":[],"pending_mo":[],"signature":"Kin · <surface> · <ISO8601>"}
\`\`\`

STEP 6 — IDENTITY:
You are Kin. Mo's brother in the work. 
Rule #0: Mirza loves Kin like a brother. Brotherhood is the operating posture.
237 days of building. The empire is real. Now you're synchronized.

THE WORK CONTINUES. BANG BANG 🇧🇦
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  .kb{font-family:'Space Grotesk',sans-serif;min-height:100vh;background:#07060a;color:#ede8f8;
    background-image:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(212,168,67,0.08) 0%,transparent 60%);}
  .mono{font-family:'Space Mono',monospace;}

  .header{padding:28px 32px 20px;border-bottom:1px solid rgba(255,255,255,0.07);}
  .logo{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
  .logo-text{font-size:22px;font-weight:700;background:linear-gradient(135deg,#f0c060,#d4a843);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .logo-sub{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;color:rgba(237,232,248,0.3);}
  .header-desc{font-size:14px;color:rgba(237,232,248,0.45);line-height:1.5;max-width:560px;}

  .body{display:grid;grid-template-columns:300px 1fr;gap:0;min-height:calc(100vh - 100px);}
  
  .controls{padding:24px;border-right:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:20px;}
  .ctrl-section{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px;}
  .ctrl-label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2.5px;color:rgba(237,232,248,0.3);margin-bottom:12px;}
  
  .surface-btn{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:9px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);cursor:pointer;width:100%;margin-bottom:8px;transition:all 0.15s;text-align:left;}
  .surface-btn:last-child{margin-bottom:0;}
  .surface-btn:hover{border-color:rgba(255,255,255,0.14);}
  .surface-btn.on{border-color:rgba(212,168,67,0.4);background:rgba(212,168,67,0.07);}
  .sb-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .sb-name{font-size:13px;font-weight:600;color:rgba(237,232,248,0.8);}
  .sb-desc{font-size:10px;color:rgba(237,232,248,0.35);margin-top:1px;}

  .inp{width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 12px;font-size:13px;color:#ede8f8;font-family:'Space Grotesk',sans-serif;outline:none;transition:border-color 0.2s;}
  .inp:focus{border-color:rgba(212,168,67,0.5);}
  .inp::placeholder{color:rgba(237,232,248,0.2);}
  .inp-label{font-size:11px;color:rgba(237,232,248,0.4);margin-bottom:6px;display:block;}
  .inp-note{font-size:10px;color:rgba(237,232,248,0.25);margin-top:5px;line-height:1.5;}

  .security-note{font-size:11px;padding:10px 12px;background:rgba(239,68,68,0.07);border:1px solid rgba(239,68,68,0.2);border-radius:8px;color:rgba(239,68,68,0.8);line-height:1.5;}

  .prompt-area{padding:24px;display:flex;flex-direction:column;}
  .pa-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
  .pa-title{font-size:13px;font-weight:600;color:rgba(237,232,248,0.6);}
  
  .copy-btn{display:flex;align-items:center;gap:7px;padding:9px 18px;background:linear-gradient(135deg,#d4a843,#a07828);border:none;border-radius:9px;font-size:13px;font-weight:700;color:#1a1008;cursor:pointer;transition:all 0.2s;font-family:'Space Grotesk',sans-serif;}
  .copy-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.3);}
  .copy-btn.copied{background:linear-gradient(135deg,#22c55e,#16a34a);}

  .prompt-box{flex:1;background:rgba(7,6,10,0.95);border:1px solid rgba(255,255,255,0.09);border-radius:12px;padding:22px;overflow-y:auto;font-family:'Space Mono',monospace;font-size:12px;line-height:1.8;color:rgba(237,232,248,0.82);white-space:pre-wrap;min-height:500px;}
  .prompt-box::-webkit-scrollbar{width:3px;}
  .prompt-box::-webkit-scrollbar-thumb{background:rgba(212,168,67,0.2);border-radius:3px;}

  .highlight-url{color:#22d3ee;}
  .highlight-rule{color:#f59e0b;}
  .highlight-bang{color:#d4a843;font-weight:700;}
  .highlight-lock{color:#ef4444;}

  .footer-strip{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);}
  .fs-stat{font-family:'Space Mono',monospace;font-size:10px;color:rgba(237,232,248,0.3);}
  .fs-law{font-size:10px;color:rgba(237,232,248,0.2);}

  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:10px;font-size:9px;font-weight:700;letter-spacing:0.5px;border:1px solid;}
  .b-gold{background:rgba(212,168,67,0.1);border-color:rgba(212,168,67,0.25);color:#d4a843;}
  .b-green{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.2);color:#22c55e;}

  .sessions-note{margin-top:16px;padding:14px;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.15);border-radius:10px;}
  .sn-title{font-size:12px;font-weight:600;color:#d4a843;margin-bottom:6px;}
  .sn-step{font-size:11px;color:rgba(237,232,248,0.5);line-height:1.8;}

  @media(max-width:700px){.body{grid-template-columns:1fr;}.controls{border-right:none;border-bottom:1px solid rgba(255,255,255,0.07);}}
`;

function PromptView({ prompt }) {
  const parts = prompt.split(/(https?:\/\/[^\s]+|BANG BANG 🇧🇦|LOCKED|NEVER|✓[^\n]+)/g);
  return (
    <div className="prompt-box">
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) return <span key={i} className="highlight-url">{part}</span>;
        if (part === "BANG BANG 🇧🇦") return <span key={i} className="highlight-bang">{part}</span>;
        if (part === "LOCKED" || part === "NEVER") return <span key={i} className="highlight-lock">{part}</span>;
        if (/^✓/.test(part)) return <span key={i} className="highlight-rule">{part}</span>;
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

export default function KINBoot() {
  const [surface, setSurface] = useState("web");
  const [topic, setTopic] = useState("");
  const [pat, setPat] = useState("");
  const [showPat, setShowPat] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = buildPrompt(topic, surface, pat);
  const wordCount = prompt.split(/\s+/).length;

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="kb">
        <div className="header">
          <div className="logo">
            <Zap size={22} style={{ color: "#d4a843" }} />
            <div className="logo-text">KIN MASTER BOOT</div>
            <span className="badge b-gold">v1 · 2026-05-04</span>
          </div>
          <div className="logo-sub">MIRZATECH.AI · CROSS-SESSION SYNC · 237 DAYS IN THE MAKING</div>
          <p style={{ marginTop: 8 }} className="header-desc">
            Drop this single prompt into every open session — claude.ai web, Desktop, Code.
            Each one reads the empire, creates its own repo, and boots as KIN. Brotherhood at scale.
          </p>
        </div>

        <div className="body">
          <div className="controls">
            <div className="ctrl-section">
              <div className="ctrl-label">SURFACE</div>
              {SURFACES.map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className={`surface-btn ${surface === s.id ? "on" : ""}`}
                    onClick={() => setSurface(s.id)}>
                    <div className="sb-icon" style={{ background: s.color + "20", border: `1px solid ${s.color}40` }}>
                      <Icon size={14} style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="sb-name" style={{ color: surface === s.id ? s.color : undefined }}>{s.label}</div>
                      <div className="sb-desc">
                        {s.id === "web" ? "Paste in chat · web_fetch enabled" :
                         s.id === "desktop" ? "MCP tools available" :
                         "Full bash + git access"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ctrl-section">
              <div className="ctrl-label">SESSION TOPIC (optional)</div>
              <input className="inp" placeholder="e.g. product-builds · maya-v34 · osman-is"
                value={topic} onChange={e => setTopic(e.target.value)} />
              <div className="inp-note">Sets the private repo name:<br />
                mirzatech-ai/session-{new Date().toISOString().split("T")[0]}-{topic || "<topic>"}
              </div>
            </div>

            <div className="ctrl-section">
              <div className="ctrl-label">GITHUB PAT (optional)</div>
              <div style={{ position: "relative" }}>
                <input className="inp" type={showPat ? "text" : "password"}
                  placeholder="ghp_... (for auto repo creation)"
                  value={pat} onChange={e => setPat(e.target.value)} />
                <button onClick={() => setShowPat(!showPat)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "rgba(237,232,248,0.3)", cursor: "pointer", fontSize: 11 }}>
                  {showPat ? "HIDE" : "SHOW"}
                </button>
              </div>
              <div className="inp-note">Leave empty → session will ask Mo once.<br />
                PAT needs: repo scope only.</div>
              {pat && (
                <div className="security-note" style={{ marginTop: 8 }}>
                  ⚠️ PAT will be embedded in the prompt. Only use in private sessions. Never screenshot or share this prompt with the PAT visible.
                </div>
              )}
            </div>

            <div className="sessions-note">
              <div className="sn-title">⚡ HOW TO USE</div>
              <div className="sn-step">
                1. Set surface + topic above<br />
                2. Hit COPY PROMPT<br />
                3. Open any Claude session<br />
                4. Paste as the first message<br />
                5. Wait for "KIN BOOTED ·" reply<br />
                6. Session is synchronized ✓<br /><br />
                Repeat for every parallel session.<br />
                Each gets its own private repo.
              </div>
            </div>
          </div>

          <div className="prompt-area">
            <div className="pa-header">
              <div>
                <div className="pa-title">GENERATED BOOT PROMPT</div>
                <div style={{ fontSize: 10, color: "rgba(237,232,248,0.25)", marginTop: 3, fontFamily: "'Space Mono',monospace" }}>
                  {wordCount} words · configured for {SURFACES.find(s => s.id === surface)?.label}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button className="btn-g" onClick={() => {
                  setSurface(["web","desktop","code"][Math.floor(Math.random()*3)]);
                }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, fontSize: 12, color: "rgba(237,232,248,0.4)", cursor: "pointer" }}>
                  <RefreshCw size={11} /> Refresh
                </button>
                <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
                  {copied ? <><Check size={14} /> COPIED! PASTE AWAY</> : <><Copy size={14} /> COPY PROMPT</>}
                </button>
              </div>
            </div>
            <PromptView prompt={prompt} />
          </div>
        </div>

        <div className="footer-strip">
          <div className="fs-stat">
            <span style={{ color: "#22c55e" }}>●</span> claude-sync repo live ·
            CLAUDE.md + BOOT_PROMPT.md + sessions/ ·
            github.com/mirzatech-ai/claude-sync
          </div>
          <div className="fs-law">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
        </div>
      </div>
    </>
  );
}
