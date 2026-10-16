import { test as base, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

type Fixtures = {
  /** A TodoPage already navigated to the app, so specs can skip the boilerplate. */
  todoPage: TodoPage;
};

export const test = base.extend<Fixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect };
