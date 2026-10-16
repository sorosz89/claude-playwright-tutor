import { ChatAnthropic } from '@langchain/anthropic';
import { getAnthropicApiKey, getModel } from '../../../src/llm/env';
import { TestPlanSchema, type TestPlan } from '../schema';

const SYSTEM_PROMPT = `You turn a TodoMVC feature description into a short, literal test plan.
Use only these step actions: addTodo, toggleTodo, editTodo, removeTodo, filterBy, clearCompleted.
Use only these assertion types: todoCount, itemVisible, itemCompleted, itemText, filterSelected.
"target" identifies the todo item's exact visible text (or the filter name for filterBy/filterSelected).
Keep the plan minimal: just enough steps and assertions to exercise the described behavior once.`;

export async function generateTestPlan(featureSpec: string): Promise<TestPlan> {
  const model = new ChatAnthropic({
    model: getModel(),
    apiKey: getAnthropicApiKey(),
    temperature: 0,
  }).withStructuredOutput(TestPlanSchema);

  return model.invoke([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: featureSpec },
  ]);
}
