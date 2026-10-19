# claude-tutor

A Playwright + TypeScript learning repo for practicing GenAI-in-test-automation,
against Playwright's hosted TodoMVC demo app (`https://demo.playwright.dev/todomvc/`).

## Layout

- `tests/` -- a fully working baseline suite (Page Object Model + fixtures + sanity
  specs). No API key needed. Start here if you want a quick Playwright refresher.
- `challenges/` -- structured, TODO-driven exercises that bolt a GenAI layer onto the
  baseline. Each challenge is implemented **twice**: once with the raw
  `@anthropic-ai/sdk`, once with `@langchain/anthropic` -- same model, different
  ergonomics, so the comparison is meaningful.
  - `challenges/01-ai-test-case-generator/` -- turn a feature spec into a structured,
    validated test plan and execute it.
  - `challenges/02-self-healing-locators/` -- recover from a broken locator by asking
    an LLM for a fix, with a guardrail before trusting it.
  - `challenges/03-exploratory-testing-agent/` -- a small ReAct-style agent loop that
    drives the real app through a fixed toolbox (navigate/click/type/read_page) and a
    dedicated `finish` tool, reporting what it found.

Each challenge folder has its own `README.md` with the goal, the concept it teaches,
and exactly which functions are TODOs. A `solutions/` subfolder in each holds a
complete reference implementation -- try the challenge yourself first.

- `learning/` -- short primers on the concepts behind the challenges (structured
  output/tool use, raw SDK vs. LangChain, guardrails and trust, and agent/tool-loop
  concepts -- now implemented in Challenge 3). Read before, not after.
  - `learning/drills/` -- copy-paste Socratic-tutor prompts, one per primer, that
    quiz your recall instead of letting you just recognize the ideas on the page.
- `articles/` -- standalone, shareable write-ups derived from this repo. Currently:
  [`a-model-for-learning-with-ai.md`](./articles/a-model-for-learning-with-ai.md), a
  reflection mapping the process that built this repo onto real learning-science
  research.

## Before you start

If you want to understand *why* the challenges are built the way they are before
writing any code, read [`learning/README.md`](./learning/README.md) first -- it's a
reading list of five short docs, cross-linked from each challenge's own README. After
each one, test whether it stuck with the matching prompt in
[`learning/drills/`](./learning/drills/README.md).

## Setup

```bash
npm install
cp .env.example .env   # then add your ANTHROPIC_API_KEY
```

## Commands

```bash
npm test                           # baseline suite only -- no API key needed
npm run test:challenge1            # Challenge 1, raw @anthropic-ai/sdk
npm run test:challenge1:langchain  # Challenge 1, LangChain.js
npm run test:challenge2            # Challenge 2, raw @anthropic-ai/sdk
npm run test:challenge2:langchain  # Challenge 2, LangChain.js
npm run test:challenge3            # Challenge 3, raw @anthropic-ai/sdk
npm run test:challenge3:langchain  # Challenge 3, LangChain.js
npm run test:all                   # everything
npm run typecheck
npm run lint
npm run check                      # typecheck + lint
npm run report                     # open the last HTML report
```

## Suggested order

1. Run `npm test` to confirm the baseline suite passes and skim `tests/pages/TodoPage.ts`
   to see the POM the challenges build on.
2. Work through Challenge 1, then Challenge 2, then Challenge 3. Run the `anthropic`
   and `langchain` variants of each and compare the two implementations once both are
   done -- Challenge 3 is the most interesting comparison, since it's the first time
   either side has to write a loop instead of a single call.
