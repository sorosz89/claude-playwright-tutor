/**
 * LangChain.js path. Same loop shape as agent.anthropic.ts, same two guardrails, same
 * dispatch-by-tool-name -- bindTools() gives you a clean `.tool_calls` array on the
 * returned AIMessage instead of raw content blocks to filter, and ToolMessage wraps a
 * result + its tool_call_id + a success/error status instead of a hand-built
 * tool_result block, but you still write the loop and the dispatch yourself.
 */
import { ChatAnthropic } from '@langchain/anthropic';
import { AIMessage, HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from '@langchain/core/messages';
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

export class LangchainExploratoryAgent implements ExploratoryAgent {
  constructor(private readonly page: Page) {}

  async explore(goal: string): Promise<AgentRunResult> {
    const trace: AgentTrace = [];
    const messages: BaseMessage[] = [new SystemMessage(SYSTEM_PROMPT), new HumanMessage(goal)];

    // TODO 1: Build a ChatAnthropic model (model: getModel(), apiKey:
    // getAnthropicApiKey(), temperature: 0) and call .bindTools([...]) on it, binding
    // every tool in `explorationTools` as a plain { name, description, schema } object
    // plus one more for FINISH_TOOL_NAME over ExplorationReportSchema.
    //
    // const model = new ChatAnthropic({ ... }).bindTools([ ... ]);

    for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
      // TODO 2: Call await model.invoke(messages) and push the returned AIMessage
      // directly onto `messages` -- it already carries a `.tool_calls` array, no
      // content-block parsing needed. If `.tool_calls` is empty or undefined (the model
      // just replied with text), push a nudge HumanMessage (e.g. "Call one of the
      // available tools, including finish when you're done.") and `continue` to the
      // next iteration instead of crashing.
      //
      // const response = await model.invoke(messages);
      // messages.push(response);

      // TODO 3: For each entry in response.tool_calls, in order:
      //   - if entry.name === FINISH_TOOL_NAME: validate entry.args with
      //     ExplorationReportSchema.parse(...) (never trust it as-is), push a trace
      //     entry, console.log it, and `return { report, trace }` immediately -- this
      //     is the only way explore() returns normally.
      //   - otherwise: look up the ToolDefinition in `toolsByName` by entry.name (throw
      //     if missing). Validate the shape with
      //     `const args = tool.schema.parse(entry.args) as any`, then run the matching
      //     semantic guardrail -- isPlausibleSelector(args.selector) for click/type,
      //     isPlausiblePath(args.path) for navigate, none for read_page. If the
      //     guardrail rejects, that rejection message *is* the tool's output and the
      //     status is 'error' -- don't call .execute(). Otherwise call
      //     tool.execute(this.page, args) inside a try/catch: a thrown error's .message
      //     becomes the output with status 'error', the resolved string becomes the
      //     output with status 'success'. Push
      //     `new ToolMessage({ content: output, tool_call_id: entry.id!, status })` onto
      //     `messages` for every tool call (success or failure), and push a matching
      //     trace entry + console.log, before moving to the next entry.
    }

    throw new Error(`Exploration exceeded MAX_ITERATIONS (${MAX_ITERATIONS}) without calling finish.`);
  }
}
