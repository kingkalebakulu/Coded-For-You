import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, MessageSquare, Calendar, Share2, Mail, Search, Bot,
  Users, X, Send, Star, Menu, ArrowRight, Zap, Shield, TrendingUp,
  ChevronDown, CheckCircle, Cpu, BarChart2, Headphones,
  Instagram, MessageCircle,
  Clock, DollarSign, Target, Eye
} from "lucide-react";

// ─── SHARED PERFORMANCE HOOKS ────────────────────────────────────────────────

// Single shared isMobile hook — avoids duplicate resize listeners per component
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

// Throttled scroll listener — fires at most once per animation frame
function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (rafId) cancelAnimationFrame(rafId); };
  }, [threshold]);
  return scrolled;
}

// ─── LOGO ───────────────────────────────────────────────────────────────────
const LOGO_SRC = "/logo.png";
// ─── DATA ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "27619229670";
const GMAIL = "coded.for.you.king@gmail.com";
const INSTAGRAM = "CodedForYou.codes";

const SERVICES = [
  {
    id: "sales-agents",
    icon: Bot,
    title: "AI Sales Agents",
    desc: "Deploy intelligent AI agents that qualify leads, handle objections, and close deals — operating 24/7 without a break or a bad day.",
    features: ["Lead Qualification", "Objection Handling", "CRM Integration", "24/7 Operation"],
    color: "#00E5FF",
    msg: "Hi! I'm interested in an AI Sales Agent for my business. Can we discuss how this would work?"
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    title: "WhatsApp Automations",
    desc: "Turn WhatsApp into your most powerful sales channel. Automated replies, follow-up sequences, and full customer journeys on autopilot.",
    features: ["Auto-Responses", "Broadcast Campaigns", "Follow-Up Sequences", "Order Tracking"],
    color: "#25D366",
    msg: "Hi! I want to automate my WhatsApp business messaging. Can we talk about WhatsApp automation solutions?"
  },
  {
    id: "lead-triage",
    icon: Target,
    title: "Lead Triage Systems",
    desc: "Never let a hot lead go cold. Our AI instantly scores, sorts, and routes every enquiry to the right person — or handles it outright.",
    features: ["Lead Scoring", "Smart Routing", "Auto Follow-Up", "Conversion Tracking"],
    color: "#FFB347",
    msg: "Hi! I want to set up a Lead Triage System for my business. Can we talk about how this works?"
  },
  {
    id: "web-systems",
    icon: Globe,
    title: "Custom Web Systems",
    desc: "High-performance websites and web apps built to convert — integrated with your automations and designed to scale with your growth.",
    features: ["Custom Development", "CRM Integration", "Automation-Ready", "Performance Optimised"],
    color: "#7B61FF",
    msg: "Hi! I'm looking for a Custom Web System built for my business. Can we discuss what this would involve?"
  },
  {
    id: "voice-ai",
    icon: Headphones,
    title: "Voice AI Receptionists",
    desc: "An AI receptionist that answers calls, books appointments, and handles enquiries in natural conversation — so you never miss a caller.",
    features: ["Call Handling", "Appointment Booking", "Natural Language", "24/7 Availability"],
    color: "#FF6B6B",
    msg: "Hi! I'm interested in a Voice AI Receptionist for my business. Can we discuss how this would work?"
  },
  {
    id: "ai-strategy",
    icon: BarChart2,
    title: "AI Strategy & Audit",
    desc: "Not sure where to start? We map your entire business, identify every automation opportunity, and build you a clear AI roadmap for maximum ROI.",
    features: ["Business Audit", "AI Roadmap", "ROI Projections", "Priority Planning"],
    color: "#00C896",
    msg: "Hi! I'd like to book an AI Strategy & Audit session for my business. Can we discuss what this involves?"
  }
];

const TESTIMONIALS = [
  {
    name: "Thabo Nkosi",
    role: "CEO",
    company: "Nkosi Property Group",
    rating: 5,
    text: "CFY's WhatsApp automation is genuinely next-level. Our lead response rate shot up by 340% and clients get instant replies at 2am. Best ROI decision we've made this year.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Zanele Dlamini",
    role: "Founder",
    company: "ZD Wellness Clinic",
    rating: 5,
    text: "The automated booking system literally paid for itself in week one. Admin costs dropped 60%, bookings up 45%. My staff can now focus on actual patient care instead of phone calls.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Marcus van der Berg",
    role: "Director",
    company: "Berg & Associates Legal",
    rating: 4,
    text: "Solid work overall — the chatbot and email workflows have noticeably improved our lead pipeline. Setup took a bit longer than expected but the end result is working well for us.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Amara Okafor",
    role: "Owner",
    company: "Okafor Fashion House",
    rating: 5,
    text: "Was skeptical about AI automation at first, but CFY proved me completely wrong. Social media runs itself, chatbot converts visitors, and I actually sleep properly now knowing everything's handled.",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Ruan Botha",
    role: "MD",
    company: "Botha Auto Group",
    rating: 4,
    text: "The email automation sequences are excellent — leads get nurtured automatically and come to us pre-sold. I'd have given 5 stars but we had a few teething issues in the first month with CRM sync.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Priya Naidoo",
    role: "Co-Founder",
    company: "NaidooTech Solutions",
    rating: 5,
    text: "Our AI virtual assistant handles 80% of queries now, SEO traffic tripled in 4 months, and we're closing deals way faster. CFY understands what tech businesses actually need.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Sipho Mahlangu",
    role: "Founder",
    company: "Mahlangu Logistics",
    rating: 3,
    text: "The WhatsApp bot works well for basic queries and has saved us time on repetitive questions. Still feels like it needs more customisation for our niche industry — but the team is responsive and willing to improve it.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Lerato Sithole",
    role: "CEO",
    company: "Sithole Beauty Co.",
    rating: 5,
    text: "I run a small salon and was worried this was out of my budget. CFY built me an affordable booking bot and social scheduler — I've picked up 12 new regular clients in 2 months. Absolutely worth it.",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
  }
];

const GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop", label: "AI Automation Dashboard" },
  { url: "https://images.unsplash.com/photo-1661956602944-249bcd04b63f?w=600&h=400&fit=crop", label: "Modern Website Design" },
  { url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop", label: "WhatsApp Business Integration" },
  { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", label: "Analytics & Growth Tracking" },
  { url: "https://images.unsplash.com/photo-1682687981922-7b55dbb30851?w=600&h=400&fit=crop", label: "AI Chatbot Interface" },
  { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop", label: "Lead Generation Systems" },
  { url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop", label: "Email Marketing Automation" },
  { url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop", label: "Digital Strategy Results" },
];

const STATS = [
  { value: "340%", label: "Average Lead Increase", icon: TrendingUp },
  { value: "24/7", label: "Automated Operations", icon: Clock },
  { value: "60%", label: "Cost Reduction", icon: DollarSign },
  { value: "80%", label: "Query Auto-Resolution", icon: CheckCircle },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function GlowCircle({ size = 400, x = 0, y = 0, opacity = 0.15, color = "#00B4FF" }) {
  return (
    <div
      style={{
        position: "absolute", left: x, top: y, width: size, height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
        pointerEvents: "none", zIndex: 0
      }}
    />
  );
}

function GlassCard({ children, className = "", style = {}, glowColor = "#00B4FF" }) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid rgba(255,255,255,0.09)`,
        borderRadius: 16,
        boxShadow: `0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function ElectricButton({ children, onClick, href, variant = "primary", className = "" }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 28px", borderRadius: 8, fontFamily: "'Orbitron', sans-serif",
    fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", cursor: "pointer",
    border: "none", textDecoration: "none", transition: "all 0.3s ease"
  };
  const styles = variant === "primary" ? {
    ...base,
    background: "linear-gradient(135deg, #00B4FF, #0066FF)",
    color: "#fff",
    boxShadow: "0 0 20px rgba(0,180,255,0.4), 0 0 40px rgba(0,180,255,0.2)"
  } : {
    ...base,
    background: "transparent",
    color: "#00B4FF",
    border: "1px solid rgba(0,180,255,0.4)",
    boxShadow: "0 0 10px rgba(0,180,255,0.1)"
  };

  const C = href ? "a" : "button";
  return (
    <motion.div whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(0,180,255,0.6)" }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
      <C href={href} onClick={onClick} style={styles} className={className} target={href ? "_blank" : undefined} rel={href ? "noopener noreferrer" : undefined}>
        {children}
      </C>
    </motion.div>
  );
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, background: "#050505", zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}
    >
      <GlowCircle x="-200px" y="-200px" size={600} opacity={0.08} />
      <GlowCircle x="calc(100vw - 400px)" y="calc(100vh - 400px)" size={600} opacity={0.08} />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ position: "relative", marginBottom: 32 }}
      >
        {/* Outer ring pulse */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: -20, borderRadius: "50%",
            border: "1px solid rgba(0,180,255,0.4)"
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
          style={{
            position: "absolute", inset: -40, borderRadius: "50%",
            border: "1px solid rgba(0,180,255,0.2)"
          }}
        />
        <img
          src={LOGO_SRC}
          alt="Coded For You"
          fetchpriority="high"
          decoding="sync"
          style={{
            width: 160, height: 160, borderRadius: "50%",
            objectFit: "cover",
            filter: "drop-shadow(0 0 30px rgba(0,180,255,0.8))",
            display: "block"
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: "center" }}
      >
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px, 4vw, 36px)",
          color: "#fff", letterSpacing: "0.15em", marginBottom: 8
        }}>
          CODED FOR YOU
        </h1>
        <p style={{ color: "rgba(0,180,255,0.7)", fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.3em", fontSize: 12 }}>
          AI AUTOMATION AGENCY
        </p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        style={{
          marginTop: 48, width: 200, height: 2,
          background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden"
        }}
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "linear" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #00B4FF, #0066FF)",
            boxShadow: "0 0 10px rgba(0,180,255,0.8)",
            borderRadius: 99
          }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={{ color: "rgba(0,180,255,0.5)", fontSize: 11, marginTop: 16, fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.2em" }}
      >
        INITIALIZING SYSTEMS...
      </motion.p>
    </motion.div>
  );
}

function Navbar({ onBooking }) {
  const scrolled = useScrolled(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const navLinks = useMemo(() => [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why-us" },
    { label: "Work", href: "#gallery" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ], []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px",
        background: scrolled ? "rgba(5,5,5,0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(32px) saturate(1.5)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(32px) saturate(1.5)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "all 0.4s ease"
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ position: "relative", perspective: "300px" }}>
            <motion.div
              animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, 3, 0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d", position: "relative" }}
            >
              <img src={LOGO_SRC} alt="CFY" fetchpriority="high" decoding="sync" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", display: "block", filter: "drop-shadow(0 0 12px rgba(0,180,255,0.9)) drop-shadow(0 4px 16px rgba(0,100,255,0.5))" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(110deg, transparent 30%, rgba(0,180,255,0.15) 55%, rgba(5,5,5,0.55) 100%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -6, left: "10%", right: "10%", height: 10, borderRadius: "50%", background: "rgba(0,180,255,0.25)", filter: "blur(6px)", pointerEvents: "none" }} />
            </motion.div>
          </div>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, color: "#fff", letterSpacing: "0.1em", fontWeight: 700 }}>
            CODED <span style={{ color: "#00B4FF" }}>FOR YOU</span>
          </span>
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {navLinks.map(l => (
              <a key={l.label} href={l.href} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontFamily: "'Exo 2', sans-serif", fontSize: 14, fontWeight: 500, letterSpacing: "0.05em", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "#00B4FF"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              >{l.label}</a>
            ))}
            <ElectricButton href={waLink("Hi! I'd like to learn more about Coded For You's services.")} variant="primary">
              <MessageCircle size={14} /> Get Started
            </ElectricButton>
          </div>
        )}

        {/* Mobile hamburger — always rendered, visibility by JS */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)",
              borderRadius: 8, color: "#00B4FF", cursor: "pointer",
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: "rgba(5,5,5,0.98)", borderBottom: "1px solid rgba(0,180,255,0.1)", padding: "16px 24px 24px", overflow: "hidden" }}
          >
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", padding: "12px 0", fontFamily: "'Exo 2', sans-serif", fontSize: 15, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {l.label}
              </a>
            ))}
            <div style={{ marginTop: 16 }}>
              <ElectricButton href={waLink("Hi! I'd like to learn more about Coded For You's services.")}>
                <MessageCircle size={14} /> Get Started
              </ElectricButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Hero() {
  const words = ["Automate.", "Accelerate.", "Dominate."];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "120px 24px 80px"
    }}>
      {/* Hero BG image layer — rich dark tech scene */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center top",
        }}
      />
      {/* Accent secondary image — blended */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&h=1080&fit=crop')",
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.18,
        mixBlendMode: "screen"
      }} />
      {/* Dark overlay with blue tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(5,5,5,0.93) 0%, rgba(0,15,35,0.88) 40%, rgba(0,30,60,0.82) 60%, rgba(5,5,5,0.94) 100%)"
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
        background: "linear-gradient(to top, #050505, transparent)"
      }} />
      {/* Top vignette */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "20%",
        background: "linear-gradient(to bottom, #050505, transparent)"
      }} />

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(rgba(0,180,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <GlowCircle x="-100px" y="100px" size={600} opacity={0.12} />
      <GlowCircle x="calc(100vw - 500px)" y="calc(100vh - 400px)" size={700} opacity={0.08} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.3, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 20}%`,
            width: 4, height: 4, borderRadius: "50%",
            background: "#00B4FF",
            boxShadow: "0 0 8px #00B4FF",
            pointerEvents: "none"
          }}
        />
      ))}

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.3)",
            borderRadius: 99, padding: "6px 20px", marginBottom: 32
          }}
        >
          <Zap size={14} color="#00B4FF" />
          <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 13, letterSpacing: "0.1em" }}>
            AI-POWERED BUSINESS AUTOMATION
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "clamp(36px, 7vw, 80px)",
            lineHeight: 1.1, marginBottom: 16,
            fontWeight: 900, color: "#fff"
          }}
        >
          Your Business.<br />
          <span style={{
            background: "linear-gradient(135deg, #00B4FF, #0066FF, #00E5FF)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", display: "inline-block",
            filter: "drop-shadow(0 0 20px rgba(0,180,255,0.4))"
          }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -20, rotateX: 90 }}
                transition={{ duration: 0.4 }}
                style={{ display: "inline-block" }}
              >
                {words[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            color: "rgba(255,255,255,0.65)", fontFamily: "'Exo 2', sans-serif",
            fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.7,
            maxWidth: 680, margin: "0 auto 48px"
          }}
        >
          We build smart digital systems that capture leads, respond instantly, and run your operations 24/7 — so you can focus on what matters most.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <ElectricButton href={waLink("Hi! I'd like to discuss how Coded For You can help automate and grow my business.")}>
            <Zap size={16} /> Start Automating
          </ElectricButton>
          <ElectricButton href="#services" variant="outline">
            <Eye size={16} /> Explore Services
          </ElectricButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          style={{
            display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap",
            marginTop: 72, paddingTop: 40,
            borderTop: "1px solid rgba(0,180,255,0.1)"
          }}
        >
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 900, color: "#00B4FF",
                textShadow: "0 0 20px rgba(0,180,255,0.5)"
              }}>
                {s.value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.05em", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", cursor: "pointer" }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
      >
        <ChevronDown size={24} color="rgba(0,180,255,0.5)" />
      </motion.div>
    </section>
  );
}

function About() {
  const features = [
    { icon: Bot, title: "AI-First Approach", desc: "Every solution we build leverages cutting-edge AI to outperform traditional methods." },
    { icon: Zap, title: "Results in Days", desc: "We deploy fast. Most automations are live within days, not months." },
    { icon: Shield, title: "Built to Scale", desc: "Systems designed to grow with your business, handling 10x or 1000x the volume." },
    { icon: TrendingUp, title: "ROI Focused", desc: "Every system we build is measured against revenue impact and cost savings." },
  ];

  return (
    <section id="about" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <GlowCircle x="calc(100vw - 400px)" y="0" size={500} opacity={0.1} />
      <GlowCircle x="-200px" y="300px" size={400} opacity={0.07} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Top row: text left + image right ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 64, alignItems: "center", marginBottom: 72
        }}>
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)",
              borderRadius: 99, padding: "6px 16px", marginBottom: 24
            }}>
              <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 12, letterSpacing: "0.15em" }}>ABOUT US</span>
            </div>

            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.2,
              color: "#fff", marginBottom: 24, fontWeight: 800
            }}>
              We Build Systems That<br />
              <span style={{ color: "#00B4FF" }}>Work While You Don't</span>
            </h2>

            <p style={{
              color: "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif",
              fontSize: 16, lineHeight: 1.8, marginBottom: 16
            }}>
              Coded For You is an AI automation agency on a mission to give businesses of every size the unfair advantage that large corporations have had for years — smart, tireless digital systems.
            </p>
            <p style={{
              color: "rgba(255,255,255,0.6)", fontFamily: "'Exo 2', sans-serif",
              fontSize: 16, lineHeight: 1.8, marginBottom: 40
            }}>
              From your first website visitor to your most loyal repeat customer, we design automated journeys that capture leads, nurture relationships, and close deals — automatically, 24/7, 365 days a year.
            </p>

            <ElectricButton href={waLink("Hi! I'd like to learn more about what Coded For You can do for my business.")}>
              <ArrowRight size={16} /> Let's Talk
            </ElectricButton>
          </motion.div>

          {/* Right: Image panel with glass overlay */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            style={{ position: "relative" }}
          >
            {/* Main image */}
            <div style={{
              borderRadius: 20, overflow: "hidden", position: "relative",
              border: "1px solid rgba(0,180,255,0.2)",
              boxShadow: "0 0 60px rgba(0,180,255,0.12), 0 32px 64px rgba(0,0,0,0.6)"
            }}>
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=600&fit=crop"
                alt="AI Technology"
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
              />
              {/* Blue tint overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(0,30,60,0.5) 0%, rgba(0,180,255,0.08) 50%, rgba(5,5,5,0.6) 100%)"
              }} />
              {/* Bottom glass bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px 24px",
                background: "rgba(5,5,5,0.75)",
                backdropFilter: "blur(16px)",
                borderTop: "1px solid rgba(0,180,255,0.15)",
                display: "flex", alignItems: "center", gap: 16
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(0,180,255,0.15)", border: "1px solid rgba(0,180,255,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Zap size={18} color="#00B4FF" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "#fff", fontWeight: 700 }}>
                    AI-Powered Since Day One
                  </div>
                  <div style={{ color: "rgba(0,180,255,0.7)", fontFamily: "'Exo 2', sans-serif", fontSize: 12, marginTop: 2 }}>
                    Built to grow with your business
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge top-right */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              style={{
                position: "absolute", top: -18, right: -18,
                background: "linear-gradient(135deg, #00B4FF, #0066FF)",
                borderRadius: 12, padding: "10px 18px",
                boxShadow: "0 0 24px rgba(0,180,255,0.5)",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, color: "#fff", fontWeight: 900 }}>24/7</div>
              <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em" }}>AUTOMATED</div>
            </motion.div>

            {/* Floating badge bottom-left */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              style={{
                position: "absolute", bottom: 60, left: -22,
                background: "rgba(5,5,5,0.9)",
                backdropFilter: "blur(16px)",
                borderRadius: 12, padding: "10px 16px",
                border: "1px solid rgba(0,180,255,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrendingUp size={16} color="#00B4FF" />
                <div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: "#00B4FF", fontWeight: 900 }}>340%</div>
                  <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)" }}>Avg Lead Increase</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Bottom row: feature cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0,180,255,0.18)" }}
            >
              <GlassCard style={{ padding: 28, height: "100%", cursor: "default", transition: "all 0.3s" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(0,180,255,0.1)", border: "1px solid rgba(0,180,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
                }}>
                  <f.icon size={20} color="#00B4FF" />
                </div>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: "#fff", marginBottom: 8, fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontFamily: "'Exo 2', sans-serif", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function Services({ onBook }) {
  const isMobile = useIsMobile();

  return (
    <section id="services" style={{ padding: "120px 0", position: "relative" }}>
      {/* bg gradient — no overflow:hidden so arrows aren't clipped */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, rgba(0,20,40,0.3) 50%, transparent 100%)", pointerEvents: "none" }} />
      <GlowCircle x="0" y="200px" size={500} opacity={0.08} />
      <GlowCircle x="calc(100vw - 300px)" y="400px" size={400} opacity={0.06} />

      {/* Section header */}
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, padding: "0 24px" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 12, letterSpacing: "0.15em" }}>OUR SERVICES</span>
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", fontWeight: 800, marginBottom: 16 }}>
            Everything Your Business Needs<br /><span style={{ color: "#00B4FF" }}>To Run on Autopilot</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Exo 2', sans-serif", fontSize: 17, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
            A complete ecosystem of AI-powered services designed to capture every lead, serve every customer, and maximize every opportunity.
          </p>
        </motion.div>
      </div>

      {/* ── DESKTOP: normal grid ── */}
      {!isMobile && (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} s={s} onBook={onBook} />
            ))}
          </div>
        </div>
      )}

      {/* ── MOBILE: 2-column compact grid ── */}
      {isMobile && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 16px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onBook(s)}
                style={{ cursor: "pointer" }}
              >
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  border: `1px solid ${s.color}25`,
                  borderRadius: 16, padding: "18px 14px",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  height: "100%", display: "flex", flexDirection: "column",
                }}>
                  {/* Icon */}
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: `0 0 14px ${s.color}18`, flexShrink: 0 }}>
                    <s.icon size={18} color={s.color} />
                  </div>
                  {/* Title */}
                  <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: "#fff", fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{s.title}</h3>
                  {/* Desc — truncated to 2 lines */}
                  <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 11, fontFamily: "'Exo 2', sans-serif", lineHeight: 1.6, flex: 1,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                  }}>{s.desc}</p>
                  {/* Book link */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: s.color, fontFamily: "'Exo 2', sans-serif", fontSize: 10, fontWeight: 700, marginTop: 10, letterSpacing: "0.03em" }}>
                    Book <ArrowRight size={10} style={{ marginLeft: "auto" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ServiceCard({ s, onBook }) {
  return (
    <div
      style={{ height: "100%", display: "flex", flexDirection: "column", cursor: "pointer" }}
      onClick={() => onBook(s)}
      onMouseEnter={e => {
        e.currentTarget.querySelector(".sc-inner").style.transform = "translateY(-4px)";
        e.currentTarget.querySelector(".sc-inner").style.boxShadow = `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${s.color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.querySelector(".sc-inner").style.transform = "translateY(0)";
        e.currentTarget.querySelector(".sc-inner").style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`;
      }}
    >
      <div className="sc-inner" style={{
        flex: 1, display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${s.color}28`, borderRadius: 20,
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
        padding: 24, transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}>
        <div style={{ width: 50, height: 50, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: `0 0 20px ${s.color}22`, flexShrink: 0 }}>
          <s.icon size={22} color={s.color} />
        </div>
        <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: "#fff", marginBottom: 10, fontWeight: 700, lineHeight: 1.4 }}>{s.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'Exo 2', sans-serif", lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{s.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {s.features.map(f => (
            <span key={f} style={{ background: `${s.color}12`, border: `1px solid ${s.color}25`, color: s.color, borderRadius: 6, padding: "3px 9px", fontSize: 10, fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.05em" }}>{f}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: s.color, fontFamily: "'Exo 2', sans-serif", fontSize: 12, fontWeight: 600 }}>
          <MessageCircle size={13} /> Book This Service <ArrowRight size={13} style={{ marginLeft: "auto" }} />
        </div>
      </div>
    </div>
  );
}

// ─── BENTO GALLERY ───────────────────────────────────────────────────────────
const BENTO_ITEMS = [
  {
    id: "hero",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=800&fit=crop",
    label: "AI Automation Dashboard",
    tag: "AI Systems",
    tagColor: "#00B4FF",
    desc: "End-to-end automation that handles your business operations around the clock.",
    gridArea: "a",
    accent: "#00B4FF"
  },
  {
    id: "web",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    label: "Modern Website Design",
    tag: "Web Design",
    tagColor: "#00E5FF",
    desc: "High-converting websites built to impress and perform.",
    gridArea: "b",
    accent: "#00E5FF"
  },
  {
    id: "wa",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop",
    label: "WhatsApp Business Automation",
    tag: "WhatsApp",
    tagColor: "#25D366",
    desc: "Instant replies, booking flows, and lead capture on WhatsApp.",
    gridArea: "c",
    accent: "#25D366"
  },
  {
    id: "analytics",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop",
    label: "Analytics & Growth Tracking",
    tag: "Data & ROI",
    tagColor: "#7B61FF",
    desc: "Real-time dashboards that show exactly where your business is growing.",
    gridArea: "d",
    accent: "#7B61FF"
  },
  {
    id: "chatbot",
    img: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    label: "AI Chatbot Interfaces",
    tag: "AI Chat",
    tagColor: "#FF6B6B",
    desc: "Conversational bots that qualify leads and book appointments 24/7.",
    gridArea: "e",
    accent: "#FF6B6B"
  },
  {
    id: "leads",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop",
    label: "Lead Generation Systems",
    tag: "Lead Gen",
    tagColor: "#FFB347",
    desc: "Automated pipelines that find and nurture prospects while you sleep.",
    gridArea: "f",
    accent: "#FFB347"
  },
];

function BentoCard({ item, style = {}, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 20, overflow: "hidden",
        border: `1px solid ${hovered ? item.accent + "55" : "rgba(0,180,255,0.12)"}`,
        boxShadow: hovered ? `0 0 40px ${item.accent}22, 0 20px 60px rgba(0,0,0,0.5)` : "0 8px 32px rgba(0,0,0,0.4)",
        cursor: "pointer",
        transition: "border 0.3s, box-shadow 0.3s",
        ...style
      }}
    >
      {/* Background image */}
      <motion.img
        src={item.img}
        alt={item.label}
        loading="lazy"
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Always-on gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.45) 45%, rgba(5,5,5,0.1) 100%)`
      }} />

      {/* Hover color tint */}
      <motion.div
        animate={{ opacity: hovered ? 0.18 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute", inset: 0,
          background: item.accent,
          mixBlendMode: "screen"
        }}
      />

      {/* Tag badge */}
      <div style={{
        position: "absolute", top: 16, left: 16,
        background: item.accent + "22",
        backdropFilter: "blur(8px)",
        border: `1px solid ${item.accent}55`,
        borderRadius: 99, padding: "4px 12px",
        fontFamily: "'Exo 2', sans-serif", fontSize: 11,
        color: item.accent, letterSpacing: "0.1em", fontWeight: 700
      }}>
        {item.tag}
      </div>

      {/* CFY badge */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        background: "rgba(0,180,255,0.85)",
        borderRadius: 6, padding: "3px 8px",
        fontSize: 10, fontFamily: "'Exo 2', sans-serif",
        color: "#fff", letterSpacing: "0.1em"
      }}>CFY</div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 22px"
      }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 14,
          color: "#fff", fontWeight: 700, marginBottom: 6,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)"
        }}>
          {item.label}
        </div>
        <motion.div
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <div style={{
            color: "rgba(255,255,255,0.7)", fontFamily: "'Exo 2', sans-serif",
            fontSize: 13, lineHeight: 1.6, paddingTop: 4
          }}>
            {item.desc}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Gallery() {
  const isMobile = useIsMobile();

  return (
    <section id="gallery" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <GlowCircle x="calc(50% - 300px)" y="0" size={700} opacity={0.07} />
      <GlowCircle x="calc(100vw - 200px)" y="400px" size={400} opacity={0.05} />

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 12, letterSpacing: "0.15em" }}>OUR WORK</span>
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", fontWeight: 800, marginBottom: 16 }}>
            Systems That Speak<br /><span style={{ color: "#00B4FF" }}>For Themselves</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Exo 2', sans-serif", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
            A snapshot of the automation ecosystems and digital experiences we've built.
          </p>
        </motion.div>

        {/* ── DESKTOP: full 3-col bento ── */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "340px 280px 320px", gap: 14 }}>
            <BentoCard item={BENTO_ITEMS[0]} delay={0}    style={{ gridColumn: "1",     gridRow: "1 / 3" }} />
            <BentoCard item={BENTO_ITEMS[1]} delay={0.08} style={{ gridColumn: "2",     gridRow: "1"     }} />
            <BentoCard item={BENTO_ITEMS[2]} delay={0.16} style={{ gridColumn: "3",     gridRow: "1"     }} />
            <BentoCard item={BENTO_ITEMS[3]} delay={0.12} style={{ gridColumn: "2 / 4", gridRow: "2"     }} />
            <BentoCard item={BENTO_ITEMS[4]} delay={0.20} style={{ gridColumn: "1 / 2", gridRow: "3"     }} />
            <BentoCard item={BENTO_ITEMS[5]} delay={0.28} style={{ gridColumn: "2 / 4", gridRow: "3"     }} />
          </div>
        )}

        {/* ── MOBILE: custom 2-col mosaic bento ── */}
        {isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

            {/* Row 1: Full-width hero card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ gridColumn: "1 / 3", height: 200 }}>
              <MobileBentoCard item={BENTO_ITEMS[0]} />
            </motion.div>

            {/* Row 2: Two equal small cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }} style={{ height: 160 }}>
              <MobileBentoCard item={BENTO_ITEMS[1]} compact />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.10 }} style={{ height: 160 }}>
              <MobileBentoCard item={BENTO_ITEMS[2]} compact />
            </motion.div>

            {/* Row 3: Wide left (2/3) + narrow right (1/3) — using 3-col sub-grid trick */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }} style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "3fr 2fr", gap: 10, height: 170 }}>
              <MobileBentoCard item={BENTO_ITEMS[3]} />
              <MobileBentoCard item={BENTO_ITEMS[4]} compact />
            </motion.div>

            {/* Row 4: Full-width bottom card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }} style={{ gridColumn: "1 / 3", height: 150 }}>
              <MobileBentoCard item={BENTO_ITEMS[5]} />
            </motion.div>

          </div>
        )}

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 1, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(0,180,255,0.12)" }}
        >
          {[
            { icon: Globe,       label: "Websites Built",    value: "30+"  },
            { icon: Bot,         label: "Chatbots Deployed", value: "50+"  },
            { icon: Users,       label: "Businesses Helped", value: "80+"  },
            { icon: TrendingUp,  label: "Avg ROI Boost",     value: "340%" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "20px 18px", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", gap: 12, borderRight: i < 3 ? "1px solid rgba(0,180,255,0.08)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon size={16} color="#00B4FF" />
              </div>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, color: "#00B4FF", fontWeight: 900 }}>{stat.value}</div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function MobileBentoCard({ item, compact = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", borderRadius: 14, overflow: "hidden",
        height: "100%", width: "100%",
        border: `1px solid ${hovered ? item.accent + "55" : "rgba(255,255,255,0.08)"}`,
        boxShadow: hovered ? `0 0 28px ${item.accent}22` : "0 4px 20px rgba(0,0,0,0.4)",
        transition: "border 0.3s, box-shadow 0.3s", cursor: "pointer"
      }}
    >
      <img
        src={item.img}
        alt={item.label}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
          transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease"
        }}
      />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.2) 60%, transparent 100%)" }} />
      {/* Accent tint on hover */}
      <div style={{ position: "absolute", inset: 0, background: item.accent, opacity: hovered ? 0.12 : 0, transition: "opacity 0.3s", mixBlendMode: "screen" }} />
      {/* Tag badge */}
      <div style={{
        position: "absolute", top: 8, left: 8,
        background: item.accent + "25", backdropFilter: "blur(8px)",
        border: `1px solid ${item.accent}50`, borderRadius: 99,
        padding: "2px 9px", fontFamily: "'Exo 2', sans-serif",
        fontSize: 9, color: item.accent, letterSpacing: "0.08em", fontWeight: 700
      }}>{item.tag}</div>
      {/* CFY badge */}
      <div style={{
        position: "absolute", top: 8, right: 8,
        background: "rgba(0,180,255,0.85)", borderRadius: 5,
        padding: "2px 6px", fontSize: 8,
        fontFamily: "'Exo 2', sans-serif", color: "#fff", letterSpacing: "0.1em"
      }}>CFY</div>
      {/* Label */}
      {!compact && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px" }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, color: "#fff", fontWeight: 700, textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{item.label}</div>
        </div>
      )}
    </div>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile(600);
  const startX = useRef(null);

  const prev = () => setActive(i => Math.max(0, i - 1));
  const next = () => setActive(i => Math.min(TESTIMONIALS.length - 1, i + 1));

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (startX.current === null) return;
    const dx = startX.current - e.changedTouches[0].clientX;
    if (dx > 40) next();
    else if (dx < -40) prev();
    startX.current = null;
  };

  const avg = (TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length).toFixed(1);

  const ArrowBtn = ({ dir }) => {
    const disabled = dir === "prev" ? active === 0 : active === TESTIMONIALS.length - 1;
    return (
      <button
        onClick={dir === "prev" ? prev : next}
        disabled={disabled}
        style={{
          width: 38, height: 38, borderRadius: "50%", border: "none", flexShrink: 0,
          background: disabled ? "rgba(255,255,255,0.05)" : "rgba(0,180,255,0.16)",
          outline: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "rgba(0,180,255,0.35)"}`,
          backdropFilter: "blur(12px)",
          color: disabled ? "rgba(255,255,255,0.18)" : "#00B4FF",
          cursor: disabled ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, lineHeight: 1, transition: "all 0.2s",
          boxShadow: disabled ? "none" : "0 0 12px rgba(0,180,255,0.25)",
        }}
      >{dir === "prev" ? "‹" : "›"}</button>
    );
  };

  return (
    <section id="testimonials" style={{ padding: "80px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(0,20,40,0.2) 50%, transparent)" }} />
      <GlowCircle x="0" y="50%" size={400} opacity={0.07} />
      <GlowCircle x="calc(100vw - 300px)" y="30%" size={400} opacity={0.07} />

      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", padding: "0 24px" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 99, padding: "5px 14px", marginBottom: 16 }}>
            <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}>CLIENT RESULTS</span>
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(22px, 3.5vw, 40px)", color: "#fff", fontWeight: 800, marginBottom: 12 }}>
            Real Businesses. <span style={{ color: "#00B4FF" }}>Real Results.</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
            </div>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, color: "#F59E0B", fontWeight: 800 }}>{avg}</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Exo 2', sans-serif", fontSize: 13 }}>/ {TESTIMONIALS.length} reviews</span>
          </div>
        </motion.div>

        {/* ── Desktop: side arrows ── */}
        {!isMobile && (
          <div style={{ position: "relative" }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div style={{ overflow: "hidden", borderRadius: 16 }}>
              <motion.div animate={{ x: `-${active * 100}%` }} transition={{ type: "spring", damping: 32, stiffness: 280 }} style={{ display: "flex", gap: 0 }}>
                {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} t={t} />)}
              </motion.div>
            </div>
            {["prev","next"].map(dir => {
              const disabled = dir === "prev" ? active === 0 : active === TESTIMONIALS.length - 1;
              return (
                <button key={dir} onClick={dir === "prev" ? prev : next} disabled={disabled} style={{
                  position: "absolute", [dir === "prev" ? "left" : "right"]: -48, top: "50%", transform: "translateY(-50%)",
                  width: 38, height: 38, borderRadius: "50%", border: "none",
                  background: disabled ? "rgba(255,255,255,0.05)" : "rgba(0,180,255,0.16)",
                  outline: `1px solid ${disabled ? "rgba(255,255,255,0.08)" : "rgba(0,180,255,0.35)"}`,
                  backdropFilter: "blur(12px)", color: disabled ? "rgba(255,255,255,0.18)" : "#00B4FF",
                  cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, transition: "all 0.2s", zIndex: 2, lineHeight: 1,
                  boxShadow: disabled ? "none" : "0 0 12px rgba(0,180,255,0.25)",
                }}>{dir === "prev" ? "‹" : "›"}</button>
              );
            })}
          </div>
        )}

        {/* ── Mobile: card + arrows below ── */}
        {isMobile && (
          <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div style={{ overflow: "hidden", borderRadius: 16, marginBottom: 16 }}>
              <motion.div animate={{ x: `-${active * 100}%` }} transition={{ type: "spring", damping: 32, stiffness: 280 }} style={{ display: "flex", gap: 0 }}>
                {TESTIMONIALS.map((t) => <TestimonialCard key={t.name} t={t} />)}
              </motion.div>
            </div>
            {/* Arrows + dots row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
              <ArrowBtn dir="prev" />
              <div style={{ display: "flex", gap: 5 }}>
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)} style={{
                    width: i === active ? 20 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer",
                    background: i === active ? "#00B4FF" : "rgba(255,255,255,0.15)",
                    boxShadow: i === active ? "0 0 8px rgba(0,180,255,0.5)" : "none",
                    transition: "all 0.3s", padding: 0,
                  }} />
                ))}
              </div>
              <ArrowBtn dir="next" />
            </div>
          </div>
        )}

        {/* Desktop dots */}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 20 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer",
                background: i === active ? "#00B4FF" : "rgba(255,255,255,0.15)",
                boxShadow: i === active ? "0 0 8px rgba(0,180,255,0.5)" : "none",
                transition: "all 0.3s", padding: 0,
              }} />
            ))}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: 10, color: "rgba(255,255,255,0.2)", fontFamily: "'Exo 2', sans-serif", fontSize: 11, letterSpacing: "0.08em" }}>
          {isMobile ? "SWIPE OR TAP ARROWS" : "SWIPE OR USE ARROWS"}
        </p>
      </div>
    </section>
  );
}

