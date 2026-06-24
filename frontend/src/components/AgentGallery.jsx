import { motion } from "framer-motion";
import { AGENTS } from "../lib/constants";
import { Play } from "lucide-react";

export default function AgentGallery() {
  return (
    <section id="agents" data-testid="agent-gallery" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">AI Agent Gallery</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Meet your<br/>digital workforce.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Realistic, brand-tuned AI personas — each trained for a specific business function.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              data-testid={`agent-card-${a.name.toLowerCase()}`}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer">
              <img src={a.img} alt={a.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${a.accent} mix-blend-overlay`} />
              <div className="absolute inset-0 bg-gradient-to-t from-pdblack via-pdblack/30 to-transparent" />

              <div className="absolute top-4 right-4 size-9 rounded-full glass-dark flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Play className="size-3.5 text-white ml-0.5" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-pdpurple-soft mb-1">{a.role}</div>
                <div className="font-display text-2xl text-white font-medium">{a.name}</div>
                <div className="text-xs text-white/70 mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 transition">{a.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
