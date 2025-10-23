"use client";

import { CodeGenerationOptions, SupportedLanguages } from "@/types";

interface LanguageSelectorProps {
  isDark: boolean;
  options: CodeGenerationOptions;
  supportedLanguages: SupportedLanguages;
  onOptionsChange: (options: Partial<CodeGenerationOptions>) => void;
}

export function LanguageSelector({
  isDark,
  options,
  supportedLanguages,
  onOptionsChange,
}: LanguageSelectorProps) {
  const handleLanguageChange = (language: string) => {
    const frameworks = supportedLanguages[language]?.frameworks || [];
    onOptionsChange({
      language,
      framework: frameworks[0] || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Programming Language
          </label>
          <select
            value={options.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            {Object.keys(supportedLanguages).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Framework/ORM
          </label>
          <select
            value={options.framework}
            onChange={(e) => onOptionsChange({ framework: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            {supportedLanguages[options.language]?.frameworks.map(
              (fw: string) => (
                <option key={fw} value={fw}>
                  {fw}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <CheckboxOption
          isDark={isDark}
          checked={options.includeModels}
          onChange={(checked) => onOptionsChange({ includeModels: checked })}
          title="Include Models/Entities"
          description="Generate model classes for all tables"
        />
        <CheckboxOption
          isDark={isDark}
          checked={options.includeMigrations}
          onChange={(checked) => onOptionsChange({ includeMigrations: checked })}
          title="Include Migration Files"
          description="Generate database migration scripts"
        />
        <CheckboxOption
          isDark={isDark}
          checked={options.includeRepositories}
          onChange={(checked) =>
            onOptionsChange({ includeRepositories: checked })
          }
          title="Include Repository Pattern"
          description="Generate repository classes with CRUD operations"
        />
      </div>
    </div>
  );
}

function CheckboxOption({
  isDark,
  checked,
  onChange,
  title,
  description,
}: {
  isDark: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
        isDark
          ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded"
      />
      <div>
        <p
          className={`font-medium ${isDark ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </p>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
          {description}
        </p>
      </div>
    </label>
  );
}