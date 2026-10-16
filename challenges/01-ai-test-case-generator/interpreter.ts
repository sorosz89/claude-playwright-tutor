/**
 * Maps a generated Step/Assertion onto the baseline TodoPage POM and runs it for real.
 * This is the boundary that keeps "LLM output as data": the action/assertion vocabulary
 * is a closed enum (see schema.ts), so this interpreter never has to execute arbitrary
 * code -- only ever one of a small, known set of POM calls.
 */
import { expect } from '@playwright/test';
import type { TodoPage } from '../../tests/pages/TodoPage';
import type { Step, Assertion } from './schema';

export async function executeStep(todoPage: TodoPage, step: Step): Promise<void> {
  switch (step.action) {
    case 'addTodo':
      await todoPage.addTodo(step.target);
      return;
    case 'toggleTodo':
      // TODO: call the TodoPage method that toggles the item named step.target
      return;
    case 'editTodo':
      // TODO: step.value is required for this action -- throw if it's missing,
      // otherwise call the TodoPage method that renames step.target to step.value
      return;
    case 'removeTodo':
      // TODO: call the TodoPage method that removes the item named step.target
      return;
    case 'filterBy':
      // TODO: call the TodoPage method that switches to the filter named step.target
      return;
    case 'clearCompleted':
      // TODO: call the TodoPage method that clears completed items
      return;
  }
}

export async function executeAssertion(todoPage: TodoPage, assertion: Assertion): Promise<void> {
  switch (assertion.type) {
    case 'todoCount':
      await expect(todoPage.todoCount).toHaveText(assertion.expected);
      return;
    case 'itemVisible':
      // TODO: assert the item named assertion.target is visible
      return;
    case 'itemCompleted':
      // TODO: assertion.expected is "true" or "false" -- assert the item named
      // assertion.target has (or does not have) the completed state accordingly
      return;
    case 'itemText':
      // TODO: assert an item with the exact text in assertion.expected is visible
      // (used after an editTodo step, where assertion.target is the item's OLD title)
      return;
    case 'filterSelected':
      // TODO: assert the filter link named assertion.target is currently selected
      return;
  }
}
