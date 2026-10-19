import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from '@langchain/core/messages';
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

export class LangchainExploratoryAgent implements ExploratoryAgent {
  constructor(private readonly page: Page) {}

  async explore(goal: string): Promise<AgentRunResult> {
    const trace: AgentTrace = [];
    const messages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT), new HumanMessage(goal)];

    const model = new ChatAnthropic({
      model: getModel(),
      apiKey: getAnthropicApiKey(),
      temperature: 0,
    }).bindTools([
      ...explorationTools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        schema: tool.schema,
      })),
      {
        name: FINISH_TOOL_NAME,
        description: 'Call this when you are done exploring, with a short report.',
        schema: ExplorationReportSchema,
      },
    ]);

    for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
      const response = await model.invoke(messages);
      messages.push(response);

      const toolCalls = response.tool_calls ?? [];

      if (toolCalls.length === 0) {
        messages.push(new HumanMessage("Call one of the available tools, including finish when you're done."));
        continue;
      }

      for (const call of toolCalls) {
        if (call.name === FINISH_TOOL_NAME) {
          const report = ExplorationReportSchema.parse(call.args);
          trace.push({ iteration, toolName: call.name, input: call.args, output: JSON.stringify(report), isError: false });
          console.log(`[exploratory-agent:langchain] #${iteration} finish -> ${JSON.stringify(report)}`);
          return { report, trace };
        }

        const tool = toolsByName.get(call.name);
        if (!tool) throw new Error(`Model called an undeclared tool: "${call.name}".`);

        const args = tool.schema.parse(call.args) as Record<string, unknown>;
        const rejection = runGuardrail(call.name, args);

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

        trace.push({ iteration, toolName: call.name, input: call.args, output, isError });
        console.log(
          `[exploratory-agent:langchain] #${iteration} ${call.name}(${JSON.stringify(call.args)}) -> ${
            isError ? 'ERROR: ' : ''
          }${output.slice(0, 200)}`,
        );

        messages.push(
          new ToolMessage({
            content: output,
            tool_call_id: call.id!,
            status: isError ? 'error' : 'success',
          }),
        );
      }
    }

    throw new Error(`Exploration exceeded MAX_ITERATIONS (${MAX_ITERATIONS}) without calling finish.`);
  }
}
