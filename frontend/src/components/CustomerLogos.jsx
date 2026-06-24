import { motion } from "framer-motion";
import { ASSETS, CUSTOMERS } from "../lib/constants";

export default function CustomerLogos() {
  // Double the list so the marquee loop is seamless
  const loop = [...CUSTOMERS, ...CUSTOMERS];

  return (
    <section data-testid="customer-logos" className="relative py-20 lg:py-24 bg-white border-y border-pdpurple/10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Trusted by enterprises</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium leading-[1.05] text-pdblack">
            22+ leading brands run on <span className="text-gradient-purple">PlugDrop.</span>
          </h2>
          <p className="mt-3 text-sm lg:text-base text-pdblack/60 max-w-2xl mx-auto">
            From Teleperformance to UltraTech, Standard Chartered to PVR Cinemas — global enterprises trust
            us to deploy production-grade AI agents.
          </p>
        </div>

        {/* Real logo grid (uploaded asset) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl bg-white border border-pdpurple/10 p-6 lg:p-10 shadow-[0_10px_40px_rgba(139,92,246,0.06)] overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(167,139,250,0.06) 0%, transparent 70%)" }} />
          <img
            src={ASSETS.customerLogos}
            alt="Trusted by Teleperformance, Konica Minolta, UltraTech Cement, Godrej, Bisleri, Standard Chartered, Dubai World Trade Centre, PVR Cinemas, Adidas, India Today Group, Hindustan Times, Pepperfry, King's College Hospital, Welspun, BLS International, Singapore Post, FLoT, Naukri.com, STIC Travel Group, Avon, Annik, Wave Infratech"
            className="relative w-full h-auto"
            data-testid="customer-logos-image"
          />
        </motion.div>

        {/* Marquee of brand names below for accessibility + motion */}
        <div className="relative mt-10 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <div className="flex gap-3 whitespace-nowrap marquee">
            {loop.map((c, i) => (
              <span key={i}
                className="text-sm font-medium px-4 py-2 rounded-full border border-pdpurple/15 text-pdblack/70 bg-pdpurple/5">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
