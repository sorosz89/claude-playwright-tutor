import { test, expect } from '@playwright/test';
import { TodoPage } from '../../tests/pages/TodoPage';
import { createAgent } from './createAgent';
import { ExplorationReportSchema, KNOWN_TOOL_NAMES, MAX_ITERATIONS } from './agent.types';

const GOAL = `Explore this TodoMVC app using your tools. Try adding one or two todos and
marking one complete, then switch to the Active filter to check it worked. Only read the
page when you actually need to see its current state, not after every single action.
You have a limited number of tool calls, so work efficiently and call finish as soon as
you've tried those things, with a short report of what you did and anything that looked
broken or unexpected (an empty issuesFound list is a fine, honest answer if nothing
did).`;

test('explores the todo app through a tool loop and finishes with a validated report', async ({ page }) => {
  await new TodoPage(page).goto();

  const agent = createAgent(page);

  const { report, trace } = await test.step('Run the exploration loop', () => agent.explore(GOAL));

  for (const entry of trace) {
    console.log(
      `[exploratory-agent] #${entry.iteration} ${entry.toolName}(${JSON.stringify(entry.input)}) -> ${
        entry.isError ? 'ERROR: ' : ''
      }${entry.output.slice(0, 200)}`,
    );
  }
  console.log(`[exploratory-agent] report: ${JSON.stringify(report)}`);

  await test.step('The loop stayed within bounds and ended by calling finish', async () => {
    expect(trace.length).toBeGreaterThanOrEqual(1);
    expect(trace.length).toBeLessThanOrEqual(MAX_ITERATIONS);
    expect(trace.at(-1)?.toolName).toBe('finish');
    for (const entry of trace) {
      expect(KNOWN_TOOL_NAMES).toContain(entry.toolName);
    }
  });

  await test.step('The final report is schema-valid', () => {
    expect(() => ExplorationReportSchema.parse(report)).not.toThrow();
  });
});
