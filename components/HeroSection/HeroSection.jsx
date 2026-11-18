"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

const HeroSection = () => {
  const sectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const loaderRef = useRef(null);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("விக்னேஷ் போர்ட்ஃபோலியோ");

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.style.overflow = "hidden";

    // Initial hidden state setup for background video (slightly scaled up to ease in)
    gsap.set(videoContainerRef.current, { autoAlpha: 0, scale: 1.05 });

    const tl = gsap.timeline({
      onComplete: () => {
        setLoaderDone(true);
        document.body.style.overflow = "";
      },
    });

    // Loader slide up reveal
    tl.to(
      loaderRef.current,
      {
        y: "-100%",
        duration: 0.9,
        ease: "power3.out",
      },
      "start+=1.8"
    );

    // Background video reveal (fade & scale down to 1)
    tl.to(
      videoContainerRef.current,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 1.0,
        ease: "power2.out",
      },
      "start+=2.0"
    );

    // Timeout-based interactive name transitions in different languages
    const loaderTexts = [
      "விக்னேஷ் போர்ட்ஃபோலியோ", // Tamil
      "VIGNESH PORTFOLIO", // English
      "విగ్నేష్ పోర్ట్‌ఫోలియో", // Telugu
      "വിഘ്നേഷ് പോർട്ട്ഫോളിയോ", // Malayalam
      "ವಿಘ್ನೇಶ್ ಪೋರ್ಟ್ಫೋಲಿಯೊ", // Kannada
      "विघ्नेश पोर्टफोलियो", // Hindi
      "وگنیش پورٹ فولیو", // Urdu
      "বিঘ্নেশ পোর্টফোলিও", // Bengali
      "维格内什作品集", // Chinese
      "ヴィグネーシュ ポートフォリオ", // Japanese
    ];
    const textTimers = loaderTexts.slice(1).map((text, index) =>
      setTimeout(() => setCurrentText(text), (index + 1) * 180)
    );

    return () => {
      tl.kill();
      textTimers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  const handleScrollToWork = (e) => {
    e.preventDefault();
    const target = document.getElementById("projects-section") || document.getElementById("about");
    if (target) {
      const lenis = window.__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const target = document.getElementById("about");
    if (target) {
      const lenis = window.__lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play once from the start when triggered from the initial/ended state
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Video playback failed:", err));
    }
  };

  const handleVideoEnded = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // Framer Motion reveal variants (triggered once loader is finished)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.25, // starts shortly after loader slides up
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <>
      {/* Loader Overlay */}
      <div
        id="loader"
        ref={loaderRef}
        style={{
          backgroundColor: "#111111",
          zIndex: 100002,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center text-center px-4"
        >
          {/* Logo Sketch Avatar */}
          <img
            src="/avatar-logo.jpg"
            alt="Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/10 mb-6 object-cover shadow-lg"
          />

          {/* Language Text Animating */}
          <div className="h-10 flex items-center justify-center overflow-hidden">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#F5F1EA] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-widest uppercase"
              style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
            >
              {currentText}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Hero Section Container */}
      <section
        id="hero-section"
        ref={sectionRef}
        className="relative w-full h-screen min-h-[600px] overflow-hidden select-none"
        style={{
          backgroundColor: "#ffffff",
          color: "#111111",
        }}
      >
        {/* Background Video */}
        <div
          ref={videoContainerRef}
          className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            src="/hero-bg-video.mp4"
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Corner Overlay - Vertically Centered in the Middle-Left */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={loaderDone ? "visible" : "hidden"}
          className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 lg:left-20 z-10 max-w-[480px] flex flex-col items-start text-left pointer-events-auto bg-white/85 p-6 rounded-2xl border border-black/5 lg:bg-transparent lg:p-0 lg:border-none"
        >
          <motion.span
            variants={itemVariants}
            className="text-sm sm:text-base font-semibold tracking-[0.22em] text-black/70 uppercase mb-2"
            style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
          >
            HELLO, I'M VIGNESH
          </motion.span>
          
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-1.5 mb-6"
          >
            <div className="w-12 h-[1.5px] bg-black/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black uppercase leading-[1.05] tracking-tight text-black mb-6"
            style={{ fontFamily: "'AeonikBold', 'Neue Montreal', sans-serif" }}
          >
            FULL STACK <br />
            DEVELOPER
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-black font-semibold leading-relaxed mb-8 max-w-[38ch]"
            style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
          >
            Designing beautiful interfaces and building<br />
            scalable web applications.
          </motion.p>

          {/* View Work & Download CV Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-5"
          >
            <a
              href="#projects-section"
              onClick={handleScrollToWork}
              className="px-6 py-3 bg-black text-white hover:bg-black/90 rounded-full flex items-center gap-2 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 shadow-sm"
              style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
            >
              <span>View My Work</span>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>

            <a
              href="/Vignesh_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Vignesh_Resume.pdf"
              className="text-xs font-semibold text-black hover:text-black/80 flex items-center gap-1.5 pb-0.5 border-b border-current transition-all"
              style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
            >
              <span>Download CV</span>
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
            </a>
          </motion.div>

          {/* Social Links on Bottom-Left */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-5 mt-8 text-black/60"
          >
            <a href="https://github.com/BVignesh2006" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub" className="hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/vignesh-b-dev" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn" className="hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://www.instagram.com/_mr.vigi_/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="mailto:hellovigneshofficial@gmail.com" title="Email" aria-label="Email" className="hover:text-black transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </motion.div>
        </motion.div>

        {/* Small Play/Pause Button (Floating Bottom-Right) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={loaderDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={togglePlay}
          className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 z-20 flex items-center gap-3 bg-white/85 border border-black/10 hover:border-black/30 px-4 py-2.5 rounded-full text-black hover:bg-black hover:text-white transition-all active:scale-95 shadow-md group cursor-pointer"
          style={{ fontFamily: "'Neue Montreal', 'Inter', sans-serif" }}
        >
          <span className="w-7 h-7 rounded-full bg-black/10 group-hover:bg-white/10 flex items-center justify-center transition-colors">
            {isPlaying ? (
              /* Pause Icon */
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              /* Play Icon */
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current translate-x-[1px]">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </span>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase pr-2">
            {isPlaying ? "PAUSE VIDEO" : "PLAY VIDEO"}
          </span>
        </motion.button>
      </section>
    </>
  );
};

export default HeroSection;
