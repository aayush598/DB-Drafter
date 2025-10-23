"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepWrapperProps {
  isDark: boolean;
  children: ReactNode;
}

export function StepWrapper({ isDark, children }: StepWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`rounded-xl shadow-sm border p-8 transition-colors ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
      }`}
    >
      {children}
    </motion.div>
  );
}