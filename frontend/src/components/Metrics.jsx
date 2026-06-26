import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { METRICS } from "../lib/constants";

function Counter({ value, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {decimals ? n.toFixed(decimals) : Math.round(n)}{suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <section data-testid="metrics-section" className="relative py-24 bg-pdblack overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark opacity-80" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-4">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              data-testid={`metric-${i}`}
              className="text-center lg:text-left">
              <div className="font-display text-5xl lg:text-6xl font-medium text-white tracking-tighter">
                {m.text
                  ? <span>{m.text}</span>
                  : <Counter value={m.value} suffix={m.suffix} decimals={m.decimals || 0} />}
              </div>
              <div className="mt-2 text-sm text-white/60">{m.label}</div>
              <div className="mt-3 h-px bg-gradient-to-r from-pdpurple/60 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
