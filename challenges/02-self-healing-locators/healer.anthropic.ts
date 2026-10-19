/**
 * Raw @anthropic-ai/sdk tool-use path: force Claude to return
 * { healedSelector, reasoning } through a tool schema, validate the shape with zod,
 * then run the semantic guardrail before trusting the selector.
 */
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { getAnthropicApiKey, getModel } from '../../src/llm/env';
import {
  LocatorHealResultSchema,
  type HealInput,
  type LocatorHealer,
  type LocatorHealResult,
} from './healer.types';
import { isPlausibleSelector } from './guardrail';

const TOOL_NAME = 'submit_healed_selector';

const SYSTEM_PROMPT = `A Playwright CSS locator broke because the app's DOM changed.
Given the current DOM snapshot, the selector that no longer matches anything, and a
plain-English description of what element the test is trying to find, return ONE
corrected CSS selector that matches exactly that element in the snapshot. Prefer stable
attributes (data-testid, class, aria-label) over brittle structural selectors.`;

export class AnthropicLocatorHealer implements LocatorHealer {
  private readonly client = new Anthropic({ apiKey: getAnthropicApiKey() });

  async heal(input: HealInput): Promise<LocatorHealResult> {
    // TODO 1: Call this.client.messages.create, forcing the TOOL_NAME tool -- same
    // pattern as challenges/01-ai-test-case-generator/generate.anthropic.ts:
    //   - input_schema: z.toJSONSchema(LocatorHealResultSchema) as Anthropic.Tool.InputSchema
    //   - tool_choice: { type: 'tool', name: TOOL_NAME }
    //   - a user message that includes input.domSnapshot, input.brokenSelector, and
    //     input.intentDescription

    // TODO 2: Extract the tool_use block and validate it with
    // LocatorHealResultSchema.parse(...)

    // TODO 3: Run the guardrail --
    // isPlausibleSelector(result.healedSelector, input.brokenSelector) -- and throw a
    // clear error if it fails. Only return the result once it passes.

    throw new Error('AnthropicLocatorHealer.heal is not implemented yet -- see TODOs above.');
  }
}
