import { test, expect } from '@playwright/test';
import { BrokenTodoPage } from './BrokenTodoPage';
import { createHealer } from './createHealer';

test('self-heals a broken "new todo" locator', async ({ page }) => {
  const brokenPage = new BrokenTodoPage(page);
  await brokenPage.goto();

  await test.step('The broken selector fails, as expected', async () => {
    await expect(brokenPage.addTodoWithBrokenLocator('Buy milk')).rejects.toThrow();
  });

  const healer = createHealer();
  const domSnapshot = await brokenPage.getDomSnapshot();

  const { healedSelector, reasoning } = await test.step('Ask Claude to heal the selector', () =>
    healer.heal({
      domSnapshot,
      brokenSelector: BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR,
      intentDescription: 'the input field for adding a new todo',
    }),
  );

  console.log(
    `[self-healing] original="${BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR}" healed="${healedSelector}" reasoning="${reasoning}"`,
  );

  await test.step('Retry with the healed selector', async () => {
    const healedInput = page.locator(healedSelector);
    await healedInput.fill('Buy milk');
    await healedInput.press('Enter');
  });

  await test.step('The todo was added', async () => {
    await expect(page.getByTestId('todo-item').filter({ hasText: 'Buy milk' })).toBeVisible();
  });
});
