import { motion } from "framer-motion";
import { ASSETS } from "../lib/constants";
import { useEffect, useState } from "react";

export default function FloatingMascot({ onClick }) {
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const tips = [
    "Need help? I'm Plug — your guide.",
    "Want to talk to an AI agent?",
    "Curious about our Multi-Agent stack?",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.7, y: show ? 0 : 30 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="fixed bottom-6 right-6 z-30 pointer-events-none"
      data-testid="floating-mascot"
    >
      <div className="relative pointer-events-auto group">
        {tip && (
          <div className="absolute right-full mr-3 bottom-3 whitespace-nowrap glass-light rounded-2xl px-3.5 py-2 text-xs font-medium text-pdblack shadow-lg">
            {tip}
          </div>
        )}
        <button
          data-testid="mascot-button"
          onMouseEnter={() => setTip(tips[Math.floor(Math.random() * tips.length)])}
          onMouseLeave={() => setTip("")}
          onClick={onClick}
          className="relative float-soft"
          aria-label="Talk to Plug"
        >
          <span className="absolute inset-0 rounded-full bg-pdpurple/40 blur-xl scale-110" />
          <span className="absolute inset-0 rounded-full bg-pdpurple/30 ping-slow" />
          <img
            src={ASSETS.mascot}
            alt="Plug mascot"
            className="relative size-20 sm:size-24 object-contain drop-shadow-[0_10px_30px_rgba(139,92,246,0.35)]"
          />
        </button>
      </div>
    </motion.div>
  );
}
