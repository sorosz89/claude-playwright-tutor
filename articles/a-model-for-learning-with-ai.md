# A model for learning with AI (and the decades of research behind it)

*Oct 16, 2026 · Sándor Orosz*

I spent a session building a small test-automation learning repo with an AI
assistant. Along the way, I kept steering how we worked, not just what we built:
brainstorm before building, scaffold before solving, understand before implementing,
drill before trusting it stuck.

When I stepped back and asked the assistant to map that process onto real research,
the answer surprised me in a good way: none of it was new. Every step mapped onto
learning science that is decades old. "Learning with an AI tutor" isn't a new
category of thing. It's old pedagogy, with a tutor that's finally cheap enough to run
for one person at a time.

One honest caveat up front: this article is itself AI-assisted research, so I checked
every citation below against its original source before publishing. That turned out
to be part of the lesson (see stage 5).

Here's the model, with the research behind each stage.

## Why bother with an AI tutor at all

Benjamin Bloom asked this exact question in 1984. He found that one-to-one tutoring,
combined with mastery learning, moved the average student about two standard
deviations above classroom instruction: the average tutored student outperformed 98%
of a control class. His own conclusion was that one-to-one tutoring is "too costly for
most societies to bear on a large scale" (Bloom, 1984).

That famous "2 sigma" is best read as an upper bound. Bloom's studies were small and
bundled tutoring with mastery learning. A later review of controlled studies found
human tutoring alone closer to 0.8 standard deviations (VanLehn, 2011). That is still
a large effect by educational standards.

AI removes the cost constraint. It does not remove the design problem. Two recent
trials show this from opposite sides. In a field experiment with nearly 1,000 high
school math students, unrestricted GPT-4 access improved practice scores, but
students did 17% worse on the exam once access was removed; a tutor version with
learning safeguards largely avoided that harm (Bastani et al., 2025). In a Harvard
physics trial, a custom AI tutor built on the same pedagogy as an active-learning
class produced more than double the learning gains, in less time (Kestin et al.,
2025).

Same underlying technology, opposite outcomes. None of the seven stages below happen
just because a model is involved. Each one is a design choice.

## The model: seven stages

### 1. Anchor on goals before deliverables

Decide what capability you want to end up with before deciding what to build. This is
backward design (Wiggins & McTighe, *Understanding by Design*): identify the desired
result first, then what would count as evidence you got there, and only then the
activities.

### 2. Scaffold from what you already half-know

New material lands best just above your current ability, anchored to context you
already have. This is Vygotsky's Zone of Proximal Development. The term "scaffolding"
came later, from Wood, Bruner and Ross (1976), who described six functions a good
tutor performs. Two of them come back below: demonstrating the solution (stage 3) and
frustration control (stage 4).

### 3. Model, then fade

Show a complete, correct example before asking for an extension of the pattern. This
is the worked-example effect (Sweller & Cooper, 1985; Sweller, 1988): for a novice,
studying a full worked solution teaches more per minute than an open problem, because
solving from scratch burns effort on search instead of understanding. The same idea,
staged more gradually, is cognitive apprenticeship (Collins, Brown & Holum, 1991:
modeling, coaching, scaffolding, fading) and, in literacy instruction, the gradual
release of responsibility (Pearson & Gallagher, 1983), often summarized as "I do, we
do, you do."

### 4. Guide, don't abandon

"Figure it out yourself" is not automatically good pedagogy. Kirschner, Sweller and
Clark's influential and contested 2006 paper, "Why Minimal Guidance During
Instruction Does Not Work," argues that minimally guided approaches underperform
guided instruction because they ignore how working memory and expertise develop. The
advantage flips as learners gain knowledge: guidance that helps a novice can hinder
someone more experienced. This is the expertise reversal effect (Kalyuga et al.,
2003).

The nuance deserves naming honestly. Critics argued that well-designed inquiry
learning is not "minimal guidance" at all (Hmelo-Silver, Duncan & Chinn, 2007).
Productive-failure research (Kapur) finds that genuine struggle before explicit
instruction can deepen conceptual understanding. The question isn't settled science.
It's a design choice about how much struggle is useful before you reveal the answer,
which is the tutor's "frustration control" job from stage 2.

### 5. Verify against reality, not against how confident the AI sounds

A claim that sounds well-researched is not the same as a claim that's true. In my
session, a research pass investigating a code library's API came back with a
precise-sounding technical claim: that forcing a certain kind of structured response
would fail with an error on several of the current AI models, and that one specific
model, conveniently, was the exception to use instead. The restriction didn't exist.
Neither did that model. It only got caught by checking the claim against the one list
that actually mattered, the real, current roster of models, not by re-reading the
claim more carefully.

That matches how professional fact-checkers work. Wineburg and McGrew (2019) compared
fact-checkers, PhD historians and Stanford undergraduates evaluating websites.
Historians and students read "vertically," scrutinizing the page itself, and were
often fooled. Fact-checkers read "laterally": they left the page quickly and checked
what other sources said about it, reaching better conclusions in a fraction of the
time. The fix isn't "think harder about the AI's answer." It's "go verify it
somewhere else."

### 6. Separate reading, doing, and recalling

Reading an explanation, writing code that uses it, and recalling it later unprompted
are three different cognitive activities. Conflating them hides whether any of them
actually happened. Research on the testing effect (Roediger & Karpicke, 2006) found
that actively recalling material produces better long-term retention than re-reading
it. Re-reading feels productive, but it leaves learners overconfident about what
they'll remember. That's the case for treating "read the explanation," "do the
exercise," and "get quizzed on it later, with no notes" as three separate steps.

### 7. Close the loop with reflection

