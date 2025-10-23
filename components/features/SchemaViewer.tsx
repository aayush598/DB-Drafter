"use client";

import { Download } from "lucide-react";
import { GeneratedSchema } from "@/types";
import { downloadFile } from "@/lib/utils/download";

interface SchemaViewerProps {
  isDark: boolean;
  tableName: string;
  schema: GeneratedSchema;
}

export function SchemaViewer({ isDark, tableName, schema }: SchemaViewerProps) {
  const handleDownload = () => {
    downloadFile(schema.sql_schema, `${tableName}.sql`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3
          className={`text-sm font-semibold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          SQL Schema
        </h3>
        <pre
          className={`p-4 rounded-lg overflow-x-auto text-sm ${
            isDark ? "bg-gray-900 text-gray-100" : "bg-slate-900 text-slate-100"
          }`}
        >
          {schema.sql_schema}
        </pre>
      </div>

      {schema.relationships.length > 0 && (
        <div>
          <h3
            className={`text-sm font-semibold mb-2 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Relationships
          </h3>
          <div className="space-y-2">
            {schema.relationships.map((rel, i) => (
              <div
                key={i}
                className={`p-3 border rounded-lg text-sm ${
                  isDark
                    ? "bg-blue-900/20 border-blue-800 text-gray-300"
                    : "bg-blue-50 border-blue-200 text-slate-700"
                }`}
              >
                {rel}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleDownload}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          isDark
            ? "text-blue-400 bg-blue-900/20 border-blue-800 hover:bg-blue-900/30"
            : "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
        }`}
      >
        <Download className="w-4 h-4" />
        Download {tableName}.sql
      </button>
    </div>
  );
}
