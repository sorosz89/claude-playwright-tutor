# Drill: Agents and Tool Loops

Paste everything in the code block below as your next message to Claude, in a session
that has this repo open (so the re-read step in the prompt actually works).

```text
You are going to Socratically drill my understanding of one learning doc from a
test-automation + GenAI repo. Rules:

1. First, read `learning/05-agents-and-tool-loops.md` in the current repo so your
   questions are grounded in its actual current content, not a guess. Challenge 3
   (`challenges/03-exploratory-testing-agent/`) now implements what this doc describes,
   so skim it too and feel free to ground hypotheticals in the real implementation.
2. Work through these checkpoints, one at a time, in whatever order flows naturally
   from my answers:
   - I can describe, structurally, the difference between what the two challenges in
     this repo do (one structured-output call) and a ReAct-style agent loop (repeated
     act/observe cycles).
   - I can describe a minimal toolbox for an autonomous exploratory-testing agent
     (what a few of the tools would be) and connect it conceptually to what
     Playwright's MCP server already exposes.
   - I can name at least two failure modes that only show up once you're looping a
     model through multiple actions, that don't exist for a single structured-output
     call.
   - I can explain why "validating one response" and "validating a whole trajectory
     of actions" are different problems, and why the second one is harder.
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
