import { ChatAnthropic } from '@langchain/anthropic';
import { getAnthropicApiKey, getModel } from '../../../src/llm/env';
import {
  LocatorHealResultSchema,
  type HealInput,
  type LocatorHealer,
  type LocatorHealResult,
} from '../healer.types';
import { isPlausibleSelector } from './guardrail';

const SYSTEM_PROMPT = `A Playwright CSS locator broke because the app's DOM changed.
Given the current DOM snapshot, the selector that no longer matches anything, and a
plain-English description of what element the test is trying to find, return ONE
corrected CSS selector that matches exactly that element in the snapshot. Prefer stable
attributes (data-testid, class, aria-label) over brittle structural selectors.`;

export class LangchainLocatorHealer implements LocatorHealer {
  async heal(input: HealInput): Promise<LocatorHealResult> {
    const model = new ChatAnthropic({
      model: getModel(),
      apiKey: getAnthropicApiKey(),
      temperature: 0,
    }).withStructuredOutput(LocatorHealResultSchema);

    const result = await model.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          `Broken selector: ${input.brokenSelector}`,
          `Intent: ${input.intentDescription}`,
          `DOM snapshot:\n${input.domSnapshot}`,
        ].join('\n\n'),
      },
    ]);

    if (!isPlausibleSelector(result.healedSelector, input.brokenSelector)) {
      throw new Error(`Guardrail rejected implausible selector: "${result.healedSelector}"`);
    }

    return result;
  }
}
