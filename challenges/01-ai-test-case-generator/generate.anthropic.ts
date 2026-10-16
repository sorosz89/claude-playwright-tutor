/**
 * Challenge 1 -- raw @anthropic-ai/sdk path.
 *
 * Turn a markdown feature spec into a structured TestPlan by forcing Claude to call a
 * single tool whose input_schema mirrors TestPlanSchema, then re-validate the tool's
 * input with zod before trusting it. LLM output is DATA to validate here -- never code
 * to eval.
 */
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { getAnthropicApiKey, getModel } from '../../src/llm/env';
import { TestPlanSchema, type TestPlan } from './schema';

const TOOL_NAME = 'submit_test_plan';

const SYSTEM_PROMPT = `You turn a TodoMVC feature description into a short, literal test plan.
Use only these step actions: addTodo, toggleTodo, editTodo, removeTodo, filterBy, clearCompleted.
Use only these assertion types: todoCount, itemVisible, itemCompleted, itemText, filterSelected.
"target" identifies the todo item's exact visible text (or the filter name for filterBy/filterSelected).
Keep the plan minimal: just enough steps and assertions to exercise the described behavior once.`;

export async function generateTestPlan(featureSpec: string): Promise<TestPlan> {
  const client = new Anthropic({ apiKey: getAnthropicApiKey() });

  // TODO 1: Call client.messages.create with:
  //   - model: getModel(), max_tokens: 1024, system: SYSTEM_PROMPT
  //   - messages: a single user message containing `featureSpec`
  //   - tools: one tool named TOOL_NAME whose input_schema is
  //       z.toJSONSchema(TestPlanSchema) as Anthropic.Tool.InputSchema
  //   - tool_choice: { type: 'tool', name: TOOL_NAME } -- force it, don't use "auto"
  //
  // const response = await client.messages.create({ ... });

  // TODO 2: Find the content block with type "tool_use" in response.content.
  // Throw a clear error if there isn't one.
  //
  // const toolUse = response.content.find(
  //   (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
  // );
  // if (!toolUse) {
  //   throw new Error('Claude responded without calling submit_test_plan.');
  // }

  // TODO 3: Never trust toolUse.input as-is -- re-validate it with
  // TestPlanSchema.parse(toolUse.input) and return the validated TestPlan.
  //
  // return TestPlanSchema.parse(toolUse.input);

  throw new Error('generateTestPlan (anthropic) is not implemented yet -- see TODOs above.');
}
