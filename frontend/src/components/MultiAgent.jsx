import { motion } from "framer-motion";
import { Users, ShieldCheck, BarChart3, Briefcase, Cpu, Sparkles, Wrench } from "lucide-react";

const AGENTS = [
  { name: "Sales",      icon: Briefcase,   x: -260, y: -150 },
  { name: "Support",    icon: Users,       x:  260, y: -150 },
  { name: "Research",   icon: Sparkles,    x: -310, y:   30 },
  { name: "Compliance", icon: ShieldCheck, x:  310, y:   30 },
  { name: "Analytics",  icon: BarChart3,   x: -260, y:  180 },
  { name: "Operations", icon: Wrench,      x:  260, y:  180 },
];

export default function MultiAgent({ onBookDemo }) {
  return (
    <section id="multi-agent" data-testid="multi-agent-section" className="relative py-24 lg:py-32 bg-pdblack overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Multi-Agent Framework</span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-white">
            AI agents that<br/>work as a <span className="text-gradient-purple italic">team.</span>
          </h2>
          <p className="text-base lg:text-lg leading-relaxed text-white/70 max-w-lg">
            Our orchestration framework — built on LangChain, LangGraph and CrewAI — coordinates
            specialist agents to reason, plan and execute end-to-end workflows.
          </p>
          <button
            data-testid="multi-agent-cta"
            onClick={onBookDemo}
            className="inline-flex items-center gap-2 rounded-full bg-pdpurple text-white px-6 py-3.5 text-sm font-medium hover:bg-pdpurple-soft transition-colors glow-purple-sm"
          >
            See how it works
          </button>
        </div>

        {/* Orchestration diagram */}
        <div className="lg:col-span-7 relative h-[560px] flex items-center justify-center">
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="-400 -300 800 600" preserveAspectRatio="xMidYMid meet">
            {AGENTS.map((a, i) => (
              <line key={i}
                x1="0" y1="0" x2={a.x} y2={a.y}
                stroke="rgba(167,139,250,0.45)"
                strokeWidth="1.2"
                className="dash-anim"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
            {AGENTS.map((a, i) => (
              <circle key={`d-${i}`} cx={a.x} cy={a.y} r="3" fill="#A78BFA">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            ))}
          </svg>

          {/* Center orchestrator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
            className="relative z-10"
          >
            <span className="absolute inset-0 rounded-full bg-pdpurple/40 blur-2xl scale-150" />
            <div className="relative size-32 rounded-full bg-gradient-to-br from-pdpurple to-pdpurple-deep flex items-center justify-center glow-purple-lg">
              <Cpu className="size-12 text-white" />
            </div>
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
              <div className="text-white font-display text-base font-medium">PlugDrop Core</div>
              <div className="text-pdpurple-soft text-xs">Orchestrator</div>
            </div>
          </motion.div>

          {/* Agent nodes */}
          {AGENTS.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="absolute"
                style={{
                  left: `calc(50% + ${a.x * 0.55}px)`,
                  top:  `calc(50% + ${a.y * 0.55}px)`,
                  transform: "translate(-50%,-50%)",
                }}
                data-testid={`agent-node-${a.name.toLowerCase()}`}
              >
                <div className="glass-dark rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[170px] hover:border-pdpurple/40 transition">
                  <div className="size-9 rounded-xl bg-pdpurple/20 flex items-center justify-center">
                    <Icon className="size-4 text-pdpurple-soft" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium leading-tight">{a.name} Agent</div>
                    <div className="text-white/50 text-[11px]">Specialist</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
