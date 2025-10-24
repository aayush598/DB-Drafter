// prompts/v1/generateQuestionsPrompt.ts
export const generateQuestionsPrompt = (description: string) => `
You are an expert database requirements analyst.

Based on the following project description, generate 5–7 relevant questions
to understand the database requirements better.

Project Description:
${description}

Generate questions about:
1. Project complexity (Simple/Moderate/Complex/Enterprise)
2. Expected scale/number of users (Small <1K / Medium 1K–100K / Large 100K–1M / Enterprise >1M)
3. Data relationships complexity
4. Performance requirements
5. Security requirements
6. Domain-specific considerations

Return valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the complexity level of the project?",
      "options": ["Simple", "Moderate", "Complex", "Enterprise"]
    }
  ]
}
`;
