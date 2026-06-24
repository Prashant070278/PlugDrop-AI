import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DemoModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", interest: "voice-ai", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      toast.error("Please fill in name, email and company");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/demo-request`, form);
      setDone(true);
      toast.success("Demo request received. Our team will be in touch.");
      setTimeout(() => { setDone(false); onClose(); setForm({ name: "", email: "", company: "", phone: "", interest: "voice-ai", message: "" }); }, 1800);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pdblack/70 backdrop-blur-sm"
          onClick={onClose}
          data-testid="demo-modal"
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-white p-7 sm:p-8 shadow-2xl"
          >
            <button data-testid="demo-modal-close" onClick={onClose}
              className="absolute top-4 right-4 size-9 rounded-full hover:bg-pdblack/5 flex items-center justify-center">
              <X className="size-4" />
            </button>

            {done ? (
              <div className="text-center py-10">
                <CheckCircle2 className="mx-auto size-14 text-pdpurple" />
                <h3 className="mt-4 font-display text-2xl font-medium">We've got it.</h3>
                <p className="text-sm text-pdblack/60 mt-1">A PlugDrop solutions architect will reach out within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="text-xs uppercase tracking-[0.25em] text-pdpurple font-medium">Book a demo</div>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl font-medium text-pdblack leading-tight">Let's plug AI<br/>into your business.</h3>
                <p className="text-sm text-pdblack/60 mt-2">Tell us a bit about you. We'll match you with the right solutions team.</p>

                <form onSubmit={submit} className="mt-6 space-y-3" data-testid="demo-form">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input data-testid="demo-input-name" required placeholder="Full name" value={form.name} onChange={update("name")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                    <input data-testid="demo-input-email" required type="email" placeholder="Work email" value={form.email} onChange={update("email")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input data-testid="demo-input-company" required placeholder="Company" value={form.company} onChange={update("company")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                    <input data-testid="demo-input-phone" placeholder="Phone (optional)" value={form.phone} onChange={update("phone")}
                      className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition" />
                  </div>
                  <select data-testid="demo-input-interest" value={form.interest} onChange={update("interest")}
                    className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition bg-white">
                    <option value="voice-ai">Voice AI Agents</option>
                    <option value="multi-agent">Multi-Agent Systems</option>
                    <option value="automation">Workflow Automation</option>
                    <option value="integration">CRM / ERP Integration</option>
                    <option value="general">General Enquiry</option>
                  </select>
                  <textarea data-testid="demo-input-message" placeholder="What are you looking to automate?" rows={3} value={form.message} onChange={update("message")}
                    className="w-full rounded-xl border border-pdblack/15 px-4 py-3 text-sm outline-none focus:border-pdpurple focus:ring-2 focus:ring-pdpurple/20 transition resize-none" />

                  <button data-testid="demo-submit" type="submit" disabled={loading}
                    className="w-full rounded-full bg-pdblack hover:bg-pdpurple text-white py-3.5 font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                    {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                    {loading ? "Sending…" : "Request demo"}
                  </button>

                  <p className="text-[11px] text-pdblack/40 text-center pt-1">
                    By submitting you agree to be contacted about your enquiry. We respect your data.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
