export const ASSETS = {
  mascot: "https://customer-assets.emergentagent.com/job_0cd876a0-a865-4d97-862d-50a9b26ad778/artifacts/89py54a2_Plug%20Avatar.png",
  // New cinematic 3D AI render for hero (different from previous)
  heroAvatar: "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=900&q=80",
  heroAvatarAlt: "https://images.pexels.com/photos/8728285/pexels-photo-8728285.jpeg?auto=compress&cs=tinysrgb&w=900",
  // Digital avatars for agent gallery (rendered AI-character feel via duotone in CSS)
  agentAva:    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=80",
  agentSophia: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
  agentIris:   "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80",
  agentNeo:    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  agentAtlas:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
  neuralBg: "https://images.pexels.com/photos/17483871/pexels-photo-17483871.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
};

export const AGENTS = [
  { name: "Ava",    role: "Sales Agent",      img: ASSETS.agentAva,    desc: "Qualifies leads, handles enquiries, books meetings." },
  { name: "Sophia", role: "Support Agent",    img: ASSETS.agentSophia, desc: "Resolves tickets across voice, chat & WhatsApp." },
  { name: "Iris",   role: "Compliance Agent", img: ASSETS.agentIris,   desc: "Monitors conversations for QA & regulatory adherence." },
  { name: "Neo",    role: "Research Agent",   img: ASSETS.agentNeo,    desc: "Synthesises data and produces actionable briefs." },
  { name: "Atlas",  role: "Operations Agent", img: ASSETS.agentAtlas,  desc: "Runs workflows across CRM, ERP and telephony." },
];

export const INDUSTRIES = [
  { name: "Manufacturing", challenge: "Production forecasting & demand planning", solution: "Predictive AI agents on SAP/Dynamics", roi: "18% ↑ throughput" },
  { name: "Education",     challenge: "Admissions enquiries at scale",            solution: "Admission Voice + WhatsApp Agent",     roi: "3x application rate" },
  { name: "Real Estate",   challenge: "Lead qualification & site visits",         solution: "Voice AI + CRM sync",                  roi: "42% ↑ qualified leads" },
  { name: "Construction",  challenge: "Vendor onboarding & approvals",            solution: "Partner Onboarding + CapEx Agent",     roi: "60% faster cycles" },
  { name: "FMCG",          challenge: "Field & store coverage",                   solution: "Store Delivery + DMS Automations",     roi: "25% ↑ coverage" },
  { name: "Logistics",     challenge: "Order tracking & customer queries",        solution: "Voice + WhatsApp tracking agents",     roi: "70% deflection" },
  { name: "Insurance",     challenge: "Policy enquiries, renewals, claims",       solution: "Insurance Voice Agent",                roi: "4.8 CSAT achieved" },
  { name: "Retail",        challenge: "Order status, returns, support",           solution: "Conversational AI on existing CRM",    roi: "50% ↓ AHT" },
];

// Integration logos — jsdelivr Simple Icons (monochrome SVGs colored via CSS mask)
const SI = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
export const INTEGRATIONS = [
  { name: "Microsoft Dynamics",  slug: "dynamics365",      color: "#002050", logo: SI("dynamics365") },
  { name: "Salesforce",          slug: "salesforce",       color: "#00A1E0", logo: SI("salesforce") },
  { name: "HubSpot",             slug: "hubspot",          color: "#FF7A59", logo: SI("hubspot") },
  { name: "SAP",                 slug: "sap",              color: "#0FAAFF", logo: SI("sap") },
  { name: "Oracle",              slug: "oracle",           color: "#F80000", logo: SI("oracle") },
  { name: "WhatsApp",            slug: "whatsapp",         color: "#25D366", logo: SI("whatsapp") },
  { name: "Twilio",              slug: "twilio",           color: "#F22F46", logo: SI("twilio") },
  { name: "Microsoft Azure",     slug: "microsoftazure",   color: "#0078D4", logo: SI("microsoftazure") },
  { name: "OpenAI",              slug: "openai",           color: "#000000", logo: SI("openai") },
  { name: "Power Automate",      slug: "powerautomate",    color: "#0066FF", logo: SI("powerautomate") },
  { name: "Slack",               slug: "slack",            color: "#4A154B", logo: SI("slack") },
  { name: "Zapier",              slug: "zapier",           color: "#FF4A00", logo: SI("zapier") },
];

export const BYOP = [
  { label: "CRM",       full: "Bring Your Own CRM",       desc: "Plug into existing customer data.",      slug: "salesforce" },
  { label: "ERP",       full: "Bring Your Own ERP",       desc: "Access business systems securely.",      slug: "sap" },
  { label: "Workflow",  full: "Bring Your Own Workflow",  desc: "Wrap your processes with AI.",           slug: "zapier" },
  { label: "API",       full: "Bring Your Own API",       desc: "Connect anything via APIs.",             slug: "postman" },
  { label: "Telephony", full: "Bring Your Own Telephony", desc: "Use your call infrastructure.",          slug: "twilio" },
  { label: "Interface", full: "Bring Your Own Interface", desc: "Keep your existing UI.",                 slug: "figma" },
];

export const METRICS = [
  { value: 20, suffix: "+", label: "Projects Delivered" },
  { value: 30, suffix: "+", label: "AI Agents Deployed" },
  { value: 8,  suffix: "",  label: "Countries Served" },
  { value: 12, suffix: "+", label: "Enterprise Customers" },
  { value: 4.8,suffix: "",  label: "Average CSAT", decimals: 1 },
];
