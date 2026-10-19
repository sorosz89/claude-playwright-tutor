import type { Page } from '@playwright/test';
import { getLlmProvider } from '../../src/llm/env';
import type { ExploratoryAgent } from './agent.types';
import { AnthropicExploratoryAgent } from './agent.anthropic';
import { LangchainExploratoryAgent } from './agent.langchain';

export function createAgent(page: Page): ExploratoryAgent {
  return getLlmProvider() === 'langchain' ? new LangchainExploratoryAgent(page) : new AnthropicExploratoryAgent(page);
}
