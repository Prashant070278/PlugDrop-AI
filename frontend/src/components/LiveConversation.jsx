import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, Mic, MoreHorizontal, Volume2 } from "lucide-react";
import { ASSETS } from "../lib/constants";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SEED = [
  { from: "ai",   text: "Hi! I'm your PlugDrop AI agent. How can I help you today?", time: "10:30 AM" },
  { from: "user", text: "Can you tell me what PlugDrop does?", time: "10:31 AM" },
  { from: "ai",   text: "PlugDrop deploys Voice Agents and Multi-Agent systems that automate conversations, operations and workflows on your existing stack.", time: "10:31 AM" },
];

export default function LiveConversation({ openSignal }) {
  const [messages, setMessages] = useState(SEED);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  // Triggered by hero "Talk to PlugDrop AI" — scrolls and adds a starter prompt
  useEffect(() => {
    if (!openSignal) return;
    document.getElementById("live-conversation")?.scrollIntoView({ behavior: "smooth" });
  }, [openSignal]);

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { from: "user", text: t, time }]);
    setInput("");
    setTyping(true);
    try {
      const { data } = await axios.post(`${API}/chat`, { message: t });
      setTimeout(() => {
        setMessages((m) => [...m, { from: "ai", text: data.reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
        setTyping(false);
      }, 700);
    } catch (e) {
      setTyping(false);
      setMessages((m) => [...m, { from: "ai", text: "I'm offline for a moment. Please try again.", time: "" }]);
    }
  };

  const quickPrompts = [
    "What does PlugDrop do?",
    "Tell me about voice agents",
    "How does multi-agent work?",
    "I want a demo",
  ];

  return (
    <section id="live-conversation" data-testid="live-conversation" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-stretch">
        {/* LEFT light */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Experience the future</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
            Have a real conversation with our <span className="text-gradient-purple italic">AI.</span>
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-pdblack/70 max-w-md">
            Speak or type naturally. Our AI agent will understand, respond and help you explore how
            PlugDrop can transform your business.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {quickPrompts.map((p) => (
              <button key={p}
                data-testid={`chat-quick-${p.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-full bg-pdpurple/10 text-pdpurple border border-pdpurple/15 hover:bg-pdpurple hover:text-white transition-colors">
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              data-testid="chat-tap-to-speak"
              onClick={() => send("Tell me about voice agents")}
              className="relative size-16 rounded-full bg-gradient-to-br from-pdpurple to-pdpurple-deep flex items-center justify-center text-white glow-purple-sm">
              <Mic className="size-6" />
              <span className="absolute inset-0 rounded-full bg-pdpurple/40 ping-slow" />
            </button>
            <div>
              <div className="font-display text-lg text-pdblack font-medium">Tap to speak</div>
              <div className="text-sm text-pdblack/60">or type your message</div>
            </div>
          </div>
        </div>

        {/* RIGHT dark chat */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-pdblack p-4 sm:p-5 flex flex-col h-[600px] shadow-[0_20px_60px_rgba(139,92,246,0.18)] border border-pdpurple/20">
            {/* header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full overflow-hidden border-2 border-pdpurple/50">
                  <img src={ASSETS.agentAva} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(0.4) contrast(1.05)" }} />
                  <div className="absolute inset-0 mix-blend-color" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }} />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">AI Agent · Ava</div>
                  <div className="text-emerald-400 text-xs flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="audio"><Volume2 className="size-4 text-white/70" /></button>
                <button className="size-8 rounded-full hover:bg-white/10 flex items-center justify-center" aria-label="more"><MoreHorizontal className="size-4 text-white/70" /></button>
              </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {messages.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  {m.from === "ai" && (
                    <div className="size-7 rounded-full overflow-hidden border border-pdpurple/30 shrink-0 relative">
                      <img src={ASSETS.agentAva} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(0.4)" }} />
                      <div className="absolute inset-0 mix-blend-color" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }} />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                    m.from === "user"
                      ? "bg-pdpurple text-white rounded-br-md"
                      : "bg-white text-pdblack rounded-bl-md"
                  }`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    {m.time && <div className={`text-[10px] mt-1 ${m.from === "user" ? "text-white/70" : "text-pdblack/40"}`}>{m.time}</div>}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-end gap-2">
                  <div className="size-7 rounded-full overflow-hidden border border-pdpurple/30 shrink-0 relative">
                    <img src={ASSETS.agentAva} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(0.4)" }} />
                    <div className="absolute inset-0 mix-blend-color" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    {[0,1,2].map((d) => (
                      <span key={d} className="size-1.5 rounded-full bg-pdblack/50 typing-dot" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* input */}
            <form className="flex items-center gap-2 pt-3 border-t border-white/10"
              onSubmit={(e) => { e.preventDefault(); send(); }}
              data-testid="chat-form">
              <input
                data-testid="chat-input"
                value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 bg-white/5 text-white placeholder:text-white/40 rounded-full px-5 py-3 text-sm outline-none border border-white/10 focus:border-pdpurple/60 transition" />
              <button data-testid="chat-send" type="submit"
                className="size-11 rounded-full bg-pdpurple hover:bg-pdpurple-soft text-white flex items-center justify-center transition-colors">
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