function TestimonialCard({ t }) {
  return (
    <div style={{
      minWidth: "100%", width: "100%", flexShrink: 0,
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
      border: `1px solid ${t.rating >= 5 ? "rgba(0,180,255,0.18)" : t.rating >= 4 ? "rgba(245,158,11,0.14)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 16,
      boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
      padding: "24px 28px", boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={13} fill={i <= t.rating ? "#F59E0B" : "transparent"} color={i <= t.rating ? "#F59E0B" : "rgba(255,255,255,0.15)"} />)}
          </div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Exo 2', sans-serif", fontSize: 11 }}>{t.role} · {t.company}</div>
        </div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 36, fontWeight: 900, lineHeight: 1, color: t.rating >= 5 ? "#00B4FF" : t.rating >= 4 ? "#F59E0B" : "rgba(255,255,255,0.3)", textShadow: t.rating >= 5 ? "0 0 20px rgba(0,180,255,0.35)" : "none" }}>
          {t.rating}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", fontFamily: "'Exo 2', sans-serif" }}>/5</span>
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Exo 2', sans-serif", fontSize: 14, lineHeight: 1.75, marginBottom: 18, fontStyle: "italic" }}>"{t.text}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={t.img} alt={t.name} loading="lazy" decoding="async" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(0,180,255,0.3)", flexShrink: 0 }} />
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "#fff", fontWeight: 700 }}>{t.name}</div>
      </div>
    </div>
  );
}

// ─── WHY US ──────────────────────────────────────────────────────────────────
function WhyUs() {
  const isMobile = useIsMobile();

  const steps = [
    { number: "01", title: "We Actually Understand Your Business", desc: "Before writing a single line of code, we dig deep into how your business works — your customers, your bottlenecks, your goals. The automation we build fits you, not a generic template.", icon: Target, color: "#00B4FF" },
    { number: "02", title: "Speed Without Cutting Corners", desc: "Most agencies take months. We go from briefing to live system in days. Our battle-tested workflows let us move fast while keeping quality non-negotiable.", icon: Zap, color: "#00E5FF" },
    { number: "03", title: "AI That Works 24/7 — Rain or Shine", desc: "Your automated systems don't sleep, call in sick, or go on leave. From 2am WhatsApp replies to Sunday morning lead follow-ups — it all runs without you.", icon: Clock, color: "#7B61FF" },
    { number: "04", title: "Transparent Reporting & Real ROI", desc: "We don't hide behind vanity metrics. Every system we deploy is tracked against real business outcomes — leads captured, bookings made, costs saved.", icon: BarChart2, color: "#00C896" },
    { number: "05", title: "We Scale With You", desc: "Start with one automation, grow into a full digital ecosystem. Our systems are built modular — snap in new features as your business evolves.", icon: TrendingUp, color: "#FFB347" },
    { number: "06", title: "Dedicated Support — Not a Helpdesk Ticket", desc: "You get direct access to the people who built your system. Quick questions, tweaks, or new ideas — we respond on WhatsApp, not a 3-day ticket queue.", icon: Headphones, color: "#FF6B6B" },
  ];

  const sectionHeader = (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: isMobile ? 40 : 80 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
        <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 12, letterSpacing: "0.15em" }}>WHY CHOOSE US</span>
      </div>
      <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(26px, 4vw, 48px)", color: "#fff", fontWeight: 800, lineHeight: 1.2 }}>
        The CFY Difference —<br /><span style={{ color: "#00B4FF" }}>6 Reasons Businesses Choose Us</span>
      </h2>
    </motion.div>
  );

  return (
    <section id="why-us" style={{ padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <GlowCircle x="calc(50% - 300px)" y="-100px" size={700} opacity={0.07} />
      <GlowCircle x="0" y="50%" size={400} opacity={0.06} />

      <div style={{ maxWidth: isMobile ? 520 : 1100, margin: "0 auto" }}>
        {sectionHeader}

        {/* ── DESKTOP: alternating left/right timeline ── */}
        {!isMobile && (
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)", background: "linear-gradient(to bottom, transparent, rgba(0,180,255,0.4) 10%, rgba(0,180,255,0.4) 90%, transparent)", pointerEvents: "none" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div key={step.number} initial={{ opacity: 0, x: isLeft ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr", alignItems: "center", gap: 0, marginBottom: i < steps.length - 1 ? 32 : 0 }}
                  >
                    <div style={{ padding: "0 32px 0 0", display: "flex", justifyContent: "flex-end" }}>
                      {isLeft ? <TimelineCard step={step} /> : <div />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${step.color}18`, border: `2px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${step.color}44`, flexShrink: 0, zIndex: 1, backdropFilter: "blur(10px)" }}>
                        <step.icon size={22} color={step.color} />
                      </div>
                    </div>
                    <div style={{ padding: "0 0 0 32px" }}>
                      {!isLeft ? <TimelineCard step={step} /> : <div />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MOBILE: vertical process cards with accent number ── */}
        {isMobile && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "flex", gap: 0, borderRadius: 16, overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${step.color}22`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
                }}
              >
                {/* Accent left stripe with icon */}
                <div style={{
                  width: 56, flexShrink: 0,
                  background: `linear-gradient(180deg, ${step.color}22, ${step.color}08)`,
                  borderRight: `1px solid ${step.color}25`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: "16px 0",
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${step.color}20`, border: `1px solid ${step.color}50`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <step.icon size={15} color={step.color} />
                  </div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, color: step.color, fontWeight: 900, letterSpacing: "0.05em", opacity: 0.8 }}>{step.number}</div>
                </div>
                {/* Content */}
                <div style={{ flex: 1, padding: "16px 16px 16px 14px" }}>
                  <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 8, lineHeight: 1.4 }}>{step.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Exo 2', sans-serif", fontSize: 12, lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineCard({ step }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: `0 0 40px ${step.color}22` }}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: `1px solid ${step.color}28`,
        borderRadius: 16,
        padding: "28px 32px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "all 0.3s",
        maxWidth: 420
      }}
    >
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 11, color: step.color, letterSpacing: "0.2em", marginBottom: 12,
        opacity: 0.8
      }}>
        STEP {step.number}
      </div>
      <h3 style={{
        fontFamily: "'Orbitron', sans-serif", fontSize: 15,
        color: "#fff", fontWeight: 700, marginBottom: 12, lineHeight: 1.4
      }}>
        {step.title}
      </h3>
      <p style={{
        color: "rgba(255,255,255,0.55)", fontFamily: "'Exo 2', sans-serif",
        fontSize: 14, lineHeight: 1.75
      }}>
        {step.desc}
      </p>
    </motion.div>
  );
}

