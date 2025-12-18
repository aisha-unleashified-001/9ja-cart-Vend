import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import VendorBg from "@/assets/vendor-bg.png";
import VendorLady from "@/assets/vendor-lady.png";

const HeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);
  const ladyRef = useRef<HTMLImageElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-10, 10]),
    springConfig
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background spinning animation
      gsap.to(bgRef.current, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      // Lady floating animation
      gsap.to(ladyRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Scale pulse for lady
      gsap.to(ladyRef.current, {
        scale: 1.02,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Orbit elements animation
      if (orbitRef.current) {
        const orbitElements = orbitRef.current.querySelectorAll(".orbit-item");
        orbitElements.forEach((el, i) => {
          gsap.to(el, {
            rotation: i % 2 === 0 ? 360 : -360,
            duration: 15 + i * 5,
            repeat: -1,
            ease: "none",
            transformOrigin: "center center",
          });
        });
      }

      // Particles burst animation
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".particle");
        particles.forEach((particle, i) => {
          const randomX = (Math.random() - 0.5) * 400;
          const randomY = (Math.random() - 0.5) * 400;
          const randomDelay = Math.random() * 2;
          const randomDuration = 3 + Math.random() * 4;
          console.log(i);

          gsap.set(particle, { x: 0, y: 0, scale: 0, opacity: 0 });

          gsap.to(particle, {
            x: randomX,
            y: randomY,
            scale: 1,
            opacity: 1,
            duration: randomDuration,
            delay: randomDelay,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto flex items-center justify-center"
      style={{ perspective: 1000 }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Orbiting rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute border border-primary/20 rounded-full"
            style={{
              width: 350 + ring * 80,
              height: 350 + ring * 80,
            }}
            animate={{
              rotate: ring % 2 === 0 ? 360 : -360,
              scale: [1, 1.02, 1],
            }}
            transition={{
              rotate: {
                duration: 20 + ring * 10,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}
      </div>

      {/* Particles container */}
      <div
        ref={particlesRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 rounded-full bg-primary/60"
            style={{
              boxShadow: "0 0 10px hsl(var(--primary-glow) / 0.5)",
            }}
          />
        ))}
      </div>

      {/* Orbit items container */}
      <div
        ref={orbitRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* First orbit */}
        <div className="orbit-item absolute w-[380px] h-[380px]">
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary glow-primary"
            animate={{
              scale: [1, 1.3, 1],
              boxShadow: [
                "0 0 20px hsl(var(--primary-glow) / 0.5)",
                "0 0 40px hsl(var(--primary-glow) / 0.8)",
                "0 0 20px hsl(var(--primary-glow) / 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Second orbit */}
        <div className="orbit-item absolute w-[450px] h-[450px]">
          <motion.div
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-glow-secondary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-2 left-1/3 w-3 h-3 rounded-full bg-primary/80"
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Third orbit */}
        <div className="orbit-item absolute w-[520px] h-[520px]">
          <motion.div
            className="absolute top-10 right-10 w-5 h-5 rounded-full bg-primary/70"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Main 3D container */}
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Spinning background shape */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 1.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <img
            ref={bgRef}
            src={VendorBg}
            alt=""
            className="w-[450px] h-[450px] object-contain"
            style={{
              filter: "drop-shadow(0 0 30px hsl(var(--primary) / 0.3))",
            }}
          />
        </motion.div>

        {/* Vendor Lady Image */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            type: "spring",
            stiffness: 80,
          }}
        >
          <img
            ref={ladyRef}
            src={VendorLady}
            alt="Vendor showcasing the platform"
            className="w-[400px] h-auto object-contain z-10"
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2))",
            }}
          />
        </motion.div>

        {/* Floating badges */}
        <motion.div
          className="absolute -top-4 -right-8 bg-[#8DEB6E] text-primary px-4 py-2 rounded-xl shadow-lg text-sm font-semibold z-20"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            delay: 1.2,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <motion.span
            className="flex items-center gap-2"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {/* <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="inline-block text-lg"
            > */}
            ⚡{/* </motion.span> */}
            Live Platform
          </motion.span>
        </motion.div>

        <motion.div
          className="absolute -bottom-6 -left-6 bg-card text-primary px-4 py-2 rounded-xl shadow-lg text-sm font-bold border border-border z-20"
          initial={{ scale: 0, rotate: 20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            delay: 1.4,
          }}
          whileHover={{ scale: 1.1, rotate: -5 }}
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨ Trusted
          </motion.span>
        </motion.div>

        {/* Stats badge */}
        <motion.div
          className="absolute bottom-8 right-0 bg-card/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-xl shadow-lg text-sm font-medium border border-border z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8 }}
        >
          <span className="flex items-center gap-2">
            <motion.span
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Active: 24/7
            {/* <motion.span
              className="font-bold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              15,234
            </motion.span> */}
            {/* <CountUp
              from={0}
              to={15234}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            /> */}
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom glow reflection */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[300px] h-[50px] bg-primary/20 blur-[40px] rounded-full" />
    </div>
  );
};

export default HeroAnimation;
