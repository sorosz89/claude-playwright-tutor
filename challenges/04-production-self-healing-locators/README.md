# Challenge 4 -- Production Self-Healing Architecture

## Background reading

Before touching the TODOs, read
[`../../articles/self-healing-locators-production-architecture.md`](../../articles/self-healing-locators-production-architecture.md)
-- this challenge *is* that article's reference architecture, turned into
something you build and test instead of just read. Also re-read
[`../../learning/04-guardrails-and-trust.md`](../../learning/04-guardrails-and-trust.md):
the live-DOM check you add here is the guardrail that primer's string-only lesson
structurally couldn't cover in Challenge 2.

## Goal

Challenge 2's `self-healing.spec.ts` calls `healer.heal()` directly, in the spec,
every run. That's the right shape for teaching the healer in isolation; it's not
the shape a real suite should take. Here, you build `SelfHealingLocator`: a
wrapper that lives in a page object (`SelfHealingTodoPage`, already wired up for
you) and handles three things the toy challenge leaves out on purpose:

1. The spec never sees healing -- `SelfHealingTodoPage.addTodo()` just works.
2. The LLM runs once per real DOM change, not once per test run -- a cache sits in
   front of it.
3. A healed selector is only trusted after a check the string-only guardrail
   can't do: does it resolve to *exactly one element* on the live page.

## The concept

The gap between the toy challenge and this one, side by side:

| | Challenge 2 | Challenge 4 (this one) |
|---|---|---|
| Who calls `heal()` | The spec, explicitly | The page object's locator wrapper, invisibly |
| How often the LLM runs | Every test run | Once per real DOM change, via a cache |
| What the guardrail checks | String shape + plausibility only | That, plus live resolution (`count() === 1`) |
| What happens after a successful heal | Nothing -- used once, discarded | Cached for reuse, and surfaced to a reviewer |

The healer itself (`LocatorHealer`, `isPlausibleSelector`, the anthropic/langchain
split) is reused **completely unchanged** from
[`../02-self-healing-locators/`](../02-self-healing-locators/) -- it was already
designed correctly in isolation. Nothing here reimplements it; `createHealer()` is
imported directly. What's new is everything *around* it.

## Exactly what has TODOs

- `SelfHealingLocator.ts` -- all three methods:
  - `resolve()`: try the primary selector, then the cache, then `heal()`.
  - `heal()`: snapshot the DOM, call the healer, then run the live-DOM check on the
    *candidate* before trusting it -- cache and surface it only if that passes.
  - `isUsable()`: a bounded wait, then `count() === 1` (not "at least one").

Everything else -- `HealCache.ts`, `SelfHealingTodoPage.ts`,
`production-self-healing.spec.ts` -- is complete.

## Running it

```bash
npm run test:challenge4            # raw @anthropic-ai/sdk path (via challenge 2's healer)
npm run test:challenge4:langchain  # @langchain/anthropic path
```

The first spec test needs `ANTHROPIC_API_KEY` set in `.env` (copy `.env.example`
if you haven't yet) -- it performs one real heal call and asserts the cache
absorbs every call after that. The second test (the live-DOM rejection) uses a
stub healer and needs no API key at all; it's the assertion Challenge 2
structurally cannot make.

## Self-check

`solutions/SelfHealingLocator.ts` has a complete reference implementation.
**Try to finish this challenge yourself before opening it -- peeking early defeats
the point of the exercise.**
