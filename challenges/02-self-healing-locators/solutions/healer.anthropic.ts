import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { getAnthropicApiKey, getModel } from '../../../src/llm/env';
import {
  LocatorHealResultSchema,
  type HealInput,
  type LocatorHealer,
  type LocatorHealResult,
} from '../healer.types';
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
    const response = await this.client.messages.create({
      model: getModel(),
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            `Broken selector: ${input.brokenSelector}`,
            `Intent: ${input.intentDescription}`,
            `DOM snapshot:\n${input.domSnapshot}`,
          ].join('\n\n'),
        },
      ],
      tools: [
        {
          name: TOOL_NAME,
          description: 'Submit the corrected CSS selector and a one-sentence reason.',
          input_schema: z.toJSONSchema(LocatorHealResultSchema) as Anthropic.Tool.InputSchema,
        },
      ],
      tool_choice: { type: 'tool', name: TOOL_NAME },
    });

    const toolUse = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
    );
    if (!toolUse) throw new Error('Claude responded without calling submit_healed_selector.');

    const result = LocatorHealResultSchema.parse(toolUse.input);

    if (!isPlausibleSelector(result.healedSelector, input.brokenSelector)) {
      throw new Error(`Guardrail rejected implausible selector: "${result.healedSelector}"`);
    }

    return result;
  }
}
