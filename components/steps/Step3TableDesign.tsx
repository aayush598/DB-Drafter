"use client";

import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "../common/Button";
import { StepWrapper } from "./StepWrapper";
import { TableCard } from "../features/TableCard";
import { Table } from "@/types";

interface Step3Props {
  isDark: boolean;
  tables: Table[];
  detailedPrompt: string;
  onBack: () => void;
  onNext: () => void;
}

export function Step3TableDesign({
  isDark,
  tables,
  detailedPrompt,
  onBack,
  onNext,
}: Step3Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const sortedTables = [...tables].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );

  return (
    <StepWrapper isDark={isDark}>
      <div className="mb-6">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Database Design Overview
        </h2>
        <p className={isDark ? "text-gray-400" : "text-slate-600"}>
          Review the proposed table structure.
        </p>
      </div>

      <button
        onClick={() => setShowPrompt(!showPrompt)}
        className="mb-6 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
      >
        <FileText className="w-4 h-4" />
        {showPrompt ? "Hide" : "View"} Detailed Design Prompt
      </button>

      {showPrompt && (
        <div
          className={`mb-6 p-4 border rounded-lg transition-colors ${
            isDark
              ? "bg-gray-700 border-gray-600"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <pre
            className={`text-xs whitespace-pre-wrap ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            {detailedPrompt}
          </pre>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {sortedTables.map((table) => (
          <TableCard key={table.table_name} isDark={isDark} table={table} />
        ))}
      </div>

      <div className="flex justify-between">
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
          icon={<ChevronRight className="w-5 h-5" />}
        >
          Generate Schemas
        </Button>
      </div>
    </StepWrapper>
  );
}
