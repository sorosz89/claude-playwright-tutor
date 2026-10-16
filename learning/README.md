# Learning materials

Short primers to read *before* you touch a challenge's TODOs — the goal is to
understand what you're building and why, not just make the tests pass.

Each doc is a 5-10 minute read: the core idea, why it matters, and the pitfalls to
watch for. None of them require running code; they're background for the two
challenges in `../challenges/`.

After reading a doc, test whether it actually stuck with the matching prompt in
[`drills/`](./drills/README.md) — a Socratic tutor that quizzes you on it instead of
letting you just recognize the ideas on the page.

## Reading order

| Doc | Read before | What it covers |
|---|---|---|
| [`01-the-problem.md`](./01-the-problem.md) | Either challenge | The landscape of "GenAI in test automation" — where these two challenges sit in it, and an honest look at the risks vs. where plain deterministic testing still wins. |
| [`02-structured-output-and-tool-use.md`](./02-structured-output-and-tool-use.md) | Both challenges | Forcing an LLM to return structured, schema-conformant data instead of free text or code — the mechanic both challenges are built on. |
| [`03-anthropic-sdk-vs-langchain.md`](./03-anthropic-sdk-vs-langchain.md) | Both challenges | What the raw `@anthropic-ai/sdk` call looks like underneath, versus what `@langchain/anthropic` abstracts away — why you're implementing everything twice. |
| [`04-guardrails-and-trust.md`](./04-guardrails-and-trust.md) | Challenge 2 | Why schema validation alone isn't enough, the DOM-snapshot prompt-injection angle, and fail-safe design for acting on model output. |
| [`05-agents-and-tool-loops.md`](./05-agents-and-tool-loops.md) | Neither (forward-looking) | What changes once a model takes multiple actions in a loop instead of answering once — context for building an autonomous exploratory-testing agent later. |

## How this maps to the repo

- **Challenge 1 (AI Test-Case Generator)** is one structured-output call: spec in,
  validated test plan out. Read docs 02 and 03 first.
- **Challenge 2 (Self-Healing Locators)** is also one structured-output call, but the
  response is then *acted on* (a new locator is used for real). Read docs 02, 03, and
  04 first — 04 is the one explaining why that "acted on" part needs an extra safety
  net.
- **Doc 05** doesn't map to anything implemented here. Both challenges are a single
  request/response; nothing in this repo loops a model through multiple actions. It's
  included because that's the natural next step if you want to build the "autonomous
  exploratory agent" idea that got scoped out of this repo (see the root `README.md`).
