# Drill: Structured Output and Tool Use

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/02-structured-output-and-tool-use.md` in the current repo so
   your questions are grounded in its actual current content, not a guess.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can explain what "tool use / function calling" is normally for, and how
     structured output repurposes that mechanism for a different end.
   - I can explain why *forcing* a specific tool call is more reliable than just
     asking the model nicely in the prompt to "respond only with JSON like this."
   - I can state clearly what a passing schema validation actually guarantees, and
     what it does NOT guarantee.
   - I can list zod's three distinct jobs in this repo's code (defining the shape
     once, validating the model's response at runtime, and generating the JSON
     Schema the raw SDK's `tools` param needs) -- and point to which file/line does
     each.
   - I can explain why `action` being a closed `z.enum([...])` rather than a free
     string matters for what the interpreter is able to do with it.
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
