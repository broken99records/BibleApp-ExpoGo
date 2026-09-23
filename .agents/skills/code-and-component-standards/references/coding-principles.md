# Universal coding principles

These apply in any language or framework, to all code — not just components.

## Typing

**A cast is a last resort.** Reaching for `as any` or `as SomeType` to silence a
type error means the data is mistyped upstream; the cast moves the lie
downstream rather than fixing it. Type the data instead:

- `Pick<RealType, ...>` for partial fixtures.
- Type the input, and let the libraries called infer the rest.
- Build test inputs through the real producing flow.
- For a typed literal array, declare a named element type and annotate the array
  (`const results: T[] = []`) so the literals check against the union. Don't cast
  each entry to the union member type inline.

Legitimate uses are narrow: a JSON-parse boundary (a runtime validator is
better), a documented library type bug, narrowing `unknown` from a generic.
Before committing, run `grep -n " as " <file>`.

**Never write code on an unverified data shape, API contract, or field path.**
Confirm every access path, store key, and response property against types,
schema, or existing usages first. A guessed nested path produces code that is
silently broken when the real shape differs. Where it can't be confirmed, stop
and ask — optional chaining is not a substitute for knowing. The same applies to
root-causing a bug: no guessing without evidence.

**Verify a helper's signature against its source and 2–3 real call sites.** A
type-alias name is a hint, not a contract — open it. One doc example is an
anecdote; find at least two more. This matters most before telling the user
their own code is wrong.

## Scope and footprint

Scope of action = scope of request, "extensible" means consumers choose, and a
ported file is copied verbatim rather than retyped. All three are standing
rules, stated in [`working-agreement.md`](../../../rules/working-agreement.md).
What follows is what they mean while writing code.

- **Prefer editing an existing file over creating a new one.**
- **No speculative abstractions.** Build what the task requires, not what it
  might one day need.
- **Reuse what a module, composable, hook, or config already exports.** Read its
  return value before deriving a new value or writing an inline loop.

## Check the library before building

Before writing a component, wrapper, or binding around an external library,
check the library's own source and types for a feature that already does the
job.

- **Read the installed source, not just the docs.** Open `node_modules/<lib>`.
  Docs lag, omit options, and miss internal helpers.
- **Search for the capability before authoring it.** Grep the library's exports
  and types for the callback, config flag, lifecycle hook, or primitive about to
  be built. Bind to what exists; wrap only what the library genuinely lacks.
- **Confirm every binding before building around it.** Each prop, event, ref, or
  option forwarded to the library must map to something it actually accepts.
  Options passed on a guess silently no-op.

The shape of this rule: wrapping an animation library means checking it for the
timeline, stagger, callback, or easing capability that already covers the need,
and wiring the wrapper to that — not hand-rolling logic the library ships.

## Code style

**Keep the render output declarative.** No conditional or ternary logic, no
complex inline data structures, no multi-line inline functions in the render
return or template. Derive them as named variables and handlers above the
return. Views call helpers and render; they don't decide conditions. Business
logic belongs in the composable, hook, or config.

Text interpolation is the most-missed case — a ternary picking a label is still
logic in the view:

```vue
<!-- ❌ -->
{{ submitting || localSubmitting ? 'Processing...' : 'Checkout' }}

<!-- ✅ -->
<script setup>
const checkoutLabel = computed(() => (isSubmitting.value ? "Processing..." : "Checkout"));
</script>
{{ checkoutLabel }}
```

Grep the template for `?` before finishing. Every hit is either a ternary to
extract or optional chaining to justify.

**One statement per line.** Never chain with semicolons (`a(); b(); c();`),
including in test setup and factories. Separate test blocks beat wide `it.each`
tuples, even with mild duplication.

**Route persistence through typed helpers with named constant keys.** Raw
storage calls with inline serialization scattered across features duplicate
fallback logic and introduce string-typing errors.

**Extract a helper when nesting reaches three levels.** Keep functions small and
focused; prefer early returns over pyramids of conditionals and loops.

**Prefer early returns when checking nullable or optional values**, rather than
wrapping the body in a positive conditional.

**Use awaits for sequential operations, not nested promise chains.** A
single-hop operation can use `.catch()`; multi-step sequences use awaits.

**Declare helpers and handlers before the effects or hooks that call them.**

**No error handling for scenarios that cannot happen**, and no stub to satisfy a
type where a runtime guard already covers the absent case. If a caller already
does `if (!thing) return`, an empty implementation adds nothing.

**Guards are exactly as specific as their intended scope.** Many instances can
render the same code path at once, and a loose condition fires across all of
them. Verify a condition matches only the intended instance or context, not just
the happy path.

**A per-item check does not constrain the whole.** Validating each element of a
collection in isolation leaves the aggregate unchecked: two entries of 2 both
pass a limit of 3, and 4 gets through. Where a collection is validated against a
shared budget — stock, quota, total, capacity, a rate — collapse it by key
first, then check the sum once.

```ts
// ❌ each line passes on its own
for (const line of lines) if (line.quantity > stockOf(line.id)) reject();

// ✅ check the demand, not the line
const demand = new Map();
for (const line of lines) demand.set(line.id, (demand.get(line.id) ?? 0) + line.quantity);
for (const [id, qty] of demand) if (qty > stockOf(id)) reject();
```

Before accepting any collection, ask what happens when the same entity appears
twice. Validate everything before mutating anything — a loop that validates and
writes in one pass leaves half-applied state when a later element fails.

**Use the project logger, minimally and strategically.** One well-placed log
with full context beats many scattered ones. Don't add `console.log` spam.
Conversely, existing logs that look intentional stay as they are — don't strip
them unless asked.

## Comments

**A comment states what the code does and why it is there, in one line.** What
survives is the non-obvious condition or domain fact the code cannot carry —
that a cache refresh is skipped inside a sandboxed build, not that the build
tool lacks a glob.

None of the following earn their place:

- execution mechanism, or an argument for the approach,
- "does not handle X" caveats,
- section banners,
- "Handles X" docstrings on obvious functions,
- change-log narration — git covers that,
- the rule being complied with (`// count and page share one filter`), which is
  noise the rule already covers.

Clearer names, smaller functions, and types are better than a comment at all.
Don't add comments, docstrings, or type annotations to code that wasn't changed;
clean up only the comments added in this change.

## Design-system fidelity

- **Never hardcode a value that has a named lookup.** Volatile values change
  between environments; named keys are stable. Use the slug or registry that
  maps a stable key to the volatile id.
- **Use non-deprecated design tokens.** Don't introduce new deprecated-token
  usages; leave pre-existing ones in untouched code alone, since scope of action
  = scope of request.
- **Derive theme-aware colours from the theme selectors** as named vars before
  the return.
- **Secondary and help text meets WCAG AA contrast.** Use a theme-aware grey,
  not a low-contrast token that fails AA.
- **Keep the typographic scale consistent.** No off-scale one-offs; body copy
  stays uniform across screens.
- **Never alter a design token's value to achieve a visual tweak on one screen.**
  That silently shifts every usage. Adjust at the call site, or extend the scale.
