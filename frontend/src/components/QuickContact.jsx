import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, CheckCircle2, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QuickContact() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Name, email and phone are all required so we can reach you back.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/demo-request`, {
        name: form.name,
        email: form.email,
        company: "(quick callback)",
        phone: form.phone,
        interest: "callback",
        message: "QUICK CALLBACK REQUEST — user is in a hurry. Please call back asap.",
      });
      setDone(true);
      toast.success("Got it. Our team will call you back shortly.");
      setTimeout(() => { setDone(false); setOpen(false); setForm({ name: "", phone: "", email: "" }); }, 1800);
    } catch (err) {
      toast.error("Couldn't send — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        data-testid="quick-contact-trigger"
        onClick={() => setOpen(true)}
        aria-label="Get a quick callback"
        className="fixed bottom-6 left-6 z-30 group inline-flex items-center gap-2 rounded-full bg-pdpurple hover:bg-pdpurple-deep text-white pl-3 pr-4 py-2.5 shadow-[0_10px_30px_rgba(139,92,246,0.4)] transition-all"
      >
        <span className="relative size-7 rounded-full bg-white text-pdpurple flex items-center justify-center">
          <Phone className="size-3.5" />
          <span className="absolute inset-0 rounded-full bg-pdpurple/40 ping-slow" />
        </span>
        <span className="text-xs font-semibold">In a hurry? Get a callback</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            data-testid="quick-contact-modal"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-pdblack/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl"
            >
              <button data-testid="quick-contact-close" onClick={() => setOpen(false)}
                className="absolute top-3 right-3 size-8 rounded-full hover:bg-pdblack/5 flex items-center justify-center">
                <X className="size-4" />
              </button>

              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto size-12 text-pdpurple" />
                  <h3 className="mt-3 font-display text-2xl font-medium">We'll call you back.</h3>
                  <p className="text-sm text-pdblack/60 mt-1">Our team will reach out within the hour.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-pdpurple font-semibold">
                    <Clock className="size-3" /> In a hurry?
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-medium text-pdblack leading-tight">
                    Leave your number.<br/>We'll call <span className="text-gradient-purple">you</span>.
                  </h3>
                  <p className="text-sm text-pdblack/60 mt-2">
                    Drop your name and phone — a PlugDrop team member will call back with the details you need. No long forms.
                  </p>

                  <form onSubmit={submit} className="mt-5 space-y-3" data-testid="quick-contact-form">
                    <input
                      data-testid="quick-input-name" required placeholder="Your name *" value={form.name} onChange={update("name")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                    <input
                      data-testid="quick-input-email" required type="email" placeholder="Email *" value={form.email} onChange={update("email")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                    <input
                      data-testid="quick-input-phone" required type="tel" placeholder="Phone (with country code) *" value={form.phone} onChange={update("phone")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />

                    <button data-testid="quick-submit" type="submit" disabled={loading}
                      className="w-full rounded-full bg-pdpurple hover:bg-pdpurple-deep text-white py-3 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}
                      {loading ? "Sending…" : "Call me back"}
                    </button>
                    <p className="text-[11px] text-pdblack/40 text-center pt-1">
                      No spam — we only call to help.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
