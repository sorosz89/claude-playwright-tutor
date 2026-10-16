# Structured output and tool use

Both challenges in this repo boil down to the same request: "give me an answer in
*exactly* this shape, not prose." This doc is about how that actually works, since
it's easy to use `withStructuredOutput()` without knowing what it's doing underneath.

## The core trick: tool use, repurposed

LLM APIs support "tool use" (also called "function calling") so a model can ask your
code to do something — look up a weather forecast, query a database — by emitting a
structured call instead of text: `{name: "get_weather", input: {city: "Lisbon"}}`.

Structured output hijacks this mechanism for a purpose it wasn't originally built for:
you define one tool whose schema *is* the answer shape you want, and you force the
model to call that exact tool. The model was never going to "do" anything with the
call — you just wanted it to produce arguments matching a schema, and tool-use already
gives every provider a reliable way to get schema-conformant JSON out of a model that's
fundamentally a text generator.

That's it. There's no deeper magic. `withStructuredOutput()` in LangChain is doing
exactly this tool-use trick for you; `generate.anthropic.ts` in Challenge 1 does it by
hand so you can see the machinery.

## Why force it, instead of just asking nicely in the prompt?

You could write "respond only with JSON matching this shape" in the prompt and usually
get something parseable back. The difference with *forced* tool use:

- The provider constrains generation at the API level, not just via prompt
  instruction — much lower odds of stray prose, markdown fences, or a missing field.
- You get a typed `tool_use` content block back, not a string you have to find and
  `JSON.parse()` out of a longer response.
- It's explicit in the code *that* you're constraining the model, rather than hoping a
  prompt instruction was followed.

It is **not** a guarantee. The model can still return a selector that doesn't exist on
the page, or a test step that doesn't make sense — the schema only guarantees *shape*,
never *correctness*. That distinction matters enough to have its own doc:
`04-guardrails-and-trust.md`.

## zod's three jobs in this repo

Both challenges define a schema once (`schema.ts` / `healer.types.ts`) with
[zod](https://zod.dev) and use it for three different things:

1. **Define the shape once.** `z.object({ steps: z.array(...), assertions: z.array(...) })`
   — the same object you'd reach for in any TypeScript project for runtime validation.
2. **Validate the model's response at runtime.** `TestPlanSchema.parse(toolUse.input)`
   — the model's output is untyped `unknown` as far as TypeScript is concerned until
   this line runs. If the model returned something that doesn't fit, `.parse()` throws
   immediately and loudly, instead of a malformed object silently flowing deeper into
   your test.
3. **Generate the JSON Schema the raw Anthropic SDK's `tools` param needs.**
   `z.toJSONSchema(TestPlanSchema)` — this is zod v4's built-in converter. Both the raw
   SDK path and the LangChain path validate against the *same* zod schema; only the
   raw path needs an extra step to turn it into the JSON Schema format the `tools` API
   expects. This is why the comparison between the two SDKs (see the next doc) is fair:
   neither one gets a better-specified schema than the other.

## What a closed schema buys you

Look at `StepSchema` in Challenge 1: `action` is a `z.enum([...])` of six fixed
strings, not a free-form string. This is deliberate and connects back to
`01-the-problem.md`'s "data, not code" point — the schema isn't just describing the
shape of the answer, it's *defining the entire vocabulary the model is allowed to use*.
The interpreter (`interpreter.ts`) only ever needs a `switch` over six known cases.
There's no path where the model's response causes code outside that fixed vocabulary
to run.
