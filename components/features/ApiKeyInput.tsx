"use client";

import { Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  isDark: boolean;
  value: string;
  showApiKey: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export function ApiKeyInput({
  isDark,
  value,
  showApiKey,
  onChange,
  onToggle,
}: ApiKeyInputProps) {
  return (
    <div>
      <label
        className={`block text-xs font-medium mb-1 ${
          isDark ? "text-gray-300" : "text-slate-700"
        }`}
      >
        Gemini API Key
      </label>
      <div className="relative">
        <input
          type={showApiKey ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
          }`}
          placeholder="Enter API key"
        />
        <button
          onClick={onToggle}
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${
            isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {showApiKey ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}