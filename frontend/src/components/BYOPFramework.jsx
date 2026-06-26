import { motion } from "framer-motion";
import { BYOP, INTEGRATIONS } from "../lib/constants";

export default function BYOPFramework() {
  // Position BYOP nodes around the central core in a hexagon
  const radius = 250; // px
  return (
    <section id="byop" data-testid="byop-section" className="relative py-24 lg:py-32 bg-pdpurple-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute -top-32 -right-32 size-[480px] rounded-full bg-pdpurple/15 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 size-[480px] rounded-full bg-pdpurple-soft/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">BYOP Framework</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
            Plug into your stack.<br/><span className="italic font-light">Don't rebuild it.</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg leading-relaxed text-pdblack/70 max-w-xl mx-auto">
            Bring Your Own Platform — CRM, ERP, Workflow, API, Telephony, Interface,
            Knowledge Base or IoT data. PlugDrop AI Core orchestrates around what you already run.
          </p>
        </div>

        {/* Orbital BYOP diagram */}
        <div className="relative mt-16 mx-auto" style={{ maxWidth: 880, height: 680 }}>
          {/* Orbital rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pdpurple/20"
               style={{ width: radius * 2 + 60, height: radius * 2 + 60 }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pdpurple/15 border-dashed"
               style={{ width: radius * 2 - 40, height: radius * 2 - 40 }} />

          {/* Animated connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-400 -300 800 600">
            <defs>
              <radialGradient id="coreGlow">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r="180" fill="url(#coreGlow)" />
            {BYOP.map((_, i) => {
              const angle = (i / BYOP.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <g key={i}>
                  <line x1="0" y1="0" x2={x} y2={y}
                    stroke="rgba(139,92,246,0.45)" strokeWidth="1.2"
                    className="dash-anim" style={{ animationDelay: `${i * 0.5}s` }} />
                  {/* data packet */}
                  <circle r="3.5" fill="#8B5CF6">
                    <animateMotion dur={`${4 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}
                      path={`M0,0 L${x},${y}`} />
                    <animate attributeName="opacity" values="0;1;1;0" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Center Core */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-30px] rounded-full"
              style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(139,92,246,0.55) 92%, transparent 100%)" }}
            />
            <div className="relative size-44 rounded-full bg-pdblack flex flex-col items-center justify-center text-center glow-purple-lg border border-pdpurple/30">
              <div className="absolute inset-2 rounded-full border border-pdpurple/30" />
              <div className="absolute inset-5 rounded-full border border-pdpurple/20" />
              <div className="size-10 rounded-2xl bg-pdpurple flex items-center justify-center mb-2">
                <span className="font-display text-white text-xl font-semibold leading-none">p</span>
              </div>
              <div className="text-white font-display text-base font-medium">PlugDrop</div>
              <div className="text-pdpurple-soft text-[11px] uppercase tracking-[0.2em]">AI Core</div>
            </div>
          </div>

          {/* BYOP nodes */}
          {BYOP.map((b, i) => {
            const angle = (i / BYOP.length) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="absolute z-20"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top:  `calc(50% + ${y}px)`,
                  transform: "translate(-50%,-50%)",
                }}
                data-testid={`byop-node-${b.label.toLowerCase()}`}
              >
                <div className="group relative">
                  <div className="absolute inset-0 rounded-2xl bg-pdpurple/30 blur-xl opacity-0 group-hover:opacity-100 transition" />
                  <div className="relative bg-white border border-pdpurple/25 rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[170px] hover:border-pdpurple hover:shadow-[0_10px_30px_rgba(139,92,246,0.18)] transition-all">
                    <div className="size-9 rounded-xl bg-pdpurple/10 flex items-center justify-center shrink-0">
                      <span aria-hidden className="block size-5"
                        style={{
                          WebkitMask: `url(${`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${b.slug}.svg`}) center/contain no-repeat`,
                          mask: `url(${`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${b.slug}.svg`}) center/contain no-repeat`,
                          backgroundColor: "#8B5CF6",
                        }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-pdpurple font-semibold">BYO</div>
                      <div className="text-sm font-semibold text-pdblack leading-tight truncate">{b.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Description grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-16 max-w-5xl mx-auto">
          {BYOP.map((b) => (
            <div key={b.label} className="rounded-2xl bg-white/70 backdrop-blur border border-pdpurple/15 p-4">
              <div className="text-xs font-semibold text-pdpurple uppercase tracking-wider">{b.full}</div>
              <div className="text-sm text-pdblack/70 mt-1">{b.desc}</div>
            </div>
          ))}
        </div>

        {/* Integration logo cloud */}
        <div className="mt-24">
          <div className="text-center text-xs uppercase tracking-[0.25em] text-pdblack/60 mb-8">
            Integration ecosystem · plug into 100+ systems
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-pdpurple-bg to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-pdpurple-bg to-transparent z-10 pointer-events-none" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {INTEGRATIONS.map((it, i) => (
                <motion.div key={it.name}
                  initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  data-testid={`integration-${it.name.toLowerCase().replace(/\s/g,"-")}`}
                  className="group flex items-center gap-3 rounded-2xl bg-white border border-pdpurple/15 px-4 py-3 hover:border-pdpurple/50 hover:shadow-[0_6px_20px_rgba(139,92,246,0.12)] transition">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                       style={{ backgroundColor: `${it.color}14` }}>
                    <span aria-hidden className="block size-5"
                      style={{
                        WebkitMask: `url(${it.logo}) center/contain no-repeat`,
                        mask: `url(${it.logo}) center/contain no-repeat`,
                        backgroundColor: it.color,
                      }} />
                  </div>
                  <div className="text-sm font-medium text-pdblack truncate">{it.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
