# Agents and tool loops

Nothing in this repo builds an agent — both challenges are one request, one validated
response. This doc explains what actually changes once you go further, since "agent"
gets used loosely enough to mean almost anything. It's here as context for later, not
a design doc for something you need to build now.

## The difference: one call vs. a loop

What you've implemented so far:

```
spec/context --> [one structured-output call] --> validated data --> your code acts on it once
```

An "agent" in the sense people usually mean it is the same structured-output mechanic
(`02-structured-output-and-tool-use.md`), but called repeatedly in a loop where the
model's own previous output decides what happens next:

```
goal --> [model picks a tool call] --> your code runs it --> result goes back to the model
      --> [model picks the next tool call, informed by that result] --> ... --> model decides it's done
```

This pattern has a name — **ReAct** (Reason + Act) — from the 2022 paper that
popularized interleaving the model's reasoning with real tool calls and real
observations, instead of asking it to plan everything up front in one shot. Each
iteration, the model sees what actually happened last time before deciding what to do
next.

## What this would look like for exploratory testing

The idea behind the "autonomous exploratory testing agent" that got scoped out of this
repo: give the model a small toolbox —

- `navigate(url)`
- `click(selector-or-description)`
- `type(selector, text)`
- `read_page()` — returns something like an accessibility-tree snapshot or the visible
  text, so the model can decide what to do next without you hand-feeding it state

— and a goal like "explore this app and report anything that looks broken." Each
iteration: the model picks one tool call, your code executes it for real against
Playwright, the result (what the page now looks like) goes back to the model as the
next message, and it decides the next action. This is also, functionally, what
Playwright's own MCP server exposes — a browser as a toolbox a model can drive one
call at a time — rather than something you'd need to hand-build from scratch.

## Why this is a bigger design problem than either challenge here

A single structured-output call fails in one of two ways: wrong shape (zod catches
it) or wrong content (the guardrail catches it, `04-guardrails-and-trust.md`). A loop
adds failure modes that only show up *across* iterations:

- **Stopping conditions.** What makes the model decide it's done exploring? Left
  unbounded, a model can loop indefinitely or re-discover the same page repeatedly.
  Real implementations cap it with a max-iteration count and/or a dedicated "finish"
  tool the model must explicitly call.
- **Cost and time compound.** Challenge 2 is one API call; an agent run might be
  dozens. Latency and $ scale with how many iterations it takes to reach the goal, and
  that number isn't something you control directly — only how you bound it.
- **Observability matters more, not less.** With one call, you log one request and
  one response. With a loop, you need a legible trace of *every* action taken and why,
  or a bug report the agent produces becomes as unverifiable as the bug itself — you'd
  be trusting a black box about what it actually did on the page.
- **The guardrail problem gets harder.** `isPlausibleSelector()` can check one string.
  There's no equivalent one-line check for "was this entire sequence of 40 clicks a
  reasonable way to explore a todo app" — validating a trajectory, not a single
  output, is still mostly an open problem in applied agent design.

None of this is a reason to avoid building it — it's the actual shape of the problem
if you do. If you come back to the "autonomous exploratory agent" idea later, start
small: a toolbox of three or four actions, a hard iteration cap, and a log of every
tool call and result printed to the console before you worry about anything fancier.
