import { getLlmProvider } from '../../src/llm/env';
import type { LocatorHealer } from './healer.types';
import { AnthropicLocatorHealer } from './healer.anthropic';
import { LangchainLocatorHealer } from './healer.langchain';

export function createHealer(): LocatorHealer {
  return getLlmProvider() === 'langchain' ? new LangchainLocatorHealer() : new AnthropicLocatorHealer();
}
