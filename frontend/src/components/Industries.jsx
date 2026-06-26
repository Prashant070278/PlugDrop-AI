import { motion } from "framer-motion";
import { INDUSTRIES, INDUSTRY_ICONS } from "../lib/constants";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function Industries() {
  return (
    <section id="industries" data-testid="industries-section" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 size-[500px] rounded-full bg-pdpurple/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-[500px] rounded-full bg-pdpurple-soft/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Industry Solutions</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Vertical-tuned agents,<br/>proven where it counts.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Each card shows the real problem, the agents we deploy, the use cases handled and the
            measurable outcome our customers see.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => {
            const Icon = INDUSTRY_ICONS[ind.name] || Sparkles;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                data-testid={`industry-card-${ind.name.toLowerCase().replace(/\s/g,"-")}`}
                className="group relative rounded-3xl border border-pdpurple/15 bg-white p-6 overflow-hidden hover:border-pdpurple/50 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(139,92,246,0.10)] transition-all"
              >
                {/* hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-pdpurple/0 to-pdpurple/0 group-hover:from-pdpurple/8 group-hover:to-transparent transition-all" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-11 rounded-2xl bg-pdpurple/10 border border-pdpurple/20 flex items-center justify-center group-hover:bg-pdpurple group-hover:text-white transition-colors">
                      <Icon className="size-5 text-pdpurple group-hover:text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-pdpurple/70">{String(i + 1).padStart(2, "0")}</span>
                      <ArrowUpRight className="size-4 text-pdblack/40 group-hover:text-pdpurple group-hover:rotate-12 transition-all" />
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-medium text-pdblack mb-2">{ind.name}</h3>
                  <p className="text-xs text-pdblack/65 leading-relaxed mb-3 line-clamp-2">{ind.challenge}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {ind.stats.map((s) => (
                      <div key={s.k} className="rounded-xl bg-pdpurple/8 border border-pdpurple/15 px-2.5 py-2">
                        <div className="text-[9px] uppercase tracking-wider text-pdpurple/70 font-semibold">{s.k}</div>
                        <div className="text-sm font-display font-semibold text-pdblack">{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Use cases chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ind.useCases.slice(0, 3).map((u) => (
                      <span key={u} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-pdpurple/20 text-pdblack/70">
                        {u}
                      </span>
                    ))}
                    {ind.useCases.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full text-pdpurple font-medium">
                        +{ind.useCases.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Solution + ROI */}
                  <div className="pt-3 border-t border-pdpurple/10">
                    <div className="text-[10px] uppercase tracking-wider text-pdblack/40 font-semibold mb-1">Solution</div>
                    <p className="text-xs text-pdblack/75 leading-relaxed mb-2 line-clamp-2">{ind.solution}</p>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-pdpurple bg-pdpurple/10 rounded-full px-2.5 py-1">
                      <Sparkles className="size-3" />
                      {ind.roi}
                    </div>
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
