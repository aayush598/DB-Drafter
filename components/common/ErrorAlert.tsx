"use client";

import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorAlertProps {
  message: string;
  isDark?: boolean;
}

export function ErrorAlert({ message, isDark = false }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 border rounded-lg p-4 flex items-start gap-3 ${
        isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
      }`}
    >
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div>
        <p
          className={`text-sm font-medium ${
            isDark ? "text-red-400" : "text-red-900"
          }`}
        >
          Error
        </p>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-red-300" : "text-red-700"
          }`}
        >
          {message}
        </p>
      </div>
    </motion.div>
  );
}