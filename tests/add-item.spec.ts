import { test, expect } from './fixtures';

test.describe('Adding a todo', () => {
  test('adds a new item to the list', async ({ todoPage }) => {
    await test.step('When the user adds "Buy milk"', async () => {
      await todoPage.addTodo('Buy milk');
    });

    await test.step('Then the item appears in the list', async () => {
      await expect(todoPage.item('Buy milk')).toBeVisible();
    });

    await test.step('And the todo count reflects one item left', async () => {
      await expect(todoPage.todoCount).toHaveText('1 item left');
    });
  });

  test('clears the input after adding an item', async ({ todoPage }) => {
    await todoPage.addTodo('Walk the dog');
    await expect(todoPage.newTodoInput).toHaveValue('');
  });
});
