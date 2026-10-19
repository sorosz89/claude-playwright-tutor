import type { Page } from '@playwright/test';
import type { LocatorHealer } from '../02-self-healing-locators/healer.types';
import { BrokenTodoPage } from '../02-self-healing-locators/BrokenTodoPage';
import { SelfHealingLocator } from './SelfHealingLocator';
import type { HealCache, HealReviewer } from './HealCache';

/**
 * A page object whose "new todo" locator is wired through SelfHealingLocator.
 * The primary selector is deliberately BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR --
 * this simulates the moment right after a DOM rename, where the page object's
 * source selector is now wrong and every test depending on it needs healing to
 * carry it transparently. Callers of addTodo() never know any of this happened.
 */
export class SelfHealingTodoPage {
  private readonly newTodoLocator: SelfHealingLocator;

  constructor(page: Page, healer: LocatorHealer, cache: HealCache, reviewer?: HealReviewer) {
    this.newTodoLocator = new SelfHealingLocator({
      page,
      primarySelector: BrokenTodoPage.BROKEN_NEW_TODO_SELECTOR,
      intentDescription: 'the input field for adding a new todo',
      healer,
      cache,
      reviewer,
      domScope: '.todoapp',
    });
  }

  async goto(page: Page): Promise<void> {
    // './' (not '/') keeps navigation under baseURL's /todomvc/ path.
    await page.goto('./');
  }

  async addTodo(title: string): Promise<void> {
    const input = await this.newTodoLocator.resolve();
    await input.fill(title);
    await input.press('Enter');
  }
}
