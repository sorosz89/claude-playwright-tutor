# Drill: Production Self-Healing Architecture

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/06-production-architecture.md` in the current repo so your
   questions are grounded in its actual current content, not a guess. If I ask
   something that depends on doc 04's two-layer guardrail model, you can also check
   `learning/04-guardrails-and-trust.md`.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can explain why healing logic belongs in the page object/locator layer rather
     than in the spec, and name the concrete cost of getting that wrong (what a spec
     author has to do differently if it isn't layered this way).
   - I can list, in order, the three cases `resolve()` has to handle (primary works /
     cache hit / neither), and explain why a cache hit still has to be re-verified
     against the live page instead of trusted outright.
   - I can explain what the cache is actually buying (and NOT buying) -- i.e. why
     "the suite is green" and "the underlying problem is fixed" are different claims.
   - I can name the third guardrail layer this architecture adds beyond schema
     validation and `isPlausibleSelector`, explain concretely why neither of those
     two can do that check, and say exactly what the check requires (`count() === 1`,
     not "at least one").
   - I can explain why a successful heal still gets surfaced to a human, not just a
     rejected one -- what's the asymmetry doc 04 focuses on, and what does production
     add on the success path.
   - I can explain how `resolve()` relates to Playwright's auto-waiting and to
     test-level `retries` -- what each one is actually for, and why leaning on
     `retries` to cover an unreliable heal is the wrong fix.
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