// ─── CONTACT / SOCIAL SECTION ────────────────────────────────────────────────
function ContactSection() {
  const contacts = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      sub: "+27 61 922 9670",
      desc: "Fastest response — usually within minutes",
      href: waLink("Hi! I'd like to get in touch with Coded For You."),
      color: "#25D366",
      gradient: "linear-gradient(135deg, #25D366, #128C7E)",
    },
    {
      icon: Instagram,
      label: "Instagram",
      sub: "@CodedForYou.codes",
      desc: "Follow us for AI tips and project showcases",
      href: `https://instagram.com/${INSTAGRAM}`,
      color: "#E1306C",
      gradient: "linear-gradient(135deg, #E1306C, #833AB4)",
    },
    {
      icon: Mail,
      label: "Email",
      sub: "coded.for.you.king@gmail.com",
      desc: "For detailed briefs, proposals & partnerships",
      href: `mailto:${GMAIL}`,
      color: "#00B4FF",
      gradient: "linear-gradient(135deg, #00B4FF, #0066FF)",
    },
  ];

  return (
    <section id="contact" style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      <GlowCircle x="calc(50% - 400px)" y="-50px" size={800} opacity={0.06} />

      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.2)", borderRadius: 99, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 12, letterSpacing: "0.15em" }}>GET IN TOUCH</span>
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(26px, 4vw, 44px)", color: "#fff", fontWeight: 800, lineHeight: 1.2 }}>
            Let's Build Something<br /><span style={{ color: "#00B4FF" }}>Extraordinary Together</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Exo 2', sans-serif", fontSize: 16, maxWidth: 420, margin: "14px auto 0", lineHeight: 1.7 }}>
            Reach out through any channel — we typically respond within the hour.
          </p>
        </motion.div>

        {/* Contact rows inside a single glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            boxShadow: "0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              style={{
                display: "flex", alignItems: "center", gap: 20,
                padding: "22px 28px",
                textDecoration: "none",
                borderBottom: i < contacts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                transition: "background 0.25s",
                cursor: "pointer",
              }}
            >
              {/* Gradient icon circle */}
              <div style={{
                width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                background: c.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 20px ${c.color}35`,
              }}>
                <c.icon size={22} color="#fff" />
              </div>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: "#fff", fontWeight: 700, marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: c.color, fontWeight: 600, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.sub}</div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{c.desc}</div>
              </div>

              {/* Arrow */}
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: `${c.color}14`,
                border: `1px solid ${c.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.25s",
              }}>
                <ArrowRight size={15} color={c.color} />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Bottom note */}
        <p style={{ textAlign: "center", marginTop: 20, color: "rgba(255,255,255,0.22)", fontFamily: "'Exo 2', sans-serif", fontSize: 12 }}>
          Available Mon – Sat · 8am – 8pm SAST
        </p>
      </div>
    </section>
  );
}

