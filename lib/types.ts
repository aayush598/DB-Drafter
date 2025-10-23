// lib/types.ts

export interface ProjectDescriptionInput {
  description: string;
  api_key: string;
  model_name?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
}

export interface QuestionsResponse {
  session_id: string;
  questions: Question[];
  project_description: string;
}

export interface AnswersInput {
  session_id: string;
  answers: Record<string, string>;
}

export interface TableInfo {
  table_name: string;
  description: string;
  sequence_order: number;
}

export interface DetailedPromptResponse {
  session_id: string;
  detailed_prompt: string;
  tables: TableInfo[];
}

export interface TableSchemaRequest {
  session_id: string;
  table_name: string;
}

export interface TableSchemaResponse {
  table_name: string;
  sql_schema: string;
  relationships: string[];
}

export interface CodeFile {
  filename: string;
  content: string;
  description: string;
}

export interface CodeGenerationRequest {
  session_id: string;
  language: string;
  framework: string;
  include_migrations?: boolean;
  include_models?: boolean;
  include_repositories?: boolean;
}

export interface CodeGenerationResponse {
  session_id: string;
  language: string;
  framework: string;
  files: CodeFile[];
  setup_instructions: string;
}
