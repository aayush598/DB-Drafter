export const STEPS = [
  "Project Description",
  "Requirements",
  "Table Design",
  "Schema Generation",
  "Code Generation",
] as const;

export const STEP_DESCRIPTIONS = {
  1: "Describe your project to generate relevant database questions",
  2: "Help us understand your requirements better",
  3: "Review the proposed table structure",
  4: "Generate and download SQL schemas for your tables",
  5: "Create complete database setup code in your preferred language",
} as const;