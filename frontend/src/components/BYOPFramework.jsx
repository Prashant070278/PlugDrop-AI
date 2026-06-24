import { motion } from "framer-motion";
import { BYOP, INTEGRATIONS } from "../lib/constants";
import { Cpu } from "lucide-react";

export default function BYOPFramework() {
  return (
    <section id="byop" data-testid="byop-section" className="relative py-24 lg:py-32 bg-pdpurple-bg overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">BYOP Framework</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
            Enterprise AI without<br/>replacing your stack.
          </h2>
          <p className="mt-5 text-base lg:text-lg leading-relaxed text-pdblack/70">
            Bring Your Own Platform — CRM, ERP, Workflow, API, Telephony or Interface.
            PlugDrop AI Core wraps around what you already run.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-12 gap-8 items-center">
          {/* left BYOP list */}
          <div className="lg:col-span-4 space-y-3">
            {BYOP.slice(0, 3).map((b, i) => (
              <motion.div key={b.label}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-pdpurple/15 p-4 hover:border-pdpurple/40 hover:shadow-[0_8px_24px_rgba(139,92,246,0.10)] transition-all">
                <div className="text-sm font-semibold text-pdblack">{b.label}</div>
                <div className="text-xs text-pdblack/60 mt-1">{b.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* center core */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-pdpurple/30 blur-3xl scale-125" />
              <motion.div
                animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-40px] rounded-full"
                style={{ background: "conic-gradient(from 0deg, transparent 75%, rgba(139,92,246,0.45) 92%, transparent 100%)" }}
              />
              <div className="relative size-44 rounded-full bg-gradient-to-br from-pdpurple to-pdpurple-deep flex flex-col items-center justify-center glow-purple-lg">
                <Cpu className="size-10 text-white" />
                <div className="text-white font-display font-medium mt-2">PlugDrop</div>
                <div className="text-white/70 text-xs">AI Core</div>
              </div>
            </div>
          </div>

          {/* right BYOP list */}
          <div className="lg:col-span-4 space-y-3">
            {BYOP.slice(3).map((b, i) => (
              <motion.div key={b.label}
                initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl bg-white border border-pdpurple/15 p-4 hover:border-pdpurple/40 hover:shadow-[0_8px_24px_rgba(139,92,246,0.10)] transition-all">
                <div className="text-sm font-semibold text-pdblack">{b.label}</div>
                <div className="text-xs text-pdblack/60 mt-1">{b.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration logos */}
        <div className="mt-20 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-pdblack/60 mb-5">Integration ecosystem</div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {INTEGRATIONS.map((name, i) => (
              <motion.span key={name}
                initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-2 rounded-full bg-white border border-pdpurple/20 text-pdblack text-sm font-medium hover:border-pdpurple hover:bg-pdpurple hover:text-white transition-colors">
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
