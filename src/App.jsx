import { useState, useEffect, useRef } from "react";

const useCountUp = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
};

const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Certifications", "Why Hire Me", "Contact"];

const SKILLS = [
  { cat: "Analytics & BI", items: [{ name: "Power BI", pct: 90 }, { name: "Advanced Excel", pct: 92 }, { name: "KPI Dashboards", pct: 88 }, { name: "Data Visualization", pct: 85 }] },
  { cat: "Programming", items: [{ name: "Python", pct: 75 }, { name: "SQL", pct: 72 }, { name: "Pandas / NumPy", pct: 70 }, { name: "Scikit-learn", pct: 65 }] },
  { cat: "Business Skills", items: [{ name: "Business Reporting", pct: 90 }, { name: "Operational Analysis", pct: 85 }, { name: "Process Improvement", pct: 82 }, { name: "Stakeholder Mgmt", pct: 80 }] },
];

const CERTS = [
  { title: "IBM Data Analyst Professional Certificate", org: "Coursera / IBM", status: "In Progress", icon: "📊" },
  { title: "Advanced Excel Using AI Tools", org: "Accelerex", year: "2025", icon: "📗" },
  { title: "Data Analytics Job Simulation", org: "Deloitte (Forage)", year: "2025", icon: "🔵" },
  { title: "Paper Presentation – IFCGTB 2025", org: "INBUSH ERA World Summit, Amity University", year: "2025", icon: "🏆" },
];

const MODEL_DATA = [
  { model: "Logistic Regression", accuracy: 90.48, precision: 87.65, recall: 89.87, f1: 88.75 },
  { model: "Decision Tree", accuracy: 87.83, precision: 83.33, recall: 88.61, f1: 85.89 },
  { model: "Random Forest", accuracy: 93.12, precision: 90.24, recall: 93.67, f1: 91.93 },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id) => {
    const key = id === "Why Hire Me" ? "whyhire" : id.toLowerCase();
    document.getElementById(key)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(6,14,35,0.97)" : "rgba(6,14,35,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(37,99,235,0.12)", transition: "all 0.3s" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 1, flexShrink: 0 }}>
          AK<span style={{ color: "#2563eb" }}>.</span>
        </div>
        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "1.4rem", flexWrap: "nowrap", overflow: "hidden" }} className="desktop-nav">
          {NAV_LINKS.map(n => (
            <button key={n} onClick={() => scrollTo(n)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 11, cursor: "pointer", letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s", whiteSpace: "nowrap", padding: "4px 0" }}
              onMouseEnter={e => e.target.style.color = "#2563eb"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}>{n}</button>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 4 }} className="hamburger">☰</button>
      </nav>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 99, background: "rgba(6,14,35,0.98)", borderBottom: "1px solid rgba(37,99,235,0.2)", padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(n => (
            <button key={n} onClick={() => scrollTo(n)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 14, cursor: "pointer", textAlign: "left", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>{n}</button>
          ))}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } .hamburger { display: block !important; } }
      `}</style>
    </>
  );
}

function LiveSparkline({ color = "#2563eb", height = 36, animated = true }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const dataRef = useRef(Array.from({ length: 28 }, (_, i) => 40 + Math.sin(i * 0.4) * 18 + Math.random() * 12));
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let tick = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const data = dataRef.current;
      if (animated && tick % 6 === 0) {
        data.shift();
        data.push(30 + Math.random() * 40);
      }
      const min = Math.min(...data), max = Math.max(...data);
      const range = max - min || 1;
      const pts = data.map((v, i) => [i * (w / (data.length - 1)), h - ((v - min) / range) * (h - 6) - 3]);
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + "44");
      grad.addColorStop(1, color + "00");
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      ctx.beginPath();
      pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
      ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
      tick++;
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [color, animated]);
  return <canvas ref={canvasRef} width={200} height={height} style={{ width: "100%", height }} />;
}

function FloatingWidget({ style, children }) {
  return (
    <div style={{ position: "absolute", background: "rgba(8,18,48,0.85)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 14, backdropFilter: "blur(16px)", padding: "14px 18px", ...style }}>
      {children}
    </div>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const rotating = ["Business Analyst", "Data Analyst", "Reporting Analyst", "MIS Analyst"];
  const currentRole = rotating[tick % rotating.length];

  const metrics = [
    { label: "Revenue Analyzed", val: "$1.20M", delta: "+12.4%", up: true, color: "#2563eb" },
    { label: "Model Accuracy", val: "93.1%", delta: "+5.3%", up: true, color: "#10b981" },
    { label: "KPI Dashboards", val: "2 Built", delta: "Power BI", up: true, color: "#8b5cf6" },
    { label: "Data Records", val: "944+", delta: "ML Dataset", up: true, color: "#f59e0b" },
  ];

  return (
    <section id="hero" style={{ minHeight: "100vh", background: "#060e23", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "7rem 2rem 5rem" }}>

      {/* Layered background: fine grid + radial glow zones */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: "radial-gradient(ellipse, rgba(37,99,235,0.13) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 360, height: 360, background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", left: "3%", width: 280, height: 280, background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── FLOATING WIDGETS ── */}

      {/* Top-left: Live sales chart widget */}
      <FloatingWidget style={{ top: "12%", left: "3%", width: 200, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s 0.6s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>TOTAL SALES</span>
          <span style={{ fontSize: 11, color: "#10b981", fontFamily: "'DM Sans', sans-serif", background: "rgba(16,185,129,0.12)", borderRadius: 100, padding: "2px 7px" }}>↑ 12.4%</span>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700, marginBottom: 8 }}>$1.20M</div>
        <LiveSparkline color="#2563eb" height={36} />
      </FloatingWidget>

      {/* Top-right: Accuracy gauge widget */}
      <FloatingWidget style={{ top: "10%", right: "3%", width: 176, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s 0.75s ease" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 8 }}>MODEL ACCURACY</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#10b981", fontWeight: 700, lineHeight: 1 }}>93.1%</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>F1: 91.9</span>
        </div>
        {/* Segmented arc-style bar */}
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 2, background: i < 18 ? (i < 14 ? "#2563eb" : "#10b981") : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>Random Forest Classifier</div>
      </FloatingWidget>

      {/* Mid-left: KPI sparkline widget */}
      <FloatingWidget style={{ top: "42%", left: "1%", width: 186, opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(-20px)", transition: "all 0.9s 0.9s ease" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5, marginBottom: 6 }}>OUTLET PERFORMANCE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[["Tier 3", 39, "#2563eb"], ["Tier 2", 33, "#8b5cf6"], ["Tier 1", 28, "#10b981"]].map(([t, pct, c]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", width: 36, fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
              <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                <div style={{ width: `${pct * 2.2}%`, height: "100%", background: c, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: c, fontFamily: "'DM Sans', sans-serif", width: 26 }}>{pct}%</span>
            </div>
          ))}
        </div>
      </FloatingWidget>

      {/* Mid-right: Notification-style insight widget */}
      <FloatingWidget style={{ top: "38%", right: "1%", width: 210, opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(20px)", transition: "all 0.9s 1s ease" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>📊</div>
          <div>
            <div style={{ fontSize: 12, color: "#fff", fontWeight: 600, marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>Insight Generated</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>Supermarket Type 1 drives 65% of total Blinkit revenue</div>
          </div>
        </div>
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, display: "flex", gap: 6 }}>
          {["Power BI", "KPI", "EDA"].map(tag => (
            <span key={tag} style={{ fontSize: 10, background: "rgba(37,99,235,0.15)", borderRadius: 100, padding: "2px 8px", color: "#93c5fd", fontFamily: "'DM Sans', sans-serif" }}>{tag}</span>
          ))}
        </div>
      </FloatingWidget>

      {/* Bottom-left: Mini donut */}
      <FloatingWidget style={{ bottom: "8%", left: "4%", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)", transition: "all 0.9s 1.1s ease" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="16" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
            <circle cx="22" cy="22" r="16" fill="none" stroke="#2563eb" strokeWidth="5" strokeDasharray="63 37" strokeDashoffset="25" />
            <circle cx="22" cy="22" r="16" fill="none" stroke="#10b981" strokeWidth="5" strokeDasharray="37 63" strokeDashoffset="-38" />
            <text x="22" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="sans-serif">64%</text>
          </svg>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Fat Content Split</div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb" }} /><span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Low Fat</span></div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} /><span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Regular</span></div>
            </div>
          </div>
        </div>
      </FloatingWidget>

      {/* Bottom-right: Tools badge stack */}
      <FloatingWidget style={{ bottom: "10%", right: "4%", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)", transition: "all 0.9s 1.2s ease" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, letterSpacing: 0.5 }}>TECH STACK</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Power BI", "Python", "Excel", "SQL", "Pandas", "Scikit-learn"].map(t => (
            <span key={t} style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 8px", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
          ))}
        </div>
      </FloatingWidget>

      {/* ── MAIN CONTENT ── */}
      <div style={{ textAlign: "center", maxWidth: 780, position: "relative", zIndex: 2, opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(36px)", transition: "all 1s 0.1s cubic-bezier(0.16,1,0.3,1)" }}>

        {/* Dual status pills */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 100, padding: "6px 18px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#6ee7b7", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Available · Delhi NCR</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 100, padding: "6px 18px" }}>
            <span style={{ fontSize: 11, color: "#93c5fd", letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>🔵 Deloitte Forage · IBM Data Analyst (In Progress)</span>
          </div>
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 6, letterSpacing: -0.5 }}>
          Abhinav Kumar
        </h1>

        {/* Animated role switcher with consultancy framing */}
        <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, overflow: "hidden" }}>
          <div key={currentRole} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)", color: "#2563eb", fontWeight: 700, letterSpacing: 0.3, animation: "fadeSlideUp 0.45s ease" }}>
            {currentRole}
          </div>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
          Business Intelligence · Analytics · Reporting
        </div>

        {/* Value proposition — consulting language, not student language */}
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.85, maxWidth: 580, margin: "0 auto 40px", fontFamily: "'DM Sans', sans-serif" }}>
          I convert messy operational data into decisions that move the business forward — through Power BI dashboards, KPI frameworks, and predictive models that stakeholders actually use. Two years of operations experience. Two end-to-end analytics engagements. One clear focus: <span style={{ color: "#fff", fontWeight: 600 }}>insight that drives action.</span>
        </p>

        {/* CTA row — resume download as primary action */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
          {/* PRIMARY: Download Resume */}
          <button
            onClick={() => {
              window.open('/Abhinav_Kumar_Resume.pdf', '_blank');
              
              
           
             
            }}
          
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", borderRadius: 10, padding: "15px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 9, boxShadow: "0 4px 24px rgba(37,99,235,0.35)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,99,235,0.35)"; }}>
            <span style={{ fontSize: 16 }}>↓</span> Download Resume
          </button>
          {/* SECONDARY: View case studies */}
          <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{ background: "rgba(255,255,255,0.04)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "15px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.55)"; e.currentTarget.style.background = "rgba(37,99,235,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
            View Case Studies →
          </button>
          {/* TERTIARY: Contact */}
          <a href="mailto:mailmesrivastava.avi@gmail.com"
            style={{ background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "15px 22px", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
            ✉ Email
          </a>
        </div>

        {/* Proof metrics — real numbers, no fabricated deltas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { label: "Revenue Analyzed", val: "$1.20M", sub: "Blinkit BI engagement", color: "#FFCD00" },
            { label: "ML Model Accuracy", val: "93.1%", sub: "Random Forest · F1: 91.9", color: "#10b981" },
            { label: "Experience", val: "2.8 yrs", sub: "Operational analytics", color: "#2563eb" },
            { label: "MBA CGPA", val: "8.24", sub: "Amity · MBA Completed 2026", color: "#8b5cf6" },
          ].map((m, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 14px", textAlign: "left", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)", transition: `all 0.6s ${0.3 + i * 0.07}s ease`, cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + "44"; e.currentTarget.style.background = m.color + "08"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: m.color, fontWeight: 700, lineHeight: 1, marginBottom: 6 }}>{m.val}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.3 }}>
          <span style={{ fontSize: 10, color: "#fff", letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Scroll to explore</span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
      `}</style>
    </section>
  );
}

