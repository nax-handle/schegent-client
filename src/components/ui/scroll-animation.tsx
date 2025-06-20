"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";

export function ScrollAnimation() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0]);
  const scale = useTransform(y, [0, 100], [1, 0.8]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors cursor-grab active:cursor-grabbing"
          style={{ y, opacity, scale }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 100 }}
          dragElastic={0.1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onDragEnd={(event, info) => {
            if (info.offset.y > 50) {
              scrollToTop();
            }
            y.set(0);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      )}
    </>
  );
}

export function DraggableEvent({ children, onDragEnd }: { children: React.ReactNode, onDragEnd?: (position: { x: number, y: number }) => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      style={{ x, y, rotate }}
      className="cursor-grab active:cursor-grabbing"
      onDragEnd={(event, info) => {
        if (onDragEnd) {
          onDragEnd({ x: info.point.x, y: info.point.y });
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
} 