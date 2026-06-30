import { motion } from "framer-motion";
import { CUSTOMERS } from "../lib/constants";

/**
 * Customer logo wall — real brand logos provided by client.
 * Dual-row infinite marquee, monochrome by default, color on hover.
 */
export default function CustomerLogos() {
  const row1 = CUSTOMERS.slice(0, Math.ceil(CUSTOMERS.length / 2));
  const row2 = CUSTOMERS.slice(Math.ceil(CUSTOMERS.length / 2));

  return (
    <section
      data-testid="customer-logos"
      className="relative py-20 lg:py-24 bg-white border-y border-pdpurple/10 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-12">
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">
            Trusted by enterprises
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tighter font-medium leading-[1.05] text-pdblack">
            16+ leading brands run{" "}
            <span className="text-gradient-purple">PlugDrop AI Agents.</span>
          </h2>
          <p className="mt-3 text-sm lg:text-base text-pdblack/60 max-w-2xl mx-auto">
            From Standard Chartered to UltraTech, Singapore Post to Dubai World Trade Centre —
            global enterprises trust us to deploy production-grade AI agents.
          </p>
        </div>
      </div>

      <LogoRow logos={row1} direction="left" duration={55} testid="logo-row-1" />
      <div className="h-8" />
      <LogoRow logos={row2} direction="right" duration={65} testid="logo-row-2" />
    </section>
  );
}

function LogoRow({ logos, direction = "left", duration = 60, testid }) {
  const items = [...logos, ...logos, ...logos]; // triple for seamless loop
  const animateX =
    direction === "left" ? ["0%", "-33.333%"] : ["-33.333%", "0%"];

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        data-testid={testid}
        className="flex items-center gap-14 sm:gap-20 whitespace-nowrap"
        animate={{ x: animateX }}
        transition={{ ease: "linear", repeat: Infinity, duration }}
        style={{ width: "max-content" }}
      >
        {items.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            data-testid={`customer-logo-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="shrink-0 flex items-center justify-center h-20 sm:h-24 w-32 sm:w-40 group"
            title={c.name}
          >
            <img
              src={c.src}
              alt={c.name}
              className="max-h-full max-w-full object-contain select-none transition-all duration-300
                         grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
              draggable="false"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
