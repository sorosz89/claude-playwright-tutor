/**
 * Raw @anthropic-ai/sdk path: a ReAct-style loop. Each iteration, Claude picks one of
 * the tools below (including `finish`) with `tool_choice: 'auto'` -- unlike challenges
 * 1/2, nothing forces a single tool, because the whole point is letting the model
 * decide what to do next, informed by what actually happened last time.
 */
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { Page } from '@playwright/test';
import { getAnthropicApiKey, getModel } from '../../src/llm/env';
import {
  ExplorationReportSchema,
  MAX_ITERATIONS,
  FINISH_TOOL_NAME,
  type AgentRunResult,
  type AgentTrace,
  type ExploratoryAgent,
} from './agent.types';
import { explorationTools, type ToolDefinition } from './tools';
import { isPlausibleSelector, isPlausiblePath } from './guardrail';

const SYSTEM_PROMPT = `You are exploratory-testing a TodoMVC web app by calling tools one
at a time. Each tool call you make is executed for real against a live browser, and the
result is given back to you before your next move. Use read_page whenever you need to
see the current DOM or confirm what an action actually did -- don't assume. You have a
limited number of tool calls, so don't repeat the same action more than once or twice.
When you've tried a reasonable number of things, call finish with a short report.
Selectors must never contain whitespace -- use the child combinator '>' (no spaces) instead of a
descendant space when you need to narrow into a specific nested element.`;

const toolsByName = new Map<string, ToolDefinition<unknown>>(
  explorationTools.map((tool) => [tool.name, tool as ToolDefinition<unknown>]),
);

export class AnthropicExploratoryAgent implements ExploratoryAgent {
  private readonly client = new Anthropic({ apiKey: getAnthropicApiKey() });

  constructor(private readonly page: Page) {}

  async explore(goal: string): Promise<AgentRunResult> {
    const trace: AgentTrace = [];
    const messages: Anthropic.MessageParam[] = [{ role: 'user', content: goal }];

    const tools: Anthropic.Tool[] = [
      ...explorationTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: z.toJSONSchema(tool.schema) as Anthropic.Tool.InputSchema,
      })),
      {
        name: FINISH_TOOL_NAME,
        description: 'Call this when you are done exploring, with a short report.',
        input_schema: z.toJSONSchema(ExplorationReportSchema) as Anthropic.Tool.InputSchema,
      },
    ];

    for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
      // TODO 1: Call this.client.messages.create with model: getModel(), max_tokens: 1024,
      // system: SYSTEM_PROMPT, `messages`, `tools`, and tool_choice: { type: 'auto' }.
      //
      // const response = await this.client.messages.create({ ... });

      // TODO 2: Push the assistant's turn onto `messages` so the model sees its own
      // prior turn on the next iteration:
      // messages.push({ role: 'assistant', content: response.content });

      // TODO 3: Collect every block in response.content with type 'tool_use'
      // (Anthropic.ToolUseBlock[]). If there are none (the model just replied with
      // text), push a short nudge user message -- e.g. "Call one of the available
      // tools, including finish when you're done." -- and `continue` to the next
      // iteration instead of crashing.

      // TODO 4: For each tool_use block, in order:
      //   - if block.name === FINISH_TOOL_NAME: validate block.input with
      //     ExplorationReportSchema.parse(...) (never trust it as-is, same rule as
      //     every challenge before this one), push a trace entry, console.log it, and
      //     `return { report, trace }` immediately -- this is the only way explore()
      //     returns normally.
      //   - otherwise: look up the ToolDefinition in `toolsByName` by block.name
      //     (throw if it's missing -- a model calling an undeclared tool is a bug, not
      //     something to recover from). Validate the shape with
      //     `const args = tool.schema.parse(block.input) as any` -- then run the
      //     matching semantic guardrail: isPlausibleSelector(args.selector) for
      //     click/type, isPlausiblePath(args.path) for navigate, no guardrail for
      //     read_page. If the guardrail rejects, that rejection message *is* the tool's
      //     output (isError: true) and you must NOT call .execute(). Otherwise call
      //     tool.execute(this.page, args) inside a try/catch: a thrown error's .message
      //     becomes the output (isError: true), the resolved string becomes the output
      //     (isError: false) on success. Push a trace entry and console.log every
      //     outcome -- success or failure -- before moving to the next block.

      // TODO 5: Build one tool_result content block per tool_use block handled above
      // (`{ type: 'tool_result', tool_use_id: block.id, content: <output>, is_error:
      // <isError> } satisfies Anthropic.ToolResultBlockParam`) and push a single
      // `{ role: 'user', content: toolResultBlocks }` turn onto `messages` before the
      // loop continues.
    }

    throw new Error(`Exploration exceeded MAX_ITERATIONS (${MAX_ITERATIONS}) without calling finish.`);
  }
}
