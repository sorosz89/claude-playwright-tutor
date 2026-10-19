# Challenge 3 -- Exploratory Testing Agent

## Background reading

Before touching the TODOs, read
[`../../learning/02-structured-output-and-tool-use.md`](../../learning/02-structured-output-and-tool-use.md),
[`../../learning/03-anthropic-sdk-vs-langchain.md`](../../learning/03-anthropic-sdk-vs-langchain.md),
[`../../learning/04-guardrails-and-trust.md`](../../learning/04-guardrails-and-trust.md),
and
[`../../learning/05-agents-and-tool-loops.md`](../../learning/05-agents-and-tool-loops.md) --
the last one is the primer this challenge actually builds: a model that picks tool calls
in a loop, informed by what really happened last time, instead of answering once.

## Goal

Give Claude a small toolbox -- `navigate`, `click`, `type`, `read_page` -- plus a
required `finish` tool, point it at the live TodoMVC app with a goal ("explore this app
and report anything that looks broken"), and let it drive. Each iteration: Claude picks
one tool call, your code runs it for real against Playwright, the result goes back to
Claude as the next message, and it decides the next move. The loop ends only when Claude
calls `finish` with a validated report, or a hard iteration cap is hit (in which case the
run throws -- an agent that never stops is a bug, not a feature).

## The concept

Three things that are new here, beyond challenges 1 and 2:

1. **`tool_choice: 'auto'` over several tools, not one forced tool.** Challenges 1/2
   force a single tool because there's only ever one right shape of answer. Here the
   model genuinely chooses, including when to stop -- so the loop is written to let it.
2. **Two guardrails, not one** (`guardrail.ts`): `isPlausibleSelector` for `click`/`type`
   (the same semantic check as Challenge 2's), and `isPlausiblePath` for `navigate` --
   this challenge's own prompt-injection angle (`04-guardrails-and-trust.md`): nothing
   but the guardrail stops a `navigate` call from pointing somewhere that isn't an
   in-app route.
3. **A tool failure is an observation, not a crash.** If a selector doesn't match
   anything, or a guardrail rejects an argument, that failure is fed back to the model
   as an error result, same turn, so it can try something else -- the run only throws
   when the iteration cap is exhausted without `finish`, never on a single bad tool call.

You implement the loop twice, same as Challenges 1 and 2: once via raw
`@anthropic-ai/sdk` (manually filtering `tool_use` content blocks and building
`tool_result` blocks), once via `@langchain/anthropic`'s `bindTools()` (an `AIMessage`
with a ready-made `.tool_calls` array, and `ToolMessage` instead of a hand-built
content block) -- same loop, same dispatch-by-tool-name, different ergonomics for
reading what the model asked for and reporting back what happened.

## Exactly what has TODOs

- `guardrail.ts` -> `isPlausibleSelector()`, `isPlausiblePath()`: the two plausibility
  checks described above.
- `agent.anthropic.ts` -> `AnthropicExploratoryAgent.explore()`: the loop -- call the
  model with `tool_choice: 'auto'`, filter `tool_use` blocks, dispatch to a tool (schema
  validation, then the matching guardrail, then `.execute()`), handle `finish`, and feed
  `tool_result` blocks back for the next turn.
- `agent.langchain.ts` -> `LangchainExploratoryAgent.explore()`: the same loop via
  `bindTools()` and `ToolMessage`.

Everything else -- `agent.types.ts`, `tools.ts`, `createAgent.ts`,
`exploratory-agent.spec.ts` -- is complete.

## Running it

```bash
npm run test:challenge3            # raw @anthropic-ai/sdk path
npm run test:challenge3:langchain  # @langchain/anthropic path
```

Both need `ANTHROPIC_API_KEY` set in `.env` (copy `.env.example` if you haven't yet).
Watch the console output -- every tool call and its result is logged, iteration by
iteration, so you can see the loop actually reasoning its way through the app.

## Self-check

`solutions/` has a complete reference implementation of every TODO above.
**Try to finish this challenge yourself before opening it -- peeking early defeats the
point of the exercise.**
