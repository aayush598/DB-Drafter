"use client";

import { CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  isDark: boolean;
  currentStep: number;
  steps: readonly string[];
}

export function ProgressIndicator({
  isDark,
  currentStep,
  steps,
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      {steps.map((stepName, idx) => {
        const stepNum = idx + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isPending = stepNum > currentStep;

        return (
          <div
            key={stepNum}
            className={`flex items-center gap-2 text-sm ${
              isCompleted
                ? "text-green-600"
                : isCurrent
                ? "text-blue-600 font-medium"
                : isDark
                ? "text-gray-500"
                : "text-slate-400"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isCurrent ? (
              <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            ) : (
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  isDark ? "border-gray-600" : "border-slate-300"
                }`}
              />
            )}
            <span>{stepName}</span>
          </div>
        );
      })}
    </div>
  );
}