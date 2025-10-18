import React, { useRef } from 'react';
import ContactSection from './ContactSection';

// --- Hero Section ---
const HeroSection: React.FC = () => (
  <section className="mx-auto max-w-7xl px-20 py-6 md:py-10 flex flex-col items-center text-center">
    <img
      id="hero-logo"
      src="https://i.ibb.co/B5g68K1S/UTS-Logo-Main-Light-Crop.png"
      alt="UnityTech Solutions Logo"
      className="mx-auto h-45 w-auto mb-6 opacity-0"
      style={{ willChange: 'transform, opacity' }}
    />
    <h1 data-reveal="hero" className="text-4xl md:text-6xl font-extrabold leading-tight font-ox">
      All‑in‑one <span className="text-brand-300">IT Solutions</span> for private businesses
    </h1>
    <div data-reveal="hero" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>New experience in development</span>
    </div>
    <div data-reveal="hero" className="relative w-full max-w-2xl h-1 mt-6">
      <div className="laser-scan animate-pulsebar" aria-hidden="true"></div>
    </div>
    <div data-reveal="hero" className="mt-10 w-full max-w-3xl">
      <svg viewBox="0 0 200 100" className="w-full" aria-hidden="true">
        <defs>
          <linearGradient id="traceGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#00eaff"/>
            <stop offset="50%" stopColor="#27a0ff"/>
            <stop offset="100%" stopColor="#1976ff"/>
          </linearGradient>
        </defs>
        <path d="M 0,50 C 0,5 50,5 50,50 C 50,95 100,95 100,50 C 100,5 150,5 150,50 C 150,95 200,95 200,50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
        <path d="M 0,50 C 0,5 50,5 50,50 C 50,95 100,95 100,50 C 100,5 150,5 150,50 C 150,95 200,95 200,50" fill="none" stroke="url(#traceGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="24 80">
          <animate attributeName="stroke-dashoffset" values="200;0" dur="4s" repeatCount="indefinite"/>
        </path>
      </svg>
    </div>
    <p data-reveal="hero" className="mt-4 max-w-2xl text-slate-300/90">
      From websites to marketing, video, and security—we manage your entire technology stack. A redesigned site is on the way. In the meantime, get a fast, free assessment.
    </p>
    <div data-reveal="hero" className="mt-8 flex flex-col sm:flex-row gap-4">
      <a href="#contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-brand-500 hover:bg-brand-600 transition shadow-glow btn-neon">
        Request a Consult
      </a>
      <a href="#services" className="inline-flex items-center justify-center rounded-xl px-5 py-3 border border-white/10 hover:bg-white/5 transition btn-neon">
        Explore Capabilities
      </a>
    </div>
    <div data-reveal="hero" className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
      <div className="glass-dark neon-card rounded-xl p-4 text-left tilt">
        <p className="text-sm text-slate-300"><span className="font-semibold text-white">Full‑stack delivery</span> — web, cloud, security & creative.</p>
      </div>
      <div className="glass-dark neon-card rounded-xl p-4 text-left tilt">
        <p className="text-sm text-slate-300"><span className="font-semibold text-white">Rapid response</span> — proactive monitoring & support.</p>
      </div>
      <div className="glass-dark neon-card rounded-xl p-4 text-left tilt">
        <p className="text-sm text-slate-300"><span className="font-semibold text-white">Privacy‑first</span> — minimal data collection, clear consent.</p>
      </div>
    </div>
  </section>
);


// --- About Section ---
const AboutSection: React.FC = () => (
  <section id="about" className="relative mx-auto max-w-7xl px-6 pb-6">
    <div className="grid lg:grid-cols-2 gap-6 items-stretch">
      <div data-reveal="card" className="glass rounded-2xl p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold font-ox">Who we are</h2>
        <p className="mt-3 text-slate-300">
          UnityTech Solutions is a boutique technology partner. We embed with owners and operations teams to build and manage the digital backbone of the business—reliably, securely, and beautifully.
        </p>
        <ul className="mt-4 space-y-2 text-slate-300">
          <li>• Fractional CTO & ongoing support</li>
          <li>• Modern web & ecommerce builds</li>
          <li>• Security hardening & compliance guidance</li>
          <li>• Marketing systems, analytics & creative</li>
        </ul>
      </div>
      <div data-reveal="card" className="glass rounded-2xl p-6 md:p-10">
        <h3 className="text-xl md:text-2xl font-semibold font-ox">Site Status</h3>
        <p className="mt-3 text-slate-300">Our new site is in active development. Expect a phased rollout with live case studies and a client dashboard.</p>
        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Phase 1</p>
            <p className="text-lg font-semibold">Splash + Intake</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Phase 2</p>
            <p className="text-lg font-semibold">Services + Work</p>
          </div>
          <div className="rounded-xl border border-white/10 p-4">
            <p className="text-sm text-slate-400">Phase 3</p>
            <p className="text-lg font-semibold">Client Portal</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);


// --- Services Section ---
const services = [
  { title: "Web & Ecommerce", description: "Next‑gen sites, SEO, performance, accessibility, Shopify/Headless.", tags: "• JAMstack • SSR • CI/CD" },
  { title: "Security & Infra", description: "Hardening, backups, monitoring, Zero‑Trust, SSO/MFA rollouts.", tags: "• Cloud • Compliance • DR" },
  { title: "Marketing Ops", description: "Funnels, automation, analytics, CRM/CDP integrations.", tags: "• GA4 • Tagging • CDP" },
  { title: "Creative & Video", description: "Brand systems, motion graphics, product videos & edits.", tags: "• Post • Color • SFX" },
  { title: "Apps & Automation", description: "Internal tools, integrations, AI assistants, workflow automation.", tags: "• GPT • Firebase • n8n" },
  { title: "Support & Advisory", description: "Fractional CTO, vendor management, tech due diligence.", tags: "• SLA • Roadmaps • Audits" },
];

const ServicesSection: React.FC = () => (
  <section id="services" className="mx-auto max-w-7xl px-6 py-12">
    <div data-reveal="up">
      <h2 className="text-center text-2xl md:text-3xl font-extrabold font-ox">Capabilities</h2>
      <p className="mt-3 text-center text-slate-300 max-w-2xl mx-auto">End‑to‑end solutions tailored to your industry and stage.</p>
    </div>
    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-container>
      {services.map((service, index) => (
        <article key={index} data-reveal="service" className="group glass-dark neon-card rounded-2xl p-6 hover:shadow-glow transition neon-border tilt">
          <h3 className="text-lg font-semibold">{service.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{service.description}</p>
          <div className="mt-3 text-xs text-slate-400">{service.tags}</div>
        </article>
      ))}
    </div>
  </section>
);


// --- Main Content Component ---
const MainContent: React.FC = () => {
  const mainRef = useRef(null);
  
  return (
    <div ref={mainRef}>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
    </div>
  );
};

export default MainContent;