import { motion } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { Play, Sparkles } from "lucide-react";

export default function AgentGallery() {
  return (
    <section id="agents" data-testid="agent-gallery" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-20 right-0 size-[400px] rounded-full bg-pdpurple/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">AI Agent Gallery</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Meet your<br/>digital workforce.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Brand-tuned digital avatars — each trained for a specific business function.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              data-testid={`agent-card-${a.name.toLowerCase()}`}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-pdpurple/15 hover:border-pdpurple/50 transition-all hover:-translate-y-1"
            >
              {/* Light purple gradient backdrop (clean studio look) */}
              <div className="absolute inset-0 bg-gradient-to-b from-pdpurple-bg via-white to-pdpurple-bg" />
              <div className="absolute inset-0"
                style={{ backgroundImage: "radial-gradient(circle at 50% 0%, rgba(167,139,250,0.35) 0%, transparent 60%)" }} />

              {/* Portrait area */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={a.img}
                  alt={a.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Purple duotone — preserves "clean" look */}
                <div className="absolute inset-0 mix-blend-multiply opacity-20"
                  style={{ background: "linear-gradient(160deg, #C4B5FD 0%, #8B5CF6 100%)" }} />
                <div className="absolute inset-0 mix-blend-screen opacity-25"
                  style={{ background: "radial-gradient(circle at 50% 30%, #F5F3FF 0%, transparent 60%)" }} />

                {/* HUD corner frame */}
                <div className="absolute top-3 left-3 size-4 border-l-2 border-t-2 border-pdpurple-soft/80" />
                <div className="absolute top-3 right-3 size-4 border-r-2 border-t-2 border-pdpurple-soft/80" />
                <div className="absolute bottom-3 left-3 size-4 border-l-2 border-b-2 border-pdpurple-soft/80" />
                <div className="absolute bottom-3 right-3 size-4 border-r-2 border-b-2 border-pdpurple-soft/80" />

                {/* Online badge */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-pdpurple/20">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-pdblack/80">Online</span>
                </div>

                {/* Hover play */}
                <div className="absolute bottom-3 right-3 size-9 rounded-full bg-pdpurple flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all">
                  <Play className="size-3.5 text-white ml-0.5" />
                </div>
              </div>

              {/* Bottom info on light panel */}
              <div className="relative p-4 bg-white/80 backdrop-blur border-t border-pdpurple/10">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-pdpurple mb-1">
                  <Sparkles className="size-3" />
                  {a.role}
                </div>
                <div className="font-display text-xl text-pdblack font-medium tracking-tight">{a.name}</div>
                <div className="text-xs text-pdblack/60 leading-relaxed mt-1.5 line-clamp-2">{a.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
