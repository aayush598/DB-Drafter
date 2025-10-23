// components/steps/Step1ProjectDescription.tsx

"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";
import { ProjectExamples } from "../features/ProjectExamples"; // Import the new component
import { EXAMPLE_PROMPTS } from "@/lib/constants/projectExamples"; // Import to use placeholder text

interface Step1Props {
  isDark: boolean;
  projectDescription: string;
  apiKey: string;
  loading: boolean;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void;
}

export function Step1ProjectDescription({
  isDark,
  projectDescription,
  apiKey,
  loading,
  onDescriptionChange,
  onGenerate,
}: Step1Props) {
  // Handler to paste the example prompt (passed down to the ProjectExamples component)
  const handleExampleClick = (prompt: string) => {
    onDescriptionChange(prompt);
  };

  return (
    <StepWrapper isDark={isDark}>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Describe Your Project
        </h2>
        <p className={isDark ? "text-gray-400" : "text-slate-600"}>
          Provide a detailed description of your project to generate relevant
          database questions.
        </p>
      </div>

      {/* Main Input Box Container */}
      <div className="relative">
        <textarea
          value={projectDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={`w-full h-64 px-4 py-3 pb-16 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
          placeholder={EXAMPLE_PROMPTS[0].full}
        />

        {/* Generate Questions Button inside the Input Box */}
        <div className="absolute bottom-3 right-3">
          <Button
            onClick={onGenerate}
            disabled={loading || !apiKey || projectDescription.trim() === ""}
            loading={loading}
            icon={<ChevronRight className="w-5 h-5" />}
          >
            {loading ? "Generating..." : "Generate Questions"}
          </Button>
        </div>
      </div>

      {/* 4. Examples Section - Using the new component */}
      <ProjectExamples 
        isDark={isDark} 
        onSelectExample={handleExampleClick} 
      />
    </StepWrapper>
  );
}