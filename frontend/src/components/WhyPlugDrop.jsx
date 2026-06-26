import { motion } from "framer-motion";
import { Shield, Lock, FileCheck, Server, Activity, KeyRound, GitBranch, Eye } from "lucide-react";
import { WHY_POINTS, COMPLIANCE_BADGES } from "../lib/content";

const ICONS = [Shield, Lock, FileCheck, Server, Activity, KeyRound, GitBranch, Eye];

export default function WhyPlugDrop({ onBookDemo }) {
  return (
    <section id="why" data-testid="why-plugdrop" className="relative py-24 lg:py-32 bg-white overflow-hidden" aria-labelledby="why-heading">
      <div className="absolute -top-20 right-0 size-[500px] rounded-full bg-pdpurple/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Why PlugDrop</span>
            <h2 id="why-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
              Enterprise AI,<br/>delivered the <span className="text-gradient-purple italic">right way.</span>
            </h2>
            <p className="mt-5 text-base lg:text-lg leading-relaxed text-pdblack/70">
              PlugDrop is engineered for the realities of large organizations — security, integration, scale,
              compliance and measurable business outcomes.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-2">
              {COMPLIANCE_BADGES.map((b, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <div key={b} className="flex items-center gap-2 rounded-xl bg-pdpurple-bg border border-pdpurple/15 px-3 py-2">
                    <Icon className="size-3.5 text-pdpurple shrink-0" />
                    <span className="text-xs font-medium text-pdblack/80">{b}</span>
                  </div>
                );
              })}
            </div>

            <button
              data-testid="why-book-demo"
              onClick={onBookDemo}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-pdblack hover:bg-pdpurple text-white px-6 py-3.5 text-sm font-medium transition-colors"
            >
              Book a discovery session
            </button>
          </div>

          {/* Right list */}
          <div className="lg:col-span-7 space-y-3">
            {WHY_POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-pdpurple/15 bg-white p-5 hover:border-pdpurple/40 hover:shadow-[0_10px_24px_rgba(139,92,246,0.08)] transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-pdpurple/10 border border-pdpurple/20 flex items-center justify-center shrink-0 group-hover:bg-pdpurple group-hover:text-white transition-colors">
                    <span className="font-display text-sm font-semibold text-pdpurple group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg sm:text-xl font-medium text-pdblack">{p.title}</h3>
                    <p className="text-sm sm:text-base text-pdblack/65 leading-relaxed mt-1">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
