// components/features/ProjectExamples.tsx

"use client";

import { EXAMPLE_PROMPTS } from "@/lib/constants/projectExamples";

interface ProjectExamplesProps {
  isDark: boolean;
  onSelectExample: (prompt: string) => void;
}

export function ProjectExamples({ isDark, onSelectExample }: ProjectExamplesProps) {
  return (
    <div className="mt-4">
      <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
        Try an example project description:
      </p>
      
      {/* Centering and wrapping container */}
      <div className="flex flex-wrap justify-center gap-3">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example.short}
            onClick={() => onSelectExample(example.full)}
            type="button" // Use type="button" to prevent form submission if wrapped in a form
            className={`
              px-4 py-2 rounded-full border cursor-pointer transition-all text-sm font-medium whitespace-nowrap 
              shadow-sm hover:shadow-md
              ${isDark 
                ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-blue-500" 
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-500"
              }
            `}
          >
            {example.short}
          </button>
        ))}
      </div>
    </div>
  );
}