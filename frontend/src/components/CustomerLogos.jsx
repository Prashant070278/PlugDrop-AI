import { motion } from "framer-motion";
import { CUSTOMERS } from "../lib/constants";

// Generate a deterministic brand-tinted style for each pill
function hueFor(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

export default function CustomerLogos() {
  // Triple the list so the seamless marquee never gaps
  const loop = [...CUSTOMERS, ...CUSTOMERS, ...CUSTOMERS];

  return (
    <section data-testid="customer-logos" className="relative py-20 lg:py-24 bg-white border-y border-pdpurple/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Trusted by enterprises</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium leading-[1.05] text-pdblack">
            22+ leading brands run <span className="text-gradient-purple">PlugDrop AI Agents.</span>
          </h2>
          <p className="mt-3 text-sm lg:text-base text-pdblack/60 max-w-2xl mx-auto">
            From Teleperformance to UltraTech, Standard Chartered to PVR Cinemas — global enterprises trust
            us to deploy production-grade AI agents.
          </p>
        </div>
      </div>

      {/* Full-bleed scrolling band */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-32 sm:w-48 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 sm:w-48 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Row 1 - logo style cards */}
        <div className="flex gap-3 whitespace-nowrap marquee py-2">
          {loop.map((c, i) => {
            const h = hueFor(c);
            return (
              <motion.div
                key={`a-${i}`}
                className="shrink-0 inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-pdpurple/15 shadow-[0_6px_18px_rgba(139,92,246,0.06)]"
                whileHover={{ y: -2 }}
                data-testid={`customer-${c.toLowerCase().replace(/[^a-z0-9]/g,"-")}`}
              >
                <span
                  className="size-7 rounded-lg flex items-center justify-center font-display text-xs font-semibold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, hsl(${h} 70% 55%), hsl(${(h + 40) % 360} 70% 45%))` }}
                  aria-hidden
                >
                  {c.slice(0, 1)}
                </span>
                <span className="font-display text-base font-medium text-pdblack tracking-tight">{c}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Row 2 - reverse direction text-only */}
        <div className="flex gap-3 whitespace-nowrap marquee-reverse py-2 mt-3 opacity-90">
          {loop.map((c, i) => (
            <span
              key={`b-${i}`}
              className="shrink-0 text-sm font-medium px-4 py-2 rounded-full border border-pdpurple/15 text-pdblack/65 bg-pdpurple/5"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
