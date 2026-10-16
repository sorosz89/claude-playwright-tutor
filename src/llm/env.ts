export type LlmProvider = 'anthropic' | 'langchain';

export function getAnthropicApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.',
    );
  }
  return key;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';
}

export function getLlmProvider(): LlmProvider {
  const provider = process.env.LLM_PROVIDER ?? 'anthropic';
  if (provider !== 'anthropic' && provider !== 'langchain') {
    throw new Error(`Unknown LLM_PROVIDER "${provider}". Use "anthropic" or "langchain".`);
  }
  return provider;
}
