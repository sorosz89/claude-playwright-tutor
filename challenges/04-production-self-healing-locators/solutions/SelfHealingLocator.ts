import type { Locator, Page } from '@playwright/test';
import type { LocatorHealer } from '../../02-self-healing-locators/healer.types';
import type { HealCache, HealReviewer } from '../HealCache';

export interface SelfHealingLocatorOptions {
  page: Page;
  primarySelector: string;
  intentDescription: string;
  healer: LocatorHealer;
  cache: HealCache;
  domScope: string;
  reviewer?: HealReviewer;
  existenceTimeoutMs?: number;
}

export class SelfHealingLocator {
  constructor(private readonly opts: SelfHealingLocatorOptions) {}

  async resolve(): Promise<Locator> {
    const { page, primarySelector, cache } = this.opts;
    const primary = page.locator(primarySelector);
    if (await this.isUsable(primary)) return primary;

    const cached = cache.get(primarySelector);
    if (cached) {
      const candidate = page.locator(cached);
      if (await this.isUsable(candidate)) return candidate;
      cache.invalidate(primarySelector); // the DOM moved on again -- re-heal below
    }

    return this.heal();
  }

  private async heal(): Promise<Locator> {
    const { page, primarySelector, intentDescription, healer, cache, reviewer, domScope } = this.opts;
    const domSnapshot = await page.locator(domScope).innerHTML();

    const { healedSelector, reasoning } = await healer.heal({
      domSnapshot,
      brokenSelector: primarySelector,
      intentDescription,
    });

    const candidate = page.locator(healedSelector);
    if (!(await this.isUsable(candidate))) {
      // Schema validation and the string-plausibility guardrail already ran
      // inside healer.heal(). This is the check neither of those can do: does it
      // actually resolve, here, on the real page, to exactly one element?
      throw new Error(
        `Healer suggested "${healedSelector}" (${reasoning}) but it doesn't resolve ` +
          `to exactly one element on the live page. Not trusting it.`,
      );
    }

    cache.record(primarySelector, healedSelector, reasoning);
    reviewer?.({ brokenSelector: primarySelector, healedSelector, reasoning, healedAt: new Date().toISOString() });

    return candidate;
  }

  private async isUsable(locator: Locator): Promise<boolean> {
    try {
      await locator.first().waitFor({ state: 'visible', timeout: this.opts.existenceTimeoutMs ?? 3000 });
      return (await locator.count()) === 1;
    } catch {
      return false;
    }
  }
}