Periodically step back from the artifact and ask what the process itself taught you,
independent of what you built. Cognitive apprenticeship lists reflection as a core
method: comparing your own process with an expert's (Collins, Brown & Holum, 1991). A
field study by Di Stefano, Gino, Pisano and Staats (2014) found that employees who
spent the last 15 minutes of the day reflecting on lessons learned performed better
than those who kept practicing. This article is that step.

## Applying this to your next AI-assisted learning project

If you only take one thing from this article, take this list.

- Write down the capability you want before the thing you'll build.
- Ground new material in something you already know. Point the AI at your own prior
  work, not a blank prompt.
- Ask for one fully worked example before you ask for an open exercise.
- Decide up front how much to withhold: bounded exercises before open-ended ones,
  hints before answers, and a real point where the answer gets revealed rather than
  withheld forever. Loosen this as you get more experienced.
- Don't trust an AI's claims by how confident they sound. Check them against an
  original source, especially before they get baked into something you'll teach from.
- Test your recall of anything you learn separately, later, without the source
  material open. If you can't recall it unprompted, you don't know it yet; you only
  recognized it.
- When the thing is done, spend five minutes on what the process itself taught you.

## Where this came from

This model came out of building [`claude-tutor`](https://github.com/sorosz89/claude-playwright-tutor),
a small Playwright + GenAI learning repo. Its [`learning/`](../learning/) docs teach
the concepts *inside* that repo (structured output, guardrails, agents); this article
is about the process that produced them.

## References

- Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., & Mariman, R. (2025). Generative AI without guardrails can harm learning: Evidence from high school mathematics. *PNAS*, 122(26). [doi.org/10.1073/pnas.2422633122](https://doi.org/10.1073/pnas.2422633122)
- Bloom, B. S. (1984). The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring. *Educational Researcher*, 13(6), 4-16. [doi.org/10.3102/0013189X013006004](https://doi.org/10.3102/0013189X013006004)
- Collins, A., Brown, J. S., & Holum, A. (1991). Cognitive Apprenticeship: Making Thinking Visible. *American Educator*. [aft.org/ae/winter1991/collins_brown_holum](https://www.aft.org/ae/winter1991/collins_brown_holum)
- Di Stefano, G., Gino, F., Pisano, G., & Staats, B. (2014). Learning by Thinking: How Reflection Aids Performance. *Harvard Business School Working Paper 14-093*.
- Hmelo-Silver, C. E., Duncan, R. G., & Chinn, C. A. (2007). Scaffolding and Achievement in Problem-Based and Inquiry Learning: A Response to Kirschner, Sweller, and Clark (2006). *Educational Psychologist*, 42(2), 99-107. [doi.org/10.1080/00461520701263368](https://doi.org/10.1080/00461520701263368)
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The Expertise Reversal Effect. *Educational Psychologist*, 38(1), 23-31. [doi.org/10.1207/S15326985EP3801_4](https://doi.org/10.1207/S15326985EP3801_4)
- Kapur, M. (2014). Productive Failure in Learning Math. *Cognitive Science*, 38(5), 1008-1022. [doi.org/10.1111/cogs.12107](https://doi.org/10.1111/cogs.12107)
- Kestin, G., Miller, K., Klales, A., Milbourne, T., & Ponti, G. (2025). AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting. *Scientific Reports*, 15, 17458. [pmc.ncbi.nlm.nih.gov/articles/PMC12179260](https://pmc.ncbi.nlm.nih.gov/articles/PMC12179260/)
- Kirschner, P. A., Sweller, J., & Clark, R. E. (2006). Why Minimal Guidance During Instruction Does Not Work. *Educational Psychologist*, 41(2), 75-86. [doi.org/10.1207/s15326985ep4102_1](https://doi.org/10.1207/s15326985ep4102_1)
- Pearson, P. D., & Gallagher, M. C. (1983). The Instruction of Reading Comprehension. *Contemporary Educational Psychology*, 8(3), 317-344. [doi.org/10.1016/0361-476X(83)90019-X](https://doi.org/10.1016/0361-476X%2883%2990019-X)
- Roediger, H. L., & Karpicke, J. D. (2006). The Power of Testing Memory: Basic Research and Implications for Educational Practice. *Perspectives on Psychological Science*, 1(3), 181-210. [doi.org/10.1111/j.1745-6916.2006.00012.x](https://doi.org/10.1111/j.1745-6916.2006.00012.x)
- Sweller, J., & Cooper, G. A. (1985). The Use of Worked Examples as a Substitute for Problem Solving in Learning Algebra. *Cognition and Instruction*, 2(1), 59-89. [doi.org/10.1207/s1532690xci0201_3](https://doi.org/10.1207/s1532690xci0201_3)
- Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning. *Cognitive Science*, 12(2), 257-285. [doi.org/10.1207/s15516709cog1202_4](https://doi.org/10.1207/s15516709cog1202_4)
- VanLehn, K. (2011). The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems. *Educational Psychologist*, 46(4), 197-221. [doi.org/10.1080/00461520.2011.611369](https://doi.org/10.1080/00461520.2011.611369)
- Vygotsky, L. S. (1978). *Mind in Society: The Development of Higher Psychological Processes*. Harvard University Press.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.). ASCD.
- Wineburg, S., & McGrew, S. (2019). Lateral Reading and the Nature of Expertise: Reading Less and Learning More When Evaluating Digital Information. *Teachers College Record*, 121(11). [doi.org/10.1177/016146811912101102](https://doi.org/10.1177/016146811912101102)
- Wood, D., Bruner, J. S., & Ross, G. (1976). The Role of Tutoring in Problem Solving. *Journal of Child Psychology and Psychiatry*, 17(2), 89-100. [doi.org/10.1111/j.1469-7610.1976.tb00381.x](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x)
