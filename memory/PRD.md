# PlugDrop.ai Website — PRD

## Original Problem Statement
Build a marketing website for PlugDrop.ai (enterprise AI deployment company — Voice Agents, Multi-Agent AI, BYOP framework). Light purple / black / white futuristic theme. AI agent interacts with visitors (voice + chat). Chat should look like a real person conversation, not a chatbot widget. Realistic AI avatars (TryEva.ai style) + cute Plug mascot as floating guide.

## Architecture
- **Frontend**: React 19 + Tailwind + Framer Motion + shadcn/ui + sonner toasts
- **Backend**: FastAPI + Motor (MongoDB)
- **Fonts**: Bricolage Grotesque (display) + Manrope (body) + JetBrains Mono
- **No 3rd-party LLM** — chat uses scripted keyword knowledge base
- **No email** — demo requests stored in MongoDB only

## Personas
1. Enterprise buyer (CXO, COO) — wants ROI proof + integration assurance
2. Solutions head / Head of Digital — explores BYOP framework + use cases
3. Founder / SMB — books a demo to evaluate

## Core Requirements (Static)
- Hero with realistic avatar + voice/chat dual CTA
- No traditional chatbot widget
- Multi-agent orchestration visualization
- BYOP framework, integration ecosystem
- Industry verticals, agent gallery
- WhatsApp/iMessage-style live chat
- Demo booking form
- Floating Plug mascot guide

## Implemented (2026-06-24)
- Navigation (sticky, glass, mobile menu)
- Hero (avatar, animated speech card, voice waveform, CTAs)
- Voice Experience (large mic visualizer, transcript cards, use-case chips)
- Multi-Agent (dark section, animated orchestration diagram, 6 specialist nodes)
- Industries (8 hover-reveal cards)
- BYOP Framework (6 BYOP cards + central AI Core + integration logos)
- Metrics (animated counters: 20+, 30+, 8, 12+, 4.8 CSAT)
- Agent Gallery (Ava, Sophia, Iris, Neo, Atlas)
- Live Conversation (split light/dark, real /api/chat backed scripted Q&A)
- Footer (India + Canada presence, contact)
- Floating Mascot (Plug avatar, follows scroll, tooltip)
- Demo Modal (form → MongoDB)
- Backend: /api/chat scripted KB, /api/demo-request CRUD
- All data-testids in place; 100% tests pass

## Backlog (Prioritised)
- **P1**: Real-time voice agent (OpenAI Whisper STT + GPT + TTS) — requires Emergent LLM key
- **P1**: Resend email notifications on demo submission
- **P1**: Replace placeholder testimonials/case studies with real customer logos
- **P2**: AI-powered chat (Claude/GPT) replacing scripted KB
- **P2**: Admin dashboard to view demo requests (currently DB only)
- **P2**: Calendly/Cal.com integration for self-scheduling
- **P3**: Multi-language support (Hindi for India market)
- **P3**: Blog / Resources section
- **P3**: Pricing calculator

## Next Tasks
- Gather real customer logos
- Decide on voice provider (ElevenLabs vs OpenAI TTS)
- Set up Resend domain
