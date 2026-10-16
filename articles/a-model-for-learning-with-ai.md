# A model for learning with AI (a reflection on building this repo)

This article is a companion to [`claude-tutor`](https://github.com/sorosz89/claude-playwright-tutor), a small Playwright + GenAI learning repo, and specifically to its [`learning/`](../learning/) docs — five primers that teach concepts *inside* the repo (structured output, guardrails, agents). This piece steps back and asks a different question: what was the actual *process* that produced that repo and its learning materials, and is there a reusable model in it?

The short answer: nothing here is new. Every step this session actually took maps
onto learning-science research that's decades old. That's reassuring, not
disappointing — it means "learning with an AI tutor" isn't a mysterious new category
of thing. It's old pedagogy, with a tutor that's finally cheap enough to run for one
person at a time.

## The session outline

| # | What happened | In plain terms |
|---|---|---|
| 1 | Asked for "3 challenge ideas" before any file existed, framed around a goal (demystify GenAI in test automation) rather than a deliverable. | Goals before artifacts. |
| 2 | Ideas were grounded in two of your own existing repos' conventions (`zero-gluten-e2e`'s Playwright/ESLint setup, `prompt-engineering-01`'s LangChain/zod usage) rather than a blank slate. | New material anchored to what you already half-know. |
| 3 | You picked, by structured choice, which 2 challenges, which demo app, which SDK(s), and where the repo would live. | Collaborative narrowing of an open design space. |
| 4 | A research pass verified the *current* SDK APIs (tool-use shape, structured-output helpers, package versions) via web search before any code was written — and surfaced a claim (a fictitious model name and a tool-use restriction) that didn't match reality and was corrected before it reached the plan. | Don't let an AI's confident-sounding research become fact unchecked. |
| 5 | The baseline Playwright suite was built fully working, as a worked example. Each TODO-driven challenge got a complete `solutions/` reference, a TODO stub with *one case already filled in* as a model to imitate, and fully-wired surrounding files (spec, types, wiring) so only the core logic was left undone. | Show a complete example before asking for an extension of the pattern. |
| 6 | The scaffold was actually run: `npm install`, typecheck, lint, the baseline suite against the real hosted app (passed 9/9), and the unfinished TODO stubs (confirmed they failed exactly at the expected boundary, not somewhere else). | Verify against reality, not against how confident the output looked. |
| 7 | You said you didn't want to just implement something that works — you wanted to understand it first. Five primer docs (the repo's [`learning/`](../learning/) folder) were added, explaining the concepts *before* the TODOs, cross-linked so they're read first. | Explicit instruction inserted before guided practice. |
| 8 | You asked for a Socratic drill — a tutor that quizzes recall of those primers, probing wrong answers with hints and only revealing the plain answer after real attempts. | A separate, later step to test whether the explanation actually stuck. |
| 9 | The repo was committed and pushed to GitHub. | Shipping the artifact. |
| 10 | This document — stepping back from the artifact to ask what the process itself teaches. | Reflection, fed back into how the next thing gets built. |

## The model

Seven stages, each a real, named idea from learning science, illustrated by the row
above it maps to.

### 1. Anchor on goals before deliverables

Decide what capability you want to end up with before deciding what to build. This is
**backward design** (Wiggins & McTighe, *Understanding by Design*): identify the
desired result first, then what would count as evidence you got there, and only then
the activities. *(Row 1 — the "3 ideas" brainstorm happened before a single file did.)*

### 2. Scaffold from what you already half-know

New material lands best just above your current ability, anchored to context you
already have — not below it (boring), not far above it (incomprehensible). This is
Vygotsky's **Zone of Proximal Development**, and **scaffolding** is literally the name
for a tutor building on what the learner already has (Wood, Bruner & Ross, 1976, "The
Role of Tutoring in Problem Solving," described six tutor functions this way — one of
them, notably, is *frustration control*, which resurfaces in stage 4). *(Row 2 — your
own sibling repos' conventions were the scaffold, not a blank slate.)*

### 3. Model, then fade

Show a complete, correct example before asking for an extension of the pattern. This
is the **worked-example effect** (Sweller & Cooper, 1985; Sweller, 1988): for a
novice, studying a full worked solution teaches more per minute than being handed an
open problem, because solving-from-scratch burns cognitive effort on search instead of
on understanding. The same idea, staged more gradually, is **cognitive apprenticeship**
(Collins, Brown & Newman, 1989: *modeling → coaching → scaffolding → fading*) and, in
a classroom-literacy framing, **gradual release of responsibility** / "I do, we do,
you do" (Pearson & Gallagher, 1983). *(Row 5 — the fully-working baseline, and the one
pre-filled case in every TODO `switch` statement.)*

### 4. Guide, don't abandon

Open-ended "figure it out yourself" is not the same as good pedagogy, and the research
is unflattering about pure discovery learning for novices: **Kirschner, Sweller &
Clark (2006), "Why Minimal Guidance During Instruction Does Not Work,"** argue that
minimally guided approaches underperform guided instruction because they ignore how
working memory and expertise actually develop — the advantage of guidance only fades
once a learner already has enough prior knowledge to self-guide. This is the direct
case for choosing "probe, then reveal" over "pure Socratic, never tell" when you were
asked which style the drills should use — and it's the same spirit as Wood, Bruner &
Ross's *frustration control* from stage 2. (A real nuance worth naming, not papering
over: **productive failure** research, e.g. Kapur, finds that genuine struggle
*before* explicit instruction can deepen conceptual transfer — so the tension isn't
settled science, it's a design choice about how much struggle is useful before you
reveal the answer.) *(Row 4, Row 8 — closed TODO stubs instead of a blank file; drills
that hint before they tell.)*

