import type { Locator, Page } from '@playwright/test';

export type TodoFilter = 'All' | 'Active' | 'Completed';

export class TodoPage {
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;
  readonly toggleAllCheckbox: Locator;

  constructor(private readonly page: Page) {
    this.newTodoInput = page.locator('input.new-todo');
    this.todoItems = page.getByTestId('todo-item');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.toggleAllCheckbox = page.getByLabel('Mark all as complete');
  }

  async goto(): Promise<void> {
    // './' (not '/') keeps navigation under baseURL's /todomvc/ path --
    // an absolute '/' would resolve to the domain root instead.
    await this.page.goto('./');
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  item(title: string): Locator {
    return this.todoItems.filter({ hasText: title });
  }

  async toggle(title: string): Promise<void> {
    await this.item(title).getByLabel('Toggle Todo').click();
  }

  async remove(title: string): Promise<void> {
    const item = this.item(title);
    await item.hover();
    await item.getByLabel('Delete').click();
  }

  async edit(title: string, newTitle: string): Promise<void> {
    const item = this.item(title);
    await item.getByTestId('todo-title').dblclick();
    const editInput = item.getByLabel('Edit');
    await editInput.fill(newTitle);
    await editInput.press('Enter');
  }

  async isCompleted(title: string): Promise<boolean> {
    const classAttr = await this.item(title).getAttribute('class');
    return classAttr?.includes('completed') ?? false;
  }

  async filterBy(filter: TodoFilter): Promise<void> {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }

  filterLink(filter: TodoFilter): Locator {
    return this.page.getByRole('link', { name: filter, exact: true });
  }

  async clearCompleted(): Promise<void> {
    await this.clearCompletedButton.click();
  }

  async toggleAll(): Promise<void> {
    await this.toggleAllCheckbox.click();
  }
}
