// prompts/index.ts
import * as v1 from "./v1/generateQuestionsPrompt";
import * as v1Detailed from "./v1/generateDetailedPrompt";
import * as v1Table from "./v1/generateTableSchemaPrompt";
import * as v1DbCode from "./v1/generateDatabaseCodePrompt";

export const promptsV1 = {
  generateQuestionsPrompt: v1.generateQuestionsPrompt,
  generateDetailedPrompt: v1Detailed.generateDetailedPrompt,
  generateTableSchemaPrompt: v1Table.generateTableSchemaPrompt,
  generateDatabaseCodePrompt: v1DbCode.generateDatabaseCodePrompt,
};
