// prompts/v1/generateQuestionsPrompt.ts
export const generateQuestionsPrompt = (description: string) => `
You are an expert database requirements analyst.

Based on the following project description, generate 5–7 multiple-choice questions (MCQs) 
to understand the database requirements better. Each question must have 3–5 options. 
Do NOT provide any free-text answers.

Project Description:
${description}

The questions should cover:
1. Project complexity level
2. Expected scale/number of users
3. Data relationships complexity
4. Performance requirements
5. Security level
6. Any other domain-specific considerations

Return the response strictly in the following JSON format:

{
  "questions": [
    {
      "id": "q1",
      "question": "Your first question here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
    },
    {
      "id": "q2",
      "question": "Your second question here?",
      "options": ["Option 1", "Option 2", "Option 3"]
    }
  ]
}

⚠️ Important:
- Ensure all questions have a unique "id".
- All answers must be listed under "options".
- Do not include any free-text answers.
- JSON must be valid and parseable.
`;
