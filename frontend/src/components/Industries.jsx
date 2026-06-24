import { useState } from "react";
import { motion } from "framer-motion";
import { INDUSTRIES } from "../lib/constants";
import { ArrowUpRight } from "lucide-react";

export default function Industries() {
  const [active, setActive] = useState(null);
  return (
    <section id="industries" data-testid="industries-section" className="relative py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Industry Solutions</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-2xl">
              Vertical-tuned agents,<br/>proven where it counts.
            </h2>
          </div>
          <p className="text-base text-pdblack/60 max-w-md">
            Hover any industry to explore the challenge we solved, the agents we deployed and the ROI delivered.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              data-testid={`industry-card-${ind.name.toLowerCase().replace(/\s/g,"-")}`}
              className="relative group cursor-pointer rounded-3xl border border-pdblack/10 bg-white p-6 overflow-hidden hover:border-pdpurple/40 hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pdpurple/0 to-pdpurple/0 group-hover:from-pdpurple/8 group-hover:to-transparent transition-all" />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-pdpurple/70">{String(i+1).padStart(2,"0")}</span>
                  <ArrowUpRight className="size-4 text-pdblack/40 group-hover:text-pdpurple group-hover:rotate-12 transition-all" />
                </div>
                <h3 className="font-display text-xl font-medium text-pdblack mb-3">{ind.name}</h3>

                <div className={`space-y-2 transition-all ${active === i ? "opacity-100" : "opacity-0 lg:opacity-60"}`}>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-pdblack/40 font-semibold">Challenge</div>
                    <div className="text-xs text-pdblack/70">{ind.challenge}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-pdblack/40 font-semibold">Solution</div>
                    <div className="text-xs text-pdblack/70">{ind.solution}</div>
                  </div>
                  <div className="pt-1">
                    <span className="inline-block text-xs font-semibold text-pdpurple bg-pdpurple/10 rounded-full px-2.5 py-0.5">{ind.roi}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
