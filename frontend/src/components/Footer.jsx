import { Mail, MapPin, Globe, ArrowUpRight } from "lucide-react";

export default function Footer({ onBookDemo }) {
  return (
    <footer data-testid="site-footer" className="relative bg-pdblack text-white pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-dark opacity-90" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="size-9 rounded-xl bg-pdpurple flex items-center justify-center">
                <span className="font-display text-white font-semibold text-lg leading-none">p</span>
              </div>
              <span className="font-display text-xl font-semibold tracking-tight">
                Plug<span className="text-pdpurple-soft">Drop</span>
              </span>
            </div>
            <p className="text-white/70 max-w-md leading-relaxed">
              Enterprise AI deployment. Voice agents, multi-agent orchestration and digital transformation —
              built to plug into the systems you already trust.
            </p>
            <button
              data-testid="footer-book-demo"
              onClick={onBookDemo}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-pdpurple hover:bg-pdpurple-soft text-white px-6 py-3 text-sm font-medium transition-colors"
            >
              Schedule AI Consultation
              <ArrowUpRight className="size-4" />
            </button>
          </div>

          <div className="lg:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-pdpurple-soft mb-4">Global Presence</div>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-pdpurple-soft" />
                <div>
                  <div className="font-medium text-white">India</div>
                  <div className="text-white/60 text-xs leading-relaxed">C12, 4th Floor Innov8, Plot 146, Sec 44, Gurgaon · FF24 Omaxe Square, Jasola, New Delhi</div>
                </div>
              </li>
              <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-pdpurple-soft" />
                <div>
                  <div className="font-medium text-white">Canada</div>
                  <div className="text-white/60 text-xs">Global delivery partner</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-xs uppercase tracking-[0.2em] text-pdpurple-soft mb-4">Contact</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80"><Globe className="size-4 text-pdpurple-soft" /> www.plugdrop.ai</li>
              <li className="flex items-center gap-2 text-white/80"><Mail className="size-4 text-pdpurple-soft" /> ps@plugdrop.ai</li>
            </ul>

            <div className="mt-6 text-xs uppercase tracking-[0.2em] text-pdpurple-soft mb-3">Explore</div>
            <ul className="grid grid-cols-2 gap-2 text-sm text-white/70">
              <li><a href="#solutions" className="hover:text-white">Voice AI</a></li>
              <li><a href="#multi-agent" className="hover:text-white">Multi-Agent</a></li>
              <li><a href="#byop" className="hover:text-white">BYOP</a></li>
              <li><a href="#industries" className="hover:text-white">Industries</a></li>
              <li><a href="#agents" className="hover:text-white">Agents</a></li>
              <li><a href="#live-conversation" className="hover:text-white">Live Chat</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <div>© {new Date().getFullYear()} PlugDrop.ai · AI Agents & Digital Transformation</div>
          <div className="font-mono">Built for the future of enterprise AI.</div>
        </div>
      </div>
    </footer>
  );
}
