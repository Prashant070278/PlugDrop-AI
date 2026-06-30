import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { AGENT_KB } from "../lib/agentKb";
import { Sparkles, Check, MessageSquare, Plug, Building2, Radio, Send, Mic, MicOff, Volume2 } from "lucide-react";

// Tokenize a string for matching: lowercase, strip punctuation, drop stopwords + tiny tokens.
const STOPWORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being","do","does","did",
  "i","you","your","yours","my","me","we","our","ours","it","its","they","them",
  "and","or","but","if","then","so","for","to","of","in","on","at","by","with","from","as","that","this","these","those",
  "can","could","should","would","will","shall","may","might","must","have","has","had","not","no","yes",
  "what","how","why","when","where","who","which","whose","whom",
]);

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function pickReply(agentName, userText) {
  const kb = AGENT_KB[agentName];
  if (!kb) return "Tell me more — I'll do my best to help.";

  const userTokens = tokenize(userText);
  if (userTokens.length === 0) return kb.fallback;

  let best = null;
  let bestScore = 0;
  for (const entry of kb.qa) {
    const qTokens = tokenize(entry.q);
    if (qTokens.length === 0) continue;
    let overlap = 0;
    for (const t of userTokens) if (qTokens.includes(t)) overlap += 1;
    // Normalise by question length so short generic questions don't always win
    const score = overlap / Math.sqrt(qTokens.length);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  // Require at least one meaningful token match
  return best && bestScore > 0 ? best.a : kb.fallback;
}

function AgentChat({ agent }) {
  const kb = AGENT_KB[agent.name];
  const [messages, setMessages] = useState([{ from: "ai", text: kb?.intro || `Hi, I'm ${agent.name}.` }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const endRef = useRef(null);
  const recogRef = useRef(null);
  const sessionIdRef = useRef(null);

  // Stable session id per (agent, mount). Reset when agent changes.
  if (!sessionIdRef.current) {
    sessionIdRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Reset chat when agent changes
  useEffect(() => {
    setMessages([{ from: "ai", text: kb?.intro || `Hi, I'm ${agent.name}.` }]);
    setInput("");
    sessionIdRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }, [agent.name, kb]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, typing]);

  const speak = (text) => {
    if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.02; u.pitch = 1.04;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) { /* noop */ }
  };

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);

    try {
      const apiBase = process.env.REACT_APP_BACKEND_URL || "";
      const res = await fetch(`${apiBase}/api/agent-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent: agent.name,
          session_id: sessionIdRef.current,
          message: t,
        }),
      });
      let reply;
      if (res.ok) {
        const data = await res.json();
        reply = data.reply;
      } else {
        // Fall back to local KB matcher if the LLM endpoint fails
        reply = pickReply(agent.name, t);
      }
      setMessages((m) => [...m, { from: "ai", text: reply }]);
      speak(reply);
    } catch (err) {
      const reply = pickReply(agent.name, t);
      setMessages((m) => [...m, { from: "ai", text: reply }]);
      speak(reply);
    } finally {
      setTyping(false);
    }
  };

  const startVoice = () => {
    const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) {
      setMessages((m) => [...m, { from: "ai", text: "Voice input isn't supported in this browser. Please type — I'll still respond by voice." }]);
      return;
    }
    if (listening && recogRef.current) {
      recogRef.current.stop();
      return;
    }
    const r = new SR();
    r.lang = "en-US"; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (ev) => {
      const heard = ev.results[0]?.[0]?.transcript || "";
      if (heard) send(heard);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r;
    setListening(true);
    setVoiceOn(true); // turn on TTS for the reply
    r.start();
  };

  return (
    <div className="rounded-2xl bg-pdblack overflow-hidden border border-pdpurple/30 flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-pdpurple-soft font-semibold">
          <MessageSquare className="size-3" /> Live chat with {agent.name}
        </div>
        <button
          onClick={() => { setVoiceOn(!voiceOn); if (voiceOn) window.speechSynthesis?.cancel(); }}
          aria-label="Toggle voice"
          className={`size-7 rounded-full flex items-center justify-center transition-colors ${voiceOn ? "bg-pdpurple text-white" : "bg-white/10 text-white/70 hover:bg-white/20"}`}
          data-testid={`agent-voice-toggle-${agent.name.toLowerCase()}`}
        >
          <Volume2 className="size-3.5" />
        </button>
      </div>

      {/* messages */}
      <div className="px-3 py-3 space-y-2 max-h-56 overflow-y-auto">
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-1.5 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            {m.from === "ai" && (
              <img src={agent.img} alt="" className="size-6 rounded-full object-cover border border-pdpurple/30 shrink-0" />
            )}
            <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
              m.from === "user" ? "bg-pdpurple text-white rounded-br-md" : "bg-white text-pdblack rounded-bl-md"
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex items-end gap-1.5">
            <img src={agent.img} alt="" className="size-6 rounded-full object-cover border border-pdpurple/30 shrink-0" />
            <div className="bg-white rounded-2xl rounded-bl-md px-3 py-2.5 flex gap-1">
              {[0,1,2].map((d) => <span key={d} className="size-1 rounded-full bg-pdblack/50 typing-dot" style={{ animationDelay: `${d * 0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input bar */}
      <form className="flex items-center gap-2 px-2 pb-2 pt-1 border-t border-white/10"
        onSubmit={(e) => { e.preventDefault(); send(); }}
        data-testid={`agent-chat-form-${agent.name.toLowerCase()}`}>
        <button
          type="button"
          onClick={startVoice}
          aria-label="Talk"
          className={`size-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${listening ? "bg-red-500 text-white animate-pulse" : "bg-pdpurple text-white hover:bg-pdpurple-soft"}`}
          data-testid={`agent-mic-${agent.name.toLowerCase()}`}
        >
          {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
        </button>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${agent.name} anything…`}
          className="flex-1 bg-white/5 text-white placeholder:text-white/40 rounded-full px-4 py-2 text-xs outline-none border border-white/10 focus:border-pdpurple/60 transition"
          data-testid={`agent-chat-input-${agent.name.toLowerCase()}`}
        />
        <button type="submit"
          className="size-9 rounded-full bg-white text-pdblack flex items-center justify-center hover:bg-pdpurple hover:text-white transition-colors shrink-0"
          data-testid={`agent-chat-send-${agent.name.toLowerCase()}`}>
          <Send className="size-3.5" />
        </button>
      </form>
    </div>
  );
}

export default function AgentGallery() {
  const [active, setActive] = useState(0);
  const a = AGENTS[active];

  return (
    <section id="agents" data-testid="agent-gallery" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute -top-20 right-0 size-[400px] rounded-full bg-pdpurple/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">AI Agent Gallery</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Meet your<br/>digital workforce.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Click any agent — chat with them or tap the mic to talk. Each one knows what they do, how they work
            and how they can help your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Agent rail */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3">
            {AGENTS.map((ag, i) => {
              const isActive = i === active;
              return (
                <motion.button
                  key={ag.name}
                  onClick={() => setActive(i)}
                  whileHover={{ y: -3 }}
                  data-testid={`agent-card-${ag.name.toLowerCase()}`}
                  className={`relative text-left rounded-3xl overflow-hidden border transition-all ${
                    isActive
                      ? "border-pdpurple shadow-[0_18px_40px_rgba(139,92,246,0.25)] scale-[1.01]"
                      : "border-pdpurple/15 hover:border-pdpurple/40"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-pdpurple-bg via-white to-pdpurple-bg" />
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={ag.img} alt={ag.name} loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? "scale-105" : ""}`} />
                    {isActive && (
                      <div className="absolute inset-0 mix-blend-multiply opacity-15"
                        style={{ background: "linear-gradient(160deg, #C4B5FD 0%, #8B5CF6 100%)" }} />
                    )}
                    <div className={`absolute top-2 left-2 size-3 border-l-2 border-t-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute top-2 right-2 size-3 border-r-2 border-t-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute bottom-2 left-2 size-3 border-l-2 border-b-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute bottom-2 right-2 size-3 border-r-2 border-b-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/85 backdrop-blur-sm border border-pdpurple/20">
                      <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] font-mono uppercase tracking-wider text-pdblack/80">Live</span>
                    </div>
                  </div>
                  <div className="relative p-2 bg-white/85 backdrop-blur border-t border-pdpurple/10 text-center">
                    <div className="font-display text-sm text-pdblack font-medium leading-tight">{ag.name}</div>
                    <div className="text-[9px] uppercase tracking-[0.15em] text-pdpurple/80 mt-0.5 line-clamp-1">{ag.role}</div>
                  </div>
                  {isActive && <span className="absolute top-2 right-2 size-2 rounded-full bg-pdpurple ring-4 ring-pdpurple/20" />}
                </motion.button>
              );
            })}
          </div>

          {/* Rich detail panel with INTERACTIVE chat */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                data-testid="agent-detail-panel"
                className="relative rounded-3xl bg-gradient-to-br from-pdpurple-bg via-white to-pdpurple-bg border border-pdpurple/20 p-6 lg:p-7 overflow-hidden h-full"
              >
                <div className="absolute -top-10 -right-10 size-48 rounded-full bg-pdpurple/15 blur-2xl" />
                <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start gap-5 mb-4 pb-4 border-b border-pdpurple/10">
                  <div className="relative size-16 lg:size-20 rounded-2xl overflow-hidden border-2 border-pdpurple/30 shrink-0">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold">{a.role}</div>
                    <div className="font-display text-2xl sm:text-3xl text-pdblack font-medium leading-tight">{a.name}</div>
                    <div className="mt-1 text-xs sm:text-sm text-pdblack/70 italic font-display">{a.tagline}</div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-pdpurple/70 font-semibold">{a.metric.label}</div>
                    <div className="font-display text-xl font-semibold text-pdpurple">{a.metric.value}</div>
                  </div>
                </div>

                <p className="relative text-xs lg:text-sm text-pdblack/75 leading-relaxed mb-4">{a.desc}</p>

                {/* Capabilities */}
                <div className="relative mb-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold mb-2">
                    <Sparkles className="size-3" /> Capabilities
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {a.capabilities.map((c) => (
                      <div key={c} className="flex items-center gap-2 rounded-xl bg-white border border-pdpurple/20 px-2.5 py-1.5">
                        <span className="size-4 rounded-md bg-pdpurple/15 flex items-center justify-center shrink-0">
                          <Check className="size-2.5 text-pdpurple" />
                        </span>
                        <span className="text-xs font-medium text-pdblack">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INTERACTIVE chat (replaces the static sample) */}
                <div className="relative mb-3">
                  <AgentChat agent={a} />
                </div>

                {/* Channels + Integrations + Industries grid */}
                <div className="relative grid sm:grid-cols-3 gap-2">
                  <Block icon={Radio}     label="Channels"     items={a.channels} />
                  <Block icon={Plug}      label="Integrations" items={a.integrations} />
                  <Block icon={Building2} label="Industries"   items={a.industries} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Block({ icon: Icon, label, items }) {
  return (
    <div className="rounded-xl bg-white/80 border border-pdpurple/15 p-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-pdpurple/80 font-semibold mb-1.5">
        <Icon className="size-3" /> {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((it) => (
          <span key={it} className="text-[10px] px-2 py-0.5 rounded-full bg-pdpurple/10 border border-pdpurple/15 text-pdblack/80">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
