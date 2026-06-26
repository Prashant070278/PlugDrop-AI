import { motion } from "framer-motion";
import { CUSTOMER_LOGO_STRIPS } from "../lib/constants";

export default function CustomerLogos() {
  const src = CUSTOMER_LOGO_STRIPS[0];
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

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Single row, left-to-right scroll */}
        <motion.div
          data-testid="logo-strip-1"
          className="flex items-center gap-12 whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", repeat: Infinity, duration: 80 }}
          style={{ width: "max-content" }}
        >
          {[0, 1, 2].map((k) => (
            <img
              key={k}
              src={src}
              alt="PlugDrop customers — Teleperformance, Konica Minolta, UltraTech Cement, Godrej, Bisleri, Standard Chartered, Dubai World Trade Centre, PVR Cinemas, Adidas, India Today, Hindustan Times, Pepperfry, King's College Hospital, Welspun, BLS International, Singapore Post, FLoT, Naukri, STIC Travel Group, Avon, Annik, Wave Infratech"
              className="h-20 sm:h-24 lg:h-28 w-auto object-contain shrink-0 select-none"
              draggable="false"
              loading="lazy"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
