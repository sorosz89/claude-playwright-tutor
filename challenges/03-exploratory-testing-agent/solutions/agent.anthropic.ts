import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { Page } from '@playwright/test';
import { getAnthropicApiKey, getModel } from '../../../src/llm/env';
import {
  ExplorationReportSchema,
  MAX_ITERATIONS,
  FINISH_TOOL_NAME,
  type AgentRunResult,
  type AgentTrace,
  type ExploratoryAgent,
} from '../agent.types';
import { explorationTools, type ToolDefinition } from '../tools';
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

function runGuardrail(toolName: string, args: Record<string, unknown>): string | null {
  if ((toolName === 'click' || toolName === 'type') && typeof args.selector === 'string') {
    if (!isPlausibleSelector(args.selector)) {
      return `Guardrail rejected implausible selector: "${args.selector}". Pick a selector that appears verbatim in the DOM snapshot from read_page.`;
    }
  }
  if (toolName === 'navigate' && typeof args.path === 'string') {
    if (!isPlausiblePath(args.path)) {
      return `Guardrail rejected implausible path: "${args.path}". Use an in-app route like "#/active".`;
    }
  }
  return null;
}

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
      const response = await this.client.messages.create({
        model: getModel(),
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
        tools,
        tool_choice: { type: 'auto' },
      });

      messages.push({ role: 'assistant', content: response.content });

      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
      );

      if (toolUseBlocks.length === 0) {
        messages.push({
          role: 'user',
          content: "Call one of the available tools, including finish when you're done.",
        });
        continue;
      }

      const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];

      for (const block of toolUseBlocks) {
        if (block.name === FINISH_TOOL_NAME) {
          const report = ExplorationReportSchema.parse(block.input);
          trace.push({ iteration, toolName: block.name, input: block.input, output: JSON.stringify(report), isError: false });
          console.log(`[exploratory-agent:anthropic] #${iteration} finish -> ${JSON.stringify(report)}`);
          return { report, trace };
        }

        const tool = toolsByName.get(block.name);
        if (!tool) throw new Error(`Model called an undeclared tool: "${block.name}".`);

        const args = tool.schema.parse(block.input) as Record<string, unknown>;
        const rejection = runGuardrail(block.name, args);

        let output: string;
        let isError: boolean;
        if (rejection) {
          output = rejection;
          isError = true;
        } else {
          try {
            output = await tool.execute(this.page, args);
            isError = false;
          } catch (error) {
            output = error instanceof Error ? error.message : String(error);
            isError = true;
          }
        }

        trace.push({ iteration, toolName: block.name, input: block.input, output, isError });
        console.log(
          `[exploratory-agent:anthropic] #${iteration} ${block.name}(${JSON.stringify(block.input)}) -> ${
            isError ? 'ERROR: ' : ''
          }${output.slice(0, 200)}`,
        );

        toolResultBlocks.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: output,
          is_error: isError,
        });
      }

      messages.push({ role: 'user', content: toolResultBlocks });
    }

    throw new Error(`Exploration exceeded MAX_ITERATIONS (${MAX_ITERATIONS}) without calling finish.`);
  }
}
