export interface HealEvent {
  brokenSelector: string;
  healedSelector: string;
  reasoning: string;
  healedAt: string;
}

/**
 * A heal is a suggestion surfaced to a human, not a self-authorizing permanent
 * fix (see learning/04-guardrails-and-trust.md). This callback is how a caller
 * plugs in wherever humans actually look -- a Slack webhook, a GitHub issue, a
 * dashboard row -- without SelfHealingLocator needing to know about any of them.
 */
export type HealReviewer = (event: HealEvent) => void;

export interface HealCache {
  get(brokenSelector: string): string | undefined;
  record(brokenSelector: string, healedSelector: string, reasoning: string): void;
  invalidate(brokenSelector: string): void;
}

/**
 * In-memory, single-process cache: enough to prove the "heal once, reuse after"
 * shape and to keep this challenge's tests deterministic. A real multi-worker CI
 * suite needs a shared backend across processes (Redis, a DB table, even a
 * committed JSON file for rare, reviewed heals) -- see
 * articles/self-healing-locators-production-architecture.md for that tradeoff.
 * The interface above is the same regardless of backend.
 */
export class InMemoryHealCache implements HealCache {
  private readonly entries = new Map<string, { healedSelector: string; reasoning: string; healedAt: string }>();

  get(brokenSelector: string): string | undefined {
    return this.entries.get(brokenSelector)?.healedSelector;
  }

  record(brokenSelector: string, healedSelector: string, reasoning: string): void {
    this.entries.set(brokenSelector, { healedSelector, reasoning, healedAt: new Date().toISOString() });
  }

  invalidate(brokenSelector: string): void {
    this.entries.delete(brokenSelector);
  }
}

/** Default reviewer: logs the heal event somewhere a human will see it in CI
 *  output, separate from pass/fail noise. Never patches source files itself. */
export const consoleReviewer: HealReviewer = (event) => {
  console.log(
    `[selector-heal] broken="${event.brokenSelector}" healed="${event.healedSelector}" ` +
      `reasoning="${event.reasoning}" at=${event.healedAt}`,
  );
};
