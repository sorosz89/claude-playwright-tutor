import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '../../tests/fixtures';
import { getLlmProvider } from '../../src/llm/env';
import { generateTestPlan as generateWithAnthropic } from './generate.anthropic';
import { generateTestPlan as generateWithLangchain } from './generate.langchain';
import { executeStep, executeAssertion } from './interpreter';

function pickGenerator() {
  return getLlmProvider() === 'langchain' ? generateWithLangchain : generateWithAnthropic;
}

test('AI-generated test plan: editing an existing todo', async ({ todoPage }) => {
  const featureSpec = await fs.readFile(path.join(__dirname, 'feature-spec.md'), 'utf-8');
  const generate = pickGenerator();

  const plan = await test.step('Generate a structured test plan from the feature spec', () =>
    generate(featureSpec),
  );

  await test.step('Execute each generated step against the real TodoMVC app', async () => {
    for (const step of plan.steps) {
      await executeStep(todoPage, step);
    }
  });

  await test.step('Check each generated assertion', async () => {
    for (const assertion of plan.assertions) {
      await executeAssertion(todoPage, assertion);
    }
  });

  expect(plan.steps.length).toBeGreaterThan(0);
});
