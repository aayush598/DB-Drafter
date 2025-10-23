"use client";

import { AVAILABLE_MODELS } from "@/lib/constants/models";

interface ModelSelectorProps {
  isDark: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ isDark, value, onChange }: ModelSelectorProps) {
  return (
    <div>
      <label
        className={`block text-xs font-medium mb-1 ${
          isDark ? "text-gray-300" : "text-slate-700"
        }`}
      >
        Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          isDark
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-slate-300 text-slate-900"
        }`}
      >
        {AVAILABLE_MODELS.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
    </div>
  );
}