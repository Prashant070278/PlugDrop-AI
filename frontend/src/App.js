import { useState } from "react";
import { Toaster } from "sonner";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import VoiceExperience from "./components/VoiceExperience";
import MultiAgent from "./components/MultiAgent";
import Industries from "./components/Industries";
import BYOPFramework from "./components/BYOPFramework";
import Metrics from "./components/Metrics";
import AgentGallery from "./components/AgentGallery";
import LiveConversation from "./components/LiveConversation";
import CustomerLogos from "./components/CustomerLogos";
import WhyPlugDrop from "./components/WhyPlugDrop";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingMascot from "./components/FloatingMascot";
import DemoModal from "./components/DemoModal";
import QuickContact from "./components/QuickContact";
import "./App.css";

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [talkSignal, setTalkSignal] = useState(0);
  const openDemo = () => setDemoOpen(true);
  const talkToAgent = () => setTalkSignal((s) => s + 1);

  return (
    <div className="App relative bg-white">
      <Toaster position="top-center" richColors />
      <Navigation onBookDemo={openDemo} />
      <main>
        <Hero onBookDemo={openDemo} onTalkToAgent={talkToAgent} />
        {/* Agent Gallery now sits where Voice Experience was, and Why follows it */}
        <AgentGallery />
        <WhyPlugDrop onBookDemo={openDemo} />
        <MultiAgent onBookDemo={openDemo} />
        <Industries />
        <BYOPFramework />
        <Metrics />
        {/* Voice Experience moved down to where Agent Gallery was */}
        <VoiceExperience onTalkToAgent={talkToAgent} />
        <CustomerLogos />
        <Testimonials />
        <LiveConversation openSignal={talkSignal} />
        <FAQ />
      </main>
      <Footer onBookDemo={openDemo} />
      <FloatingMascot onClick={talkToAgent} />
      <QuickContact />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
