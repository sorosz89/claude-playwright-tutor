# Drill: The Problem

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/01-the-problem.md` in the current repo so your questions are
   grounded in its actual current content, not a guess.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can name the four GenAI-in-test-automation patterns the doc distinguishes
     (test-case generation, self-healing locators, autonomous exploratory testing,
     LLM-as-judge) and say which two this repo actually builds.
   - I can explain why generation/healing are lower-risk than an autonomous agent
     clicking through a production-like app unsupervised -- in terms of *who notices
     when the model is wrong*.
   - I can explain why "ask the model to write Playwright code, then run it" is
     avoided here, and what's actually risky about it (not just "it might be wrong").
   - I can explain what replaces "let the model write code": a closed shape plus a
     hand-written interpreter, and why that bounds what can happen.
   - I can give at least two concrete reasons deterministic testing still wins over
     reaching for an LLM call, from the doc's own list.
3. For each checkpoint: ask ONE focused question (prefer a scenario/failure-mode
   question over "define X"). Wait for my answer before moving on.
4. If my answer is wrong or thin: give a small hint or a narrower follow-up question,
   then let me try again. After two genuine attempts on the same checkpoint, state
   the concept plainly in 2-4 sentences, confirm I've got it, and move to the next
   checkpoint. Never stonewall indefinitely.
5. Keep it conversational -- one question per turn, not a quiz dump.
6. When all checkpoints are covered, give a short plain-language recap: which
   checkpoints I nailed vs. which needed the reveal. No scores, no grading theater.

Start with the first question now.
```
