"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Database, Download } from "lucide-react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";
import { SchemaViewer } from "../features/SchemaViewer";
import { Table, GeneratedSchema } from "@/types";
import { downloadMultipleSchemas } from "@/lib/utils/download";

interface Step4Props {
  isDark: boolean;
  tables: Table[];
  generatedSchemas: Record<string, GeneratedSchema>;
  loading: boolean;
  onGenerateAll: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step4GenerateSchemas({
  isDark,
  tables,
  generatedSchemas,
  loading,
  onGenerateAll,
  onBack,
  onNext,
}: Step4Props) {
  const [activeTab, setActiveTab] = useState(0);
  const sortedTables = [...tables].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );
  const allGenerated = Object.keys(generatedSchemas).length === tables.length;

  const handleDownloadAll = () => {
    downloadMultipleSchemas(generatedSchemas, tables);
  };

  return (
    <StepWrapper isDark={isDark}>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          SQL Schemas
        </h2>
        <p className={isDark ? "text-gray-400" : "text-slate-600"}>
          Generate and download SQL schemas for your tables.
        </p>
      </div>

      {!allGenerated && (
        <Button
          onClick={onGenerateAll}
          disabled={loading}
          loading={loading}
          variant="primary"
          icon={<Database className="w-5 h-5" />}
          className="mb-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          {loading ? "Generating..." : "Generate All Schemas"}
        </Button>
      )}

      {Object.keys(generatedSchemas).length > 0 && (
        <>
          <div
            className={`mb-6 border-b ${
              isDark ? "border-gray-700" : "border-slate-200"
            }`}
          >
            <div className="flex gap-2 overflow-x-auto">
              {sortedTables.map((table, idx) => (
                <button
                  key={table.table_name}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === idx
                      ? "border-blue-600 text-blue-600"
                      : isDark
                      ? "border-transparent text-gray-400 hover:text-gray-200"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {table.table_name}
                </button>
              ))}
            </div>
          </div>

          {sortedTables.map((table, idx) => (
            <div
              key={table.table_name}
              className={activeTab === idx ? "block" : "hidden"}
            >
              {generatedSchemas[table.table_name] ? (
                <SchemaViewer
                  isDark={isDark}
                  tableName={table.table_name}
                  schema={generatedSchemas[table.table_name]}
                />
              ) : (
                <div className="text-center py-12">
                  <p
                    className={
                      isDark ? "text-gray-400 mb-4" : "text-slate-600 mb-4"
                    }
                  >
                    Schema not generated yet
                  </p>
                </div>
              )}
            </div>
          ))}

          {allGenerated && (
            <div
              className={`mt-6 pt-6 border-t ${
                isDark ? "border-gray-700" : "border-slate-200"
              }`}
            >
              <button
                onClick={handleDownloadAll}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5" />
                Download Complete Schema (All Tables)
              </button>
            </div>
          )}
        </>
      )}

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
          disabled={!allGenerated}
          icon={<ChevronRight className="w-5 h-5" />}
        >
          Generate Code
        </Button>
      </div>
    </StepWrapper>
  );
}