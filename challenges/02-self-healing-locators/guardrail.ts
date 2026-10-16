/**
 * Plausibility guardrail on an LLM-supplied CSS selector, run BEFORE handing it to
 * Playwright. This is defense-in-depth on top of the schema validation already applied
 * to the model's structured output -- it catches strings that are syntactically valid
 * JSON but not a sane selector (prose, an echo of the broken selector, etc.).
 */
export function isPlausibleSelector(selector: string, brokenSelector: string): boolean {
  // TODO: return false (reject) when any of these hold, true otherwise:
  //  - selector is empty/whitespace-only
  //  - selector is identical to brokenSelector (the model just repeated the broken one)
  //  - selector is implausibly long (say, > 200 chars) -- a sign of a hallucinated
  //    explanation instead of a selector
  //  - selector contains characters that can't appear in a real CSS selector, e.g.
  //    unquoted/unbracketed whitespace like "the input field" (a crude but good-enough
  //    check for this exercise: strip [...] and quoted strings first, then check for
  //    any remaining whitespace)

  throw new Error('isPlausibleSelector is not implemented yet -- see TODOs above.');
}
