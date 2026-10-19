/**
 * Plausibility guardrails on LLM-supplied tool arguments, run BEFORE handing them to
 * Playwright -- same defense-in-depth idea as Challenge 2's `isPlausibleSelector`, now
 * needed for two different kinds of arguments the model can get wrong: a `click`/`type`
 * selector, and a `navigate` path. The second one is this challenge's own
 * prompt-injection angle (see `04-guardrails-and-trust.md`): nothing stops a DOM
 * snapshot or a model's own "creative" next step from smuggling in something that
 * looks like a URL instead of an in-app route.
 */

export function isPlausibleSelector(selector: string): boolean {
  // TODO: same crude "looks like CSS, not prose" check as Challenge 2's
  // isPlausibleSelector (there's no "broken selector" to compare against here, so skip
  // that part of Challenge 2's check):
  //  - reject empty/whitespace-only
  //  - reject implausibly long (say, > 200 chars)
  //  - strip [...] and quoted strings first, then reject anything with remaining
  //    whitespace

  throw new Error('isPlausibleSelector is not implemented yet -- see TODOs above.');
}

export function isPlausiblePath(path: string): boolean {
  // TODO: return false (reject) when any of these hold, true otherwise:
  //  - path does not start with "#/" (rejects absolute URLs, "//host/...",
  //    "javascript:", or any other scheme the model might produce)
  //  - path contains characters outside letters, digits, "/", "-" (after the leading
  //    "#/") -- this app only ever needs "#/", "#/active", "#/completed"
  //  - path is implausibly long (say, > 50 chars -- generous for this app's 3 routes)

  throw new Error('isPlausiblePath is not implemented yet -- see TODOs above.');
}
