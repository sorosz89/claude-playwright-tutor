import type { Locator, Page } from '@playwright/test';
import type { LocatorHealer } from '../02-self-healing-locators/healer.types';
import type { HealCache, HealReviewer } from './HealCache';

export interface SelfHealingLocatorOptions {
  page: Page;
  primarySelector: string;
  intentDescription: string;
  healer: LocatorHealer;
  cache: HealCache;
  /** Scope the DOM snapshot sent to the model -- keep context small and the blast
   *  radius of prompt injection (see learning/04-guardrails-and-trust.md) narrow. */
  domScope: string;
  /** Where a successful (or attempted) heal gets surfaced for a human to review.
   *  A heal keeps the suite green today; it doesn't patch the source selector. */
  reviewer?: HealReviewer;
  /** How long to give a selector to become visible before treating it as broken
   *  rather than just slow. Short on purpose: Playwright's own action timeout
   *  (default 30s) is for interacting with an element already known to exist;
   *  this is a separate, tighter budget for "does this selector exist at all." */
  existenceTimeoutMs?: number;
}

/**
 * Wraps a single locator with a resolve-then-heal strategy: try the primary
 * selector, then a cached heal, then ask an LLM for a new one -- and only ever
 * trust a healed selector after checking it against the *live* page. This is the
 * piece that keeps healing out of every spec file: page objects hold one of
 * these per locator that might drift, and call `resolve()` instead of
 * `page.locator(...)` directly.
 */
export class SelfHealingLocator {
  constructor(private readonly opts: SelfHealingLocatorOptions) {}

  async resolve(): Promise<Locator> {
    // TODO:
    //  1. Build a Locator from opts.primarySelector and check it with isUsable().
    //     If usable, return it -- this is the common case and it should stay cheap.
    //  2. Otherwise, check opts.cache.get(opts.primarySelector). If there's a
    //     cached healed selector, build a Locator from it and check isUsable().
    //     If usable, return it (a cache hit should mean zero LLM calls). If it's
    //     NOT usable anymore, call opts.cache.invalidate(opts.primarySelector) --
    //     the DOM moved on again -- and fall through to step 3.
    //  3. Otherwise, call this.heal() and return what it gives back.

    throw new Error('SelfHealingLocator.resolve is not implemented yet -- see TODOs above.');
  }

  private async heal(): Promise<Locator> {
    // TODO:
    //  1. Snapshot the DOM: await this.opts.page.locator(this.opts.domScope).innerHTML().
    //  2. Call this.opts.healer.heal({ domSnapshot, brokenSelector: opts.primarySelector,
    //     intentDescription: opts.intentDescription }). Schema validation and the
    //     string-plausibility guardrail already ran inside heal() -- don't redo them.
    //  3. Build a Locator from the returned healedSelector and run isUsable() on it.
    //     This is the guardrail Challenge 2 structurally couldn't have: does the
    //     candidate actually resolve to exactly one element on the REAL page, not
    //     just look like a plausible selector string. If it's not usable, throw a
    //     loud Error (include the rejected selector and reasoning) -- never fall
    //     back to trusting it anyway.
    //  4. On success: opts.cache.record(primarySelector, healedSelector, reasoning),
    //     call opts.reviewer?.(event) with a HealEvent (reviewer is optional --
    //     skip the call if it wasn't provided), and return the candidate Locator.

    throw new Error('SelfHealingLocator.heal is not implemented yet -- see TODOs above.');
  }

  /** Waits a bounded amount of time -- *not* a single immediate check -- so a
   *  slow-rendering element isn't misdiagnosed as a broken selector. Still much
   *  shorter than Playwright's default action timeout, so a genuinely broken
   *  selector fails fast and falls through to healing instead of stalling the
   *  suite. This is the one place this wrapper has to do its own waiting --
   *  Playwright's auto-waiting on `.fill()` / `.click()` only kicks in *after*
   *  resolve() has already handed back a locator it's decided to trust. */
  private async isUsable(locator: Locator): Promise<boolean> {
    // TODO: await locator.first().waitFor({ state: 'visible', timeout:
    //   this.opts.existenceTimeoutMs ?? 3000 }) inside a try/catch -- return false
    //   if it throws (timed out or never appeared). Otherwise return whether
    //   (await locator.count()) === 1 -- exactly one match, not "at least one".

    throw new Error('SelfHealingLocator.isUsable is not implemented yet -- see TODOs above.');
  }
}