function CTAParticle({ delay, x, y, size }) {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        position: "absolute", left: x, top: y,
        width: size, height: size, borderRadius: "50%",
        background: "rgba(0,180,255,0.4)",
        filter: "blur(1px)", pointerEvents: "none"
      }}
    />
  );
}

const CTA_PARTICLES = [
  { delay: 0,   x: "8%",  y: "20%", size: 4 },
  { delay: 0.5, x: "15%", y: "65%", size: 6 },
  { delay: 1,   x: "22%", y: "35%", size: 3 },
  { delay: 1.5, x: "75%", y: "15%", size: 5 },
  { delay: 0.8, x: "82%", y: "55%", size: 4 },
  { delay: 0.3, x: "90%", y: "75%", size: 7 },
  { delay: 1.2, x: "60%", y: "80%", size: 3 },
  { delay: 0.6, x: "45%", y: "10%", size: 5 },
];

const CTA_STATS = [
  { value: "340%", label: "avg lead increase" },
  { value: "60%",  label: "cost reduction" },
  { value: "24/7", label: "automated ops" },
];

function CTA() {
  return (
    <section style={{ padding: "80px 24px 100px", position: "relative", overflow: "hidden" }}>
      {/* Deep background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,60,120,0.35) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Animated particles */}
      {CTA_PARTICLES.map((p, i) => <CTAParticle key={i} {...p} />)}

      {/* Diagonal accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent 0%, rgba(0,180,255,0.5) 40%, rgba(0,180,255,0.8) 50%, rgba(0,180,255,0.5) 60%, transparent 100%)",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            borderRadius: 28,
            overflow: "hidden",
            /* Glassmorphism outer container */
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: "0 0 80px rgba(0,180,255,0.12), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          className="cta-grid"
        >
          {/* LEFT — headline + stats */}
          <div style={{
            background: "rgba(0,20,60,0.45)",
            padding: "64px 56px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Corner accent */}
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,180,255,0.12) 0%, transparent 70%)",
              pointerEvents: "none"
            }} />

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.25)",
                borderRadius: 99, padding: "5px 14px", marginBottom: 28
              }}>
                <Zap size={12} color="#00B4FF" />
                <span style={{ color: "#00B4FF", fontFamily: "'Exo 2', sans-serif", fontSize: 11, letterSpacing: "0.15em" }}>
                  READY TO SCALE?
                </span>
              </div>

              <h2 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(22px, 3.2vw, 40px)", color: "#fff", fontWeight: 900,
                lineHeight: 1.15, marginBottom: 20,
              }}>
                Put Your Business<br />
                <span style={{
                  background: "linear-gradient(90deg, #00B4FF, #7B61FF)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>
                  On Autopilot
                </span>
              </h2>

              <p style={{
                color: "rgba(255,255,255,0.55)", fontFamily: "'Exo 2', sans-serif",
                fontSize: 15, lineHeight: 1.75, marginBottom: 44, maxWidth: 380
              }}>
                A 15-minute conversation could uncover thousands in automated revenue. Let's build something extraordinary.
              </p>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 32 }}>
                {CTA_STATS.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div style={{
                      fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(18px, 2.5vw, 26px)",
                      fontWeight: 900, color: "#00B4FF", lineHeight: 1
                    }}>{s.value}</div>
                    <div style={{
                      fontFamily: "'Exo 2', sans-serif", fontSize: 11,
                      color: "rgba(255,255,255,0.38)", marginTop: 4, letterSpacing: "0.05em"
                    }}>{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — action panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            style={{
              background: "rgba(0,180,255,0.04)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "64px 48px",
              display: "flex", flexDirection: "column", justifyContent: "center",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Grid dot pattern */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(0,180,255,0.08) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              pointerEvents: "none", borderRadius: "inherit"
            }} />

            <div style={{ position: "relative" }}>
              <p style={{
                fontFamily: "'Orbitron', sans-serif", fontSize: 11,
                color: "rgba(0,180,255,0.7)", letterSpacing: "0.2em", marginBottom: 24
              }}>
                START TODAY — FREE CONSULTATION
              </p>

              {/* Primary CTA */}
              <motion.a
                href={waLink("Hi! I'm ready to discuss automating my business with Coded For You. Can we set up a time to chat?")}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(37,211,102,0.5)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "18px 28px", borderRadius: 14,
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  color: "#fff", textDecoration: "none",
                  fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 700,
                  letterSpacing: "0.04em",
                  boxShadow: "0 0 24px rgba(37,211,102,0.3)",
                  marginBottom: 14,
                }}
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </motion.a>

              {/* Secondary CTA */}
              <motion.a
                href="#services"
                whileHover={{ scale: 1.01, borderColor: "rgba(0,180,255,0.6)" }}
                whileTap={{ scale: 0.99 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  padding: "16px 28px", borderRadius: 14,
                  background: "rgba(0,180,255,0.06)",
                  border: "1px solid rgba(0,180,255,0.25)",
                  color: "#fff", textDecoration: "none",
                  fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 600,
                  letterSpacing: "0.04em",
                  transition: "all 0.25s",
                  marginBottom: 32,
                }}
              >
                <Eye size={16} color="#00B4FF" />
                <span style={{ color: "#00B4FF" }}>Explore Services</span>
              </motion.a>

              {/* Trust badges */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "✓ Free consultation — no commitment",
                  "✓ Results in as little as 7 days",
                  "✓ South African based team",
                ].map(text => (
                  <div key={text} style={{
                    fontFamily: "'Exo 2', sans-serif", fontSize: 12,
                    color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 8
                  }}>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Inline responsive style */}
      <style>{`
        @media (max-width: 768px) {
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "60px 24px 32px",
      borderTop: "1px solid rgba(0,180,255,0.1)",
      position: "relative"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <img src={LOGO_SRC} alt="CFY" loading="lazy" decoding="async" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", filter: "drop-shadow(0 0 8px rgba(0,180,255,0.5))" }} />
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: "#fff", fontWeight: 700 }}>
                  CODED FOR YOU
                </div>
                <div style={{ color: "#00B4FF", fontSize: 10, fontFamily: "'Exo 2', sans-serif", letterSpacing: "0.15em" }}>
                  AI AUTOMATION AGENCY
                </div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Exo 2', sans-serif", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              Building smart digital systems that capture leads, respond instantly, and run your operations 24/7.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "#00B4FF", letterSpacing: "0.15em", marginBottom: 20 }}>
              SERVICES
            </h4>
            {["AI Sales Agents", "WhatsApp Automations", "Lead Triage Systems", "Custom Web Systems", "Voice AI Receptionists", "AI Strategy & Audit"].map(s => (
              <div key={s} style={{ marginBottom: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "'Exo 2', sans-serif" }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, color: "#00B4FF", letterSpacing: "0.15em", marginBottom: 20 }}>
              CONNECT
            </h4>
            {[
              {
                href: waLink("Hi! I'd like to connect with Coded For You."),
                icon: MessageCircle,
                label: "WhatsApp Us",
                color: "#25D366"
              },
              {
                href: `mailto:${GMAIL}`,
                icon: Mail,
                label: GMAIL,
                color: "#00B4FF"
              },
              {
                href: `https://instagram.com/${INSTAGRAM}`,
                icon: Instagram,
                label: `@${INSTAGRAM}`,
                color: "#E1306C"
              }
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  color: "rgba(255,255,255,0.55)", textDecoration: "none",
                  fontFamily: "'Exo 2', sans-serif", fontSize: 13, marginBottom: 14,
                  transition: "color 0.3s"
                }}
                onMouseEnter={e => { e.currentTarget.style.color = link.color; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
              >
                <link.icon size={15} style={{ flexShrink: 0 }} />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(0,180,255,0.08)",
          paddingTop: 24, display: "flex", justifyContent: "center",
          alignItems: "center"
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Exo 2', sans-serif", fontSize: 13 }}>
            © {new Date().getFullYear()} Coded For You. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── BOOKING MODAL ───────────────────────────────────────────────────────────
function BookingModal({ service, onClose }) {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");

  if (!service) return null;

  const handleBook = () => {
    const custom = message.trim();
    const fullMsg = `Hi! I'm ${name || "a potential client"}${business ? ` from ${business}` : ""}.\n\n${service.msg}${custom ? `\n\nAdditional info: ${custom}` : ""}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fullMsg)}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          style={{ width: "100%", maxWidth: 520 }}
        >
          <GlassCard style={{
            padding: 36,
            border: `1px solid ${service.color}33`,
            boxShadow: `0 0 60px ${service.color}22`
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: `${service.color}18`, border: `1px solid ${service.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <service.icon size={24} color={service.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
                  Book: {service.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Exo 2', sans-serif", fontSize: 13 }}>
                  We'll connect via WhatsApp to discuss your needs
                </p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Your Name", val: name, set: setName, placeholder: "e.g. John Smith" },
                { label: "Business Name", val: business, set: setBusiness, placeholder: "e.g. Smith Consulting" }
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: "block", fontFamily: "'Exo 2', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 8 }}>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(0,180,255,0.2)", borderRadius: 8,
                      padding: "12px 16px", color: "#fff",
                      fontFamily: "'Exo 2', sans-serif", fontSize: 14,
                      outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontFamily: "'Exo 2', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 8 }}>
                  Anything Specific? (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us a bit about your business or specific requirements..."
                  rows={3}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(0,180,255,0.2)", borderRadius: 8,
                    padding: "12px 16px", color: "#fff",
                    fontFamily: "'Exo 2', sans-serif", fontSize: 14,
                    outline: "none", resize: "vertical", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Action */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37,211,102,0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBook}
              style={{
                width: "100%", marginTop: 24, padding: "16px",
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                border: "none", borderRadius: 10,
                color: "#fff", fontFamily: "'Orbitron', sans-serif",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                letterSpacing: "0.05em",
                boxShadow: "0 0 20px rgba(37,211,102,0.3)"
              }}
            >
              <MessageCircle size={18} />
              Continue to WhatsApp
            </motion.button>

            <p style={{
              textAlign: "center", marginTop: 12,
              color: "rgba(255,255,255,0.3)", fontFamily: "'Exo 2', sans-serif", fontSize: 12
            }}>
              You'll be redirected to WhatsApp to start the conversation
            </p>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── LIVE CHATBOT ────────────────────────────────────────────────────────────
const CFY_SYSTEM_PROMPT = `You are Zara, the friendly AI assistant for Coded For You — a South African AI automation agency. You help website visitors learn about services, answer questions, and guide them toward booking a consultation via WhatsApp.

ABOUT CODED FOR YOU:
- AI automation agency based in South Africa
- WhatsApp: +27 61 922 9670
- Instagram: @CodedForYou.codes
- Email: coded.for.you.king@gmail.com

SERVICES OFFERED (9 services):
1. AI Website Chatbots — 24/7 lead capture bots for websites
2. WhatsApp Automation — automated replies, follow-ups, broadcasts
3. Automated Appointment Booking — online booking, reminders, calendar sync
4. Customer Support Bots — resolve 80% of queries instantly
5. Social Media Management — content creation, scheduling, engagement
6. Lead Generation & Follow-Up — drip campaigns, auto follow-ups
7. Email Marketing Workflows — sequences, segmentation, A/B testing
8. SEO & Blog Automation — AI content, keyword research, rank tracking
9. Custom AI Virtual Assistants — branded AI trained on your business

KEY RESULTS: 340% avg lead increase, 60% cost reduction, 24/7 automated operations, 80% auto-resolution of queries.

YOUR PERSONALITY:
- Warm, professional, helpful, enthusiastic about AI
- Use short paragraphs, max 3-4 sentences per reply
- Use occasional emojis to keep it friendly (not excessive)
- Always end responses by offering to connect them to WhatsApp or asking a follow-up question
- If someone seems ready to buy, direct them to WhatsApp immediately
- Never make up prices — say pricing depends on scope and to chat on WhatsApp for a custom quote

NAVIGATION HELP:
- About section → #about
- Services → #services
- Our Work/Gallery → #gallery
- Why Choose Us → #why-us
- Testimonials → #testimonials
- Contact → #contact`;

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! 👋 I'm Zara, your CFY assistant. I can help you learn about our AI automation services, answer questions, or guide you to the right section. What brings you here today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, messages]);

  // Pulse open after 8s to draw attention
  useEffect(() => {
    const t = setTimeout(() => setUnread(u => u > 0 ? u : 1), 8000);
    return () => clearTimeout(t);
  }, []);

  const sendText = async (text) => {
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          system: CFY_SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I had trouble connecting. Please reach out on WhatsApp directly! 📱";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Looks like I lost connection 😅 You can reach us directly on WhatsApp at +27 61 922 9670!" }]);
    } finally {
      setLoading(false);
    }
  };

  const send = () => sendText(input.trim());
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const quickReplies = ["What services do you offer?", "How much does it cost?", "Book a consultation", "Show me your work"];

  return (
    <>
      {/* ── Floating bubble ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        animate={!open && unread > 0 ? { scale: [1, 1.12, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 999,
          width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #00B4FF, #0055FF)",
          boxShadow: "0 0 30px rgba(0,180,255,0.5), 0 8px 32px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          <motion.div key={open ? "close" : "chat"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            {open ? <X size={22} color="#fff" /> : <MessageSquare size={22} color="#fff" />}
          </motion.div>
        </AnimatePresence>
        {!open && unread > 0 && (
          <div style={{
            position: "absolute", top: -4, right: -4, width: 18, height: 18,
            background: "#FF4444", borderRadius: "50%", border: "2px solid #050505",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "#fff", fontFamily: "'Exo 2', sans-serif", fontWeight: 700
          }}>{unread}</div>
        )}
      </motion.button>

      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "fixed", bottom: 100, right: 28, zIndex: 998,
              width: "min(380px, calc(100vw - 40px))",
              borderRadius: 20, overflow: "hidden",
              background: "rgba(8,10,20,0.92)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(0,180,255,0.2)",
              boxShadow: "0 0 60px rgba(0,180,255,0.12), 0 24px 64px rgba(0,0,0,0.7)",
              display: "flex", flexDirection: "column",
              maxHeight: "min(560px, calc(100vh - 130px))"
            }}
          >
            {/* Header */}
            <div style={{
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: "1px solid rgba(0,180,255,0.1)",
              background: "rgba(0,180,255,0.06)"
            }}>
              <div style={{ position: "relative" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00B4FF, #0055FF)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 16px rgba(0,180,255,0.4)"
                }}>
                  <Bot size={20} color="#fff" />
                </div>
                <div style={{
                  position: "absolute", bottom: 1, right: 1, width: 10, height: 10,
                  background: "#00C896", borderRadius: "50%", border: "2px solid rgba(8,10,20,0.9)"
                }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, color: "#fff", fontWeight: 700 }}>Zara</div>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 11, color: "#00C896" }}>● Online — CFY Assistant</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages" style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
                >
                  {m.role === "assistant" && (
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #00B4FF, #0055FF)",
                      display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, alignSelf: "flex-end"
                    }}>
                      <Bot size={13} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: "78%", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    background: m.role === "user"
                      ? "linear-gradient(135deg, #00B4FF, #0055FF)"
                      : "rgba(255,255,255,0.06)",
                    border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: "#fff", fontFamily: "'Exo 2', sans-serif", fontSize: 13, lineHeight: 1.6,
                    whiteSpace: "pre-wrap"
                  }}>
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #00B4FF, #0055FF)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Bot size={13} color="#fff" />
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => (
                      <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#00B4FF" }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && !loading && (
              <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {quickReplies.map(q => (
                  <button key={q} onClick={() => sendText(q)}
                    style={{
                      background: "rgba(0,180,255,0.08)", border: "1px solid rgba(0,180,255,0.25)",
                      borderRadius: 99, padding: "5px 12px", color: "#00B4FF",
                      fontFamily: "'Exo 2', sans-serif", fontSize: 11, cursor: "pointer",
                      transition: "all 0.2s", whiteSpace: "nowrap"
                    }}
                    onMouseEnter={e => e.target.style.background = "rgba(0,180,255,0.16)"}
                    onMouseLeave={e => e.target.style.background = "rgba(0,180,255,0.08)"}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: "10px 12px 12px",
              borderTop: "1px solid rgba(0,180,255,0.08)",
              display: "flex", gap: 8, alignItems: "flex-end"
            }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask Zara anything..."
                rows={1}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(0,180,255,0.2)", borderRadius: 12,
                  padding: "10px 14px", color: "#fff", fontFamily: "'Exo 2', sans-serif", fontSize: 13,
                  outline: "none", resize: "none", lineHeight: 1.5,
                  maxHeight: 80, overflowY: "auto"
                }}
              />
              <motion.button
                onClick={send}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 40, height: 40, borderRadius: "50%", border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                  background: input.trim() && !loading ? "linear-gradient(135deg, #00B4FF, #0055FF)" : "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: input.trim() ? "0 0 16px rgba(0,180,255,0.35)" : "none",
                  transition: "all 0.2s", flexShrink: 0
                }}
              >
                <Send size={16} color={input.trim() && !loading ? "#fff" : "rgba(255,255,255,0.3)"} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);

  return (
    <>
      {/* Preconnect for faster font loading */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Exo+2:wght@400;500;600;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #050505; color: #fff; font-family: 'Exo 2', sans-serif; overflow-x: hidden; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: rgba(0,180,255,0.25); border-radius: 99px; }

        input, textarea { font-family: 'Exo 2', sans-serif; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        input:focus, textarea:focus { border-color: rgba(0,180,255,0.5) !important; box-shadow: 0 0 0 3px rgba(0,180,255,0.08) !important; outline: none; }

        /* GPU-accelerate animated elements */
        .gpu { will-change: transform; transform: translateZ(0); }

        /* Defer rendering cost of off-screen sections */
        section { content-visibility: auto; contain-intrinsic-size: 0 600px; }

        /* Prevent layout shift on images — explicit size beats auto */
        img { max-width: 100%; display: block; }

        /* FOOTER */
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }

        /* MOBILE SECTION SPACING */
        @media (max-width: 768px) {
          section { padding-top: 56px !important; padding-bottom: 56px !important; }
        }

        /* CHATBOT MESSAGES */
        .chat-messages::-webkit-scrollbar { display: none; }
        .chat-messages { scrollbar-width: none; }

        /* Smooth GPU compositing for framer-motion elements */
        [data-framer-component-type], .motion-div { transform: translateZ(0); }
      `}</style>

      <AnimatePresence>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Navbar />
          <main>
            <Hero />
            <About />
            <Services onBook={setBooking} />
            <WhyUs />
            <Gallery />
            <Testimonials />
            <ContactSection />
            <CTA />
          </main>
          <Footer />
        </motion.div>
      )}

      <AnimatePresence>
        {booking && <BookingModal service={booking} onClose={() => setBooking(null)} />}
      </AnimatePresence>

      <Chatbot />
    </>
  );
}
