import { z } from 'zod';

export const StepSchema = z.object({
  action: z
    .enum(['addTodo', 'toggleTodo', 'editTodo', 'removeTodo', 'filterBy', 'clearCompleted'])
    .describe('Which TodoPage operation to perform.'),
  target: z
    .string()
    .describe(
      'The exact visible text of the todo item this step acts on, or the filter name ("All"/"Active"/"Completed") for filterBy.',
    ),
  value: z.string().optional().describe('New title text — only used by editTodo.'),
});

export const AssertionSchema = z.object({
  type: z
    .enum(['todoCount', 'itemVisible', 'itemCompleted', 'itemText', 'filterSelected'])
    .describe('Which kind of check to run.'),
  target: z.string().describe('The todo item text, or the filter name, this assertion is about.'),
  expected: z
    .string()
    .describe('Expected value as a plain string, e.g. "1 item left", "true", "Buy oat milk".'),
});

export const TestPlanSchema = z.object({
  steps: z.array(StepSchema).min(1),
  assertions: z.array(AssertionSchema).min(1),
});

export type Step = z.infer<typeof StepSchema>;
export type Assertion = z.infer<typeof AssertionSchema>;
export type TestPlan = z.infer<typeof TestPlanSchema>;
