"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { Step1ProjectDescription } from "@/components/steps/Step1ProjectDescription";
import { Step2AnswerQuestions } from "@/components/steps/Step2AnswerQuestions";
import { Step3TableDesign } from "@/components/steps/Step3TableDesign";
import { Step4GenerateSchemas } from "@/components/steps/Step4GenerateSchemas";
import { Step5GenerateCode } from "@/components/steps/Step5GenerateCode";
import {
  Question,
  Table,
  GeneratedSchema,
  GeneratedCode,
  CodeGenerationOptions,
  SupportedLanguages,
} from "@/types";
import { DEFAULT_MODEL } from "@/lib/constants/models";
import { generateQuestions } from "@/lib/api/questions";
import { generateDesign } from "@/lib/api/design";
import { generateTableSchema, getSupportedLanguages } from "@/lib/api/schema";
import { generateDatabaseCode } from "@/lib/api/code";

export default function DatabaseSchemaGenerator() {
  const { isDark, toggleTheme } = useTheme();

  // State
  const [step, setStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelName, setModelName] = useState(DEFAULT_MODEL);
  const [projectDescription, setProjectDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tables, setTables] = useState<Table[]>([]);
  const [detailedPrompt, setDetailedPrompt] = useState("");
  const [generatedSchemas, setGeneratedSchemas] = useState<
    Record<string, GeneratedSchema>
  >({});
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [supportedLanguages, setSupportedLanguages] =
    useState<SupportedLanguages>({});

  const [codeOptions, setCodeOptions] = useState<CodeGenerationOptions>({
    language: "python",
    framework: "sqlalchemy",
    includeModels: true,
    includeMigrations: true,
    includeRepositories: false,
  });

  // Fetch supported languages
  useEffect(() => {
    getSupportedLanguages()
      .then(setSupportedLanguages)
      .catch(console.error);
  }, []);

  // Handlers
  const handleGenerateQuestions = async () => {
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
      const data = await generateQuestions({
        description: projectDescription,
        api_key: apiKey,
        model_name: modelName,
      });

      setSessionId(data.session_id);
      setQuestions(data.questions);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDesign = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");

    try {
      const data = await generateDesign({ session_id: sessionId, answers });
      setTables(data.tables);
      setDetailedPrompt(data.detailed_prompt);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to generate design");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAllSchemas = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");

    const sortedTables = [...tables].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );

    for (const table of sortedTables) {
      try {
        const data = await generateTableSchema({
          session_id: sessionId,
          table_name: table.table_name,
        });

        setGeneratedSchemas((prev) => ({
          ...prev,
          [table.table_name]: data,
        }));
      } catch (err: any) {
        setError(`Error generating ${table.table_name}: ${err.message}`);
      }
    }

    setLoading(false);
  };

  const handleGenerateDatabaseCode = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError("");

    try {
      const data = await generateDatabaseCode({
        session_id: sessionId,
        ...codeOptions,
      });
      setGeneratedCode(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate code");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
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
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleCodeOptionsChange = (options: Partial<CodeGenerationOptions>) => {
    setCodeOptions({ ...codeOptions, ...options });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      <Header isDark={isDark} onToggleTheme={toggleTheme} onReset={handleReset} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              isDark={isDark}
              step={step}
              sessionId={sessionId}
              apiKey={apiKey}
              modelName={modelName}
              showApiKey={showApiKey}
              onApiKeyChange={setApiKey}
              onModelChange={setModelName}
              onToggleApiKey={() => setShowApiKey(!showApiKey)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <ErrorAlert message={error} isDark={isDark} />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1ProjectDescription
                  key="step1"
                  isDark={isDark}
                  projectDescription={projectDescription}
                  apiKey={apiKey}
                  loading={loading}
                  onDescriptionChange={setProjectDescription}
                  onGenerate={handleGenerateQuestions}
                />
              )}

              {step === 2 && (
                <Step2AnswerQuestions
                  key="step2"
                  isDark={isDark}
                  questions={questions}
                  answers={answers}
                  loading={loading}
                  onAnswerChange={handleAnswerChange}
                  onBack={() => setStep(1)}
                  onNext={handleGenerateDesign}
                />
              )}

              {step === 3 && (
                <Step3TableDesign
                  key="step3"
                  isDark={isDark}
                  tables={tables}
                  detailedPrompt={detailedPrompt}
                  onBack={() => setStep(2)}
                  onNext={() => setStep(4)}
                />
              )}

              {step === 4 && (
                <Step4GenerateSchemas
                  key="step4"
                  isDark={isDark}
                  tables={tables}
                  generatedSchemas={generatedSchemas}
                  loading={loading}
                  onGenerateAll={handleGenerateAllSchemas}
                  onBack={() => setStep(3)}
                  onNext={() => setStep(5)}
                />
              )}

              {step === 5 && (
                <Step5GenerateCode
                  key="step5"
                  isDark={isDark}
                  generatedCode={generatedCode}
                  codeOptions={codeOptions}
                  supportedLanguages={supportedLanguages}
                  loading={loading}
                  onOptionsChange={handleCodeOptionsChange}
                  onGenerate={handleGenerateDatabaseCode}
                  onBack={() => setStep(4)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer isDark={isDark} />
    </div>
  );
}
