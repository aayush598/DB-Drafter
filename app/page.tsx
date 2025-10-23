"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ChevronRight,
  ChevronLeft,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code,
  FileText,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Table {
  table_name: string;
  description: string;
  sequence_order: number;
}

interface GeneratedSchema {
  sql_schema: string;
  relationships: string[];
}

interface CodeFile {
  filename: string;
  content: string;
  description: string;
}

export default function DatabaseSchemaGenerator() {
  // State Management
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelName, setModelName] = useState("gemini-2.0-flash-lite");
  const [projectDescription, setProjectDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tables, setTables] = useState<Table[]>([]);
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [generatedSchemas, setGeneratedSchemas] = useState<
    Record<string, GeneratedSchema>
  >({});
  const [generatedCode, setGeneratedCode] = useState<{
    files: CodeFile[];
    setup_instructions: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  // Code generation state
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [selectedFramework, setSelectedFramework] = useState("sqlalchemy");
  const [includeModels, setIncludeModels] = useState(true);
  const [includeMigrations, setIncludeMigrations] = useState(true);
  const [includeRepositories, setIncludeRepositories] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<any>({});

  // Fetch supported languages
  useEffect(() => {
    fetch("/api/v1/supported-languages")
      .then((res) => res.json())
      .then(setSupportedLanguages)
      .catch(console.error);
  }, []);

  // API Calls
  const generateQuestions = async () => {
    if (!projectDescription.trim()) {
      setError("Please enter a project description");
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: projectDescription,
          api_key: apiKey,
          model_name: modelName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSessionId(data.session_id);
        setQuestions(data.questions);
        setStep(2);
      } else {
        setError(data.error || "Failed to generate questions");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const generateDesign = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/generate-detailed-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, answers }),
      });

      const data = await response.json();

      if (response.ok) {
        setTables(data.tables);
        setDetailedPrompt(data.detailed_prompt);
        setStep(3);
      } else {
        setError(data.error || "Failed to generate design");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const generateAllSchemas = async () => {
    setLoading(true);
    setError("");

    const sortedTables = [...tables].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );

    for (const table of sortedTables) {
      try {
        const response = await fetch("/api/v1/generate-table-schema", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            table_name: table.table_name,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setGeneratedSchemas((prev) => ({
            ...prev,
            [table.table_name]: data,
          }));
        } else {
          setError(`Error generating ${table.table_name}`);
        }
      } catch (err: any) {
        setError(`Error for ${table.table_name}: ${err.message}`);
      }
    }

    setLoading(false);
  };

  const generateDatabaseCode = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/generate-database-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          language: selectedLanguage,
          framework: selectedFramework,
          include_models: includeModels,
          include_migrations: includeMigrations,
          include_repositories: includeRepositories,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCode(data);
      } else {
        setError(data.error || "Failed to generate code");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const downloadAllSchemas = () => {
    const sortedTables = [...tables].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );
    let allSchemas = "";

    sortedTables.forEach((table) => {
      if (generatedSchemas[table.table_name]) {
        allSchemas += `\n-- Table: ${table.table_name}\n`;
        allSchemas += `-- ${"-".repeat(60)}\n\n`;
        allSchemas += generatedSchemas[table.table_name].sql_schema;
        allSchemas += "\n\n";
      }
    });

    const blob = new Blob([allSchemas], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complete_database_schema.sql";
    a.click();
  };

  const resetApp = () => {
    setStep(1);
    setSessionId(null);
    setProjectDescription("");
    setQuestions([]);
    setAnswers({});
    setTables([]);
    setDetailedPrompt("");
    setGeneratedSchemas({});
    setGeneratedCode(null);
    setError("");
    setActiveTab(0);
  };

  // Progress Steps
  const steps = [
    "Project Description",
    "Requirements",
    "Table Design",
    "Schema Generation",
    "Code Generation",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Database Schema Generator
                </h1>
                <p className="text-sm text-slate-600">
                  AI-powered database design and code generation
                </p>
              </div>
            </div>
            <button
              onClick={resetApp}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
              {/* API Configuration */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Gemini API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 pr-10 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter API key"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Model
                    </label>
                    <select
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="gemini-2.0-flash-lite">
                        Gemini 2.0 Flash Lite
                      </option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Progress
                </h3>
                <div className="space-y-2">
                  {steps.map((stepName, idx) => {
                    const stepNum = idx + 1;
                    return (
                      <div
                        key={stepNum}
                        className={`flex items-center gap-2 text-sm ${
                          stepNum < step
                            ? "text-green-600"
                            : stepNum === step
                            ? "text-blue-600 font-medium"
                            : "text-slate-400"
                        }`}
                      >
                        {stepNum < step ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : stepNum === step ? (
                          <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                        <span>{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {sessionId && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500">Session ID</p>
                  <p className="text-xs font-mono text-slate-700 mt-1 break-all">
                    {sessionId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Project Description */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Describe Your Project
                    </h2>
                    <p className="text-slate-600">
                      Provide a detailed description of your project to generate
                      relevant database questions.
                    </p>
                  </div>

                  {!apiKey && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-amber-900 mb-2">
                        API Key Required
                      </p>
                      <p className="text-sm text-amber-700 mb-3">
                        Enter your Gemini API key in the sidebar to continue.
                      </p>
                      <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        Get API Key →
                      </a>
                    </div>
                  )}

                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Example: An e-commerce platform with user authentication, product catalog, shopping cart, order management, and payment processing. The system should support multiple vendors, customer reviews, wishlists, and promotional codes..."
                  />

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={generateQuestions}
                      disabled={loading || !apiKey}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Questions
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Answer Questions */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Answer Questions
                    </h2>
                    <p className="text-slate-600">
                      Help us understand your requirements better.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-6 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                          {idx + 1}. {q.question}
                        </h3>
                        <div className="space-y-2">
                          {q.options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={option}
                                checked={answers[q.id] === option}
                                onChange={(e) =>
                                  setAnswers({
                                    ...answers,
                                    [q.id]: e.target.value,
                                  })
                                }
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-slate-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={generateDesign}
                      disabled={
                        loading || Object.keys(answers).length !== questions.length
                      }
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Design
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Table Design */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Database Design Overview
                    </h2>
                    <p className="text-slate-600">
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
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                        {detailedPrompt}
                      </pre>
                    </div>
                  )}

                  <div className="space-y-4 mb-8">
                    {tables
                      .sort((a, b) => a.sequence_order - b.sequence_order)
                      .map((table) => (
                        <div
                          key={table.table_name}
                          className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                            {table.sequence_order}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                              {table.table_name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {table.description.slice(0, 200)}...
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Generate Schemas
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Generate Schemas */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      SQL Schemas
                    </h2>
                    <p className="text-slate-600">
                      Generate and download SQL schemas for your tables.
                    </p>
                  </div>

                  {Object.keys(generatedSchemas).length < tables.length && (
                    <button
                      onClick={generateAllSchemas}
                      disabled={loading}
                      className="mb-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate All Schemas
                          <Database className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}

                  {Object.keys(generatedSchemas).length > 0 && (
                    <>
                      <div className="mb-6 border-b border-slate-200">
                        <div className="flex gap-2 overflow-x-auto">
                          {tables
                            .sort((a, b) => a.sequence_order - b.sequence_order)
                            .map((table, idx) => (
                              <button
                                key={table.table_name}
                                onClick={() => setActiveTab(idx)}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                  activeTab === idx
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-slate-600 hover:text-slate-900"
                                }`}
                              >
                                {table.table_name}
                              </button>
                            ))}
                        </div>
                      </div>

                      {tables
                        .sort((a, b) => a.sequence_order - b.sequence_order)
                        .map((table, idx) => (
                          <div
                            key={table.table_name}
                            className={activeTab === idx ? "block" : "hidden"}
                          >
                            {generatedSchemas[table.table_name] ? (
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                                    SQL Schema
                                  </h3>
                                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                                    {generatedSchemas[table.table_name].sql_schema}
                                  </pre>
                                </div>

                                {generatedSchemas[table.table_name].relationships
                                  .length > 0 && (
                                  <div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                                      Relationships
                                    </h3>
                                    <div className="space-y-2">
                                      {generatedSchemas[
                                        table.table_name
                                      ].relationships.map((rel, i) => (
                                        <div
                                          key={i}
                                          className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-slate-700"
                                        >
                                          {rel}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <button
                                  onClick={() => {
                                    const blob = new Blob(
                                      [
                                        generatedSchemas[table.table_name]
                                          .sql_schema,
                                      ],
                                      { type: "text/plain" }
                                    );
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `${table.table_name}.sql`;
                                    a.click();
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                  Download {table.table_name}.sql
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-12">
                                <p className="text-slate-600 mb-4">
                                  Schema not generated yet
                                </p>
                              </div>
                            )}
                          </div>
                        ))}

                      {Object.keys(generatedSchemas).length === tables.length && (
                        <div className="mt-6 pt-6 border-t border-slate-200">
                          <button
                            onClick={downloadAllSchemas}
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
                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={() => setStep(5)}
                      disabled={Object.keys(generatedSchemas).length !== tables.length}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      Generate Code
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Generate Code */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Generate Database Code
                    </h2>
                    <p className="text-slate-600">
                      Create complete database setup code in your preferred language.
                    </p>
                  </div>

                  {!generatedCode && (
                    <div className="space-y-6 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Programming Language
                          </label>
                          <select
                            value={selectedLanguage}
                            onChange={(e) => {
                              setSelectedLanguage(e.target.value);
                              setSelectedFramework(
                                supportedLanguages[e.target.value]?.frameworks[0] || ""
                              );
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {Object.keys(supportedLanguages).map((lang) => (
                              <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Framework/ORM
                          </label>
                          <select
                            value={selectedFramework}
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            {supportedLanguages[selectedLanguage]?.frameworks.map(
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
                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={includeModels}
                            onChange={(e) => setIncludeModels(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              Include Models/Entities
                            </p>
                            <p className="text-sm text-slate-600">
                              Generate model classes for all tables
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={includeMigrations}
                            onChange={(e) => setIncludeMigrations(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              Include Migration Files
                            </p>
                            <p className="text-sm text-slate-600">
                              Generate database migration scripts
                            </p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={includeRepositories}
                            onChange={(e) =>
                              setIncludeRepositories(e.target.checked)
                            }
                            className="w-5 h-5 text-blue-600 rounded"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              Include Repository Pattern
                            </p>
                            <p className="text-sm text-slate-600">
                              Generate repository classes with CRUD operations
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {generatedCode && (
                    <div className="space-y-6 mb-8">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Code Generated Successfully
                          </p>
                          <p className="text-sm text-green-700 mt-1">
                            {generatedCode.files.length} files generated for{" "}
                            {selectedLanguage} with {selectedFramework}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                          Generated Files
                        </h3>
                        <div className="space-y-4">
                          {generatedCode.files.map((file, idx) => (
                            <div
                              key={idx}
                              className="border border-slate-200 rounded-lg overflow-hidden"
                            >
                              <div className="bg-slate-100 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-slate-600" />
                                  <span className="font-mono text-sm text-slate-900">
                                    {file.filename}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    const blob = new Blob([file.content], {
                                      type: "text/plain",
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = file.filename;
                                    a.click();
                                  }}
                                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-slate-600 mb-3">
                                  {file.description}
                                </p>
                                <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs max-h-96">
                                  {file.content}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                          Setup Instructions
                        </h3>
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                            {generatedCode.setup_instructions}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(4)}
                      className="flex items-center gap-2 px-6 py-3 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back to Schemas
                    </button>
                    {!generatedCode && (
                      <button
                        onClick={generateDatabaseCode}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate Database Code
                            <Code className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-600">
            Powered by Google Gemini 2.0 Flash | Built with Next.js & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}