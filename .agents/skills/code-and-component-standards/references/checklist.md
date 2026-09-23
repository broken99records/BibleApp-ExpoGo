# Checklist before finishing

Every item is stack-neutral. Where an item says to grep, work out the pattern
that expresses it in the stack at hand and run that — the check is the
constraint, not any one syntax. An item whose grep cannot match the language
being written has not passed; it has not been run.

## Typing and footprint

- No cast used to silence the type checker.
- Literal arrays use a named element type, not a per-entry cast.
- Every data path and helper signature confirmed against source plus real
  usages. Nothing written on a guessed shape.
- The external library's source and types checked for an existing feature before
  a wrapper was built.
- Every binding forwarded to that library confirmed against its API.
- Existing files edited where possible; no speculative abstractions.
- No consumer customization deleted outside the request's scope.

## Code style

- No conditional, complex, or inline logic in the rendered output.
- No ternary in the markup, including where text is interpolated. Grep the
  markup region for the stack's conditional operators; every hit is logic to
  extract or an optional access to justify.
- No inline class list or style object built inside a binding. Grep the stack's
  class and style binding syntax; all return nothing.
- No banner comments. Grep the stack's markup comment syntax, and numbered
  section comments in code.
- No comment restating a rule from this skill.
- Business logic lives in the module the stack uses for it, not in the view.
- One statement per line.
- Comments state intent or why in one line, never mechanism.
- Storage and persistence routed through typed helpers with named constant keys.
- Helpers extracted where nesting reaches three levels.
- Sequential async operations use step-by-step awaits, not nested `.then()`.
- Early returns used instead of positive conditionals when checking nullables.
- Helpers declared before the effects or hooks that call them.
- No error handling for impossible cases.
- Guards are exactly as specific as their scope.
- Collections validated against a shared budget are collapsed by key, then
  checked once — no per-item check standing in for the aggregate.
- Project logger used rather than `console.log` spam; existing intentional logs
  left in place.
- No design token value altered to achieve a visual tweak on one screen.

## Components

- A region that repeats, or appears in more than one context, is a component —
  not markup left inline in a page.
- Every distinct visual region of a *reusable* component takes a class override
  from the caller, merged so the caller's classes win. Singular one-call-site
  layout blocks are exempt.
- Opt-outs are token-constant toggles, never a forced-priority declaration and
  never a parallel variant.
- Variant styles live in one constant map; the variant type is derived from that
  map rather than written out again.
- Design tokens used, each paired with its dark-mode counterpart.
- Help text meets AA contrast; type sizes are on-scale.
- Declarations follow the file's existing order; nothing wedged between
  declarations the stack expects to sit together.
- Attributes the caller sets reach the element they are meant for; no redundant
  pass-through prop duplicating what the stack already forwards.
- Native semantic elements used, accessibility state driven by real state,
  generated ids, no duplicated accessibility references, visually hidden
  controls still focusable.
- Structural styles live in the stack's style layer; themeable utilities stay
  where a caller can override them.

Stack-specific mechanics — the exact declaration order, the binding helper, the
attribute-forwarding switch, the style syntax — are in
[component-conventions.md](./component-conventions.md) for the Vue worked
example, and in the stack's own skill where one exists.
