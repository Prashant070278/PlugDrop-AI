import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { Sparkles, Check } from "lucide-react";

export default function AgentGallery() {
  const [active, setActive] = useState(0);
  const a = AGENTS[active];

  return (
    <section id="agents" data-testid="agent-gallery" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
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
            Click any agent — see what they handle, how they're tuned, and what they replace.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Cards rail */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                    {/* HUD corners */}
                    <div className={`absolute top-2.5 left-2.5 size-3.5 border-l-2 border-t-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute top-2.5 right-2.5 size-3.5 border-r-2 border-t-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute bottom-2.5 left-2.5 size-3.5 border-l-2 border-b-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className={`absolute bottom-2.5 right-2.5 size-3.5 border-r-2 border-b-2 ${isActive ? "border-pdpurple" : "border-pdpurple-soft/70"}`} />
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/85 backdrop-blur-sm border border-pdpurple/20">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-mono uppercase tracking-wider text-pdblack/80">Online</span>
                    </div>
                  </div>
                  <div className="relative p-3 bg-white/85 backdrop-blur border-t border-pdpurple/10">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-pdpurple flex items-center gap-1">
                      <Sparkles className="size-2.5" /> {ag.role}
                    </div>
                    <div className="font-display text-lg text-pdblack font-medium leading-tight">{ag.name}</div>
                  </div>
                  {isActive && (
                    <span className="absolute top-3 right-3 size-2.5 rounded-full bg-pdpurple ring-4 ring-pdpurple/20" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Active panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                data-testid="agent-detail-panel"
                className="relative rounded-3xl bg-gradient-to-br from-pdpurple-bg via-white to-pdpurple-bg border border-pdpurple/20 p-7 lg:p-8 h-full overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 size-40 rounded-full bg-pdpurple/15 blur-2xl" />
                <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

                <div className="relative flex items-center gap-4 mb-5">
                  <div className="relative size-16 rounded-2xl overflow-hidden border-2 border-pdpurple/30 shrink-0">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold">{a.role}</div>
                    <div className="font-display text-3xl text-pdblack font-medium leading-tight">{a.name}</div>
                  </div>
                </div>

                <p className="relative text-sm lg:text-base text-pdblack/70 leading-relaxed mb-6">{a.desc}</p>

                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold mb-3">Capabilities</div>
                  <div className="grid grid-cols-2 gap-2">
                    {a.capabilities.map((c) => (
                      <motion.div
                        key={c}
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + Math.random() * 0.15 }}
                        className="flex items-center gap-2 rounded-xl bg-white border border-pdpurple/20 px-3 py-2.5"
                      >
                        <span className="size-5 rounded-md bg-pdpurple/15 flex items-center justify-center shrink-0">
                          <Check className="size-3 text-pdpurple" />
                        </span>
                        <span className="text-xs font-medium text-pdblack">{c}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-6 flex items-center gap-2 text-xs text-pdblack/60">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active across voice · chat · WhatsApp · CRM
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
