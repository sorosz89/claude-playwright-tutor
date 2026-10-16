import { ChatAnthropic } from '@langchain/anthropic';
import { getAnthropicApiKey, getModel } from '../../src/llm/env';
import {
  LocatorHealResultSchema,
  type HealInput,
  type LocatorHealer,
  type LocatorHealResult,
} from './healer.types';
import { isPlausibleSelector } from './guardrail';

const SYSTEM_PROMPT = `A Playwright CSS locator broke because the app's DOM changed.
Given the current DOM snapshot, the selector that no longer matches anything, and a
plain-English description of what element the test is trying to find, return ONE
corrected CSS selector that matches exactly that element in the snapshot. Prefer stable
attributes (data-testid, class, aria-label) over brittle structural selectors.`;

export class LangchainLocatorHealer implements LocatorHealer {
  async heal(input: HealInput): Promise<LocatorHealResult> {
    // TODO 1: Build a ChatAnthropic model (model: getModel(), apiKey:
    // getAnthropicApiKey(), temperature: 0) and call
    // .withStructuredOutput(LocatorHealResultSchema) on it.
    //
    // const model = new ChatAnthropic({
    //   model: getModel(),
    //   apiKey: getAnthropicApiKey(),
    //   temperature: 0,
    // }).withStructuredOutput(LocatorHealResultSchema);

    // TODO 2: Invoke it with SYSTEM_PROMPT plus a user message describing
    // input.domSnapshot, input.brokenSelector, and input.intentDescription. The result
    // is already schema-valid -- but NOT yet guardrail-checked.
    //
    // const result = await model.invoke([
    //   { role: 'system', content: SYSTEM_PROMPT },
    //   { role: 'user', content: [
    //     `Broken selector: ${input.brokenSelector}`,
    //     `Intent: ${input.intentDescription}`,
    //     `DOM snapshot:\n${input.domSnapshot}`,
    //   ].join('\n\n') },
    // ]);

    // TODO 3: Run isPlausibleSelector(result.healedSelector, input.brokenSelector) and
    // throw if it fails, exactly like the Anthropic path. The guardrail step is
    // deliberately provider-agnostic: schema validation (shape) and this plausibility
    // check (semantics) are two different, both-necessary safety nets.
    //
    // if (!isPlausibleSelector(result.healedSelector, input.brokenSelector)) {
    //   throw new Error(`Guardrail rejected implausible selector: "${result.healedSelector}"`);
    // }
    // return result;

    throw new Error('LangchainLocatorHealer.heal is not implemented yet -- see TODOs above.');
  }
}
