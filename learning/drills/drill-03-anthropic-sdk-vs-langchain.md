# Drill: Raw Anthropic SDK vs. LangChain.js

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/03-anthropic-sdk-vs-langchain.md` in the current repo so
   your questions are grounded in its actual current content, not a guess.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can walk through the explicit steps the raw `@anthropic-ai/sdk` path takes,
     in order, from building the tool schema to getting back a validated object.
   - I can explain what `.withStructuredOutput(schema)` is doing on LangChain's side
     -- i.e. which of the raw path's steps it's collapsing into one call.
   - I can explain why this repo implements the same function twice instead of just
     picking whichever is "better" -- what the comparison is actually for.
   - I can give at least one concrete, real-world reason to reach for the raw SDK
     over a framework, and one concrete reason to reach for LangChain (or similar)
     over the raw SDK.
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
