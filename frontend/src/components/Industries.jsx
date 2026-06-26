import { motion } from "framer-motion";
import { INDUSTRIES, INDUSTRY_ICONS } from "../lib/constants";
import { Sparkles, TrendingUp, Activity, BarChart3 } from "lucide-react";

// Mini analytics panel rendered on card BACK
function MiniDashboard({ ind, icon: Icon }) {
  const bars = [62, 78, 45, 90, 68, 84, 55, 73];
  return (
    <div className="absolute inset-0 rounded-3xl bg-pdblack overflow-hidden border border-pdpurple/30 p-5 flex flex-col">
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "linear-gradient(rgba(139,92,246,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.18) 1px, transparent 1px)",
                  backgroundSize: "24px 24px" }} />
      <div className="absolute -top-10 -right-10 size-40 rounded-full bg-pdpurple/30 blur-3xl" />

      <div className="relative flex items-center gap-2 mb-3">
        <Icon className="size-4 text-pdpurple-soft" />
        <div className="text-[10px] uppercase tracking-[0.2em] text-pdpurple-soft font-semibold">{ind.name} · Live KPIs</div>
      </div>

      {/* KPI tiles */}
      <div className="relative grid grid-cols-2 gap-2 mb-3">
        {ind.stats.map((s) => (
          <div key={s.k} className="rounded-xl bg-white/8 border border-pdpurple/30 px-2.5 py-2 backdrop-blur">
            <div className="text-[9px] uppercase tracking-wider text-pdpurple-soft/80">{s.k}</div>
            <div className="font-display text-lg text-white font-semibold">{s.v}</div>
          </div>
        ))}
      </div>

      {/* Sparkline area */}
      <div className="relative rounded-xl bg-white/5 border border-pdpurple/25 p-2.5 mb-2.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between text-[10px] text-pdpurple-soft/80 mb-2">
          <span className="flex items-center gap-1"><Activity className="size-3" /> Throughput · 7d</span>
          <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="size-3" /> ↑ {ind.roi}</span>
        </div>
        <div className="flex items-end gap-1 h-12">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-pdpurple/40 to-pdpurple-soft"
                 style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      {/* Use cases */}
      <div className="relative flex flex-wrap gap-1.5">
        {ind.useCases.slice(0, 3).map((u) => (
          <span key={u} className="text-[10px] px-2 py-0.5 rounded-full bg-pdpurple/20 border border-pdpurple/30 text-pdpurple-soft">{u}</span>
        ))}
      </div>

      <div className="relative mt-2.5 flex items-center gap-2 text-[10px] text-white/60">
        <BarChart3 className="size-3 text-pdpurple-soft" />
        Hover to flip · click for full case study
      </div>
    </div>
  );
}

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
          <p className="text-base lg:text-lg text-pdblack/60 max-w-md">
            Hover any card to flip and see real KPIs the agent moves in that vertical.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INDUSTRIES.map((ind, i) => {
            const Icon = INDUSTRY_ICONS[ind.name] || Sparkles;
            return (
              <motion.div
                key={ind.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                data-testid={`industry-card-${ind.name.toLowerCase().replace(/\s/g,"-")}`}
                className="group [perspective:1400px] h-[440px]"
              >
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* FRONT */}
                  <div className="absolute inset-0 [backface-visibility:hidden] rounded-3xl border border-pdpurple/15 bg-white p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pdpurple-bg/30 to-transparent" />
                    <div className="relative flex items-start justify-between mb-5">
                      <div className="size-14 rounded-2xl bg-pdpurple/10 border border-pdpurple/20 flex items-center justify-center">
                        <Icon className="size-7 text-pdpurple" />
                      </div>
                      <span className="text-xs font-mono text-pdpurple/70">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    <h3 className="font-display text-2xl lg:text-3xl font-semibold text-pdblack mb-3 leading-tight">{ind.name}</h3>
                    <p className="text-sm text-pdblack/70 leading-relaxed mb-4 line-clamp-3">{ind.challenge}</p>

                    {/* prominent ROI badge */}
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-pdpurple rounded-full px-4 py-2 mb-4">
                      <Sparkles className="size-3.5" />
                      {ind.roi}
                    </div>

                    {/* Top 2 use cases (bigger text) */}
                    <div className="flex flex-wrap gap-2">
                      {ind.useCases.slice(0, 3).map((u) => (
                        <span key={u} className="text-sm px-3 py-1 rounded-full bg-pdpurple/8 border border-pdpurple/20 text-pdblack/80">
                          {u}
                        </span>
                      ))}
                    </div>

                    <div className="absolute bottom-5 left-6 right-6 text-xs text-pdblack/40 flex items-center gap-1.5">
                      <Activity className="size-3.5" /> Hover for live KPIs →
                    </div>
                  </div>

                  {/* BACK — dashboard */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <MiniDashboard ind={ind} icon={Icon} />
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
