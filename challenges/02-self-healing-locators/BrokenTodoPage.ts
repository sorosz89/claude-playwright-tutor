import type { Locator, Page } from '@playwright/test';

/**
 * A deliberately broken variant of the new-todo locator: `.new-todo-input` does not
 * exist in the real app (the real class is `.new-todo`). This simulates a DOM change
 * nobody updated the test for -- exactly the scenario LocatorHealer recovers from.
 */
export class BrokenTodoPage {
  static readonly BROKEN_NEW_TODO_SELECTOR = 'input.new-todo-input';

  readonly brokenNewTodoInput: Locator;

  constructor(private readonly page: Page) {
    this.brokenNewTodoInput = page.locator(BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR);
  }

  async goto(): Promise<void> {
    await this.page.goto('./');
  }

  /** Fails: the selector above matches nothing in the real DOM. */
  async addTodoWithBrokenLocator(title: string): Promise<void> {
    await this.brokenNewTodoInput.fill(title, { timeout: 2000 });
    await this.brokenNewTodoInput.press('Enter');
  }

  /** A scoped HTML snapshot, small enough to hand to an LLM as context. */
  async getDomSnapshot(): Promise<string> {
    return this.page.locator('.todoapp').innerHTML();
  }
}
