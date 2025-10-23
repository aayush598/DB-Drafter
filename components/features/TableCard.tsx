"use client";

import { Table } from "@/types";

interface TableCardProps {
  isDark: boolean;
  table: Table;
}

export function TableCard({ isDark, table }: TableCardProps) {
  return (
    <div
      className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
        isDark
          ? "bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-800"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      }`}
    >
      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
        {table.sequence_order}
      </div>
      <div className="flex-1">
        <h3
          className={`text-lg font-semibold mb-1 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {table.table_name}
        </h3>
        <p
          className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}
        >
          {table.description.slice(0, 200)}
          {table.description.length > 200 ? "..." : ""}
        </p>
      </div>
    </div>
  );
}