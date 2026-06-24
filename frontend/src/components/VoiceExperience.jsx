import { motion } from "framer-motion";
import { Mic, Radio } from "lucide-react";

const USE_CASES = [
  "Lead Qualification", "Customer Service", "Admissions",
  "Sales Enquiries", "Appointment Scheduling", "Collections", "Order Tracking",
];

export default function VoiceExperience({ onTalkToAgent }) {
  return (
    <section id="solutions" data-testid="voice-experience" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pdpurple/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Voice AI Experience</span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-medium leading-[1.02] text-pdblack">
              Speak naturally.<br/>Let <span className="text-gradient-purple">AI</span> handle the rest.
            </h2>
            <p className="text-base lg:text-lg leading-relaxed text-pdblack/70 max-w-lg">
              Production-grade voice agents for inbound and outbound calls — fluent across languages,
              connected to your CRM, telephony and workflows. Built on the BYOP framework.
            </p>

            <button
              data-testid="voice-cta"
              onClick={onTalkToAgent}
              className="inline-flex items-center gap-2 rounded-full bg-pdblack text-white px-6 py-3.5 text-sm font-medium hover:bg-pdpurple transition-colors"
            >
              <Mic className="size-4" />
              Hear it live
            </button>

            <div className="flex flex-wrap gap-2 pt-4">
              {USE_CASES.map((u) => (
                <span key={u} data-testid={`use-case-${u.toLowerCase().replace(/\s/g,"-")}`}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-full bg-pdpurple/10 text-pdpurple border border-pdpurple/15">
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Big mic visualizer */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-square max-w-[560px] mx-auto">
              <div className="absolute inset-10 rounded-full border border-pdpurple/20" />
              <div className="absolute inset-20 rounded-full border border-pdpurple/15" />
              <div className="absolute inset-32 rounded-full border border-pdpurple/10" />

              <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full"
                style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(139,92,246,0.35) 90%, transparent 100%)" }}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-pdpurple/30 ping-slow" />
                  <span className="absolute inset-0 rounded-full bg-pdpurple/25 ping-slow" style={{animationDelay: "0.7s"}} />
                  <button
                    data-testid="voice-mic-big"
                    onClick={onTalkToAgent}
                    className="relative size-32 rounded-full bg-pdblack hover:bg-pdpurple text-white flex items-center justify-center transition-colors glow-purple"
                  >
                    <Mic className="size-12" />
                  </button>
                </div>
              </div>

              {/* Floating transcript card */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="absolute -bottom-2 -left-2 lg:bottom-4 lg:left-0 glass-light rounded-2xl p-4 max-w-[240px] shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-xs text-pdblack/60">
                  <Radio className="size-3.5 text-pdpurple" />
                  Live transcript
                </div>
                <p className="text-sm text-pdblack/80 leading-relaxed">"I'd like to know more about your admissions agent."</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="absolute -top-2 -right-2 lg:top-6 lg:right-0 glass-light rounded-2xl p-4 max-w-[240px] shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-xs text-pdblack/60">
                  <span className="size-2 rounded-full bg-pdpurple animate-pulse" />
                  Agent reply
                </div>
                <p className="text-sm text-pdblack/80 leading-relaxed">"Of course. May I know which programme you're enquiring about?"</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
