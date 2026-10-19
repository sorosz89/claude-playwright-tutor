# From one test to a suite: the production self-healing architecture

Challenge 2 proves the healer works: schema-valid output, a plausibility guardrail,
used once inside a single `test()` block. Challenge 4 takes that same healer --
unchanged -- and asks a different question: what has to change *around* it before
you'd trust it in a real suite, run on every PR, by people who didn't write it?

This doc covers what's new there. It assumes doc 04's two-layer guardrail model
(schema + plausibility); read that first if you haven't. This doc is the companion
to [`../articles/self-healing-locators-production-architecture.md`](../articles/self-healing-locators-production-architecture.md)
-- the article is the full write-up with code; this is the condensed version to
read before you touch Challenge 4's TODOs.

## Layering: the spec shouldn't know healing exists

`self-healing.spec.ts` in Challenge 2 explicitly does try → catch → heal → retry,
in the test body. That's correct for a fixture whose whole job is exercising the
healer in isolation. It's the wrong shape for a real spec, for the same reason you
don't inline retry logic into every test that calls a flaky API: the concern
belongs one layer down, so every caller benefits without every test author writing
recovery boilerplate by hand.

Challenge 4 moves healing into a `SelfHealingLocator` that a page object owns.
`SelfHealingTodoPage.addTodo()` calls `resolve()` and otherwise looks exactly like
a page object method that never fails. The spec that calls `addTodo()` has no idea
any of this happened, pass or fail -- it just gets a working interaction or a
loudly-thrown error.

## The cache is amortization, not correctness

Challenge 2 calls the model every time the test runs. That's fine for a demo
you'll run a handful of times; it's a real cost in a CI suite run on every PR --
slower, non-free, and it reintroduces a non-deterministic step into a signal
that's supposed to be boring and deterministic.

The fix isn't "call the model less often and hope." It's: call it once *per real
DOM change*, and serve every other resolution from a cache keyed on the broken
selector. Three cases `resolve()` has to handle, in order:

1. The primary selector still works -- the common case, and it should stay as
   cheap as a normal `page.locator(...)` call.
2. The primary selector is broken, but there's a cached heal from a prior run (or
   earlier in this run) that *still* works -- use it, no LLM call.
3. The primary selector is broken and the cache either has nothing or the cached
   entry stopped working too (the DOM moved on *again*) -- only now call the
   healer, and record what it returns.

That ordering matters: a cache hit has to be re-verified against the live page,
not trusted blindly, because a cache entry can go stale the same way the primary
selector did.

## A third guardrail layer: does it resolve, here, right now

Doc 04 covers two layers -- schema validation (shape) and `isPlausibleSelector`
(does the string look like real CSS, not prose or an echo of the broken
selector). Neither one can tell you whether `healedSelector` actually matches
anything on the *real* page, because neither one has the page. That's not a
missing feature in Challenge 2 -- `isPlausibleSelector` is deliberately a pure
string check, the thing you can unit-test without a browser.

Production has the live page available, so it adds the check the first two
structurally can't do: resolve the candidate and require `count() === 1` -- not
"at least one," exactly one -- before trusting it for anything. A selector that's
syntactically perfect CSS and still matches zero elements (or five) is just as
unusable as one that fails the plausibility check; it's caught one layer later,
against the DOM instead of against a string.

## Surfacing works both ways now

Doc 04's "fail-safe design" section covers what happens when the guardrail
*rejects* a suggestion: the test fails loudly, nothing silently retries, nothing
auto-patches a file on disk. Production adds the other half of that same
restraint: when the guardrail *accepts* a suggestion, that's also a fact a human
needs to see, not a problem that's now solved forever. The cache keeps the suite
green between the moment a selector breaks and the moment someone fixes the
source -- it was never meant to *be* the fix. Every successful heal is a signal
that the page object's real selector is wrong and needs a patch, so it gets
surfaced (a log line, a Slack message, a dashboard row) the same way a rejection
does, just without failing the test.

## Where this sits relative to Playwright's own retries

Two mechanisms Playwright already has can look like they overlap with this, and
don't:

- **Auto-waiting** (`.fill()`, `expect(...).toBeVisible()`) polls until a *known*
  locator becomes actionable. `resolve()` runs *before* that -- it's answering a
  different question ("does a usable element exist at all, and if not, can it be
  healed"), not replacing auto-waiting on whatever it hands back.
- **Test-level `retries`** reruns the entire test from scratch if it fails outright
  -- it has no idea `resolve()`, the cache, or any guardrail exist. Leaning on
  `retries` to paper over an unreliable heal is the same silent-retry anti-pattern
  doc 04 calls out for prompt-driven output, just moved up a layer. If a heal
  needs several test-level retries to land, that's a signal to fix the guardrail
  or the prompt, not to raise `retries`.

## How this maps to Challenge 4

`SelfHealingLocator.resolve()` and `.heal()` are exactly the three-case ordering
and the third guardrail layer above. `isUsable()` is the bounded-wait check that
keeps a slow-rendering (but correct) element from being misdiagnosed as broken
and triggering a heal it doesn't need.
