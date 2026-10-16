# Raw Anthropic SDK vs. LangChain.js

Both challenges implement the same function twice, against the same Claude model, so
the only variable is SDK ergonomics. This doc is the side-by-side you'd otherwise have
to piece together from the two solution files.

## The raw `@anthropic-ai/sdk` path

Roughly five explicit steps, all visible in your code:

1. Construct a client with your API key.
2. Build a `tools` array by hand — one tool, named, described, with an `input_schema`
   (the JSON Schema `z.toJSONSchema()` produced from your zod schema).
3. Call `client.messages.create({ model, system, messages, tools, tool_choice })`,
   where `tool_choice: { type: 'tool', name: '...' }` forces that specific tool.
4. The response is a `Message` with a `content` array of blocks (`text`, `tool_use`,
   …). You `find()` the `tool_use` block yourself and throw if it's missing.
5. `.input` on that block is `unknown` — you re-validate it with
   `YourSchema.parse(...)` before trusting it.

Nothing here is hidden. If something goes wrong, the failure is in a line of code you
wrote and can read.

## The `@langchain/anthropic` path

```ts
const model = new ChatAnthropic({ model, apiKey, temperature: 0 })
  .withStructuredOutput(YourZodSchema);

const result = await model.invoke([...]);
// result is already typed AND already schema-validated.
```

Two calls. `withStructuredOutput()` is doing steps 2-5 above for you: building the
tool definition from your zod schema, forcing tool choice, finding the `tool_use`
block, and validating it — all behind one method. You get the same guarantee with far
less code, at the cost of not seeing any of those steps.

## Why bother implementing it twice

Comparing line counts isn't really the point — it's that **the raw path makes the
underlying mechanism (`02-structured-output-and-tool-use.md`) impossible to miss,
while the LangChain path makes it easy to use well without ever thinking about it**.
Doing both once means you'll never again wonder what `withStructuredOutput()` "really"
does — you've built it by hand.

## When each actually matters in real work

Neither is objectively better; they trade off differently:

- **Reach for the raw SDK when:** you need to see exactly what's being sent and
  returned (debugging a weird response), you're doing something the framework doesn't
  have a clean abstraction for yet, or you specifically don't want another dependency
  and its upgrade/breaking-change surface in your stack.
- **Reach for LangChain (or a similar framework) when:** you want to swap models or
  providers without rewriting your call sites, you're composing multiple LLM calls
  into a pipeline (LangChain's chains/runnables exist for this), or the boilerplate of
  the raw path is genuinely costing you time with no corresponding benefit.

A useful tell: if you've only ever used the framework version of something, you don't
yet know which of its conveniences you're relying on, or what they'd cost to lose. The
raw path is how you find out.
