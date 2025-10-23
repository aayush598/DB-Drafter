// components/steps/Step4GenerateSchemas.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Database, Download, Check, Loader2 } from "lucide-react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sortedTables = [...tables].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );
  const allGenerated = Object.keys(generatedSchemas).length === tables.length;

  const generatingIndex = sortedTables.findIndex(
    (table) => !generatedSchemas[table.table_name]
  );
  
  const currentGeneratingTable = loading && generatingIndex !== -1
    ? sortedTables[generatingIndex].table_name
    : null;


  // Automatic Generation Logic
  useEffect(() => {
    if (tables.length > 0 && !allGenerated && !loading) {
      onGenerateAll();
    }
  }, [tables, allGenerated, loading, onGenerateAll]);
  
  
  // Tab Scroll Logic (keeps the generating tab in view)
  useEffect(() => {
    if (loading && generatingIndex !== -1 && scrollContainerRef.current) {
        const activeTabElement = scrollContainerRef.current.children[generatingIndex] as HTMLElement;
        if (activeTabElement) {
            scrollContainerRef.current.scrollTo({
                left: activeTabElement.offsetLeft - (scrollContainerRef.current.offsetWidth / 2) + (activeTabElement.offsetWidth / 2),
                behavior: 'smooth'
            });
        }
    }
  }, [loading, generatingIndex]);


  const handleDownloadAll = () => {
    downloadMultipleSchemas(generatedSchemas, tables);
  };
  
  const handleTabClick = (index: number) => {
    setActiveTab(index);
    if (scrollContainerRef.current) {
        const activeTabElement = scrollContainerRef.current.children[index] as HTMLElement;
        if (activeTabElement) {
            scrollContainerRef.current.scrollTo({
                left: activeTabElement.offsetLeft - (scrollContainerRef.current.offsetWidth / 2) + (activeTabElement.offsetWidth / 2),
                behavior: 'smooth'
            });
        }
    }
  };


  const getTabStatusStyles = (tableName: string, index: number): string => {
    const isGenerated = !!generatedSchemas[tableName];
    const isGenerating = loading && index === generatingIndex;
    
    if (index === activeTab) {
        return `border-b-2 ${isDark ? "border-blue-500 text-blue-500" : "border-blue-600 text-blue-600"}`;
    }
    
    if (isGenerated) {
        return `border-b-2 ${isDark ? "border-green-500 text-green-500 hover:text-green-300" : "border-green-600 text-green-600 hover:text-green-800"}`;
    }
    
    if (isGenerating) {
        return `border-b-2 ${isDark ? "border-yellow-500 text-yellow-500" : "border-yellow-600 text-yellow-600"}`;
    }
    
    return `border-transparent ${isDark ? "text-gray-400 hover:text-gray-200" : "text-slate-600 hover:text-slate-900"}`;
  };

  const getTabStatusIcon = (tableName: string, index: number) => {
    const isGenerated = !!generatedSchemas[tableName];
    const isGenerating = loading && index === generatingIndex;

    if (isGenerating) {
        return <Loader2 className="w-4 h-4 mr-1 animate-spin" />;
    }
    if (isGenerated) {
        return <Check className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  const activeTableName = sortedTables[activeTab]?.table_name;
  const activeSchema = activeTableName ? generatedSchemas[activeTableName] : null;

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
          {loading 
            ? `Generating schema for: ${currentGeneratingTable || '...'}`
            : "Review, generate, and download SQL schemas for your tables."
          }
        </p>
      </div>

      {/* FIX: Status Indicator Wrapper with Fixed Height */}
      <div className="mb-6" style={{ height: '70px' /* Approximate height of the content plus padding/margin */ }}>
        {!allGenerated && (
          <div 
            className={`p-4 rounded-lg flex items-center justify-center gap-3 transition-colors ${
              isDark ? "bg-gray-700 text-gray-300" : "bg-slate-100 text-slate-700"
            }`}
          >
            <Button
                disabled={true}
                loading={loading}
                variant="primary"
                icon={<Database className="w-5 h-5" />}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
                {loading 
                  ? `Generating Schema ${generatingIndex + 1} of ${tables.length}: ${currentGeneratingTable}...` 
                  : `Preparing to Generate ${tables.length} Schemas...`
                }
            </Button>
          </div>
        )}
      </div>

      {/* Schema Navigation Tabs */}
      {tables.length > 0 && (
        <>
          <div
            className={`mb-6 border-b ${
              isDark ? "border-gray-700" : "border-slate-200"
            }`}
          >
            <div 
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide"
            >
              {sortedTables.map((table, idx) => (
                <button
                  key={table.table_name}
                  onClick={() => handleTabClick(idx)}
                  className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-300 ${
                    getTabStatusStyles(table.table_name, idx)
                  }`}
                >
                  {getTabStatusIcon(table.table_name, idx)}
                  {table.table_name}
                </button>
              ))}
            </div>
          </div>

          {/* Schema Viewer Content */}
          <div className="block">
              {activeSchema ? (
                <SchemaViewer
                  isDark={isDark}
                  tableName={activeTableName}
                  schema={activeSchema}
                />
              ) : (
                <div className="text-center py-12">
                  <p
                    className={
                      isDark ? "text-gray-400 mb-4" : "text-slate-600 mb-4"
                    }
                  >
                    {loading && activeTableName === currentGeneratingTable
                        ? `Generating schema for ${activeTableName}...`
                        : "Schema not generated yet or currently pending."
                    }
                  </p>
                </div>
              )}
            </div>

          {/* Download Button */}
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

      {/* Navigation Buttons */}
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