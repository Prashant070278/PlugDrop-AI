import { motion } from "framer-motion";
import { CUSTOMER_LOGO_STRIPS } from "../lib/constants";

export default function CustomerLogos() {
  return (
    <section data-testid="customer-logos" className="relative py-20 lg:py-24 bg-white border-y border-pdpurple/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-12">
        <div className="text-center">
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

      {/* Logo strips — each row of the original poster scrolls horizontally */}
      <div className="relative space-y-5">
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {CUSTOMER_LOGO_STRIPS.map((src, i) => {
          const reverse = i % 2 === 1;
          const dur = 60 + i * 8;
          return (
            <motion.div
              key={src}
              data-testid={`logo-strip-${i + 1}`}
              className="flex items-center gap-12 whitespace-nowrap"
              animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
              transition={{ ease: "linear", repeat: Infinity, duration: dur }}
              style={{ width: "max-content" }}
            >
              {[0, 1, 2].map((k) => (
                <img
                  key={`${src}-${k}`}
                  src={src}
                  alt="PlugDrop customers"
                  className="h-16 sm:h-20 lg:h-24 w-auto object-contain shrink-0 select-none"
                  draggable="false"
                  loading="lazy"
                />
              ))}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
