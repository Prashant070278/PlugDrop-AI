import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { Sparkles, Check, MessageSquare, Plug, Building2, Radio } from "lucide-react";

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
            Click any agent — see what they handle, the channels they live on, the systems they plug into,
            and the outcomes they deliver.
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
                    <div className="text-[9px] uppercase tracking-[0.15em] text-pdpurple/80 mt-0.5 line-clamp-1">{ag.role.replace(" Agent","")}</div>
                  </div>
                  {isActive && (
                    <span className="absolute top-2 right-2 size-2 rounded-full bg-pdpurple ring-4 ring-pdpurple/20" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Rich detail panel */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                data-testid="agent-detail-panel"
                className="relative rounded-3xl bg-gradient-to-br from-pdpurple-bg via-white to-pdpurple-bg border border-pdpurple/20 p-7 lg:p-8 overflow-hidden h-full"
              >
                <div className="absolute -top-10 -right-10 size-48 rounded-full bg-pdpurple/15 blur-2xl" />
                <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-start gap-5 mb-5 pb-5 border-b border-pdpurple/10">
                  <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-pdpurple/30 shrink-0">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1.5 right-1.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold">{a.role}</div>
                    <div className="font-display text-3xl sm:text-4xl text-pdblack font-medium leading-tight">{a.name}</div>
                    <div className="mt-1.5 text-sm text-pdblack/70 italic font-display">{a.tagline}</div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-pdpurple/70 font-semibold">{a.metric.label}</div>
                    <div className="font-display text-2xl font-semibold text-pdpurple">{a.metric.value}</div>
                  </div>
                </div>

                <p className="relative text-sm lg:text-base text-pdblack/75 leading-relaxed mb-5">{a.desc}</p>

                {/* Capabilities */}
                <div className="relative mb-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold mb-3">
                    <Sparkles className="size-3" /> Capabilities
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {a.capabilities.map((c) => (
                      <div key={c} className="flex items-center gap-2 rounded-xl bg-white border border-pdpurple/20 px-3 py-2">
                        <span className="size-5 rounded-md bg-pdpurple/15 flex items-center justify-center shrink-0">
                          <Check className="size-3 text-pdpurple" />
                        </span>
                        <span className="text-xs font-medium text-pdblack">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live sample chat */}
                <div className="relative mb-5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-pdpurple font-semibold mb-3">
                    <MessageSquare className="size-3" /> Live sample
                  </div>
                  <div className="rounded-2xl bg-pdblack p-3 space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-pdpurple text-white text-xs rounded-2xl rounded-br-md px-3 py-2 max-w-[80%]">{a.sample.you}</div>
                    </div>
                    <div className="flex items-end gap-1.5">
                      <img src={a.img} alt="" className="size-5 rounded-full object-cover border border-pdpurple/30" />
                      <div className="bg-white text-pdblack text-xs rounded-2xl rounded-bl-md px-3 py-2 max-w-[80%]">{a.sample.agent}</div>
                    </div>
                  </div>
                </div>

                {/* Channels + Integrations + Industries grid */}
                <div className="relative grid sm:grid-cols-3 gap-3">
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
    <div className="rounded-2xl bg-white/80 border border-pdpurple/15 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-pdpurple/80 font-semibold mb-2">
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
