"use client";

import { Database, RefreshCw, Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
}

export function Header({ isDark, onToggleTheme, onReset }: HeaderProps) {
  return (
    <header
      className={`border-b shadow-sm transition-colors ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Database Schema Generator
              </h1>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                AI-powered database design and code generation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onReset}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDark
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}