import { test, expect } from './fixtures';

test.describe('Completing a todo', () => {
  test('marks an item as completed', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    await test.step('When the user toggles the item', async () => {
      await todoPage.toggle('Buy milk');
    });

    await test.step('Then the item is marked completed', async () => {
      await expect(todoPage.item('Buy milk')).toHaveClass(/completed/);
    });

    await test.step('And the todo count drops to zero items left', async () => {
      await expect(todoPage.todoCount).toHaveText('0 items left');
    });
  });

  test('un-completes an item when toggled again', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.toggle('Buy milk');
    await todoPage.toggle('Buy milk');
    await expect(todoPage.item('Buy milk')).not.toHaveClass(/completed/);
  });
});
