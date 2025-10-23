export interface Question {
  id: string;
  question: string;
  options: string[];
}

export interface Table {
  table_name: string;
  description: string;
  sequence_order: number;
}

export interface GeneratedSchema {
  sql_schema: string;
  relationships: string[];
}

export interface CodeFile {
  filename: string;
  content: string;
  description: string;
}

export interface GeneratedCode {
  files: CodeFile[];
  setup_instructions: string;
}

export interface SupportedLanguages {
  [key: string]: {
    frameworks: string[];
  };
}

export interface AppState {
  step: number;
  sessionId: string | null;
  apiKey: string;
  modelName: string;
  projectDescription: string;
  questions: Question[];
  answers: Record;
  tables: Table[];
  detailedPrompt: string;
  generatedSchemas: Record;
  generatedCode: GeneratedCode | null;
  loading: boolean;
  error: string;
  activeTab: number;
}

export interface CodeGenerationOptions {
  language: string;
  framework: string;
  includeModels: boolean;
  includeMigrations: boolean;
  includeRepositories: boolean;
}