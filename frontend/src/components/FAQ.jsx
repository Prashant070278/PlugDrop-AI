import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles } from "lucide-react";
import { FAQS } from "../lib/content";

export default function FAQ() {
  const [open, setOpen] = useState(0);

  // FAQPage JSON-LD for SEO + GEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" data-testid="faq-section" className="relative py-24 lg:py-32 bg-white overflow-hidden" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="absolute -top-32 left-0 size-[500px] rounded-full bg-pdpurple/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-0 size-[500px] rounded-full bg-pdpurple-soft/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">FAQs</span>
          <h2 id="faq-heading" className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
            Everything you need to know<br/>about <span className="text-gradient-purple">PlugDrop AI Agents.</span>
          </h2>
        </div>

        <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.article
                key={i}
                itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className={`rounded-2xl border transition-all ${isOpen ? "border-pdpurple bg-pdpurple-bg/50" : "border-pdpurple/15 bg-white hover:border-pdpurple/40"}`}
                data-testid={`faq-item-${i}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  data-testid={`faq-trigger-${i}`}
                >
                  <span className={`size-8 rounded-lg shrink-0 flex items-center justify-center transition-colors ${isOpen ? "bg-pdpurple text-white" : "bg-pdpurple/10 text-pdpurple"}`}>
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                  <h3 itemProp="name" className="flex-1 font-display text-base sm:text-lg font-medium text-pdblack">{f.q}</h3>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                      id={`faq-answer-${i}`}
                      className="overflow-hidden"
                    >
                      <p itemProp="text" className="px-5 pb-5 pl-[68px] text-sm sm:text-base text-pdblack/75 leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a href="#agents" className="inline-flex items-center gap-2 text-sm text-pdpurple font-medium hover:underline">
            <Sparkles className="size-4" /> Explore our AI Agent gallery →
          </a>
        </div>
      </div>
    </section>
  );
}
