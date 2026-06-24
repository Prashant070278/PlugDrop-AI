import { motion } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { Play, Sparkles } from "lucide-react";

export default function AgentGallery() {
  return (
    <section id="agents" data-testid="agent-gallery" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">AI Agent Gallery</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Meet your<br/>digital workforce.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Realistic, brand-tuned digital avatars — each trained for a specific business function.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              data-testid={`agent-card-${a.name.toLowerCase()}`}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer border border-pdpurple/15 hover:border-pdpurple/60 transition"
            >
              {/* Base portrait */}
              <img src={a.img} alt={a.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "grayscale(0.55) contrast(1.05)" }} />

              {/* Purple duotone overlay */}
              <div className="absolute inset-0 mix-blend-color"
                style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)" }} />
              <div className="absolute inset-0 mix-blend-screen opacity-40"
                style={{ background: "radial-gradient(circle at 30% 20%, #C4B5FD 0%, transparent 50%)" }} />

              {/* Digital scan lines */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 4px)",
                }} />

              {/* HUD frame corners */}
              <div className="absolute top-3 left-3 size-5 border-l-2 border-t-2 border-pdpurple-soft/80" />
              <div className="absolute top-3 right-3 size-5 border-r-2 border-t-2 border-pdpurple-soft/80" />
              <div className="absolute bottom-3 left-3 size-5 border-l-2 border-b-2 border-pdpurple-soft/80" />
              <div className="absolute bottom-3 right-3 size-5 border-r-2 border-b-2 border-pdpurple-soft/80" />

              {/* Top status badge */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pdblack/60 backdrop-blur-sm border border-pdpurple-soft/30">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/90">Online</span>
              </div>

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pdblack via-pdblack/50 to-transparent" />

              {/* Play button */}
              <div className="absolute top-4 right-4 size-10 rounded-full bg-pdpurple/90 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition">
                <Play className="size-4 text-white ml-0.5" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-pdpurple-soft">
                  <Sparkles className="size-3" />
                  {a.role}
                </div>
                <div className="font-display text-2xl text-white font-medium tracking-tight">{a.name}</div>
                <div className="text-xs text-white/70 leading-relaxed max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500">
                  {a.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
