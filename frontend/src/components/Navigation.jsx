import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navigation({ onBookDemo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Solutions",  href: "#solutions" },
    { label: "Multi-Agent", href: "#multi-agent" },
    { label: "Framework",  href: "#byop" },
    { label: "Industries", href: "#industries" },
    { label: "Agents",     href: "#agents" },
  ];

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className={`mx-auto max-w-7xl px-6 lg:px-10 ${scrolled ? "" : ""}`}>
        <div className={`flex items-center justify-between rounded-full px-5 lg:px-7 py-3 transition-all ${scrolled ? "glass-light shadow-[0_8px_30px_rgba(139,92,246,0.08)]" : "bg-transparent"}`}>
          <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-pdblack flex items-center justify-center">
              <span className="font-display text-white font-semibold text-lg leading-none">p</span>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-pdblack">
              Plug<span className="text-pdpurple">Drop</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g,"-")}`}
                className="px-4 py-2 text-sm font-medium text-pdblack/70 hover:text-pdpurple transition-colors rounded-full"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              data-testid="nav-book-demo"
              onClick={onBookDemo}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-pdblack text-white px-5 py-2.5 text-sm font-medium hover:bg-pdpurple transition-colors"
            >
              Book a Demo
            </button>
            <button
              data-testid="nav-mobile-toggle"
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-full hover:bg-pdpurple/10"
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden mt-3 rounded-3xl glass-light p-4 space-y-2"
            >
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                   className="block px-4 py-3 rounded-2xl text-pdblack font-medium hover:bg-pdpurple/10">
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); onBookDemo(); }}
                className="w-full mt-2 rounded-full bg-pdblack text-white py-3 font-medium"
              >
                Book a Demo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
