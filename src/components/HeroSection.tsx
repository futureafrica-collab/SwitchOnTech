import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const VIDEO_URL =
  "https://leftclick.io/wp-content/uploads/2024/02/pexels-henry-5396826-2160p.mp4";

const useTypewriter = (text: string, speed = 50, delay = 0) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed]);

  return displayed;
};

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const line1 = useTypewriter("Your Complete ", 60, 500);
  const line1Done = line1.length >= "Your Complete ".length;
  const highlight = useTypewriter("ICT Solution ", 60, line1Done ? 0 : 99999);
  const highlightDone = highlight.length >= "ICT Solution ".length;
  const line2 = useTypewriter("Center", 60, highlightDone && line1Done ? 0 : 99999);
  const allDone = line2.length >= "Center".length;

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Video background for all devices */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </motion.div>

      {/* Dark overlay 55% */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/10 text-white/90 backdrop-blur-sm border border-white/20"
          >
            Complete ICT Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white"
          >
            {line1}
            <span className="bg-gradient-to-r from-accent to-[hsl(326,95%,60%)] bg-clip-text text-transparent">
              {highlight}
            </span>
            {line2}
            {!allDone && <span className="inline-block w-[3px] h-[1em] bg-white/80 align-middle animate-pulse ml-0.5" />}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl"
          >
            Expert networking, security installation, and computer sales &amp; services — all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              to="/services"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all hover:scale-105"
            >
              Our Services
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-accent to-[hsl(326,95%,50%)] hover:opacity-90 transition-all hover:scale-105"
            >
              Visit Shop
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
