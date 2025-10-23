"use client";

import { ChevronLeft, Code, CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";
import { LanguageSelector } from "../features/LanguageSelector";
import { CodeFileCard } from "../features/CodeFileCard";
import {
  GeneratedCode,
  CodeGenerationOptions,
  SupportedLanguages,
} from "@/types";

interface Step5Props {
  isDark: boolean;
  generatedCode: GeneratedCode | null;
  codeOptions: CodeGenerationOptions;
  supportedLanguages: SupportedLanguages;
  loading: boolean;
  onOptionsChange: (options: Partial<CodeGenerationOptions>) => void;
  onGenerate: () => void;
  onBack: () => void;
}

export function Step5GenerateCode({
  isDark,
  generatedCode,
  codeOptions,
  supportedLanguages,
  loading,
  onOptionsChange,
  onGenerate,
  onBack,
}: Step5Props) {
  return (
    <StepWrapper isDark={isDark}>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Generate Database Code
        </h2>
        <p className={isDark ? "text-gray-400" : "text-slate-600"}>
          Create complete database setup code in your preferred language.
        </p>
      </div>

      {!generatedCode && (
        <div className="mb-8">
          <LanguageSelector
            isDark={isDark}
            options={codeOptions}
            supportedLanguages={supportedLanguages}
            onOptionsChange={onOptionsChange}
          />
        </div>
      )}

      {generatedCode && (
        <div className="space-y-6 mb-8">
          <div
            className={`border rounded-lg p-4 flex items-start gap-3 ${
              isDark
                ? "bg-green-900/20 border-green-800"
                : "bg-green-50 border-green-200"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-green-400" : "text-green-900"
                }`}
              >
                Code Generated Successfully
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-green-300" : "text-green-700"
                }`}
              >
                {generatedCode.files.length} files generated for{" "}
                {codeOptions.language} with {codeOptions.framework}
              </p>
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Generated Files
            </h3>
            <div className="space-y-4">
              {generatedCode.files.map((file, idx) => (
                <CodeFileCard key={idx} isDark={isDark} file={file} />
              ))}
            </div>
          </div>

          <div>
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Setup Instructions
            </h3>
            <div
              className={`p-4 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <pre
                className={`text-sm whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-slate-700"
                }`}
              >
                {generatedCode.setup_instructions}
              </pre>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          icon={<ChevronLeft className="w-5 h-5" />}
          iconPosition="left"
        >
          Back to Schemas
        </Button>
        {!generatedCode && (
          <Button
            onClick={onGenerate}
            disabled={loading}
            loading={loading}
            icon={<Code className="w-5 h-5" />}
          >
            {loading ? "Generating..." : "Generate Database Code"}
          </Button>
        )}
      </div>
    </StepWrapper>
  );
}