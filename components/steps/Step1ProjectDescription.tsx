"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";

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

      <textarea
        value={projectDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className={`w-full h-64 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
          isDark
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
        }`}
        placeholder="Example: An e-commerce platform with user authentication, product catalog, shopping cart, order management, and payment processing. The system should support multiple vendors, customer reviews, wishlists, and promotional codes..."
      />

      <div className="mt-6 flex justify-end">
        <Button
          onClick={onGenerate}
          disabled={loading || !apiKey} 
          loading={loading}
          icon={<ChevronRight className="w-5 h-5" />}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </Button>
      </div>
    </StepWrapper>
  );
}