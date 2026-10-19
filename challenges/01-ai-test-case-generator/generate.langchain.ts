/**
 * Challenge 1 -- LangChain.js path. Same model, same schema, same prompt intent as
 * generate.anthropic.ts. Compare the two files' length and shape once both are done:
 * withStructuredOutput hides the tool definition, the forced tool_choice, and the
 * content-block parsing you wrote by hand on the raw-SDK side.
 */
import { ChatAnthropic } from '@langchain/anthropic';
import { getAnthropicApiKey, getModel } from '../../src/llm/env';
import { TestPlanSchema, type TestPlan } from './schema';

const SYSTEM_PROMPT = `You turn a TodoMVC feature description into a short, literal test plan.
Use only these step actions: addTodo, toggleTodo, editTodo, removeTodo, filterBy, clearCompleted.
Use only these assertion types: todoCount, itemVisible, itemCompleted, itemText, filterSelected.
"target" identifies the todo item's exact visible text (or the filter name for filterBy/filterSelected).
Keep the plan minimal: just enough steps and assertions to exercise the described behavior once.`;

export async function generateTestPlan(featureSpec: string): Promise<TestPlan> {
  // TODO 1: Construct a ChatAnthropic instance (model: getModel(), apiKey:
  // getAnthropicApiKey(), temperature: 0) and call .withStructuredOutput(TestPlanSchema)
  // on it.

  // TODO 2: Invoke the structured model with a system message (SYSTEM_PROMPT) and a user
  // message containing `featureSpec`, and return the result directly -- it is already a
  // validated TestPlan.

  throw new Error('generateTestPlan (langchain) is not implemented yet -- see TODOs above.');
}
