import { motion } from "framer-motion";
import {
  Users, ShieldCheck, BarChart3, Briefcase, Cpu, Sparkles, Wrench, Megaphone, ArrowRight
} from "lucide-react";

const AGENTS = [
  { name: "Sales",      icon: Briefcase,   color: "from-purple-400 to-fuchsia-400" },
  { name: "Support",    icon: Users,       color: "from-indigo-400 to-purple-400" },
  { name: "Research",   icon: Sparkles,    color: "from-violet-400 to-purple-400" },
  { name: "Compliance", icon: ShieldCheck, color: "from-fuchsia-400 to-purple-400" },
  { name: "Analytics",  icon: BarChart3,   color: "from-purple-400 to-indigo-400" },
  { name: "Operations", icon: Wrench,      color: "from-purple-400 to-violet-400" },
  { name: "Marketing",  icon: Megaphone,   color: "from-fuchsia-400 to-violet-400" },
];

// Circular layout positions
const RADIUS = 260;
const positioned = AGENTS.map((a, i) => {
  const angle = (i / AGENTS.length) * Math.PI * 2 - Math.PI / 2;
  return { ...a, x: Math.cos(angle) * RADIUS, y: Math.sin(angle) * RADIUS };
});

export default function MultiAgent({ onBookDemo }) {
  return (
    <section id="multi-agent" data-testid="multi-agent-section" className="relative py-24 lg:py-32 bg-pdblack overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-pdpurple/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple-soft font-medium">Multi-Agent Framework</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-white">
            Agents that <span className="italic font-light text-pdpurple-soft">collaborate.</span><br/>
            Outcomes that <span className="text-gradient-purple">compound.</span>
          </h2>
          <p className="mt-5 text-base lg:text-lg leading-relaxed text-white/70 max-w-xl mx-auto">
            Built on LangChain, LangGraph and CrewAI — our orchestration layer lets specialist agents reason, plan
            and execute together. One brief, many minds, zero handoffs.
          </p>
        </div>

        {/* Orchestration diagram */}
        <div className="relative mt-16 mx-auto" style={{ maxWidth: 820, height: 640 }}>
          {/* Orbit rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pdpurple/15"
               style={{ width: RADIUS * 2 + 80, height: RADIUS * 2 + 80 }} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pdpurple/10 border-dashed"
               style={{ width: RADIUS * 2 - 60, height: RADIUS * 2 - 60 }} />
          <motion.div
            animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: RADIUS * 2 + 80, height: RADIUS * 2 + 80,
              background: "conic-gradient(from 0deg, transparent 88%, rgba(167,139,250,0.55) 96%, transparent 100%)" }}
          />

          {/* SVG connections + data packets */}
          <svg className="absolute inset-0 w-full h-full" viewBox="-400 -320 800 640" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="ln" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {positioned.map((a, i) => (
              <g key={i}>
                <line x1="0" y1="0" x2={a.x} y2={a.y} stroke="url(#ln)" strokeWidth="1.2"
                      className="dash-anim" style={{ animationDelay: `${i * 0.35}s` }} />
                {/* Data packet bidirectional */}
                <circle r="3" fill="#A78BFA">
                  <animateMotion dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}
                    path={`M0,0 L${a.x},${a.y}`} />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
                </circle>
                <circle r="2.4" fill="#C4B5FD">
                  <animateMotion dur={`${5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.7}s`}
                    path={`M${a.x},${a.y} L0,0`} />
                  <animate attributeName="opacity" values="0;0.9;0" dur={`${5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
                </circle>
              </g>
            ))}
            {/* Inter-agent thin connections (random subset) */}
            {positioned.map((a, i) => {
              const next = positioned[(i + 1) % positioned.length];
              return (
                <line key={`p-${i}`} x1={a.x} y1={a.y} x2={next.x} y2={next.y}
                  stroke="rgba(167,139,250,0.15)" strokeWidth="0.8" strokeDasharray="2 4" />
              );
            })}
          </svg>

          {/* Center orchestrator */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div
              animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-25px] rounded-full"
              style={{ background: "conic-gradient(from 90deg, transparent 75%, rgba(139,92,246,0.6) 92%, transparent 100%)" }}
            />
            <div className="relative size-44 rounded-full bg-gradient-to-br from-pdpurple to-pdpurple-deep flex flex-col items-center justify-center glow-purple-lg">
              <div className="absolute inset-2 rounded-full border border-white/15" />
              <div className="absolute inset-5 rounded-full border border-white/10" />
              <Cpu className="size-10 text-white" />
              <div className="text-white font-display text-sm font-medium mt-2">Orchestrator</div>
              <div className="text-white/70 text-[10px] uppercase tracking-[0.2em]">PlugDrop Core</div>
            </div>
          </div>

          {/* Agent nodes */}
          {positioned.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="absolute z-20"
                style={{
                  left: `calc(50% + ${a.x}px)`,
                  top:  `calc(50% + ${a.y}px)`,
                  transform: "translate(-50%,-50%)",
                }}
                data-testid={`agent-node-${a.name.toLowerCase()}`}
              >
                <div className="group relative">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${a.color} opacity-30 blur-xl group-hover:opacity-60 transition`} />
                  <div className="relative flex flex-col items-center">
                    <div className={`size-16 rounded-full bg-gradient-to-br ${a.color} p-[1.5px] glow-purple-sm`}>
                      <div className="size-full rounded-full bg-pdblack flex items-center justify-center border border-white/10">
                        <Icon className="size-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-2.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur border border-white/10 whitespace-nowrap">
                      <span className="text-xs font-medium text-white">{a.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom feature row */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
          {[
            { title: "Plan", desc: "Decompose goals into agent-level tasks." },
            { title: "Reason", desc: "Tool use, memory, and shared context." },
            { title: "Execute", desc: "Act on CRM, ERP, telephony and APIs." },
          ].map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl glass-dark p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-pdpurple-soft mb-1.5">0{i + 1}</div>
              <div className="font-display text-xl text-white font-medium">{f.title}</div>
              <div className="text-sm text-white/60 mt-1">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            data-testid="multi-agent-cta"
            onClick={onBookDemo}
            className="inline-flex items-center gap-2 rounded-full bg-pdpurple hover:bg-pdpurple-soft text-white px-6 py-3.5 text-sm font-medium transition-colors glow-purple-sm"
          >
            See how it works
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
