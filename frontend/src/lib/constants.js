export const ASSETS = {
  mascot: "https://customer-assets.emergentagent.com/job_0cd876a0-a865-4d97-862d-50a9b26ad778/artifacts/89py54a2_Plug%20Avatar.png",
  heroAvatar: "https://images.unsplash.com/photo-1708616748538-bdd66d6a9e25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxmdXR1cmlzdGljJTIwcG9ydHJhaXQlMjB3b21hbiUyMG5lb24lMjBsaWdodGluZ3xlbnwwfHx8fDE3ODIzMTA3Mzl8MA&ixlib=rb-4.1.0&q=85",
  agentAva: "https://images.pexels.com/photos/8108560/pexels-photo-8108560.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  agentSophia: "https://images.unsplash.com/photo-1533461502717-83546f485d24?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwcG9ydHJhaXQlMjB3b21hbiUyMG5lb24lMjBsaWdodGluZ3xlbnwwfHx8fDE3ODIzMTA3Mzl8MA&ixlib=rb-4.1.0&q=85",
  agentIris: "https://images.unsplash.com/photo-1708616748538-bdd66d6a9e25?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHw0fHxmdXR1cmlzdGljJTIwcG9ydHJhaXQlMjB3b21hbiUyMG5lb24lMjBsaWdodGluZ3xlbnwwfHx8fDE3ODIzMTA3Mzl8MA&ixlib=rb-4.1.0&q=85",
  agentNeo: "https://images.pexels.com/photos/8108327/pexels-photo-8108327.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  agentAtlas: "https://images.pexels.com/photos/8726478/pexels-photo-8726478.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  neuralBg: "https://images.pexels.com/photos/17483871/pexels-photo-17483871.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const AGENTS = [
  { name: "Ava",    role: "Sales Agent",      img: ASSETS.agentAva,    desc: "Qualifies leads, handles enquiries, books meetings.",     accent: "from-fuchsia-500/30 to-purple-500/10" },
  { name: "Sophia", role: "Support Agent",    img: ASSETS.agentSophia, desc: "Resolves tickets across voice, chat & WhatsApp.",         accent: "from-violet-500/30 to-indigo-500/10" },
  { name: "Iris",   role: "Compliance Agent", img: ASSETS.agentIris,   desc: "Monitors conversations for QA & regulatory adherence.",   accent: "from-purple-500/30 to-fuchsia-500/10" },
  { name: "Neo",    role: "Research Agent",   img: ASSETS.agentNeo,    desc: "Synthesises data and produces actionable briefs.",        accent: "from-indigo-500/30 to-purple-500/10" },
  { name: "Atlas",  role: "Operations Agent", img: ASSETS.agentAtlas,  desc: "Runs workflows across CRM, ERP and telephony.",           accent: "from-purple-500/25 to-violet-500/10" },
];

export const INDUSTRIES = [
  { name: "Manufacturing", challenge: "Production forecasting & demand planning", solution: "Predictive AI agents on SAP/Dynamics", roi: "18% ↑ throughput" },
  { name: "Education",     challenge: "Admissions enquiries at scale",            solution: "Admission Voice + WhatsApp Agent",     roi: "3x application rate" },
  { name: "Real Estate",   challenge: "Lead qualification & site visits",         solution: "Voice AI + CRM sync",                  roi: "42% ↑ qualified leads" },
  { name: "Construction",  challenge: "Vendor onboarding & approvals",            solution: "Partner Onboarding + CapEx Agent",     roi: "60% faster cycles" },
  { name: "FMCG",          challenge: "Field & store coverage",                   solution: "Store Delivery + DMS Automations",     roi: "25% ↑ coverage" },
  { name: "Logistics",     challenge: "Order tracking & customer queries",        solution: "Voice + WhatsApp tracking agents",     solutionFallback: "", roi: "70% deflection" },
  { name: "Insurance",     challenge: "Policy enquiries, renewals, claims",       solution: "Insurance Voice Agent",                roi: "4.8 CSAT achieved" },
  { name: "Retail",        challenge: "Order status, returns, support",           solution: "Conversational AI on existing CRM",    roi: "50% ↓ AHT" },
];

export const INTEGRATIONS = [
  "Microsoft Dynamics", "Salesforce", "HubSpot", "SAP", "Oracle",
  "WhatsApp", "Twilio", "Azure AI", "OpenAI", "Power Platform",
  "Service Bus", "Custom APIs",
];

export const BYOP = [
  { label: "Bring Your Own CRM",      desc: "Plug into existing customer data." },
  { label: "Bring Your Own ERP",      desc: "Access business systems securely." },
  { label: "Bring Your Own Workflow", desc: "Wrap your processes with AI." },
  { label: "Bring Your Own API",      desc: "Connect anything via APIs." },
  { label: "Bring Your Own Telephony",desc: "Use your call infrastructure." },
  { label: "Bring Your Own Interface",desc: "Keep your existing UI." },
];

export const METRICS = [
  { value: 20, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "AI Agents Deployed" },
  { value: 8,  suffix: "",  label: "Countries Served" },
  { value: 12, suffix: "+", label: "Enterprise Customers" },
  { value: 4.8,suffix: "",  label: "Average CSAT", decimals: 1 },
];