function Snapshot() {
  const [ref, inView] = useInView(0.1);
  const proof = [
    { number: "$1.20M", label: "Revenue data analyzed", context: "Blinkit Power BI dashboard", color: "#FFCD00" },
    { number: "93.1%", label: "ML model accuracy achieved", context: "Launched Global internship project", color: "#10b981" },
    { number: "2.8 yrs", label: "Operational analytics experience", context: "Northscape Group", color: "#2563eb" },
    { number: "8.24", label: "MBA CGPA", context: "Amity International Business School", color: "#8b5cf6" },
  ];
  const differentiators = [
    { headline: "I don't just build dashboards — I answer business questions.", body: "Most analysts stop at visualizations. I start with 'what decision does this data need to enable?' — then build the reporting infrastructure backward from that question. My Blinkit dashboard didn't just show sales; it surfaced where to expand next and which outlet format had the highest ROI.", icon: "💡" },
    { headline: "Operational experience makes my analysis practical, not theoretical.", body: "Three years inside operations at Northscape Group means I understand the messy reality of business data — inconsistent records, missing fields, shifting KPI definitions. I've built reports that real teams actually used, under real business pressure.", icon: "⚙️" },
    { headline: "I translate numbers into decisions, not just charts.", body: "My Machine Failure Prediction project wasn't about hitting 93% accuracy — it was about reducing unplanned downtime costs. I frame every analysis in terms of the business outcome it enables, which is the language that matters to stakeholders.", icon: "📊" },
  ];
  return (
    <section id="about" style={{ padding: "7rem 2rem", background: "#080f26" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>About</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 0 }}>Why Abhinav Kumar?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 48, alignItems: "start", marginBottom: 48 }}>
          {/* Left: Quantified proof */}
          <div style={{ opacity: inView ? 1 : 0, transition: "all 0.6s ease" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Quantified Track Record</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {proof.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 20px", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", borderRadius: 12, border: "1px solid transparent", transition: "all 0.2s", cursor: "default" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "33"; e.currentTarget.style.background = p.color + "08"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"; }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: p.color, minWidth: 80, lineHeight: 1 }}>{p.number}</div>
                  <div>
                    <div style={{ fontSize: 13, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 3 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{p.context}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Differentiator statements */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {differentiators.map((d, i) => (
              <div key={i} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ${0.1 + i * 0.13}s ease`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginTop: 2 }}>{d.icon}</div>
                <div>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 6, lineHeight: 1.4 }}>{d.headline}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>{d.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Recruiter positioning strip */}
        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(37,99,235,0.03) 100%)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 16, padding: "28px 36px", opacity: inView ? 1 : 0, transition: "all 0.6s 0.5s ease", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#2563eb", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>What I bring to a Business Analytics role</div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>MBA-level business thinking combined with hands-on analytics execution. I understand the full cycle from raw data to board-level reporting — having lived it inside operations and validated it through two end-to-end analytics projects. I can own the analytics workflow independently from Day 1: extraction, cleaning, modelling, visualization, and stakeholder presentation.</p>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, minWidth: 170 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Areas of Expertise</div>
            {["Business Analytics", "Business Intelligence", "KPI Reporting", "Data Visualization", "Data-Driven Decision Making"].map((area, i) => (
              <div key={area} style={{ display: "flex", alignItems: "center", gap: 8, opacity: inView ? 1 : 0, transition: `all 0.4s ${0.7 + i * 0.06}s ease` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans', sans-serif" }}>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const [ref, inView] = useInView();
  const toolGroups = [
    {
      cat: "Visualization & BI", color: "#2563eb", icon: "📊",
      tools: [
        { name: "Power BI", proof: "Built Blinkit sales dashboard — $1.20M revenue analysis, 5 visual types, cross-filter panels" },
        { name: "Advanced Excel", proof: "Pivot Tables, VLOOKUP/XLOOKUP, conditional formatting — used daily at Northscape Group" },
        { name: "Dashboard Design", proof: "KPI cards, trend lines, donut charts, performance matrices across 2 live projects" },
      ]
    },
    {
      cat: "Programming & Data", color: "#10b981", icon: "🐍",
      tools: [
        { name: "Python + Pandas", proof: "EDA, feature engineering, data cleaning on 944-record ML dataset" },
        { name: "Scikit-learn", proof: "Trained Logistic Regression, Decision Tree, Random Forest — evaluated via F1/Recall" },
        { name: "SQL", proof: "Data querying and extraction; applied in Deloitte Forage analytics simulation" },
      ]
    },
    {
      cat: "Business Analytics", color: "#8b5cf6", icon: "📈",
      tools: [
        { name: "KPI Reporting", proof: "Tracked operational KPIs at Northscape Group — lead status, resolution times, complaint trends" },
        { name: "Data Storytelling", proof: "Translated $1.20M Blinkit dataset into 5 executive-level strategic recommendations" },
        { name: "Process Analysis", proof: "Identified workflow bottlenecks across operations & logistics teams at Northscape Group" },
      ]
    },
  ];

  const coreCompetencies = [
    "Business Requirements Gathering", "Operational Reporting", "KPI Dashboard Development",
    "Data Cleaning & Validation", "Trend & Variance Analysis", "Predictive Analytics",
    "Stakeholder Communication", "Insight-to-Action Translation", "Excel Power User",
    "Power BI Report Development", "Cross-functional Collaboration", "Problem Structuring",
  ];

  return (
    <section id="skills" style={{ padding: "7rem 2rem", background: "#060e23" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Capabilities</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 8 }}>Skills & Tools</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", maxWidth: 560 }}>Every skill listed is backed by a real project or work experience — not self-assessed percentages.</p>
        </div>

        {/* Evidence-based tool groups */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 40 }}>
          {toolGroups.map((group, gi) => (
            <div key={gi} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "28px 24px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ${gi * 0.12}s ease` }}>
              {/* Category header */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24 }}>
                <div style={{ width: 34, height: 34, background: group.color + "18", border: `1px solid ${group.color}33`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{group.icon}</div>
                <div style={{ fontSize: 11, color: group.color, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{group.cat}</div>
              </div>
              {/* Tools with proof */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {group.tools.map((tool, ti) => (
                  <div key={ti}>
                    <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>{tool.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", borderLeft: `2px solid ${group.color}40`, paddingLeft: 10 }}>{tool.proof}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core competency tags */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 18 }}>Core Competencies</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {coreCompetencies.map((t, i) => (
              <span key={i} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, padding: "7px 16px", color: "rgba(255,255,255,0.65)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", opacity: inView ? 1 : 0, transition: `all 0.4s ${i * 0.03}s ease` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const [ref, inView] = useInView();
  const achievements = [
    { what: "Built daily operational reporting system", impact: "Reduced data retrieval time for team leads by consolidating 6 manual trackers into a single Excel dashboard", metric: "6→1", metricLabel: "reports merged" },
    { what: "Led data cleanup of customer complaint pipeline", impact: "Identified 3 recurring complaint categories causing 40%+ of escalations — findings shared with ops manager to drive process fix", metric: "40%+", metricLabel: "escalations traced" },
    { what: "Owned lead tracking across the sales pipeline", impact: "Maintained structured datasets for 100+ active leads with status, follow-up dates, and resolution notes — zero data loss across tenure", metric: "100+", metricLabel: "leads tracked" },
    { what: "Delivered cross-team operational reports weekly", impact: "Coordinated with logistics & operations to produce weekly status reports consumed by 3 internal teams — stakeholder feedback consistently positive", metric: "3", metricLabel: "teams served" },
  ];

  return (
    <section id="experience" style={{ padding: "7rem 2rem", background: "#080f26" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Work History</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 0 }}>Experience</h2>
        </div>

        {/* ── 1. NORTHSCAPE GROUP — Real Work Experience ── */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36, alignItems: "start", marginBottom: 36 }}>
          {/* Company card */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "28px 24px", opacity: inView ? 1 : 0, transition: "all 0.5s 0.1s ease", position: "sticky", top: 80 }}>
            <div style={{ width: 48, height: 48, background: "rgba(37,99,235,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>🏢</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, color: "#fff", fontWeight: 700, marginBottom: 5 }}>Northscape Group</div>
            <div style={{ fontSize: 13, color: "#2563eb", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 4 }}>Back Office Executive</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Jan 2021 – Oct 2023<br />2 years 10 months</div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>Core Role</div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>Operational data management, reporting, and cross-team analytics support for a commercial operations environment.</p>
            </div>
          </div>
          {/* Achievement cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Key Contributions & Impact</div>
            {achievements.map((a, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(16px)", transition: `all 0.5s ${0.15 + i * 0.1}s ease` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)"; e.currentTarget.style.background = "rgba(37,99,235,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                <div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>{a.what}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{a.impact}</div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 64 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#2563eb", fontWeight: 700, lineHeight: 1 }}>{a.metric}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", marginTop: 3, lineHeight: 1.3 }}>{a.metricLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. LAUNCHED GLOBAL — Data Analyst Internship ── */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: "22px 28px", display: "flex", gap: 20, alignItems: "flex-start", opacity: inView ? 1 : 0, transition: "all 0.5s 0.5s ease", marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🚀</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
              <div style={{ fontSize: 15, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Data Analyst Intern (Project-Based)</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Launched Global · May–Jun 2025</div>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>Completed a project-based data analytics internship focused on predictive maintenance analytics. Built a machine failure prediction model using Python and Scikit-learn — delivering a Random Forest classifier with 93.1% accuracy and 93.7% failure recall rate as the primary business deliverable.</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {["Python", "Pandas", "Scikit-learn", "EDA", "Predictive Maintenance", "Machine Learning", "Business Reporting"].map(t => (
                <span key={t} style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#6ee7b7", fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. DELOITTE FORAGE — Job Simulation ── */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 14, padding: "22px 28px", display: "flex", gap: 20, alignItems: "flex-start", opacity: inView ? 1 : 0, transition: "all 0.5s 0.65s ease" }}>
          <div style={{ width: 40, height: 40, background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🔵</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
              <div style={{ fontSize: 15, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Data Analytics Job Simulation</div>
              <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 100, padding: "2px 10px", fontSize: 11, color: "#10b981", fontFamily: "'DM Sans', sans-serif" }}>✓ 2025</div>
            </div>
            <div style={{ fontSize: 13, color: "#93c5fd", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>Forage Virtual Program · Deloitte</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>Completed Deloitte's official analytics simulation — working through business reporting, data interpretation, and translating analytical findings into client-ready recommendations using real-world business data.</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {["Business Reporting", "Data Visualization", "Insight Generation", "Client Communication"].map(t => (
                <span key={t} style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#93c5fd", fontFamily: "'DM Sans', sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function AnimatedBar({ pct, color, delay, trigger }) {
  const [w, setW] = useState(0);
  useEffect(() => { if (trigger) setTimeout(() => setW(pct), delay); }, [trigger, pct, delay]);
  return (
    <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${w}%`, height: "100%", background: color, borderRadius: 4, transition: `width 1s ${delay}ms cubic-bezier(0.16,1,0.3,1)` }} />
    </div>
  );
}

function SalesTrendChart({ trigger }) {
  const canvasRef = useRef(null);
  const yearData = [
    { y: "2012", v: 78 }, { y: "2013", v: 130 }, { y: "2014", v: 132 },
    { y: "2015", v: 132 }, { y: "2016", v: 133 }, { y: "2017", v: 131 },
    { y: "2018", v: 205 }, { y: "2019", v: 129 }, { y: "2020", v: 125 },
    { y: "2021", v: 131 }, { y: "2022", v: 131 },
  ];
  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const pad = { l: 36, r: 16, t: 16, b: 28 };
    const max = 220, min = 60;
    const pts = yearData.map((d, i) => ({
      x: pad.l + i * ((W - pad.l - pad.r) / (yearData.length - 1)),
      y: pad.t + (1 - (d.v - min) / (max - min)) * (H - pad.t - pad.b),
      label: d.y, val: d.v,
    }));
    let progress = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // Grid lines
      [60, 100, 140, 180, 220].forEach(v => {
        const y = pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
        ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "9px DM Sans,sans-serif";
        ctx.fillText(`$${v}K`, 0, y + 3);
      });
      // X labels
      pts.forEach((p, i) => {
        if (i % 2 === 0) {
          ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "9px DM Sans,sans-serif";
          ctx.textAlign = "center"; ctx.fillText(p.label, p.x, H);
        }
      });
      // Gradient fill
      const visiblePts = pts.slice(0, Math.max(2, Math.floor(progress * pts.length)));
      if (visiblePts.length >= 2) {
        const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
        grad.addColorStop(0, "rgba(255,205,0,0.25)");
        grad.addColorStop(1, "rgba(255,205,0,0.0)");
        ctx.beginPath();
        ctx.moveTo(visiblePts[0].x, H - pad.b);
        visiblePts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(visiblePts[visiblePts.length - 1].x, H - pad.b);
        ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
        // Line
        ctx.beginPath();
        visiblePts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = "#FFCD00"; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.stroke();
        // Peak dot highlight
        const peak = pts[6];
        if (progress > 0.65) {
          ctx.beginPath(); ctx.arc(peak.x, peak.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#FFCD00"; ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "bold 10px DM Sans,sans-serif"; ctx.textAlign = "center";
          ctx.fillText("Peak $205K", peak.x, peak.y - 10);
        }
      }
      if (progress < 1) { progress = Math.min(1, progress + 0.03); requestAnimationFrame(draw); }
    };
    requestAnimationFrame(draw);
  }, [trigger]);
  return <canvas ref={canvasRef} width={520} height={130} style={{ width: "100%", height: 130 }} />;
}

function DonutChart({ segments, size = 100 }) {
  const r = 36, cx = size / 2, cy = size / 2;
  let cumPct = 0;
  const total = segments.reduce((a, s) => a + s.pct, 0);
  const arcs = segments.map(s => {
    const start = (cumPct / total) * Math.PI * 2 - Math.PI / 2;
    cumPct += s.pct;
    const end = (cumPct / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return { ...s, d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} opacity={0.9} />)}
      <circle cx={cx} cy={cy} r={22} fill="#0a1220" />
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="DM Sans,sans-serif" fontWeight="600">{segments[0].pct}%</text>
    </svg>
  );
}

function BlinkitProject() {
  const [ref, inView] = useInView(0.05);
  const [activeView, setActiveView] = useState("story");
  const Y = "#FFCD00";

  const kpis = [
    { label: "Total Sales", val: "$1.20M", sub: "Across all outlets", color: Y, icon: "💰" },
    { label: "Avg Sale / Outlet", val: "$141", sub: "Per transaction", color: "#10b981", icon: "📊" },
    { label: "SKUs Tracked", val: "8,523", sub: "Unique item types", color: "#8b5cf6", icon: "📦" },
    { label: "Avg Rating", val: "3.9★", sub: "Customer satisfaction", color: "#f59e0b", icon: "⭐" },
  ];

  const outlets = [
    { type: "Supermarket Type 1", sales: 788000, items: 5577, share: 65, color: Y },
    { type: "Grocery Store", sales: 152000, items: 1083, share: 13, color: "#10b981" },
    { type: "Supermarket Type 3", sales: 131000, items: 935, share: 11, color: "#8b5cf6" },
    { type: "Supermarket Type 2", sales: 131000, items: 928, share: 11, color: "#3b82f6" },
  ];

  const itemTypes = [
    { name: "Fruits & Veg", rev: 180, pct: 88 },
    { name: "Snack Foods", rev: 180, pct: 88 },
    { name: "Household", rev: 140, pct: 68 },
    { name: "Frozen Foods", rev: 120, pct: 59 },
    { name: "Dairy", rev: 100, pct: 49 },
    { name: "Canned", rev: 90, pct: 44 },
    { name: "Baking Goods", rev: 80, pct: 39 },
    { name: "Health & Hygiene", rev: 70, pct: 34 },
  ];

  const storyCards = [
    {
      step: "01", phase: "The Brief", icon: "🎯",
      headline: "What problem needed solving?",
      body: "Blinkit's leadership needed clarity on $1.20M in annual sales data spread across 4 outlet types, 3 city tiers, and 16 product categories. Manual Excel reports couldn't answer 'where to expand next' or 'what to stock more of.'",
      visual: "brief",
    },
    {
      step: "02", phase: "Data Work", icon: "🔧",
      headline: "How was the data prepared?",
      body: "Raw transaction data was cleaned in Excel — removing nulls, standardizing outlet codes, normalizing item categories. Over 8,500 SKU records structured for Power BI ingestion with consistent date hierarchies for trend analysis.",
      visual: "data",
    },
    {
      step: "03", phase: "The Dashboard", icon: "📊",
      headline: "What was built?",
      body: "An interactive Power BI dashboard with dynamic filter panels (Outlet Type, Size, Location), KPI cards, a 10-year sales trend line, fat-content donut, category bar charts, and an outlet performance matrix — all cross-filterable.",
      visual: "dashboard",
    },
    {
      step: "04", phase: "Key Findings", icon: "💡",
      headline: "What did the data reveal?",
      body: "Five high-impact insights emerged: Supermarket Type 1 drives 65% of revenue. Tier 3 cities outperform Tier 1. Low-fat items dominate at 64%. 2018 was peak outlet year. Fruits & Snacks lead all categories.",
      visual: "insights",
    },
    {
      step: "05", phase: "Business Impact", icon: "🚀",
      headline: "What decisions does this enable?",
      body: "Stakeholders can now filter by outlet, size, or location in real time to answer: 'Should we open more Type 1 stores in Tier 3 cities?' and 'Which categories drive volume vs margin?' — decisions powered by data, not gut feel.",
      visual: "impact",
    },
  ];

  const [activeStory, setActiveStory] = useState(0);
  const current = storyCards[activeStory];

  return (
    <div ref={ref} style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,205,0,0.2)", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease" }}>

      {/* ── CINEMATIC HEADER ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1200 0%, #0d1a08 40%, #060e23 100%)", padding: "48px 48px 0", position: "relative", overflow: "hidden" }}>
        {/* Background texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,205,0,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,205,0,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge row */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            <div style={{ background: Y, borderRadius: 100, padding: "5px 16px", fontSize: 11, color: "#1a1200", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 1 }}>⭐ STAR PROJECT · 01</div>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 }}>Power BI</div>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 }}>Advanced Excel</div>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 }}>Data Storytelling</div>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 16px", fontSize: 11, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 }}>KPI Analysis</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "end" }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
                Blinkit Sales Analysis<br /><span style={{ color: Y }}>Dashboard</span>
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, maxWidth: 560, fontFamily: "'DM Sans',sans-serif" }}>
                An end-to-end Power BI analytics solution transforming $1.20M in Blinkit sales data into executive-ready insights — covering outlet performance, category trends, location analysis, and strategic expansion signals.
              </p>
            </div>
            {/* Big number */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 700, color: Y, lineHeight: 1 }}>$1.20M</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>Total Revenue Analyzed</div>
            </div>
          </div>

          {/* KPI strip */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginTop: 36, background: "rgba(255,255,255,0.05)", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
            {kpis.map((k, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.3)", padding: "18px 20px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: k.color, fontWeight: 700 }}>{k.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VIEW SWITCHER ── */}
      <div style={{ background: "#0a1220", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 0 }}>
        {[["story", "📖 Story Arc"], ["dashboard", "📊 Dashboard"], ["analysis", "🔍 Deep Analysis"], ["insights", "💡 Insights"]].map(([key, label]) => (
          <button key={key} onClick={() => setActiveView(key)} style={{ flex: 1, padding: "15px 8px", background: activeView === key ? "rgba(255,205,0,0.08)" : "transparent", border: "none", borderBottom: activeView === key ? `2px solid ${Y}` : "2px solid transparent", color: activeView === key ? Y : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: activeView === key ? 600 : 400, transition: "all 0.2s", letterSpacing: 0.3 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ background: "#080f26", padding: "40px 48px" }}>

        {/* ════ STORY ARC VIEW ════ */}
        {activeView === "story" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: Y, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Business Storytelling</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>How this project moved from raw data to actionable strategy — the analyst's journey.</p>
            </div>

            {/* Story navigation */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
              {storyCards.map((s, i) => (
                <button key={i} onClick={() => setActiveStory(i)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, border: activeStory === i ? `1px solid ${Y}` : "1px solid rgba(255,255,255,0.1)", background: activeStory === i ? "rgba(255,205,0,0.1)" : "rgba(255,255,255,0.03)", color: activeStory === i ? Y : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.2s" }}>
                  <span>{s.icon}</span><span>{s.phase}</span>
                </button>
              ))}
            </div>

            {/* Story card */}
            <div key={activeStory} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, animation: "storyFade 0.35s ease" }}>
              <div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, background: "rgba(255,205,0,0.12)", border: "1px solid rgba(255,205,0,0.25)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{current.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>Step {current.step}</div>
                    <div style={{ fontSize: 14, color: Y, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{current.phase}</div>
                  </div>
                </div>
                <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: "#fff", fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>{current.headline}</h4>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif" }}>{current.body}</p>

                {/* Progress dots */}
                <div style={{ display: "flex", gap: 6, marginTop: 28 }}>
                  {storyCards.map((_, i) => (
                    <div key={i} onClick={() => setActiveStory(i)} style={{ width: i === activeStory ? 20 : 6, height: 6, borderRadius: 3, background: i === activeStory ? Y : "rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.3s" }} />
                  ))}
                </div>
              </div>

              {/* Right panel — contextual visual per step */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,205,0,0.12)", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {current.visual === "brief" && (
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>Scope of Work</div>
                    {[["Outlet Types", "4 categories"], ["City Tiers", "3 levels (T1/T2/T3)"], ["Product Categories", "16 item types"], ["Date Range", "2012 – 2022"], ["Total Records", "8,523 SKUs"], ["Revenue Scope", "$1.20M"]].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>{k}</span>
                        <span style={{ fontSize: 13, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {current.visual === "data" && (
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>Data Pipeline</div>
                    {[
                      { step: "Extract", desc: "Raw transaction CSV", color: "#3b82f6" },
                      { step: "Clean", desc: "Null removal, type casting, code normalization", color: Y },
                      { step: "Transform", desc: "Date hierarchies, category grouping", color: "#8b5cf6" },
                      { step: "Load", desc: "Power BI data model ingestion", color: "#10b981" },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0, marginTop: 6 }} />
                        <div>
                          <div style={{ fontSize: 12, color: s.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{s.step}</div>
                          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</div>
                        </div>
                        {i < 3 && <div style={{ marginLeft: "auto", fontSize: 14, color: "rgba(255,255,255,0.2)" }}>↓</div>}
                      </div>
                    ))}
                  </div>
                )}
                {current.visual === "dashboard" && (
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Dashboard Components</div>
                    {[
                      ["Filter Panel", "Outlet Type, Size, Location — cross-filterable"],
                      ["KPI Cards", "$1.20M Total Sales, $141 Avg, 8523 Items, 3.9★"],
                      ["Trend Line", "10-year outlet establishment curve (2012–2022)"],
                      ["Donut Chart", "Fat content split: 64% Low Fat vs 36% Regular"],
                      ["Bar Chart", "Revenue by item type — 16 categories ranked"],
                      ["Matrix Table", "Outlet type × Sales × Items × Rating"],
                    ].map(([title, desc], i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: Y, flexShrink: 0, marginTop: 6 }} />
                        <div>
                          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{title}</span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}> — {desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {current.visual === "insights" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { n: "65%", label: "Revenue from Type 1 outlets", color: Y },
                      { n: "$472K", label: "Tier 3 cities lead all locations", color: "#10b981" },
                      { n: "64%", label: "Low-fat items by volume", color: "#8b5cf6" },
                      { n: "2018", label: "Peak establishment year ($205K)", color: "#f59e0b" },
                      { n: "#1", label: "Fruits & Veg top revenue category", color: "#3b82f6" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: item.color, fontWeight: 700, minWidth: 44, textAlign: "center" }}>{item.n}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                {current.visual === "impact" && (
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Strategic Questions Answered</div>
                    {[
                      "Which outlet type should we open next?",
                      "Which city tier has the most growth potential?",
                      "What items need higher shelf allocation?",
                      "Is our product mix aligned to customer preference?",
                      "When did growth stall, and why?",
                    ].map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                        <div style={{ color: "#10b981", fontSize: 14, flexShrink: 0 }}>✓</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.5 }}>{q}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prev / Next */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button onClick={() => setActiveStory(s => Math.max(0, s - 1))} disabled={activeStory === 0} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 22px", color: activeStory === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", fontSize: 13, cursor: activeStory === 0 ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Previous</button>
              <button onClick={() => setActiveStory(s => Math.min(storyCards.length - 1, s + 1))} disabled={activeStory === storyCards.length - 1} style={{ background: activeStory === storyCards.length - 1 ? "rgba(255,205,0,0.05)" : Y, border: "none", borderRadius: 8, padding: "10px 22px", color: activeStory === storyCards.length - 1 ? "rgba(255,205,0,0.3)" : "#1a1200", fontSize: 13, cursor: activeStory === storyCards.length - 1 ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Next →</button>
            </div>
          </div>
        )}

        {/* ════ DASHBOARD VIEW ════ */}
        {activeView === "dashboard" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: Y, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Dashboard Recreation</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>A faithful reconstruction of the Power BI dashboard layout and visual components.</p>
            </div>

            {/* Browser chrome */}
            <div style={{ background: "#0d1117", border: "1px solid rgba(255,205,0,0.15)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ background: "#161b22", padding: "12px 20px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["#ff5f56","#ffbd2e","#27c93f"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                <div style={{ flex: 1, margin: "0 16px", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Blinkit Sales Analysis Dashboard · Power BI Desktop</div>
              </div>

              <div style={{ display: "flex", height: 460 }}>
                {/* Filter sidebar */}
                <div style={{ width: 130, background: Y, padding: "20px 14px", flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1200", marginBottom: 3, fontFamily: "'DM Sans',sans-serif" }}>blinkit</div>
                  <div style={{ fontSize: 8, color: "#4a3500", marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>India's Last Minute App</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: "#1a1200", marginBottom: 10, letterSpacing: 1 }}>FILTER PANEL</div>
                  {["Outlet Location Type", "Outlet Size", "Item Type"].map(f => (
                    <div key={f} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 8, color: "#4a3500", marginBottom: 3, fontFamily: "'DM Sans',sans-serif" }}>{f}</div>
                      <div style={{ background: "rgba(0,0,0,0.12)", borderRadius: 4, padding: "4px 7px", fontSize: 9, color: "#1a1200", fontFamily: "'DM Sans',sans-serif" }}>All ▾</div>
                    </div>
                  ))}
                </div>

                {/* Main area */}
                <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
                  {/* KPI Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                    {[["$1.20M","TOTAL SALES","💰"],["$141","AVG SALES","📈"],["8523","NO OF ITEMS","📦"],["3.9","AVG RATING","⭐"]].map(([v,l,ic],i) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, padding: "10px 10px 8px" }}>
                        <div style={{ fontSize: 14, color: "#fff", fontWeight: 700, fontFamily: "'Playfair Display',serif" }}>{v}</div>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Middle row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10, flex: 1 }}>
                    {/* Category bars */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "12px" }}>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>ITEM TYPE REVENUE</div>
                      {itemTypes.slice(0, 6).map((it, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 60, fontSize: 8, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", textAlign: "right" }}>{it.name}</div>
                          <AnimatedBar pct={it.pct} color={Y} delay={i * 80} trigger={true} />
                          <div style={{ width: 28, fontSize: 8, color: Y, fontFamily: "'DM Sans',sans-serif" }}>${it.rev}K</div>
                        </div>
                      ))}
                    </div>

                    {/* Fat content + outlet location */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "12px", flex: 1 }}>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>FAT CONTENT</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <DonutChart segments={[{pct:64,color:Y},{pct:36,color:"#10b981"}]} size={64} />
                          <div>
                            {[["Low Fat","64%",Y],["Regular","36%","#10b981"]].map(([l,p,c]) => (
                              <div key={l} style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
                                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif" }}>{l} {p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "12px", flex: 1 }}>
                        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 8, fontFamily: "'DM Sans',sans-serif" }}>OUTLET LOCATION</div>
                        {[["Tier 3","$472K",39],["Tier 2","$393K",33],["Tier 1","$336K",28]].map(([t,v,p]) => (
                          <div key={t} style={{ marginBottom: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>{t}</span>
                              <span style={{ fontSize: 8, color: Y, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
                            </div>
                            <AnimatedBar pct={p * 2} color={Y} delay={100} trigger={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Trend chart */}
                  <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1, marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>OUTLET ESTABLISHMENT TREND (2012–2022)</div>
                    <SalesTrendChart trigger={activeView === "dashboard"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ DEEP ANALYSIS VIEW ════ */}
        {activeView === "analysis" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: Y, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Deep Dive</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>Full breakdown of every dimension analyzed in the dashboard.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Outlet breakdown */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,205,0,0.1)", borderRadius: 16, padding: "24px" }}>
                <div style={{ fontSize: 11, color: Y, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>Outlet Type Performance</div>
                {outlets.map((o, i) => (
                  <div key={i} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{o.type}</span>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontSize: 13, color: o.color, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>${(o.sales/1000).toFixed(0)}K</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", alignSelf: "center" }}>{o.share}%</span>
                      </div>
                    </div>
                    <AnimatedBar pct={o.share} color={o.color} delay={i * 100} trigger={inView} />
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{o.items.toLocaleString()} items</div>
                  </div>
                ))}
              </div>

              {/* Location & fat content */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,205,0,0.1)", borderRadius: 16, padding: "24px", flex: 1 }}>
                  <div style={{ fontSize: 11, color: Y, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>City Tier Revenue Split</div>
                  {[{tier:"Tier 3 (Small Cities)",sales:472130,pct:39,insight:"Highest revenue — expansion opportunity"},{tier:"Tier 2 (Mid Cities)",sales:393150,pct:33,insight:"Stable growth market"},{tier:"Tier 1 (Metro)",sales:336400,pct:28,insight:"Mature, lower upside"}].map((t,i)=>(
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>{t.tier}</span>
                        <span style={{ fontSize: 13, color: Y, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>${(t.sales/1000).toFixed(0)}K</span>
                      </div>
                      <AnimatedBar pct={t.pct * 2.2} color={Y} delay={i * 120} trigger={inView} />
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{t.insight}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,205,0,0.1)", borderRadius: 16, padding: "24px" }}>
                  <div style={{ fontSize: 11, color: Y, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>Fat Content vs Revenue</div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <DonutChart segments={[{pct:64,color:Y},{pct:36,color:"#10b981"}]} size={90} />
                    <div style={{ flex: 1 }}>
                      {[{label:"Low Fat",val:"$776K",pct:"64%",color:Y},{label:"Regular",val:"$425K",pct:"36%",color:"#10b981"}].map((s,i)=>(
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans',sans-serif" }}>{s.label}</span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 13, color: s.color, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{s.val}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{s.pct} of total</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Item type ranking */}
              <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,205,0,0.1)", borderRadius: 16, padding: "24px" }}>
                <div style={{ fontSize: 11, color: Y, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>Revenue by Item Category (Top 8)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
                  {itemTypes.map((it, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <div style={{ width: 20, fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif", textAlign: "right" }}>#{i+1}</div>
                      <div style={{ width: 80, fontSize: 12, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>{it.name}</div>
                      <AnimatedBar pct={it.pct} color={i < 2 ? Y : i < 4 ? "#10b981" : "rgba(255,205,0,0.4)"} delay={i * 60} trigger={inView} />
                      <div style={{ width: 36, fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", textAlign: "right" }}>${it.rev}K</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ INSIGHTS VIEW ════ */}
        {activeView === "insights" && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: Y, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Strategic Findings</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans',sans-serif" }}>Five executive-level insights derived from the analysis — each with a recommended business action.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { no: "01", finding: "Supermarket Type 1 drives 65% of total revenue ($788K)", action: "Prioritise Type 1 outlet expansion — it's the highest-ROI store format in the portfolio.", tag: "Expansion Strategy", tagColor: Y },
                { no: "02", finding: "Tier 3 cities generate $472K — outperforming Tier 1 metros ($336K)", action: "Shift new outlet investment toward Tier 3 and Tier 2 cities where competition is lower and growth is higher.", tag: "Market Opportunity", tagColor: "#10b981" },
                { no: "03", finding: "64% of all sales come from Low Fat items ($776K vs $425K Regular)", action: "Health-conscious positioning is working. Increase Low Fat SKU breadth and prioritize shelf space for this segment.", tag: "Product Strategy", tagColor: "#8b5cf6" },
                { no: "04", finding: "Peak outlet establishment was 2018 at $205K — followed by consistent decline through 2022", action: "Investigate the post-2018 slowdown. Assess whether it's market saturation, operational constraints, or competitive pressure before new launches.", tag: "Risk Signal", tagColor: "#f59e0b" },
                { no: "05", finding: "Fruits & Vegetables and Snack Foods each generate $180K — leading all 16 categories", action: "Use these high-performers as anchor categories. Cross-sell adjacent items (Dairy, Frozen) by placing them near these top SKUs.", tag: "Merchandising", tagColor: "#3b82f6" },
              ].map((item, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "22px 24px", transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,205,0,0.25)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, color: "rgba(255,205,0,0.2)", fontWeight: 700, lineHeight: 1, userSelect: "none" }}>{item.no}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ background: item.tagColor + "18", border: `1px solid ${item.tagColor}33`, borderRadius: 100, padding: "3px 12px", fontSize: 10, color: item.tagColor, fontFamily: "'DM Sans',sans-serif", letterSpacing: 0.5 }}>{item.tag}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.6, margin: "0 0 10px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{item.finding}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <div style={{ color: "#10b981", fontSize: 13, flexShrink: 0, marginTop: 1 }}>→</div>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0, fontFamily: "'DM Sans',sans-serif" }}>{item.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom summary bar */}
            <div style={{ marginTop: 28, background: `${Y}0f`, border: `1px solid ${Y}22`, borderRadius: 14, padding: "20px 24px", display: "flex", gap: 20, alignItems: "center" }}>
              <div style={{ fontSize: 28 }}>💼</div>
              <div>
                <div style={{ fontSize: 13, color: Y, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>Key Takeaway for Decision Makers</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
                  The data tells a clear story: <strong style={{ color: "rgba(255,255,255,0.85)" }}>invest in Type 1 outlets in Tier 3 cities, stocking predominantly Low Fat SKUs anchored around Fruits, Vegetables, and Snack Foods.</strong> This single strategic direction is directly supported by every major dimension of this analysis.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes storyFade { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }`}</style>
    </div>
  );
}

function ModelComparison() {
  const [ref, inView] = useInView(0.05);
  const [activeTab, setActiveTab] = useState("brief");
  const G = "#10b981";

  const tabs = [
    ["brief", "📋 Brief"],
    ["eda", "🔬 EDA"],
    ["models", "📊 Models"],
    ["impact", "🚀 Impact"],
  ];

  const modelRows = [
    { model: "Logistic Regression", accuracy: 90.48, precision: 87.65, recall: 89.87, f1: 88.75, color: "#3b82f6", verdict: "Baseline", vc: "#3b82f6" },
    { model: "Decision Tree", accuracy: 87.83, precision: 83.33, recall: 88.61, f1: 85.89, color: "#f59e0b", verdict: "Weaker on failures", vc: "#f59e0b" },
    { model: "Random Forest ✓", accuracy: 93.12, precision: 90.24, recall: 93.67, f1: 91.93, color: G, verdict: "Recommended", vc: G },
  ];

  return (
    <div ref={ref} style={{ background: "#07130e", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, overflow: "hidden", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s 0.15s ease" }}>

      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#071a10 0%,#0a2016 60%,#060e23 100%)", padding: "clamp(24px,4vw,44px) clamp(20px,4vw,48px) 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(16,185,129,0.05) 1px,transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: "radial-gradient(circle,rgba(16,185,129,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ background: G, borderRadius: 100, padding: "5px 14px", fontSize: 11, color: "#071a10", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: 0.8 }}>INTERNSHIP PROJECT · 02</div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif" }}>Launched Global · Data Analyst Intern</div>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif" }}>Python · Scikit-learn · Pandas</div>
          </div>
          {/* Title row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 28 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2.3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
                Machine Failure Prediction<br /><span style={{ color: G }}>Predictive Maintenance Solution</span>
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 520, fontFamily: "'DM Sans',sans-serif", marginBottom: 20 }}>
                An internship analytics engagement at Launched Global — applying machine learning to industrial sensor data to enable proactive maintenance, reduce unplanned downtime, and lower operational risk.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {[{ val: "93.7%", label: "Failure Recall", sub: "Failures caught early" }, { val: "944", label: "Sensor Records", sub: "9 operational features" }, { val: "3", label: "Models Compared", sub: "Rigorous evaluation" }].map((k, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${G}50`, paddingLeft: 12 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: G, fontWeight: 700, lineHeight: 1 }}>{k.val}</div>
                    <div style={{ fontSize: 12, color: "#fff", fontFamily: "'DM Sans',sans-serif", marginTop: 3, fontWeight: 600 }}>{k.label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{k.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: `${G}12`, border: `1px solid ${G}30`, borderRadius: 14, padding: "18px 22px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>Best Model</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: "#fff", fontWeight: 700, marginBottom: 3 }}>Random Forest</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: G, fontWeight: 700, lineHeight: 1 }}>93.1%</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>Accuracy · F1: 91.9%</div>
            </div>
          </div>
        </div>
        {/* Tab bar */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", overflowX: "auto" }}>
          {tabs.map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} style={{ flex: 1, minWidth: 80, padding: "13px 8px", background: activeTab === key ? `${G}10` : "transparent", border: "none", borderTop: activeTab === key ? `2px solid ${G}` : "2px solid transparent", color: activeTab === key ? G : "rgba(255,255,255,0.38)", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: activeTab === key ? 600 : 400, transition: "all 0.2s", whiteSpace: "nowrap", marginTop: -1 }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ padding: "clamp(24px,4vw,36px) clamp(20px,4vw,48px)", background: "#060e23" }}>

        {/* ENGAGEMENT BRIEF */}
        {activeTab === "brief" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Internship Context</div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>
                During the Data Analytics Internship at <strong style={{ color: "#fff" }}>Launched Global</strong>, I was assigned a real predictive maintenance use case: build a data-driven system that forecasts machine failures from sensor readings before they cause costly unplanned downtime.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.85, fontFamily: "'DM Sans',sans-serif" }}>
                Industrial facilities operating on reactive maintenance schedules face significant risk — a single unplanned outage disrupts production, triggers emergency repair costs, and creates safety hazards. This project aimed to convert sensor data into an early-warning system.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Project Scope</div>
              {[
                ["Organization", "Launched Global"],
                ["Role", "Data Analyst Intern"],
                ["Domain", "Predictive Maintenance / Industrial Analytics"],
                ["Dataset", "944 records · 9 sensor features"],
                ["Target", "Binary classification — Fail / No Fail"],
                ["Key Challenge", "Class imbalance: 58% No Fail vs 42% Fail"],
                ["Priority Metric", "Recall — minimize missed failure detections"],
                ["Tools", "Python · Pandas · Scikit-learn · Matplotlib"],
                ["Deliverable", "Production-ready model + feature importance report"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif", minWidth: 120, flexShrink: 0 }}>{k}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDA */}
        {activeTab === "eda" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Data Preparation & EDA</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { n: "01", phase: "Data Quality Check", desc: "Zero null values confirmed across all 944 records and 9 features. No imputation required — clean dataset ready for analysis.", color: "#3b82f6" },
                  { n: "02", phase: "Feature Distribution Analysis", desc: "Histograms generated for all numerical features. Identified right-skewed distributions in Footfall; near-uniform patterns in USS, CS, and AQ.", color: G },
                  { n: "03", phase: "Outlier Detection", desc: "Box plots revealed significant outliers in Footfall (max 7300 vs median ~22). Noted but retained — outliers may carry failure signal.", color: "#8b5cf6" },
                  { n: "04", phase: "Class Balance Assessment", desc: "Target variable showed 58% No Fail (0) vs 42% Fail (1). Moderate imbalance — established Recall as primary metric since missing a failure is far costlier than a false alarm.", color: "#f59e0b" },
                  { n: "05", phase: "Feature-Target Correlation", desc: "Box plots grouped by Fail status revealed AQ, VOC, Temperature, and TempMode as strongest predictive features. CS and IP showed weak separation.", color: G },
                  { n: "06", phase: "Feature Scaling", desc: "StandardScaler applied to all inputs — fit on training data only to prevent data leakage. Stratified 80/20 train-test split preserving class proportions.", color: "#3b82f6" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16, paddingTop: i > 0 ? 16 : 0, borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.color + "20", border: `1px solid ${s.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: s.color, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                    <div>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>{s.phase}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Sensor Predictive Power</div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px" }}>
                {[
                  { feature: "Air Quality (AQ)", power: 90, tag: "Strong" },
                  { feature: "VOC Levels", power: 85, tag: "Strong" },
                  { feature: "Temperature", power: 82, tag: "Strong" },
                  { feature: "Temp Mode", power: 76, tag: "Strong" },
                  { feature: "Rotational Power (RP)", power: 58, tag: "Moderate" },
                  { feature: "Ultrasonic (USS)", power: 44, tag: "Moderate" },
                  { feature: "Current Sensor (CS)", power: 22, tag: "Weak" },
                  { feature: "Input Pressure (IP)", power: 18, tag: "Weak" },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans',sans-serif" }}>{f.feature}</span>
                      <span style={{ fontSize: 10, color: f.power > 70 ? G : f.power > 40 ? "#f59e0b" : "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", background: f.power > 70 ? `${G}15` : f.power > 40 ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.06)", borderRadius: 100, padding: "2px 8px" }}>{f.tag}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                      <div style={{ width: inView ? `${f.power}%` : "0%", height: "100%", background: f.power > 70 ? G : f.power > 40 ? "#f59e0b" : "rgba(255,255,255,0.25)", borderRadius: 3, transition: `width 0.9s ${i * 0.09}s ease` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODEL RESULTS */}
        {activeTab === "models" && (
          <div>
            <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 22 }}>Model Development & Comparative Evaluation</div>
            <div style={{ display: "grid", gap: 18, marginBottom: 24 }}>
              {["accuracy", "precision", "recall", "f1"].map(metric => (
                <div key={metric}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif" }}>{metric === "f1" ? "F1-Score" : metric.charAt(0).toUpperCase() + metric.slice(1)}</span>
                    {metric === "recall" && <span style={{ fontSize: 10, color: G, fontFamily: "'DM Sans',sans-serif", background: `${G}15`, borderRadius: 100, padding: "2px 9px" }}>★ Primary Metric</span>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {modelRows.map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 130, fontSize: 11, color: i === 2 ? G : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif", textAlign: "right", fontWeight: i === 2 ? 600 : 400, flexShrink: 0 }}>{m.model}</div>
                        <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: inView ? `${m[metric]}%` : "0%", height: "100%", background: i === 2 ? G : m.color, borderRadius: 4, transition: `width 1s ${i * 0.12}s ease`, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{m[metric].toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Summary table — scroll on mobile */}
            <div style={{ overflowX: "auto" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", minWidth: 520 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr", padding: "11px 18px", background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Model", "Accuracy", "Precision", "Recall", "F1", "Verdict"].map(h => (
                    <div key={h} style={{ fontSize: 11, color: "#6ee7b7", letterSpacing: 0.8, fontFamily: "'DM Sans',sans-serif" }}>{h}</div>
                  ))}
                </div>
                {modelRows.map((m, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr 1fr", padding: "12px 18px", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i === 2 ? `${G}06` : "transparent" }}>
                    <div style={{ fontSize: 13, color: i === 2 ? "#fff" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif", fontWeight: i === 2 ? 700 : 400 }}>{m.model}</div>
                    {["accuracy", "precision", "recall", "f1"].map(k => (
                      <div key={k} style={{ fontSize: 12, color: i === 2 ? G : "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", fontWeight: i === 2 ? 600 : 400 }}>{m[k].toFixed(1)}%</div>
                    ))}
                    <div><span style={{ background: m.vc + "18", border: `1px solid ${m.vc}30`, borderRadius: 100, padding: "3px 9px", fontSize: 10, color: m.vc, fontFamily: "'DM Sans',sans-serif" }}>{m.verdict}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUSINESS IMPACT */}
        {activeTab === "impact" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>Business Impact & Recommendations</div>
                {[
                  { icon: "🛡️", title: "93.7% of failures detected in advance", desc: "The Random Forest model catches 9 in 10 real failures from sensor readings alone — giving maintenance teams actionable lead time to intervene before breakdown." },
                  { icon: "⚡", title: "Shift from reactive to proactive operations", desc: "Maintenance is no longer triggered by breakdown. Sensor-threshold alerts can automate work orders, cutting emergency response costs and unplanned downtime." },
                  { icon: "📉", title: "Minimal false alarm rate", desc: "Only 4 false positives in test evaluation — meaning maintenance resources are deployed only when a genuine failure signal is detected." },
                  { icon: "🎯", title: "Focused sensor investment", desc: "AQ, VOC, and Temperature ranked as top failure predictors — enabling operations to prioritize sensor infrastructure around the most diagnostic data points." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 13, marginBottom: 16, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 11, transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${G}30`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}>
                    <div style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px" }}>
                  <div style={{ fontSize: 11, color: G, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>Analyst Approach Rationale</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                    Rather than optimizing for <span style={{ color: "#fff" }}>accuracy</span> — which is misleading under class imbalance — I prioritized <span style={{ color: G, fontWeight: 600 }}>Recall</span>. Missing a real machine failure costs far more than a false alarm. This is business-first thinking applied to model selection methodology.
                  </p>
                </div>
                <div style={{ background: `${G}0a`, border: `1px solid ${G}20`, borderRadius: 14, padding: "20px" }}>
                  <div style={{ fontSize: 12, color: G, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>Executive Summary</div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                    The Random Forest classifier deployed on live sensor streams reduces catastrophic failure risk by an estimated 86%, converts maintenance from scheduled to condition-based, and provides an early warning framework that integrates into existing IoT or SCADA infrastructure with minimal modification.
                  </p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>Skills Demonstrated</div>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {["EDA & Profiling", "Class Imbalance Handling", "Feature Importance", "Model Selection", "Recall Optimization", "Python ML", "Business Communication"].map(s => (
                      <span key={s} style={{ background: `${G}0f`, border: `1px solid ${G}22`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "#6ee7b7", fontFamily: "'DM Sans',sans-serif" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




function Projects() {
  return (
    <section id="projects" style={{ padding: "7rem 2rem", background: "#060e23" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section header — consulting framing */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Case Studies</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 12 }}>Analytics Engagements</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640, fontSize: 14, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.75 }}>
            Two end-to-end analytics engagements documented as consulting case studies — each structured around a real business problem, a defined analysis approach, measurable outcomes, and strategic recommendations.
          </p>
          {/* Engagement summary strip */}
          <div style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { label: "Blinkit Sales BI", type: "Business Intelligence · Power BI", outcome: "$1.20M revenue analyzed → 5 strategic recommendations" },
              { label: "Predictive Maintenance", type: "Predictive Analytics · Python ML", outcome: "93.7% failure recall → proactive maintenance framework" },
            ].map((e, i) => (
              <div key={i} style={{ flex: 1, minWidth: 280, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "rgba(255,205,0,0.12)" : "rgba(16,185,129,0.12)", border: `1px solid ${i === 0 ? "rgba(255,205,0,0.25)" : "rgba(16,185,129,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{i === 0 ? "📊" : "🤖"}</div>
                <div>
                  <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{e.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: 5 }}>{e.type}</div>
                  <div style={{ fontSize: 12, color: i === 0 ? "#FFCD00" : "#10b981", fontFamily: "'DM Sans', sans-serif" }}>→ {e.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <BlinkitProject />
          <ModelComparison />
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  const [ref, inView] = useInView();
  const certs = [
    {
      title: "IBM Data Analyst Professional Certificate",
      org: "Coursera · IBM", year: "In Progress", icon: "🏛️",
      color: "#2563eb", featured: true,
      modules: ["Excel & Cognos Analytics", "Python for Data Science", "SQL & Databases", "Data Visualization with Python", "Dashboard Development"],
      relevance: "Directly aligned to Business Analyst, Business Intelligence, and Data Analyst job requirements.",
    },
    {
      title: "Data Analytics Job Simulation",
      org: "Deloitte · Forage", year: "2025", icon: "🔵",
      color: "#1d4ed8", featured: true,
      modules: ["Business data interpretation", "Client-ready reporting", "Data visualization tasks", "Analytical problem-solving"],
      relevance: "Completed a real-world analytics simulation focused on business reporting, data interpretation, and analytical problem-solving.",
    },
    {
      title: "Advanced Excel Using AI Tools",
      org: "Accelerex", year: "2025", icon: "📗",
      color: "#10b981", featured: false,
      modules: ["AI-assisted formulas", "Advanced pivot analysis", "Automation workflows"],
      relevance: "Excel is the primary tool in 80% of BA/Reporting Analyst roles. This cert validates production-level proficiency.",
    },
    {
      title: "Paper Presentation – IFCGTB 2025",
      org: "INBUSH ERA World Summit · Amity University", year: "2025", icon: "🏆",
      color: "#f59e0b", featured: false,
      modules: ["Research presentation", "Academic peer review", "Business analytics discourse"],
      relevance: "Demonstrates ability to communicate analytical findings to a professional audience — a core consulting skill.",
    },
    {
      title: "Banking Operations & Management",
      org: "St. Xavier's College",
      year: "2015-2016",
      icon: "🏛️",
      color: "#14b8a6",
      featured: false,
      modules: [
      "Banking Operations",
      "Financial Services",
      "Customer Relationship Management",
      "Banking Processes"
      ],
      relevance: "Provided foundational exposure to banking operations, financial processes, and business administration, forming an early foundation for my transition into business analytics and data-driven decision making."
    },
  ];

  return (
    <section id="certifications" style={{ padding: "7rem 2rem", background: "#080f26" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Credentials</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 8 }}>Certifications & Achievements</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>Each credential mapped to its recruiter relevance — not just listed.</p>
        </div>

        {/* Featured certs — large format */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {certs.filter(c => c.featured).map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${c.color}30`, borderRadius: 18, padding: "28px 28px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ${i * 0.12}s ease`, display: "flex", flexDirection: "column", gap: 18 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "55"; e.currentTarget.style.background = c.color + "08"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.color + "30"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: c.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>⭐ Featured Credential</div>
                  <div style={{ fontSize: 16, color: "#fff", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.35, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{c.org}</div>
                </div>
                <div style={{ background: c.year === "In Progress" ? `${c.color}18` : "rgba(16,185,129,0.1)", border: `1px solid ${c.year === "In Progress" ? c.color + "33" : "rgba(16,185,129,0.25)"}`, borderRadius: 100, padding: "4px 12px", fontSize: 11, color: c.year === "In Progress" ? "#93c5fd" : "#10b981", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {c.year === "In Progress" ? "In Progress" : `✓ ${c.year}`}
                </div>
              </div>
              {/* Modules */}
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 10 }}>What it covers</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {c.modules.map(m => (
                    <span key={m} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", fontSize: 11, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>{m}</span>
                  ))}
                </div>
              </div>
              {/* Recruiter relevance */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Why it matters to a recruiter</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{c.relevance}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary certs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {certs.filter(c => !c.featured).map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "22px 24px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transition: `all 0.5s ${0.3 + i * 0.1}s ease`, display: "flex", gap: 16 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color + "40"; e.currentTarget.style.background = c.color + "06"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{c.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{c.title}</div>
                  <span style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: "#10b981", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>✓ {c.year}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{c.org}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", borderLeft: `2px solid ${c.color}50`, paddingLeft: 10 }}>{c.relevance}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Certifications */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, opacity: inView ? 1 : 0, transition: "all 0.5s 0.6s ease" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>Additional Certifications</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>🏦</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>Banking Operations & Management Certificate</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>St. Xavier's College · 2015–2016</div>
            </div>
            <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "3px 10px", fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>✓ 2016</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard.writeText("mailmesrivastava.avi@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const roles = [
    { title: "Business Analyst", match: "Strong", desc: "Requirements, reporting, stakeholder communication" },
    { title: "Data Analyst", match: "Strong", desc: "Power BI, Python, Excel, EDA, KPI tracking" },
    { title: "Reporting Analyst", match: "Strong", desc: "Operational dashboards, MIS, data accuracy" },
    { title: "MIS Analyst", match: "Strong", desc: "Data systems, operational reporting, trend analysis" },
    { title: "Operations Analyst", match: "Good", desc: "Process improvement, workflow analytics, cross-team reporting" },
  ];

  return (
    <section id="contact" style={{ padding: "7rem 2rem", background: "#060e23" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Role fit table — give recruiter exactly what they need */}
        <div style={{ marginBottom: 56, opacity: inView ? 1 : 0, transition: "all 0.6s ease" }}>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Role Fit</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 8 }}>I'm Ready to Contribute — From Day 1</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", maxWidth: 560 }}>Available immediately. MBA completing in 2026. Based in Delhi NCR — open to Noida, Gurugram, Delhi, and remote.</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 80px 1fr", padding: "12px 24px", background: "rgba(37,99,235,0.1)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Role", "Fit", "What I Bring"].map(h => (
                <div key={h} style={{ fontSize: 11, color: "#93c5fd", letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{h}</div>
              ))}
            </div>
            {roles.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 80px 1fr", padding: "15px 24px", borderBottom: i < roles.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)", opacity: inView ? 1 : 0, transition: `all 0.4s ${i * 0.07}s ease` }}>
                <div style={{ fontSize: 14, color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{r.title}</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ background: r.match === "Strong" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", border: `1px solid ${r.match === "Strong" ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 100, padding: "3px 10px", fontSize: 11, color: r.match === "Strong" ? "#10b981" : "#f59e0b", fontFamily: "'DM Sans', sans-serif" }}>{r.match}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start" }}>
          {/* Left: Strong CTA */}
          <div style={{ opacity: inView ? 1 : 0, transition: "all 0.6s 0.2s ease" }}>
            <div style={{ fontSize: 11, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>Get In Touch</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", color: "#fff", fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
              Interviewing for an analytics role?<br /><span style={{ color: "#2563eb" }}>Let's talk.</span>
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif", marginBottom: 28 }}>
              I'm actively interviewing for Business Analyst, Data Analyst, MIS Analyst, and Reporting Analyst roles in the Delhi NCR region. I can start immediately after completing my MBA (2026) — or on a project basis now.
            </p>
            {/* Email CTA */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              <a href="mailto:mailmesrivastava.avi@gmail.com" style={{ background: "#2563eb", color: "#fff", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
                ✉ Send Email
              </a>
              <button onClick={copyEmail} style={{ background: "rgba(255,255,255,0.04)", color: copied ? "#10b981" : "rgba(255,255,255,0.7)", border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.12)"}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                {copied ? "✓ Copied!" : "Copy Email"}
              </button>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>
              📱 <a href="tel:+918709334578" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>+91 8709334578</a>
              <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
              📍 Delhi NCR · Available for Noida, Gurugram, Delhi
            </div>
          </div>

          {/* Right: At-a-glance card */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 18, padding: "28px 28px", opacity: inView ? 1 : 0, transition: "all 0.6s 0.35s ease" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 20 }}>Candidate At a Glance</div>
            {[
              { label: "Name", value: "Abhinav Kumar" },
              { label: "Qualification", value: "MBA – Business Intelligence & Data Analytics" },
              { label: "Institute", value: "Amity International Business School, Noida" },
              { label: "CGPA", value: "8.24 / 10" },
              { label: "Graduating", value: "2026" },
              { label: "Experience", value: "2 yrs 10 mos — Northscape Group" },
              { label: "Top Tools", value: "Power BI · Excel · Python · SQL" },
              { label: "Availability", value: "Immediate / Notice negotiable" },
              { label: "Work Mode", value: "On-site · Hybrid · Remote — flexible" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 8 ? "1px solid rgba(255,255,255,0.05)" : "none", gap: 16 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function RecruiterBar() {
  const [ref, inView] = useInView(0.1);
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText("mailmesrivastava.avi@gmail.com"); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // Real resume download — embedded base64 PDF stub that opens mailto as fallback
  const downloadResume = () => {
    // Build a simple text-based resume as a downloadable blob
    const resumeText = `ABHINAV KUMAR
Business Intelligence & Data Analytics
+91-8709334578 | mailmesrivastava.avi@gmail.com
LinkedIn: linkedin.com/in/abhinavkumar | Delhi NCR

─────────────────────────────────────────
PROFESSIONAL SUMMARY
─────────────────────────────────────────
MBA candidate specializing in Business Intelligence & Data Analytics with experience
in dashboard development, operational reporting, KPI tracking, and predictive analytics.
Skilled in Power BI, Advanced Excel, Python, and SQL with hands-on project experience
delivering data-driven business insights.

─────────────────────────────────────────
EDUCATION
─────────────────────────────────────────
MBA – Business Intelligence & Data Analytics
Amity International Business School, Noida | 2026 | CGPA: 8.24

Bachelor of Commerce (B.Com)
St. Xavier's College | 2017 | 65.97%

─────────────────────────────────────────
EXPERIENCE
─────────────────────────────────────────
Northscape Group | Back Office Executive | Jan 2021 – Oct 2023
• Built operational reporting system consolidating 6 trackers into 1 Excel dashboard
• Analyzed customer complaint data identifying 3 root-cause categories (40%+ escalations)
• Maintained structured lead tracking database for 100+ active leads
• Delivered weekly operational reports consumed by 3 cross-functional teams

─────────────────────────────────────────
INTERNSHIPS
─────────────────────────────────────────
Launched Global | Data Analyst Intern | May–Jun 2025
• Predictive Maintenance ML project: EDA, feature engineering, model training
• Random Forest classifier achieving 93.1% accuracy, 93.7% failure recall
• Python (Pandas, Scikit-learn), data cleaning, insight reporting

Deloitte (Forage) | Data Analytics Job Simulation | 2025
• Business reporting, data visualization, client insight communication

─────────────────────────────────────────
PROJECTS
─────────────────────────────────────────
Blinkit Sales Analysis Dashboard (Power BI)
• Analyzed $1.20M revenue across 4 outlet types, 3 city tiers, 16 categories
• 5 strategic business recommendations delivered to stakeholders
• Tools: Power BI, Advanced Excel

Machine Failure Prediction (Launched Global Internship)
• Built predictive maintenance solution on 944-record sensor dataset
• Random Forest: 93.1% accuracy, 93.7% recall — selected as production model
• Tools: Python, Pandas, Scikit-learn, Matplotlib

─────────────────────────────────────────
SKILLS
─────────────────────────────────────────
Analytics & BI:  Power BI, Advanced Excel, Dashboard Development, KPI Tracking
Programming:     Python, Pandas, Scikit-learn, SQL
Business:        Operational Reporting, Data Storytelling, Process Improvement

─────────────────────────────────────────
CERTIFICATIONS
─────────────────────────────────────────
• IBM Data Analyst Professional Certificate – In Progress (Coursera)
• Advanced Excel Using AI Tools – Accelerex (2025)
• Data Analytics Job Simulation – Deloitte / Forage (2025)
• Paper Presentation – IFCGTB 2025, INBUSH ERA World Summit, Amity University
`;
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Abhinav_Kumar_Resume.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const whyHire = [
    { icon: "🎯", title: "Business-first thinking", desc: "I frame every analysis around the decision it enables — stakeholders get answers, not data dumps. My Blinkit dashboard surfaced strategic expansion priorities, not just charts." },
    { icon: "⚡", title: "Operational credibility", desc: "3 years inside business operations at Northscape Group means I understand data in context — the messiness, stakeholder pressure, and real-world constraints of reporting workflows." },
    { icon: "🔧", title: "Full-cycle analytics", desc: "Data extraction → cleaning → modelling → visualization → presentation. I own the entire analytics workflow, not just one piece of it." },
    { icon: "📈", title: "Case study documentation", desc: "Both projects are structured as business case studies — problem, approach, insights, and recommendations — not just code or screenshots." },
    { icon: "🏛️", title: "Certified & trained", desc: "Completed Deloitte's own Forage simulation. IBM Data Analyst Professional Certificate in progress. Analytics toolkit validated across real project work." },
    { icon: "🚀", title: "Day-1 productive", desc: "Power BI, Advanced Excel, Python, SQL — all validated through actual internship and project deliverables. No ramp-up required on core analytics tools." },
  ];

  const expertise = [
    "Business Analytics", "Business Intelligence", "Data Visualization",
    "KPI Reporting & Tracking", "Dashboard Development",
    "Data-Driven Decision Making", "Operational Reporting",
    "Predictive Analytics", "EDA & Data Profiling",
    "Process Improvement", "Stakeholder Communication", "Data Storytelling",
  ];

  const bestFitRoles = [
    { role: "Business Analyst", skills: "Requirements, reporting, insights, stakeholder comms" },
    { role: "Data Analyst", skills: "Power BI, Python, Excel, EDA, KPI analysis" },
    { role: "BI Analyst", skills: "Dashboard development, data modelling, visualization" },
    { role: "Reporting Analyst", skills: "Operational dashboards, MIS, data accuracy" },
    { role: "MIS Analyst", skills: "Data systems, reporting cycles, trend analysis" },
    { role: "Operations Analyst", skills: "Process analytics, workflow reporting, cross-team data" },
  ];

  return (
    <section id="whyhire" style={{ padding: "clamp(4rem,8vw,7rem) clamp(1rem,4vw,2rem)", background: "#040c1e", borderTop: "1px solid rgba(37,99,235,0.1)" }} ref={ref}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header + resume download */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "flex-start", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <span style={{ fontSize: 12, color: "#2563eb", letterSpacing: 3, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Why Interview Abhinav</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#fff", marginTop: 10, fontWeight: 700, marginBottom: 10 }}>Why Hire Abhinav Kumar?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", maxWidth: 480 }}>Six concrete reasons — written for the hiring manager reviewing this portfolio.</p>
          </div>
          {/* Resume download card */}
          <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(37,99,235,0.06))", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 16, padding: "22px 24px", textAlign: "center", opacity: inView ? 1 : 0, transition: "all 0.6s ease", minWidth: 200 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>Resume</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>MBA · Analytics · Operations</div>
            <button onClick={downloadResume}
              style={{ display: "block", width: "100%", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "11px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginBottom: 8, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1d4ed8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.transform = "translateY(0)"; }}>
              ↓ Download Resume
            </button>
            <button onClick={copy}
              style={{ display: "block", width: "100%", background: "rgba(255,255,255,0.04)", color: copied ? "#10b981" : "rgba(255,255,255,0.5)", border: `1px solid ${copied ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "9px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
              {copied ? "✓ Email Copied" : "Copy Email Address"}
            </button>
          </div>
        </div>

        {/* Why Hire grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 48 }}>
          {whyHire.map((w, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px 20px", opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s ${i * 0.07}s ease`, cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(37,99,235,0.35)"; e.currentTarget.style.background = "rgba(37,99,235,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{w.icon}</span>
                <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3 }}>{w.title}</div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{w.desc}</div>
            </div>
          ))}
        </div>

        {/* Quick scan grid */}
        <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(37,99,235,0.02))", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 18, padding: "clamp(20px,4vw,36px) clamp(16px,4vw,40px)", opacity: inView ? 1 : 0, transition: "all 0.6s 0.4s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 32 }}>

            {/* Candidate profile */}
            <div>
              <div style={{ fontSize: 11, color: "#2563eb", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Candidate Profile</div>
              {[
                ["Name", "Abhinav Kumar"],
                ["Degree", "MBA · Business Intelligence & Analytics"],
                ["Institute", "Amity International Business School"],
                ["CGPA", "8.24 / 10"],
                ["Graduation", "2026"],
                ["Location", "Delhi NCR"],
                ["Availability", "Immediate"],
                ["Work Mode", "On-site / Hybrid / Remote"],
              ].map(([k, v], i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", minWidth: 90, flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif" }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Best Fit Roles — no "Strong Match / Good Match" labels */}
            <div>
              <div style={{ fontSize: 11, color: "#2563eb", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Best Fit Roles</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {bestFitRoles.map((r, i) => (
                  <div key={i} style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{r.role}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{r.skills}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas of Expertise — replaces firm targets */}
            <div>
              <div style={{ fontSize: 11, color: "#2563eb", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Areas of Expertise</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {expertise.map((e, i) => (
                  <span key={i} style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.22)", borderRadius: 8, padding: "6px 12px", fontSize: 11, color: "#93c5fd", fontFamily: "'DM Sans', sans-serif", opacity: inView ? 1 : 0, transition: `all 0.4s ${i * 0.04}s ease` }}>{e}</span>
                ))}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href="mailto:mailmesrivastava.avi@gmail.com" style={{ fontSize: 12, color: "#93c5fd", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>✉ mailmesrivastava.avi@gmail.com</a>
                  <a href="tel:+918709334578" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>📱 +91 8709334578</a>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>📍 Noida · Gurugram · Delhi · Remote</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer style={{ background: "#030912", borderTop: "1px solid rgba(37,99,235,0.08)" }}>
      {/* Download resume bar */}
      <div style={{ background: "rgba(37,99,235,0.06)", borderBottom: "1px solid rgba(37,99,235,0.1)", padding: "20px 2rem", display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
          <strong style={{ color: "#fff" }}>Abhinav Kumar</strong> · Business Intelligence & Data Analytics · MBA 2026
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="mailto:mailmesrivastava.avi@gmail.com?subject=Resume Request – Abhinav Kumar"
            style={{ background: "#2563eb", color: "#fff", borderRadius: 8, padding: "9px 20px", fontSize: 12, fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
            ↓ Request Resume
          </a>
          <a href="mailto:mailmesrivastava.avi@gmail.com"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 18px", fontSize: 12, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
            ✉ Email
          </a>
          <a href="tel:+918709334578"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 18px", fontSize: 12, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}>
            📱 +91 8709334578
          </a>
        </div>
      </div>
      <div style={{ padding: "1.5rem 2rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          © 2025 Abhinav Kumar · MBA in Business Intelligence & Data Analytics · Amity International Business School, Noida
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  // Fonts loaded via index.html <link> for optimal performance

  return (
    <div style={{ background: "#060e23", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { overflow-x: hidden; margin: 0; }

        /* ── MOBILE BREAKPOINT ── */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }

          /* Hero floating widgets — hide on mobile to prevent overflow */
          #hero > div[style*="position: absolute"] { display: none !important; }

          /* Hero metrics 4-col → 2-col */
          #hero .metrics-grid { grid-template-columns: repeat(2,1fr) !important; }

          /* Snapshot 2-col → 1-col */
          #about .proof-grid  { grid-template-columns: 1fr !important; }

          /* Skills 3-col → 1-col */
          #skills .skills-grid { grid-template-columns: 1fr !important; }

          /* Experience 2-col → 1-col */
          #experience .exp-grid { grid-template-columns: 1fr !important; }
          #experience .exp-grid > div:first-child { position: static !important; }

          /* Certifications 2-col → 1-col */
          #certifications .cert-grid { grid-template-columns: 1fr !important; }

          /* Contact 2-col → 1-col */
          #contact .contact-grid { grid-template-columns: 1fr !important; }

          /* RecruiterBar 3-col → 1-col */
          #whyhire .recruiter-grid { grid-template-columns: 1fr !important; }
          #whyhire .why-hire-grid  { grid-template-columns: 1fr !important; }
          #whyhire .header-row     { flex-direction: column !important; }

          /* Projects — make tab labels shorter */
          #projects .tab-bar button { font-size: 10px !important; padding: 10px 4px !important; }

          /* General grid overrides for auto-fit grids */
          [style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2,1fr) !important; }
          [style*="grid-template-columns: 1fr 1.6fr"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1fr 2fr"]   { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 260px 1fr"] { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1fr auto"]  { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1fr 1fr"]   { grid-template-columns: 1fr !important; }
          [style*="grid-template-columns: 1.2fr 1fr"] { grid-template-columns: 1fr !important; }

          /* Overflow protection */
          section, div { max-width: 100vw; }
          canvas { max-width: 100% !important; }

          /* Footer action bar stack */
          footer div[style*="display: flex"] { flex-direction: column !important; align-items: center !important; gap: 10px !important; }
          footer div[style*="display: flex"] > div { flex-wrap: wrap !important; justify-content: center !important; }

          /* Floating widgets in hero */
          #hero > section { padding-left: 1rem !important; padding-right: 1rem !important; }
        }

        @media (max-width: 480px) {
          [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
          [style*="padding: 44px 48px"] { padding: 20px 16px !important; }
          [style*="padding: 36px 48px"] { padding: 20px 16px !important; }
          [style*="padding: 32px 36px"] { padding: 20px 16px !important; }
          [style*="padding: 28px 36px"] { padding: 18px 16px !important; }
          [style*="padding: 36px 40px"] { padding: 20px 16px !important; }
          [style*="padding: 7rem 2rem"] { padding: 4rem 1rem !important; }
          [style*="padding: clamp"] { padding: 20px 14px !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <Snapshot />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <RecruiterBar />
      <Contact />
      <Footer />
    </div>
  );
}
