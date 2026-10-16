# Drill-mode prompts

Reading a primer isn't the same as knowing it cold. Each file here is a single
copy-paste-ready prompt that turns Claude into a Socratic tutor for one learning doc:
it asks you one question at a time, probes a weak answer with a hint or follow-up, and
only states the concept plainly after a couple of genuine attempts — then moves on. No
scores, just a plain-language recap of what landed and what needed the reveal.

## How to use one

1. Finish reading the matching doc in `../` first — the drill tests recall, it
   doesn't teach from scratch.
2. Open the drill file below and copy the whole fenced code block.
3. Paste it as your next message to Claude, in a session that has this repo open (the
   prompt tells Claude to re-read the source doc itself, so the questions stay
   accurate even if the doc changes later).
4. Answer one question at a time. Don't look at the source doc while answering —
   that defeats the point.

## The five drills

| Drill | Drills your recall of |
|---|---|
| [`drill-01-the-problem.md`](./drill-01-the-problem.md) | [`../01-the-problem.md`](../01-the-problem.md) |
| [`drill-02-structured-output-and-tool-use.md`](./drill-02-structured-output-and-tool-use.md) | [`../02-structured-output-and-tool-use.md`](../02-structured-output-and-tool-use.md) |
| [`drill-03-anthropic-sdk-vs-langchain.md`](./drill-03-anthropic-sdk-vs-langchain.md) | [`../03-anthropic-sdk-vs-langchain.md`](../03-anthropic-sdk-vs-langchain.md) |
| [`drill-04-guardrails-and-trust.md`](./drill-04-guardrails-and-trust.md) | [`../04-guardrails-and-trust.md`](../04-guardrails-and-trust.md) |
| [`drill-05-agents-and-tool-loops.md`](./drill-05-agents-and-tool-loops.md) | [`../05-agents-and-tool-loops.md`](../05-agents-and-tool-loops.md) |
