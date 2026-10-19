import { test, expect } from '@playwright/test';
import type { LocatorHealer } from '../02-self-healing-locators/healer.types';
import { BrokenTodoPage } from '../02-self-healing-locators/BrokenTodoPage';
import { createHealer } from '../02-self-healing-locators/createHealer';
import { SelfHealingLocator } from './SelfHealingLocator';
import { SelfHealingTodoPage } from './SelfHealingTodoPage';
import { InMemoryHealCache, type HealEvent } from './HealCache';

test('heals once and reuses the cache on every later resolve', async ({ page }) => {
  const cache = new InMemoryHealCache();
  const events: HealEvent[] = [];
  let healCalls = 0;

  // Wraps the real (challenge 2) healer just to count invocations -- the point
  // of this test is that this counter stops moving after the first heal.
  const baseHealer = createHealer();
  const countingHealer: LocatorHealer = {
    heal: (input) => {
      healCalls++;
      return baseHealer.heal(input);
    },
  };

  await test.step('first page: no cache entry yet, so this one actually heals', async () => {
    const todoPage = new SelfHealingTodoPage(page, countingHealer, cache, (event) => events.push(event));
    await todoPage.goto(page);
    await todoPage.addTodo('Buy milk');

    await expect(page.getByTestId('todo-item').filter({ hasText: 'Buy milk' })).toBeVisible();
    expect(healCalls).toBe(1);
    expect(cache.get(BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR)).toBeTruthy();
    expect(events).toHaveLength(1);
  });

  await test.step('a fresh page load, same broken primary selector, shared cache: no new heal', async () => {
    const todoPage = new SelfHealingTodoPage(page, countingHealer, cache, (event) => events.push(event));
    await todoPage.goto(page);
    await todoPage.addTodo('Walk the dog');

    await expect(page.getByTestId('todo-item').filter({ hasText: 'Walk the dog' })).toBeVisible();
    expect(healCalls).toBe(1); // still 1: the cache hit skipped the LLM entirely
    expect(events).toHaveLength(1); // still 1: nothing new to surface for review
  });
});

test('rejects a healed selector that does not resolve on the live page', async ({ page }) => {
  // Schema-valid, and it would pass challenge 2's string-only isPlausibleSelector
  // (it's non-empty, short, has no stray whitespace, and isn't an echo of the
  // broken selector) -- but it matches nothing in the real DOM. The live-DOM
  // check inside SelfHealingLocator is the only thing that can catch this.
  const stubHealer: LocatorHealer = {
    heal: async () => ({
      healedSelector: '.this-class-does-not-exist-in-todomvc',
      reasoning: 'stub healer for testing the live-DOM guardrail',
    }),
  };

  const cache = new InMemoryHealCache();
  const events: HealEvent[] = [];

  const locator = new SelfHealingLocator({
    page,
    primarySelector: BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR,
    intentDescription: 'the input field for adding a new todo',
    healer: stubHealer,
    cache,
    reviewer: (event) => events.push(event),
    domScope: '.todoapp',
  });

  await page.goto('./');

  await expect(locator.resolve()).rejects.toThrow();
  expect(cache.get(BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR)).toBeUndefined();
  expect(events).toHaveLength(0);
});
