# Drill: Guardrails and Trust Boundaries

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/04-guardrails-and-trust.md` in the current repo so your
   questions are grounded in its actual current content, not a guess.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can name the two independent trust layers in Challenge 2 and explain why
     neither one makes the other redundant.
   - I can give a concrete example of a response that would pass schema validation
     but still be useless or dangerous to act on.
   - I can explain the DOM-snapshot prompt-injection angle specific to this
     challenge -- what in the DOM is potentially attacker/user-controlled, and how
     that content reaches the model.
   - I can explain why the guardrail still matters even if a prompt-injection
     attempt partly succeeded -- i.e. what makes the guardrail's check independent
     of how the model's output was produced.
   - I can contrast "reject and surface to a human" against the two tempting
     alternatives the doc names (silent retry, auto-patching the test file), and say
     what's specifically wrong with each alternative.
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