### 5. Verify against reality, not against the AI's own confidence

A claim that sounds authoritative and well-researched is not the same as a claim that
is true. The exact moment this mattered: a research pass returned a plausible-sounding
but fictitious model name and a restriction that didn't exist, and it got caught by
checking it against the one source that actually mattered (the real, current model
list) — not by re-reading the claim more carefully. This is the same principle
Challenge 2's guardrail teaches about LLM-suggested locators (schema-valid ≠ true),
applied one level up, to the *process of building the lesson itself*. *(Row 4 — the
caught hallucination; Row 6 — actually running the suite against the real app instead
of trusting that the generated code looked plausible.)*

### 6. Separate knowing, doing, and recalling

Reading an explanation, writing code that uses it, and recalling it later unprompted
are three different cognitive activities, and conflating them hides whether any of
them actually happened. **Retrieval practice / the testing effect** (Roediger &
Karpicke, 2006) found that *actively recalling* material produces better long-term
retention than re-reading it — re-reading mostly builds a false sense of familiarity,
not retrievable knowledge. That's the direct justification for keeping the primers in
[`learning/`](../learning/) (knowing), the challenge TODOs (doing), and
[`learning/drills/`](../learning/drills/) (recalling, independent of and after the
other two) as three separate artifacts instead of one. *(Rows 7 and 8
— the primers, then the drills, added as two distinct, later steps.)*

### 7. Close the loop with reflection

Periodically step back from the artifact and ask what the process itself teaches,
generalize it, and let that shape how the next thing gets built — rather than only
ever looking forward to the next deliverable. *(Row 10 — this document.)*

## Why bother with an AI tutor at all

**Bloom's 2 Sigma Problem** (1984) is the original version of this question: Bloom
found that one-to-one tutoring (plus mastery learning) moved the average student about
two standard deviations above classroom instruction — "too costly for most societies
to bear" at scale, in his own words, for human tutors. An AI tutor doesn't
automatically close that gap (none of the stages above happen just because a model is
involved — every one of them is a *design choice* you made this session, not a
default), but it does remove the cost constraint that made one-to-one tutoring
unscalable in the first place. The seven stages above are what made this particular
session's version of that actually work, rather than just producing code quickly.

## Applying this to your next AI-assisted learning project

1. Write down the capability you want, before the thing you'll build. Ask "what should
   I be able to do after this" before "what should I make."
2. Ground it in something you already know. Point the AI at your own prior work, not a
   blank prompt.
3. Ask for (or build) one fully-worked example before you ask for an open exercise.
   If you're the one building the exercise for someone else, never start them from a
   blank file.
4. Decide up front how much to withhold: closed, bounded exercises over open-ended
   ones for a first pass; hints before answers; and a real stopping point where the
   answer gets revealed rather than withheld forever.
5. Don't trust an AI's research or generated claims by how confident they sound. Check
   them against the one source that actually matters, especially before they get
   baked into something you'll teach from.
6. After you've built or read something, test your recall of it separately, later, and
   without the source material open. If you can't recall it unprompted, you don't
   know it yet — you recognized it.
7. When the thing is done, spend five minutes asking what the process itself just
   taught you, independent of the artifact.

## References

- Wiggins, G., & McTighe, J. — *Understanding by Design* (backward design). Overview: [Understanding by Design (UbD) and the Backward Design Framework](https://pressbooks.pub/etsu/chapter/understanding-by-design-ubd-and-the-backward-design-framework/)
- Wood, D., Bruner, J. S., & Ross, G. (1976). "The Role of Tutoring in Problem Solving." *Journal of Child Psychology and Psychiatry*, 17(2), 89-100. Overview: [Vygotsky vs Bruner: Scaffolding and Social Learning](https://www.structural-learning.com/post/vygotsky-vs-bruner)
- Vygotsky, L. — Zone of Proximal Development. Overview: [Zone of Proximal Development](https://www.simplypsychology.org/zone-of-proximal-development.html)
- Collins, A., Brown, J. S., & Newman, S. E. (1989). Cognitive apprenticeship. Overview: [Cognitive Apprenticeship](https://www.aft.org/ae/winter1991/collins_brown_holum) / [Wikipedia](https://en.wikipedia.org/wiki/Cognitive_apprenticeship)
- Sweller, J. (1988). "Cognitive Load During Problem Solving: Effects on Learning." *Cognitive Science*, 12(2), 257-285. Sweller & Cooper (1985) first reported the worked-example effect. Overview: [Worked example effect](https://notes.andymatuschak.org/Worked_example_effect)
- Pearson, P. D., & Gallagher, M. (1983). Gradual release of responsibility. Overview: [Gradual release of responsibility](https://en.wikipedia.org/wiki/Gradual_release_of_responsibility)
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). "Why Minimal Guidance During Instruction Does Not Work." *Educational Psychologist*, 41(2), 75-86. Full text: [PDF](https://www.sfu.ca/~jcnesbit/EDUC220/ThinkPaper/KirschnerSweller2006.pdf)
- Kapur, M. — Productive failure. Overview: [Productive Failure in Learning Math](https://onlinelibrary.wiley.com/doi/10.1111/cogs.12107)
- Roediger, H. L., & Karpicke, J. D. (2006). "The Power of Testing Memory: Basic Research and Implications for Educational Practice." *Perspectives on Psychological Science*, 1(3), 181-210. Overview: [Testing Effect: Retrieval Practice Strategies](https://www.structural-learning.com/post/testing-effect-retrieval-practice)
- Bloom, B. S. (1984). "The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring." *Educational Researcher*. Overview: [Bloom's 2 sigma problem](https://en.wikipedia.org/wiki/Bloom%27s_2_sigma_problem)
