import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { getAnthropicApiKey, getModel } from '../../../src/llm/env';
import { TestPlanSchema, type TestPlan } from '../schema';

const TOOL_NAME = 'submit_test_plan';

const SYSTEM_PROMPT = `You turn a TodoMVC feature description into a short, literal test plan.
Use only these step actions: addTodo, toggleTodo, editTodo, removeTodo, filterBy, clearCompleted.
Use only these assertion types: todoCount, itemVisible, itemCompleted, itemText, filterSelected.
"target" identifies the todo item's exact visible text (or the filter name for filterBy/filterSelected).
Keep the plan minimal: just enough steps and assertions to exercise the described behavior once.`;

export async function generateTestPlan(featureSpec: string): Promise<TestPlan> {
  const client = new Anthropic({ apiKey: getAnthropicApiKey() });

  const response = await client.messages.create({
    model: getModel(),
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: featureSpec }],
    tools: [
      {
        name: TOOL_NAME,
        description:
          'Submit the structured list of steps and assertions implementing the described TodoMVC behavior.',
        input_schema: z.toJSONSchema(TestPlanSchema) as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: 'tool', name: TOOL_NAME },
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
  );
  if (!toolUse) {
    throw new Error('Claude responded without calling submit_test_plan.');
  }

  return TestPlanSchema.parse(toolUse.input);
}
