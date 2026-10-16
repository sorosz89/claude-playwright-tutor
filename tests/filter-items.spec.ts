import { test, expect } from './fixtures';

test.describe('Filtering todos', () => {
  test.beforeEach(async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');
    await todoPage.addTodo('Walk the dog');
    await todoPage.toggle('Buy milk');
  });

  test('Active filter hides completed items', async ({ todoPage }) => {
    await todoPage.filterBy('Active');
    await expect(todoPage.item('Walk the dog')).toBeVisible();
    await expect(todoPage.item('Buy milk')).toBeHidden();
  });

  test('Completed filter hides active items', async ({ todoPage }) => {
    await todoPage.filterBy('Completed');
    await expect(todoPage.item('Buy milk')).toBeVisible();
    await expect(todoPage.item('Walk the dog')).toBeHidden();
  });

  test('All filter shows every item', async ({ todoPage }) => {
    await todoPage.filterBy('Active');
    await todoPage.filterBy('All');
    await expect(todoPage.item('Buy milk')).toBeVisible();
    await expect(todoPage.item('Walk the dog')).toBeVisible();
  });
});
