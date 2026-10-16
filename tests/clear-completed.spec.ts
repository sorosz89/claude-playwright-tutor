import { test, expect } from './fixtures';

test.describe('Clearing completed todos', () => {
  test('removes only completed items', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.addTodo('Walk the dog');
    await todoPage.toggle('Buy milk');

    await todoPage.clearCompleted();

    await expect(todoPage.item('Buy milk')).toHaveCount(0);
    await expect(todoPage.item('Walk the dog')).toBeVisible();
  });

  test('hides the button when nothing is completed', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await expect(todoPage.clearCompletedButton).toBeHidden();
  });
});
