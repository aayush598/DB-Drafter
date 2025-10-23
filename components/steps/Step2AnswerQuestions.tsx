"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";
import { Question } from "@/types";
import { useEffect } from "react"; // 1. Import useEffect

interface Step2Props {
  isDark: boolean;
  questions: Question[];
  answers: Record<string, string>;
  loading: boolean;
  onAnswerChange: (questionId: string, answer: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2AnswerQuestions({
  isDark,
  questions,
  answers,
  loading,
  onAnswerChange,
  onBack,
  onNext,
}: Step2Props) {
  // 2. Use useEffect to set default answers on mount
  useEffect(() => {
    questions.forEach((q) => {
      // Check if the question has options AND hasn't been answered yet
      if (q.options.length > 0 && !answers[q.id]) {
        // Select the first option as the default
        onAnswerChange(q.id, q.options[0]);
      }
    });
    // Dependency array includes `questions`, `answers`, and `onAnswerChange`.
    // This ensures it runs whenever the questions or existing answers change.
  }, [questions, answers, onAnswerChange]);

  // The `allAnswered` check remains the same
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <StepWrapper isDark={isDark}>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Answer Questions
        </h2>
        <p className={isDark ? "text-gray-400" : "text-slate-600"}>
          Help us understand your requirements better.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-6 rounded-lg border transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {idx + 1}. {q.question}
            </h3>
            <div className="space-y-2">
              {q.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isDark
                      ? "bg-gray-800 border-gray-600 hover:border-blue-500 hover:bg-gray-750"
                      : "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={option}
                    // This remains the same, as the answer will be set in the 'answers' state by useEffect
                    checked={answers[q.id] === option}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span
                    className={isDark ? "text-gray-300" : "text-slate-700"}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          icon={<ChevronLeft className="w-5 h-5" />}
          iconPosition="left"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={loading || !allAnswered}
          loading={loading}
          icon={<ChevronRight className="w-5 h-5" />}
        >
          {loading ? "Generating..." : "Generate Design"}
        </Button>
      </div>
    </StepWrapper>
  );
}