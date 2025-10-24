// lib/promptService.ts
import { promptsV1 } from "@/prompts/index";

type PromptVersion = "v1"; // can add v2, v3 later

export class PromptService {
  static currentVersion: PromptVersion = "v1";

  static getPrompt(version: PromptVersion = this.currentVersion) {
    switch (version) {
      case "v1":
        return promptsV1;
      default:
        throw new Error(`Unsupported prompt version: ${version}`);
    }
  }
}
