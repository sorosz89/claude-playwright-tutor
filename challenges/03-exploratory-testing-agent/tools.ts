/**
 * The agent's toolbox: real actions against the live Playwright `Page`. Each
 * `execute()` returns a plain string observation that gets fed back to the model --
 * never throw here for "the model gave a bad selector," that's the guardrail's job
 * (run by the loop, before `execute()` is called); only Playwright's own errors (e.g.
 * "no element matches selector") propagate uncaught, for the loop to catch and relay.
 */
import type { Page } from '@playwright/test';
import type { z } from 'zod';
import {
  NavigateArgsSchema,
  ClickArgsSchema,
  TypeArgsSchema,
  ReadPageArgsSchema,
  type NavigateArgs,
  type ClickArgs,
  type TypeArgs,
  type ReadPageArgs,
} from './agent.types';

const DOM_SNAPSHOT_MAX_LENGTH = 4000;

export interface ToolDefinition<TArgs> {
  name: string;
  description: string;
  schema: z.ZodType<TArgs>;
  execute(page: Page, args: TArgs): Promise<string>;
}

export const navigateTool: ToolDefinition<NavigateArgs> = {
  name: 'navigate',
  description: 'Navigate to an in-app hash route, e.g. "#/active", "#/completed", or "#/".',
  schema: NavigateArgsSchema,
  async execute(page, { path }) {
    await page.goto(`./${path}`);
    return `Navigated to ${page.url()}.`;
  },
};

export const clickTool: ToolDefinition<ClickArgs> = {
  name: 'click',
  description:
    'Click the element matching a CSS selector. The selector must not contain whitespace -- ' +
    "to narrow into a specific nested element (e.g. one todo among several), use the child " +
    "combinator '>' with no spaces around it, e.g. '.todo-list>li:nth-child(2)>input.toggle', " +
    "instead of a descendant selector with a space.",
  schema: ClickArgsSchema,
  async execute(page, { selector }) {
    await page.locator(selector).click({ timeout: 5000 });
    return `Clicked "${selector}".`;
  },
};

export const typeTool: ToolDefinition<TypeArgs> = {
  name: 'type',
  description:
    'Fill a text input matching a CSS selector, optionally pressing Enter afterward (required to ' +
    "submit a new todo). The selector must not contain whitespace -- use the child combinator '>' " +
    "(no spaces) instead of a descendant space if you need to narrow into a nested element.",
  schema: TypeArgsSchema,
  async execute(page, { selector, text, pressEnter }) {
    const input = page.locator(selector);
    await input.fill(text, { timeout: 5000 });
    if (pressEnter) await input.press('Enter');
    return `Typed "${text}" into "${selector}"${pressEnter ? ' and pressed Enter' : ''}.`;
  },
};

export const readPageTool: ToolDefinition<ReadPageArgs> = {
  name: 'read_page',
  description: 'Read the current URL and a DOM snapshot of the todo app, scoped to ".todoapp".',
  schema: ReadPageArgsSchema,
  async execute(page) {
    const html = await page.locator('.todoapp').innerHTML();
    const snapshot =
      html.length > DOM_SNAPSHOT_MAX_LENGTH ? `${html.slice(0, DOM_SNAPSHOT_MAX_LENGTH)}...(truncated)` : html;
    return `Current URL: ${page.url()}\n\nDOM snapshot (.todoapp):\n${snapshot}`;
  },
};

export const explorationTools = [navigateTool, clickTool, typeTool, readPageTool];
