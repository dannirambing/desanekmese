"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  y?: number;
  x?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.55,
  scale = 0.95,
  y = 15,
  x = 0,
  once = true,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale, y, x }}
      whileInView={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
