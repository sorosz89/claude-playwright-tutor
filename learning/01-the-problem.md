# The problem: what does "GenAI in test automation" actually mean?

It's a vague phrase that bundles together several genuinely different techniques.
Separating them is the first step to demystifying any of it.

## A map of the patterns

| Pattern | What the model does | Example |
|---|---|---|
| **Test-case generation** | Turns a spec/requirement into test steps or assertions, once, offline-ish. | Challenge 1 in this repo. |
| **Self-healing locators** | Repairs a single broken selector at runtime, using the current DOM as context. | Challenge 2 in this repo. |
| **Autonomous exploratory testing** | Drives the app itself across many steps, deciding what to click next, to find bugs or map behavior. | Not built here — see `05-agents-and-tool-loops.md`. |
| **LLM-as-judge** | Scores something hard to assert deterministically — "is this error message helpful?", "does this screenshot look broken?" | Not built here. |

These sound similar ("AI helps with testing!") but have very different risk profiles.
Generating a test case once, with a human reviewing the diff before it's committed, is
low-stakes. An agent autonomously clicking through a production-like app, or a selector
auto-patching itself in CI with no human in the loop, is a different risk category
entirely — the failure mode isn't "the model was wrong," it's "the model was wrong *and
nobody looked*."

This repo picked the two lowest-risk, most concretely useful patterns — generation and
healing — specifically because the output is easy to validate before anything happens:
a test plan is data you can inspect, and a healed locator is one string you can sanity
check before using it.

## Why "LLM output as data, never as code"

The tempting shortcut for test-case generation is: ask the model to write Playwright
code, then run that code. Don't do this, for the same reason you wouldn't `eval()`
user input:

- A hallucinated or subtly wrong test is a code-quality problem you might not notice
  until it passes when it shouldn't.
- There's no cheap way to validate "is this valid, safe Playwright code" short of
  actually running it.
- You lose the ability to reason about *what the model is allowed to do* — the space
  of possible outputs is "any JavaScript," not "one of six known actions."

Both challenges in this repo instead ask the model to fill in a closed, boring JSON
shape (see `02-structured-output-and-tool-use.md`). A small interpreter you write by
hand maps that shape onto a fixed set of real Playwright calls. The model never gets to
decide *what code runs* — only *which of a few known things happens, and with what
arguments*. That's the difference between "the model can suggest" and "the model can
execute."

## Where deterministic testing still just wins

GenAI doesn't replace the bulk of a test suite, and shouldn't:

- **Cost and latency.** An LLM call is cents and hundreds of milliseconds to seconds.
  A hand-written assertion is free and instant. Don't reach for a model to check
  something a plain `expect()` already covers.
- **Non-determinism.** Even at `temperature: 0`, model output can drift between
  provider updates. A flaky *test* defeats the point of having tests. Treat any
  LLM-touched test as a step above a normal one in flakiness risk, and design around
  it (retries, logging, human review of what the model actually returned — see
  `04-guardrails-and-trust.md`).
- **Auditability.** "Why did this test fail" should have a traceable answer. A test
  that silently regenerated itself differently each run is worse than no test.

The honest framing: GenAI is useful for the *last-mile* problems that are expensive to
hand-write or brittle to hand-maintain (turning a spec into a first draft, recovering
from a renamed class) — not as a wholesale replacement for writing tests that know
exactly what they check.
