# Challenge 2 -- Self-Healing Locators

## Background reading

Before touching the TODOs, read
[`../../learning/02-structured-output-and-tool-use.md`](../../learning/02-structured-output-and-tool-use.md),
[`../../learning/03-anthropic-sdk-vs-langchain.md`](../../learning/03-anthropic-sdk-vs-langchain.md),
and
[`../../learning/04-guardrails-and-trust.md`](../../learning/04-guardrails-and-trust.md) --
the last one in particular explains why this challenge has a guardrail that Challenge 1
doesn't, and the prompt-injection angle specific to handing a DOM snapshot to a model.

## Goal

`BrokenTodoPage` has one deliberately wrong locator (`.new-todo-input`, simulating a
DOM rename nobody updated the test for). Implement a `LocatorHealer` that: takes a DOM
snapshot, the broken selector, and a plain-English description of intent; asks Claude
for a corrected CSS selector via forced structured output; validates it's plausible
*before* trusting it; and returns it. The spec then retries with the healed selector and
asserts success, logging original vs. healed selector.

## The concept

Two independent safety nets, not one:
1. **Schema validation** (zod / LangChain's structured output) guarantees the model
   returned *a string in the right shape*.
2. **The guardrail** (`isPlausibleSelector`) checks that string is actually a plausible
   CSS selector -- not prose, not the broken selector echoed back, not a hallucinated
   explanation. A shape-valid response can still be semantically useless; never skip
   this just because the schema already passed.

You implement `heal()` twice, same as Challenge 1: once via raw `@anthropic-ai/sdk`
forced tool-use, once via `@langchain/anthropic`'s structured output.

## Exactly what has TODOs

- `guardrail.ts` -> `isPlausibleSelector()`: the plausibility checks described above.
- `healer.anthropic.ts` -> `AnthropicLocatorHealer.heal()`: forced tool-use call,
  extract + validate the tool_use block, run the guardrail.
- `healer.langchain.ts` -> `LangchainLocatorHealer.heal()`: `withStructuredOutput`
  call, run the same guardrail.

Everything else -- `BrokenTodoPage.ts`, `healer.types.ts`, `createHealer.ts`,
`self-healing.spec.ts` -- is complete.

## Running it

```bash
npm run test:challenge2            # raw @anthropic-ai/sdk path
npm run test:challenge2:langchain  # @langchain/anthropic path
```

Both need `ANTHROPIC_API_KEY` set in `.env` (copy `.env.example` if you haven't yet).

## Self-check

`solutions/` has a complete reference implementation of every TODO above.
**Try to finish this challenge yourself before opening it -- peeking early defeats the
point of the exercise.**
