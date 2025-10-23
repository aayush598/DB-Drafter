"use client";

import { Code, Download } from "lucide-react";
import { CodeFile } from "@/types";
import { downloadFile } from "@/lib/utils/download";

interface CodeFileCardProps {
  isDark: boolean;
  file: CodeFile;
}

export function CodeFileCard({ isDark, file }: CodeFileCardProps) {
  const handleDownload = () => {
    downloadFile(file.content, file.filename);
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isDark ? "border-gray-700" : "border-slate-200"
      }`}
    >
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          isDark ? "bg-gray-700" : "bg-slate-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <Code
            className={`w-4 h-4 ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          />
          <span
            className={`font-mono text-sm ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {file.filename}
          </span>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
      <div className="p-4">
        <p
          className={`text-sm mb-3 ${
            isDark ? "text-gray-400" : "text-slate-600"
          }`}
        >
          {file.description}
        </p>
        <pre
          className={`p-4 rounded-lg overflow-x-auto text-xs max-h-96 ${
            isDark ? "bg-gray-900 text-gray-100" : "bg-slate-900 text-slate-100"
          }`}
        >
          {file.content}
        </pre>
      </div>
    </div>
  );
}