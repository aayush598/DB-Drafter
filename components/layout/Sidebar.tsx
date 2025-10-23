"use client";

import { Settings } from "lucide-react";
import { STEPS } from "@/lib/constants/steps";
import { ProgressIndicator } from "../features/ProgressIndicator";
import { ApiKeyInput } from "../features/ApiKeyInput";
import { ModelSelector } from "../features/ModelSelector";

interface SidebarProps {
  isDark: boolean;
  step: number;
  sessionId: string | null;
  apiKey: string;
  modelName: string;
  showApiKey: boolean;
  onApiKeyChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onToggleApiKey: () => void;
}

export function Sidebar({
  isDark,
  step,
  sessionId,
  apiKey,
  modelName,
  showApiKey,
  onApiKeyChange,
  onModelChange,
  onToggleApiKey,
}: SidebarProps) {
  return (
    <div
      className={`rounded-xl shadow-sm border p-6 sticky top-6 transition-colors ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
      }`}
    >
      {/* API Configuration */}
      <div className="mb-6">
        <h3
          className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          Configuration
        </h3>
        <div className="space-y-3">
          <ApiKeyInput
            isDark={isDark}
            value={apiKey}
            showApiKey={showApiKey}
            onChange={onApiKeyChange}
            onToggle={onToggleApiKey}
          />
          <ModelSelector
            isDark={isDark}
            value={modelName}
            onChange={onModelChange}
          />
        </div>
      </div>

      {/* Progress */}
      <div>
        <h3
          className={`text-sm font-semibold mb-3 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Progress
        </h3>
        <ProgressIndicator isDark={isDark} currentStep={step} steps={STEPS} />
      </div>

      {sessionId && (
        <div
          className={`mt-6 pt-6 border-t ${
            isDark ? "border-gray-700" : "border-slate-200"
          }`}
        >
          <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            Session ID
          </p>
          <p
            className={`text-xs font-mono mt-1 break-all ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            {sessionId}
          </p>
        </div>
      )}
    </div>
  );
}