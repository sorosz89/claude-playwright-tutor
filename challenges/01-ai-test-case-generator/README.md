# Challenge 1 -- AI Test-Case Generator

## Background reading

Before touching the TODOs, read
[`../../learning/02-structured-output-and-tool-use.md`](../../learning/02-structured-output-and-tool-use.md)
and
[`../../learning/03-anthropic-sdk-vs-langchain.md`](../../learning/03-anthropic-sdk-vs-langchain.md) --
they explain the mechanic this challenge is built on and what each SDK is doing
underneath `generate.anthropic.ts` / `generate.langchain.ts`.

## Goal

Turn `feature-spec.md` (a behavior the baseline suite doesn't cover: editing a todo)
into a structured, zod-validated list of `{action, target, value?}` steps and
`{type, target, expected}` assertions -- using Claude -- then execute that plan against
the real app through the existing `TodoPage` POM.

## The concept

**LLM output is data you validate, never code you eval.** The model never writes
Playwright code. It fills in a fixed JSON shape (`schema.ts`); a small interpreter maps
that shape onto a closed set of POM calls. This means a hallucinated or malformed
response fails loudly (zod throws, or the interpreter's switch has no case to run) --
it never silently executes something unexpected.

You implement the same "spec -> structured plan" step **twice**: once with the raw
`@anthropic-ai/sdk` (forcing a tool call), once with `@langchain/anthropic`'s
`withStructuredOutput`. Both call the same model; only the ergonomics differ.

## Exactly what has TODOs

- `generate.anthropic.ts` -> `generateTestPlan()`: build the forced tool-use request,
  pull the `tool_use` block out of the response, re-validate with zod.
- `generate.langchain.ts` -> `generateTestPlan()`: build a `ChatAnthropic` model with
  `.withStructuredOutput(TestPlanSchema)` and invoke it.
- `interpreter.ts` -> `executeStep()` and `executeAssertion()`: fill in the missing
  `switch` cases (one case per function is done for you as a worked example).

Everything else -- `schema.ts`, `pipeline.spec.ts`, `feature-spec.md` -- is complete.

## Running it

```bash
npm run test:challenge1            # raw @anthropic-ai/sdk path
npm run test:challenge1:langchain  # @langchain/anthropic path
```

Both need `ANTHROPIC_API_KEY` set in `.env` (copy `.env.example` if you haven't yet).

## Self-check

`solutions/` has a complete reference implementation of every TODO above.
**Try to finish this challenge yourself before opening it -- peeking early defeats the
point of the exercise.**
