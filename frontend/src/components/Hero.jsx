import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { ASSETS } from "../lib/constants";
import NeuralNetwork from "./NeuralNetwork";

function WaveBars({ active = false, count = 28 }) {
  return (
    <div className="flex items-center gap-[3px] h-9">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${active ? "wave-bar bg-pdpurple" : "bg-pdpurple/30"}`}
          style={{
            height: `${20 + Math.abs(Math.sin(i * 0.7)) * 60}%`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ onBookDemo, onTalkToAgent }) {
  const [speaking, setSpeaking] = useState(true);
  const [text, setText] = useState("");
  const fullText = "Hello. Welcome to PlugDrop. I can help you understand our AI solutions and find the right deployment for your business.";

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(id);
        setSpeaking(false);
      }
    }, 22);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" data-testid="hero-section" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-mesh-light overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      <NeuralNetwork count={4} opacity={0.7} />

      {/* Floating glassy holograms */}
      <div className="hidden lg:block absolute left-8 top-44 size-24 rounded-3xl glass-light border border-pdpurple/20 float-soft pointer-events-none" />
      <div className="hidden lg:block absolute right-[18%] bottom-24 size-20 rounded-2xl glass-light border border-pdpurple/20 float-soft pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="hidden lg:block absolute left-[12%] bottom-32 size-14 rounded-full glass-light border border-pdpurple/20 float-soft pointer-events-none" style={{ animationDelay: "2.5s" }} />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* LEFT — copy */}
        <div className="lg:col-span-6 space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-pdpurple/20 backdrop-blur-sm"
            data-testid="hero-eyebrow"
          >
            <Sparkles className="size-3.5 text-pdpurple" />
            <span className="text-xs uppercase tracking-[0.2em] text-pdblack/70 font-medium">AI Agents & Digital Transformation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-medium text-pdblack"
            data-testid="hero-headline"
          >
            Deploy <span className="text-gradient-purple">AI Agents.</span><br/>
            Scale Operations.<br/>
            <span className="italic font-light">Transform</span> Business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-lg leading-relaxed text-pdblack/75 max-w-xl"
            data-testid="hero-subhead"
          >
            <span className="font-semibold text-pdblack">Reduce operating costs by 45%</span>,
            handle <span className="font-semibold text-pdblack">100,000+ customer conversations</span> automatically
            & deploy <span className="font-semibold text-pdblack">full-fledged AI teams</span> that complete work across departments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center gap-3"
          >
            <button
              data-testid="hero-book-demo"
              onClick={onBookDemo}
              className="group inline-flex items-center gap-2 rounded-full bg-pdblack text-white px-6 py-3.5 text-sm font-medium hover:bg-pdpurple transition-all hover:translate-y-[-1px]"
            >
              Book a Demo
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              data-testid="hero-talk-agent"
              onClick={onTalkToAgent}
              className="inline-flex items-center gap-2 rounded-full bg-white border border-pdpurple/30 text-pdblack px-6 py-3.5 text-sm font-medium hover:border-pdpurple hover:glow-purple-sm transition-all"
            >
              <Mic className="size-4 text-pdpurple" />
              Talk to PlugDrop AI
            </button>
          </motion.div>

          {/* Live speech card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            data-testid="hero-speech-card"
            className="mt-4 glass-light rounded-2xl p-4 max-w-xl shadow-[0_10px_40px_rgba(139,92,246,0.12)]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-pdpurple flex items-center justify-center text-white">
                  <Volume2 className="size-4" />
                </div>
                {speaking && <span className="absolute inset-0 rounded-full bg-pdpurple/40 ping-slow" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs text-pdblack/60 mb-1.5">
                  <span className="font-medium">{speaking ? "AI Agent is speaking…" : "Ready to listen"}</span>
                  <span className="font-mono">00:12</span>
                </div>
                <WaveBars active={speaking} />
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-pdblack/80 min-h-[40px]">
              {text}<span className="inline-block w-0.5 h-4 align-middle bg-pdpurple/70 ml-0.5 animate-pulse" />
            </p>
          </motion.div>
        </div>

        {/* RIGHT — avatar */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="relative aspect-[4/5] max-w-[520px] mx-auto"
          >
            {/* Glow rings */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-pdpurple/30 via-fuchsia-400/10 to-transparent blur-2xl" />
            <div className="absolute -inset-2 rounded-[44px] border border-pdpurple/20" />

            <div className="relative h-full w-full rounded-[36px] overflow-hidden noise" data-testid="hero-avatar">
              <img src={ASSETS.heroAvatar} alt="PlugDrop AI agent"
                className="h-full w-full object-cover bg-white"
                style={{ transform: "scaleX(-1)" }} />
              {/* Soft purple lift only (keep clean white) */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 60% 50%, rgba(139,92,246,0.10) 0%, transparent 60%)" }} />
              {/* HUD corner frames */}
              <div className="absolute top-4 left-4 size-6 border-l-2 border-t-2 border-pdpurple-soft" />
              <div className="absolute top-4 right-4 size-6 border-r-2 border-t-2 border-pdpurple-soft" />
              <div className="absolute inset-0 bg-gradient-to-t from-pdblack/40 via-transparent to-transparent" />

              {/* Floating badges */}
              <div className="absolute top-5 left-5 glass-light rounded-2xl px-3 py-2 flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-pdblack">Live AI · Online</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 glass-light rounded-2xl p-3.5 flex items-center gap-3">
                <button
                  data-testid="hero-mic-button"
                  onClick={onTalkToAgent}
                  className="relative size-12 rounded-full bg-pdblack text-white flex items-center justify-center hover:bg-pdpurple transition-colors"
                >
                  <Mic className="size-5" />
                  <span className="absolute inset-0 rounded-full bg-pdpurple/30 ping-slow" />
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium text-pdblack">Live AI Interaction</div>
                  <div className="text-xs text-pdblack/60">Tap and start a real-time conversation</div>
                </div>
              </div>
            </div>

            {/* Side feature pills */}
            <div className="hidden lg:flex flex-col gap-3 absolute -right-4 top-12">
              {[
                { label: "Voice Agents", sub: "Natural, real-time" },
                { label: "Multi-Agent", sub: "Orchestrated teams" },
                { label: "Enterprise", sub: "Production-grade" },
              ].map((p, i) => (
                <motion.div key={p.label}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="glass-light rounded-2xl px-3.5 py-2.5 max-w-[170px]">
                  <div className="text-xs font-semibold text-pdblack">{p.label}</div>
                  <div className="text-[11px] text-pdblack/60">{p.sub}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
