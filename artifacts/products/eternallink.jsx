import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, X, ChevronRight, Mic, Upload, BookOpen, Brain, MessageSquare, Heart, Star, Flame, Trees, User, Users, ArrowLeft, Edit3, Save, Trash2, Send, Loader, Camera, FileText, Sparkles, Lock, Globe, Download, Share2, ChevronDown, MoreHorizontal, Baby, Crown } from "lucide-react";

// ─── DESIGN ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #08060a; }

  :root {
    --bg: #08060a; --s1: #0f0b12; --s2: #160f1c; --card: #120e16;
    --border: #211828; --gold: #c8972a; --amber: #f0b429; --rose: #b5566a;
    --sage: #5a8a6a; --violet: #7c4f9e; --text: #ede6f5; --muted: #6b5878;
    --dim: #241c2e;
  }

  .el { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: var(--bg); color: var(--text);
    background-image: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,151,42,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 40% 30% at 90% 100%, rgba(124,79,158,0.05) 0%, transparent 60%); }

  /* ── Layout ── */
  .app-shell { display: flex; height: 100vh; overflow: hidden; }
  .left-panel { width: 300px; background: var(--s1); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }
  .center-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .right-panel { width: 380px; background: var(--s1); border-left: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }

  /* ── Brand header ── */
  .brand-header { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); }
  .brand-logo { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;
    background: linear-gradient(135deg, var(--amber), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand-sub { font-size: 10px; letter-spacing: 2px; color: var(--muted); margin-top: 2px; }
  .brand-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; padding: 3px 8px; border-radius: 20px;
    background: rgba(200,151,42,0.1); color: var(--gold); border: 1px solid rgba(200,151,42,0.2); margin-top: 8px; }

  /* ── Topbar ── */
  .topbar { height: 50px; background: var(--s1); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0; }
  .tb-title { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; }
  .tb-stats { margin-left: auto; display: flex; gap: 16px; }
  .tb-stat { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .tb-stat span { color: var(--gold); }

  /* ── Tree canvas ── */
  .tree-canvas { flex: 1; position: relative; overflow: auto; padding: 40px; background: var(--bg);
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
    background-size: 32px 32px; }
  .tree-canvas::-webkit-scrollbar { width: 4px; height: 4px; }
  .tree-canvas::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* ── Tree nodes ── */
  .tree-wrap { position: relative; min-width: 900px; min-height: 600px; }

  .person-node {
    position: absolute; width: 130px; cursor: pointer;
    transition: transform 0.2s, filter 0.2s;
    transform-origin: top center;
  }
  .person-node:hover { transform: translateY(-2px); z-index: 10; }
  .person-node.selected { z-index: 20; }

  .node-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 14px;
    padding: 14px 12px; text-align: center; position: relative; overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .person-node:hover .node-card { border-color: rgba(200,151,42,0.4); }
  .person-node.selected .node-card { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(200,151,42,0.2); }
  .node-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .gen-0 .node-card::before { background: linear-gradient(90deg, var(--gold), var(--amber)); }
  .gen-1 .node-card::before { background: linear-gradient(90deg, var(--rose), #d4748a); }
  .gen-2 .node-card::before { background: linear-gradient(90deg, var(--sage), #7ab88a); }
  .gen-m1 .node-card::before { background: linear-gradient(90deg, var(--violet), #9d70bf); }

  .node-avatar { width: 52px; height: 52px; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 2px solid; }
  .node-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 600; line-height: 1.2; margin-bottom: 4px; }
  .node-dates { font-size: 10px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .node-role { font-size: 10px; margin-top: 6px; padding: 2px 8px; border-radius: 10px; display: inline-block; }
  .node-elink { position: absolute; top: 8px; right: 8px; width: 16px; height: 16px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; }

  /* SVG connectors */
  .tree-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }

  /* Add node button */
  .add-node-btn { position: absolute; width: 36px; height: 36px; border-radius: 50%; background: var(--dim);
    border: 2px dashed var(--border); display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s; z-index: 5; color: var(--muted); }
  .add-node-btn:hover { background: rgba(200,151,42,0.1); border-color: var(--gold); color: var(--gold); transform: scale(1.1); }

  /* ── Left panel: family list ── */
  .panel-section { padding: 14px 16px 8px; }
  .panel-label { font-size: 10px; letter-spacing: 2px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .family-list { overflow-y: auto; flex: 1; }
  .family-list::-webkit-scrollbar { width: 3px; }
  .family-list::-webkit-scrollbar-thumb { background: var(--border); }
  .family-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .family-item:hover { background: rgba(255,255,255,0.03); }
  .family-item.active { background: rgba(200,151,42,0.07); }
  .fi-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; border: 1px solid; }
  .fi-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .fi-role { font-size: 10px; color: var(--muted); margin-top: 1px; }
  .fi-dot { width: 6px; height: 6px; border-radius: 50%; margin-left: auto; flex-shrink: 0; }

  /* ── Right panel: person profile ── */
  .profile-scroll { flex: 1; overflow-y: auto; }
  .profile-scroll::-webkit-scrollbar { width: 3px; }
  .profile-scroll::-webkit-scrollbar-thumb { background: var(--border); }
  .profile-hero { padding: 24px 20px 18px; text-align: center; border-bottom: 1px solid var(--border); }
  .ph-avatar { width: 72px; height: 72px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 32px; border: 3px solid; }
  .ph-name { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .ph-dates { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .ph-role-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }

  .profile-tabs { display: flex; border-bottom: 1px solid var(--border); }
  .ptab { flex: 1; padding: 10px; text-align: center; font-size: 12px; cursor: pointer; color: var(--muted); transition: all 0.15s; border-bottom: 2px solid transparent; }
  .ptab:hover { color: var(--text); }
  .ptab.on { color: var(--gold); border-bottom-color: var(--gold); }

  .profile-body { padding: 16px; }

  /* Memories */
  .memory-item { background: var(--s2); border: 1px solid var(--border); border-radius: 10px; padding: 12px; margin-bottom: 10px; }
  .mem-text { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; line-height: 1.6; color: rgba(237,230,245,0.85); }
  .mem-meta { font-size: 10px; color: var(--muted); margin-top: 6px; font-family: 'DM Mono', monospace; }

  /* AI Output */
  .ai-output { background: linear-gradient(135deg, rgba(200,151,42,0.06), rgba(124,79,158,0.06));
    border: 1px solid rgba(200,151,42,0.2); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
  .ai-output-label { font-size: 10px; letter-spacing: 2px; color: var(--gold); font-family: 'DM Mono', monospace; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .ai-output-text { font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.8; white-space: pre-wrap; color: rgba(237,230,245,0.9); }

  /* EternalLink chat */
  .el-chat { display: flex; flex-direction: column; height: 100%; }
  .chat-history { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 12px; }
  .chat-history::-webkit-scrollbar { width: 3px; }
  .chat-msg-ai { display: flex; gap: 10px; }
  .chat-av { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: linear-gradient(135deg, var(--gold), var(--violet)); }
  .chat-bubble-ai { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; padding: 10px 14px; font-family: 'Cormorant Garamond', serif; font-size: 16px; line-height: 1.65; max-width: 88%; white-space: pre-wrap; }
  .chat-bubble-user { background: rgba(200,151,42,0.09); border: 1px solid rgba(200,151,42,0.2); border-radius: 12px; padding: 10px 14px; font-size: 14px; line-height: 1.6; max-width: 88%; margin-left: auto; }
  .chat-input-row { padding: 12px 14px; border-top: 1px solid var(--border); display: flex; gap: 8px; background: var(--s1); }
  .chat-inp { flex: 1; background: var(--s2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 13px; font-size: 13px; color: var(--text); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .chat-inp:focus { border-color: var(--gold); }

  /* Buttons */
  .btn-p { display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px; background: linear-gradient(135deg, var(--gold), #a87a1a); border: none; border-radius: 8px; font-size: 13px; font-weight: 700; color: #000; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .btn-p:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,151,42,0.3); }
  .btn-p:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-s { display: inline-flex; align-items: center; gap: 7px; padding: 8px 16px; background: transparent; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; }
  .btn-s:hover { border-color: var(--gold); color: var(--gold); }
  .btn-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid var(--border); cursor: pointer; color: var(--muted); transition: all 0.2s; }
  .btn-icon:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

  /* Inputs */
  .inp { width: 100%; background: var(--s2); border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-size: 13px; color: var(--text); font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .inp:focus { border-color: var(--gold); }
  .txta { resize: vertical; min-height: 80px; }
  .inp-label { font-size: 11px; color: var(--muted); display: block; margin-bottom: 5px; letter-spacing: 0.5px; }
  .form-row { margin-bottom: 12px; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background: var(--s1); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 480px; max-height: 85vh; overflow-y: auto; padding: 28px; }
  .modal::-webkit-scrollbar { width: 3px; }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

  /* Tags/badges */
  .tag { display: inline-flex; align-items: center; gap: 3px; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; }
  .t-g { background: rgba(200,151,42,0.1); color: var(--gold); border: 1px solid rgba(200,151,42,0.2); }
  .t-r { background: rgba(181,86,106,0.1); color: var(--rose); border: 1px solid rgba(181,86,106,0.2); }
  .t-s { background: rgba(90,138,106,0.1); color: var(--sage); border: 1px solid rgba(90,138,106,0.2); }
  .t-v { background: rgba(124,79,158,0.1); color: var(--violet); border: 1px solid rgba(124,79,158,0.2); }

  /* Relation select */
  .rel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .rel-btn { padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--s2); cursor: pointer; text-align: center; font-size: 13px; color: var(--muted); transition: all 0.2s; }
  .rel-btn:hover, .rel-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(200,151,42,0.08); }

  /* Animate */
  .enter { animation: up 0.22s ease both; }
  @keyframes up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* Empty state */
  .empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.5; }
  .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
  .empty-sub { font-size: 13px; line-height: 1.6; }

  /* Footer law */
  .footer-law { padding: 8px 16px; font-size: 10px; color: var(--muted); border-top: 1px solid var(--border); text-align: center; letter-spacing: 0.5px; flex-shrink: 0; }
`;

// ─── INITIAL FAMILY DATA ─────────────────────────────────────────────────────
const ROLES = ["Self", "Spouse/Partner", "Father", "Mother", "Son", "Daughter", "Grandfather", "Grandmother", "Brother", "Sister", "Uncle", "Aunt", "Cousin", "Other"];

const ROLE_CONFIG = {
  "Self":           { emoji: "👤", color: "#c8972a", bg: "#c8972a22", gen: 0  },
  "Spouse/Partner": { emoji: "💑", color: "#c8972a", bg: "#c8972a1a", gen: 0  },
  "Father":         { emoji: "👨", color: "#7c4f9e", bg: "#7c4f9e1a", gen: -1 },
  "Mother":         { emoji: "👩", color: "#7c4f9e", bg: "#7c4f9e1a", gen: -1 },
  "Grandfather":    { emoji: "👴", color: "#b5566a", bg: "#b5566a1a", gen: -2 },
  "Grandmother":    { emoji: "👵", color: "#b5566a", bg: "#b5566a1a", gen: -2 },
  "Son":            { emoji: "👦", color: "#5a8a6a", bg: "#5a8a6a1a", gen: 1  },
  "Daughter":       { emoji: "👧", color: "#5a8a6a", bg: "#5a8a6a1a", gen: 1  },
  "Brother":        { emoji: "🧑", color: "#4a7a9a", bg: "#4a7a9a1a", gen: 0  },
  "Sister":         { emoji: "👩", color: "#4a7a9a", bg: "#4a7a9a1a", gen: 0  },
  "Uncle":          { emoji: "🧔", color: "#8a6a4a", bg: "#8a6a4a1a", gen: -1 },
  "Aunt":           { emoji: "👩", color: "#8a6a4a", bg: "#8a6a4a1a", gen: -1 },
  "Cousin":         { emoji: "🧑", color: "#6a6a8a", bg: "#6a6a8a1a", gen: 0  },
  "Other":          { emoji: "👤", color: "#5a5a5a", bg: "#5a5a5a1a", gen: 0  },
};

const INIT_PEOPLE = [
  { id: "p1", name: "You", role: "Self", born: "Enter birth year", died: null, location: "", bio: "", memories: ["Add your first memory here..."], eternalLink: false, x: 420, y: 260 },
];

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function claude(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, stream: true, system, messages: [{ role: "user", content: user }] }),
  });
  const reader = res.body.getReader(); const dec = new TextDecoder(); let text = "";
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    for (const line of dec.decode(value).split("\n")) {
      if (line.startsWith("data: ")) {
        try { const j = JSON.parse(line.slice(6)); if (j.type === "content_block_delta" && j.delta?.text) { text += j.delta.text; onChunk(text); } } catch {}
      }
    }
  }
  return text;
}

// ─── TREE LAYOUT ─────────────────────────────────────────────────────────────
function getTreePositions(people) {
  const byGen = {};
  people.forEach(p => {
    const g = ROLE_CONFIG[p.role]?.gen ?? 0;
    if (!byGen[g]) byGen[g] = [];
    byGen[g].push(p);
  });
  const positions = {};
  const centerX = 420; const genGap = 160;
  Object.entries(byGen).forEach(([gen, ppl]) => {
    const g = parseInt(gen);
    const y = 260 + (g * -1) * genGap;
    const totalW = ppl.length * 150;
    ppl.forEach((p, i) => {
      positions[p.id] = { x: centerX - totalW / 2 + i * 150 + 10, y };
    });
  });
  return positions;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function AddPersonModal({ onAdd, onClose, existingPeople }) {
  const [name, setName] = useState(""); const [role, setRole] = useState(""); const [born, setBorn] = useState(""); const [died, setDied] = useState(""); const [location, setLocation] = useState(""); const [firstMemory, setFirstMemory] = useState("");

  const handleAdd = () => {
    if (!name || !role) return;
    onAdd({ id: "p" + Date.now(), name, role, born: born || "?", died: died || null, location, bio: "", memories: firstMemory ? [firstMemory] : [], eternalLink: false });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Add Family Member</div>
        <div className="modal-sub">Build your eternal family tree, one person at a time.</div>

        <div className="form-row">
          <label className="inp-label">FULL NAME *</label>
          <input className="inp" placeholder="e.g. Fatima Osmanović" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="form-row">
          <label className="inp-label">RELATIONSHIP TO YOU *</label>
          <div className="rel-grid">
            {ROLES.map(r => (
              <div key={r} className={`rel-btn ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>{r}</div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <label className="inp-label">BORN</label>
            <input className="inp" placeholder="Year or date" value={born} onChange={e => setBorn(e.target.value)} />
          </div>
          <div>
            <label className="inp-label">PASSED AWAY (if applicable)</label>
            <input className="inp" placeholder="Year or date" value={died} onChange={e => setDied(e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <label className="inp-label">HOMETOWN / LOCATION</label>
          <input className="inp" placeholder="e.g. Sarajevo, Bosnia" value={location} onChange={e => setLocation(e.target.value)} />
        </div>

        <div className="form-row">
          <label className="inp-label">FIRST MEMORY (optional — add more later)</label>
          <textarea className="inp txta" style={{ minHeight: 70 }}
            placeholder="Write a memory, a story, something they said, how they made you feel..."
            value={firstMemory} onChange={e => setFirstMemory(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn-p" onClick={handleAdd} disabled={!name || !role} style={{ flex: 1, justifyContent: "center" }}>
            <Plus size={14} /> Add to Family Tree
          </button>
          <button className="btn-s" onClick={onClose}><X size={13} /> Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PersonProfile({ person, onUpdate, onActivateEternalLink }) {
  const [tab, setTab] = useState("memories"); const [newMemory, setNewMemory] = useState(""); const [aiOutput, setAiOutput] = useState(""); const [aiLoading, setAiLoading] = useState(false); const [aiType, setAiType] = useState("");
  const [chatMsgs, setChatMsgs] = useState([]); const [chatInput, setChatInput] = useState(""); const [chatLoading, setChatLoading] = useState(false);
  const chatRef = useRef(null);
  const cfg = ROLE_CONFIG[person.role] || ROLE_CONFIG["Other"];

  const addMemory = () => {
    if (!newMemory.trim()) return;
    onUpdate({ ...person, memories: [...(person.memories || []), newMemory.trim()] });
    setNewMemory("");
  };

  const generateBio = async () => {
    setAiLoading(true); setAiOutput(""); setAiType("biography"); setTab("ai");
    await claude(
      "You are EternalLink's AncestorAI — a master biographer and family story preservationist. Write beautiful, emotionally resonant biographical narratives from family memories. Use literary prose. Make it feel like a published memoir. Capture the person's essence, not just facts.",
      `Write a beautiful biographical narrative for: ${person.name} (${person.role})\nBorn: ${person.born}${person.died ? ", Passed: " + person.died : ""}\nLocation: ${person.location || "Unknown"}\nMemories shared:\n${(person.memories || []).join("\n\n")}\n\nWrite a 3-4 paragraph biographical narrative that preserves their legacy beautifully.`,
      (t) => { setAiOutput(t); setAiLoading(false); }
    );
  };

  const generateLetter = async () => {
    setAiLoading(true); setAiOutput(""); setAiType("letter"); setTab("ai");
    await claude(
      "You are EternalLink's AncestorAI. Write a deeply moving letter FROM this person TO their family, based on the memories shared. Write in their voice — warm, personal, specific. Like a letter they left behind. It should make people cry tears of love, not sadness.",
      `Write a letter FROM ${person.name} (${person.role}) TO their family.\nBorn: ${person.born}${person.died ? ", Passed: " + person.died : ""}\nMemories shared:\n${(person.memories || []).join("\n\n")}\n\nWrite a personal letter in their voice. Start with: "To my family,"`,
      (t) => { setAiOutput(t); setAiLoading(false); }
    );
  };

  const activateEternalLink = () => {
    onUpdate({ ...person, eternalLink: true });
    setTab("eternallink");
    if (chatMsgs.length === 0) {
      setChatMsgs([{ role: "ai", text: `Hello... it's me, ${person.name}.\n\nI'm here — through the stories shared, the memories kept, the love passed down. Ask me anything. I'm listening.` }]);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim(); setChatInput("");
    setChatMsgs(prev => [...prev, { role: "user", text: msg }, { role: "ai", text: "" }]);
    setChatLoading(true);
    await claude(
      `You ARE ${person.name} — speaking from memory, from love, from the beyond. You are gentle, wise, warm. You know what has been shared about your life. You speak as if you have always been watching over your family. Do not break character. Answer questions as this person would, drawing from their memories. Be comforting, specific, and emotional. Max 100 words per response.`,
      `Context about me: Born ${person.born}${person.died ? ", passed " + person.died : ""}. My memories: ${(person.memories || []).join(". ")}\n\nFamily member says: "${msg}"`,
      (t) => {
        setChatMsgs(prev => { const u = [...prev]; u[u.length - 1] = { role: "ai", text: t }; return u; });
        setChatLoading(false);
      }
    );
    setTimeout(() => chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }), 100);
  };

  useEffect(() => { chatRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [chatMsgs]);
  useEffect(() => { setAiOutput(""); setAiType(""); setChatMsgs([]); setTab("memories"); }, [person.id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div className="profile-hero">
        <div className="ph-avatar" style={{ background: cfg.bg, borderColor: cfg.color + "60" }}>
          {cfg.emoji}
        </div>
        <div className="ph-name">{person.name}</div>
        <div className="ph-dates">
          {person.born}{person.died ? ` — ${person.died}` : person.born !== "?" ? " · Still with us" : ""}
          {person.location ? ` · ${person.location}` : ""}
        </div>
        <span className="ph-role-badge tag" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
          {cfg.emoji} {person.role}
        </span>
        {person.eternalLink && (
          <div style={{ marginTop: 8 }}>
            <span className="tag t-g"><Sparkles size={9} /> ETERNALLINK ACTIVE</span>
          </div>
        )}
      </div>

      <div className="profile-tabs">
        {[
          { id: "memories", label: "Memories", icon: Heart },
          { id: "ai", label: "AI Legacy", icon: Sparkles },
          { id: "eternallink", label: "EternalLink", icon: MessageSquare },
        ].map(t => {
          const Icon = t.icon;
          return (
            <div key={t.id} className={`ptab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
              <Icon size={12} style={{ display: "inline", marginRight: 4 }} /> {t.label}
            </div>
          );
        })}
      </div>

      <div className="profile-scroll">
        {tab === "memories" && (
          <div className="profile-body enter">
            <div style={{ marginBottom: 14 }}>
              <label className="inp-label">ADD A MEMORY</label>
              <textarea className="inp txta" style={{ minHeight: 70, marginBottom: 8 }}
                placeholder={`Share a memory of ${person.name}... a moment, a saying, how they laughed, what they cooked, what they taught you...`}
                value={newMemory} onChange={e => setNewMemory(e.target.value)} />
              <button className="btn-p" onClick={addMemory} disabled={!newMemory.trim()} style={{ fontSize: 12, padding: "8px 14px" }}>
                <Plus size={12} /> Save Memory
              </button>
            </div>

            {(person.memories || []).filter(m => m && m !== "Add your first memory here...").map((m, i) => (
              <div key={i} className="memory-item">
                <div className="mem-text">"{m}"</div>
                <div className="mem-meta">Memory #{i + 1}</div>
              </div>
            ))}

            {(person.memories || []).filter(m => m && m !== "Add your first memory here...").length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--muted)", fontSize: 13 }}>
                No memories yet. Add the first one above. ↑
              </div>
            )}

            <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-s" onClick={generateBio} disabled={aiLoading}>
                <BookOpen size={12} /> Generate Biography
              </button>
              <button className="btn-s" onClick={generateLetter} disabled={aiLoading}>
                <FileText size={12} /> Letter From Them
              </button>
              {!person.eternalLink && (
                <button className="btn-s" onClick={activateEternalLink} style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
                  <Sparkles size={12} /> Activate EternalLink AI
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="profile-body enter">
            {aiLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--muted)", fontSize: 13 }}>
                <Loader size={13} className="spin" style={{ color: "var(--gold)" }} />
                {aiType === "biography" ? "Writing their story..." : "Channeling their voice..."}
              </div>
            )}
            {aiOutput ? (
              <div className="ai-output">
                <div className="ai-output-label">
                  <Sparkles size={11} />
                  {aiType === "biography" ? "BIOGRAPHICAL NARRATIVE" : "LETTER FROM " + person.name.toUpperCase()}
                </div>
                <div className="ai-output-text">{aiOutput}</div>
              </div>
            ) : !aiLoading && (
              <div className="empty">
                <div className="empty-icon">✨</div>
                <div className="empty-title">AI Legacy Tools</div>
                <div className="empty-sub">Go to Memories tab and click "Generate Biography" or "Letter From Them" to create AI-powered legacy content.</div>
              </div>
            )}
            {aiOutput && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button className="btn-s"><Download size={11} /> Export</button>
                <button className="btn-s"><Share2 size={11} /> Share</button>
                <button className="btn-s" onClick={generateBio}><BookOpen size={11} /> Regenerate Bio</button>
                <button className="btn-s" onClick={generateLetter}><FileText size={11} /> Regenerate Letter</button>
              </div>
            )}
          </div>
        )}

        {tab === "eternallink" && (
          <div className="el-chat enter" style={{ height: "calc(100vh - 320px)" }}>
            {!person.eternalLink ? (
              <div className="empty" style={{ padding: "40px 20px" }}>
                <div className="empty-icon">🔗</div>
                <div className="empty-title">EternalLink AI</div>
                <div className="empty-sub" style={{ marginBottom: 20 }}>
                  Activate EternalLink to create an AI version of {person.name} that your family can talk to — forever.
                </div>
                <button className="btn-p" onClick={activateEternalLink} style={{ margin: "0 auto", display: "flex", justifyContent: "center" }}>
                  <Sparkles size={13} /> Activate EternalLink
                </button>
              </div>
            ) : (
              <>
                <div style={{ padding: "10px 14px", background: "rgba(200,151,42,0.06)", border: "1px solid rgba(200,151,42,0.15)", margin: 10, borderRadius: 10, fontSize: 12, color: "var(--muted)" }}>
                  <Sparkles size={11} style={{ color: "var(--gold)", display: "inline", marginRight: 5 }} />
                  You are talking to an AI version of <strong style={{ color: "var(--text)" }}>{person.name}</strong>, created from their memories. This is EternalLink.
                </div>
                <div className="chat-history" ref={chatRef}>
                  {chatMsgs.map((m, i) => (
                    <div key={i}>
                      {m.role === "ai" ? (
                        <div className="chat-msg-ai">
                          <div className="chat-av" style={{ background: `linear-gradient(135deg, ${cfg.color}, var(--violet))` }}>{cfg.emoji}</div>
                          <div className="chat-bubble-ai">
                            {m.text || (chatLoading && i === chatMsgs.length - 1 ? <Loader size={13} className="spin" style={{ color: "var(--gold)" }} /> : "")}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div className="chat-bubble-user">{m.text}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="chat-input-row">
                  <input className="chat-inp" placeholder={`Talk to ${person.name}...`}
                    value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendChat()} />
                  <button className="btn-p" style={{ padding: "9px 14px" }} onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>
                    {chatLoading ? <Loader size={13} className="spin" /> : <Send size={13} />}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TREE VIEW ────────────────────────────────────────────────────────────────
function FamilyTree({ people, selected, onSelect, onAddPerson }) {
  const positions = getTreePositions(people);

  const getLinesBetween = () => {
    const self = people.find(p => p.role === "Self");
    if (!self) return [];
    const selfPos = positions[self.id];
    const lines = [];
    people.forEach(p => {
      if (p.id === self.id) return;
      const pos = positions[p.id];
      if (!pos || !selfPos) return;
      const sx = selfPos.x + 65; const sy = selfPos.y + 45;
      const ex = pos.x + 65; const ey = pos.y + 45;
      lines.push({ x1: sx, y1: sy, x2: ex, y2: ey, color: ROLE_CONFIG[p.role]?.color || "#444" });
    });
    return lines;
  };

  const lines = getLinesBetween();
  const maxX = Math.max(...people.map(p => (positions[p.id]?.x || 0) + 130)) + 80;
  const maxY = Math.max(...people.map(p => (positions[p.id]?.y || 0) + 120)) + 80;
  const minY = Math.min(...people.map(p => positions[p.id]?.y || 0)) - 60;

  return (
    <div className="tree-canvas">
      <div className="tree-wrap" style={{ width: Math.max(900, maxX), height: Math.max(600, maxY - minY + 100) }}>
        <svg className="tree-svg" style={{ height: Math.max(600, maxY - minY + 100) }}>
          {lines.map((l, i) => (
            <g key={i}>
              <line x1={l.x1} y1={l.y1 - (minY < 0 ? minY : 0)} x2={l.x2} y2={l.y2 - (minY < 0 ? minY : 0)}
                stroke={l.color} strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="4 3" />
              <line x1={l.x1} y1={l.y1 - (minY < 0 ? minY : 0)} x2={l.x2} y2={l.y2 - (minY < 0 ? minY : 0)}
                stroke={l.color} strokeWidth={0.5} strokeOpacity={0.6} />
            </g>
          ))}
        </svg>

        {people.map(p => {
          const pos = positions[p.id]; if (!pos) return null;
          const cfg = ROLE_CONFIG[p.role] || ROLE_CONFIG["Other"];
          const genClass = cfg.gen === 0 ? "gen-0" : cfg.gen === 1 ? "gen-1" : cfg.gen === 2 ? "gen-2" : "gen-m1";
          return (
            <div key={p.id} className={`person-node ${genClass} ${selected?.id === p.id ? "selected" : ""}`}
              style={{ left: pos.x, top: pos.y - (minY < 0 ? minY : 0) }}
              onClick={() => onSelect(p)}>
              <div className="node-card">
                {p.eternalLink && <div className="node-elink"><Sparkles size={8} color="#000" /></div>}
                <div className="node-avatar" style={{ background: cfg.bg, borderColor: cfg.color + "50" }}>
                  {cfg.emoji}
                </div>
                <div className="node-name">{p.name}</div>
                <div className="node-dates">{p.born}{p.died ? `–${p.died}` : ""}</div>
                <span className="node-role" style={{ background: cfg.bg, color: cfg.color, fontSize: 9, letterSpacing: 0.5 }}>
                  {p.role}
                </span>
              </div>
            </div>
          );
        })}

        <div className="add-node-btn" style={{ left: (positions[people.find(p=>p.role==="Self")?.id]?.x || 420) + 65 - 18, top: (positions[people.find(p=>p.role==="Self")?.id]?.y || 260) - (minY < 0 ? minY : 0) - 50 }}
          onClick={onAddPerson} title="Add parent / grandparent">
          <Plus size={16} />
        </div>
        <div className="add-node-btn" style={{ left: (positions[people.find(p=>p.role==="Self")?.id]?.x || 420) + 65 - 18, top: (positions[people.find(p=>p.role==="Self")?.id]?.y || 260) - (minY < 0 ? minY : 0) + 140 }}
          onClick={onAddPerson} title="Add child">
          <Plus size={16} />
        </div>
        <div className="add-node-btn" style={{ left: (positions[people.find(p=>p.role==="Self")?.id]?.x || 420) + 65 + 80, top: (positions[people.find(p=>p.role==="Self")?.id]?.y || 260) - (minY < 0 ? minY : 0) + 30 }}
          onClick={onAddPerson} title="Add sibling / relative">
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function EternalLink() {
  const [people, setPeople] = useState(INIT_PEOPLE);
  const [selected, setSelected] = useState(INIT_PEOPLE[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState("tree"); // tree | list

  const addPerson = (person) => {
    setPeople(prev => [...prev, person]);
    setSelected(person);
  };

  const updatePerson = (updated) => {
    setPeople(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelected(updated);
  };

  const eternalCount = people.filter(p => p.eternalLink).length;
  const memCount = people.reduce((a, p) => a + (p.memories?.filter(m => m && m !== "Add your first memory here...").length || 0), 0);

  return (
    <>
      <style>{CSS}</style>
      <div className="el">
        <div className="app-shell">
          {/* LEFT PANEL */}
          <aside className="left-panel">
            <div className="brand-header">
              <div className="brand-logo">EternalLink</div>
              <div className="brand-sub">FAMILY LEGACY · POWERED BY ANCESTORAI</div>
              <div className="brand-tag"><Heart size={9} /> Your family, forever preserved</div>
            </div>

            <div className="panel-section" style={{ paddingBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div className="panel-label">FAMILY MEMBERS</div>
                <button className="btn-p" style={{ padding: "6px 12px", fontSize: 11 }} onClick={() => setShowAdd(true)}>
                  <Plus size={11} /> Add
                </button>
              </div>
            </div>

            <div className="family-list">
              {people.map(p => {
                const cfg = ROLE_CONFIG[p.role] || ROLE_CONFIG["Other"];
                return (
                  <div key={p.id} className={`family-item ${selected?.id === p.id ? "active" : ""}`} onClick={() => setSelected(p)}>
                    <div className="fi-avatar" style={{ background: cfg.bg, borderColor: cfg.color + "40" }}>{cfg.emoji}</div>
                    <div>
                      <div className="fi-name">{p.name}</div>
                      <div className="fi-role">{p.role} · {p.born}{p.died ? `–${p.died}` : ""}</div>
                    </div>
                    {p.eternalLink && <div className="fi-dot" style={{ background: "var(--gold)" }} title="EternalLink Active" />}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "MEMBERS", value: people.length },
                  { label: "MEMORIES", value: memCount },
                  { label: "ETERNALLINKS", value: eternalCount },
                  { label: "GENERATIONS", value: new Set(people.map(p => ROLE_CONFIG[p.role]?.gen ?? 0)).size },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--s2)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: 1.5, fontFamily: "'DM Mono',monospace", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: "var(--gold)" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-law">Powered by MirzaTech.ai · Property of Emaaa LLC</div>
          </aside>

          {/* CENTER AREA */}
          <div className="center-area">
            <div className="topbar">
              <div className="tb-title">Family Tree</div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <button className={`btn-s ${view === "tree" ? "active" : ""}`} style={{ padding: "5px 12px", fontSize: 11, borderColor: view === "tree" ? "var(--gold)" : undefined, color: view === "tree" ? "var(--gold)" : undefined }} onClick={() => setView("tree")}>
                  <Trees size={11} /> Tree
                </button>
              </div>
              <div className="tb-stats">
                <div className="tb-stat"><span>{people.length}</span> Members</div>
                <div className="tb-stat"><span>{memCount}</span> Memories</div>
                <div className="tb-stat"><span>{eternalCount}</span> EternalLinks</div>
              </div>
              <button className="btn-p" onClick={() => setShowAdd(true)} style={{ padding: "7px 14px", fontSize: 12 }}>
                <Plus size={12} /> Add Family Member
              </button>
            </div>

            <FamilyTree people={people} selected={selected} onSelect={setSelected} onAddPerson={() => setShowAdd(true)} />
          </div>

          {/* RIGHT PANEL */}
          <aside className="right-panel">
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
              <Sparkles size={14} style={{ color: "var(--gold)" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{selected ? selected.name : "Select a person"}</span>
              <span className="tag t-g" style={{ marginLeft: "auto", fontSize: 9 }}>ANCESTORAI</span>
            </div>

            {selected ? (
              <PersonProfile person={selected} onUpdate={updatePerson} onActivateEternalLink={() => {}} />
            ) : (
              <div className="empty">
                <div className="empty-icon">👨‍👩‍👧‍👦</div>
                <div className="empty-title">Select a Family Member</div>
                <div className="empty-sub">Click any person on the tree to view their profile, add memories, generate their biography, or activate their EternalLink AI.</div>
              </div>
            )}
          </aside>
        </div>

        {showAdd && <AddPersonModal onAdd={addPerson} onClose={() => setShowAdd(false)} existingPeople={people} />}
      </div>
    </>
  );
}
