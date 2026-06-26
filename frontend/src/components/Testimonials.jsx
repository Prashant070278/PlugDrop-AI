import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "../lib/content";

// Deterministic palette for letter avatars
function colorFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h} 70% 55%), hsl(${(h + 50) % 360} 70% 45%))`;
}

export default function Testimonials() {
  // Review aggregate schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PlugDrop AI",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: TESTIMONIALS.length,
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
    })),
  };

  return (
    <section id="testimonials" data-testid="testimonials" className="relative py-24 lg:py-32 bg-pdpurple-bg overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 size-[500px] rounded-full bg-pdpurple/15 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Voices from the field</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack max-w-3xl mx-auto">
            Leaders building the<br/><span className="text-gradient-purple">AI-powered enterprise.</span>
          </h2>
          <p className="mt-4 text-base lg:text-lg text-pdblack/65 max-w-2xl mx-auto">
            Real outcomes from CXOs, Directors and Heads of Digital across Manufacturing, Retail, BFSI, Healthcare,
            Real Estate and more.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              itemScope itemType="https://schema.org/Review"
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="break-inside-avoid mb-5 rounded-3xl bg-white border border-pdpurple/15 p-6 shadow-[0_6px_24px_rgba(139,92,246,0.06)] hover:border-pdpurple/40 hover:shadow-[0_12px_30px_rgba(139,92,246,0.12)] transition"
              data-testid={`testimonial-${i}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, k) => <Star key={k} className="size-3.5 text-pdpurple fill-pdpurple" />)}
                </div>
                <Quote className="size-5 text-pdpurple/40" />
              </div>
              <blockquote itemProp="reviewBody" className="text-sm lg:text-base text-pdblack/85 leading-relaxed mb-5">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3" itemScope itemProp="author" itemType="https://schema.org/Person">
                <div className="size-10 rounded-xl flex items-center justify-center font-display text-sm font-semibold text-white shrink-0"
                     style={{ background: colorFor(t.name) }} aria-hidden>
                  {t.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-sm font-medium text-pdblack" itemProp="name">{t.name}</div>
                  <div className="text-xs text-pdblack/55">
                    <span itemProp="jobTitle">{t.title}</span>
                    <span className="text-pdpurple"> • {t.industry}</span>
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
