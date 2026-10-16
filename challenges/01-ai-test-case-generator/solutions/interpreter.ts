import { expect } from '@playwright/test';
import type { TodoPage } from '../../../tests/pages/TodoPage';
import type { Step, Assertion } from '../schema';

export async function executeStep(todoPage: TodoPage, step: Step): Promise<void> {
  switch (step.action) {
    case 'addTodo':
      await todoPage.addTodo(step.target);
      return;
    case 'toggleTodo':
      await todoPage.toggle(step.target);
      return;
    case 'editTodo':
      if (!step.value) throw new Error('editTodo requires a "value"');
      await todoPage.edit(step.target, step.value);
      return;
    case 'removeTodo':
      await todoPage.remove(step.target);
      return;
    case 'filterBy':
      await todoPage.filterBy(step.target as 'All' | 'Active' | 'Completed');
      return;
    case 'clearCompleted':
      await todoPage.clearCompleted();
      return;
  }
}

export async function executeAssertion(todoPage: TodoPage, assertion: Assertion): Promise<void> {
  switch (assertion.type) {
    case 'todoCount':
      await expect(todoPage.todoCount).toHaveText(assertion.expected);
      return;
    case 'itemVisible':
      await expect(todoPage.item(assertion.target)).toBeVisible();
      return;
    case 'itemCompleted':
      if (assertion.expected === 'true') {
        await expect(todoPage.item(assertion.target)).toHaveClass(/completed/);
      } else {
        await expect(todoPage.item(assertion.target)).not.toHaveClass(/completed/);
      }
      return;
    case 'itemText':
      await expect(todoPage.item(assertion.expected)).toBeVisible();
      return;
    case 'filterSelected':
      await expect(
        todoPage.filterLink(assertion.target as 'All' | 'Active' | 'Completed'),
      ).toHaveClass(/selected/);
      return;
  }
}
