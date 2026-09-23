---
name: code-and-component-standards
description: How I prefer code and UI components to be written. Drop this into any project so an agent writes/reviews code and builds components the way I do. Use when authoring or reviewing code, especially building reusable/UI components, wrapping an external library, or matching an existing codebase's style.
---

# Code and component standards

A personal engineering style, meant to drop into any project. Two ideas run
through everything:

1. **Write for the task at hand, on verified facts, with the smallest
   footprint.** No guessing, no speculative abstractions, no edits beyond the
   request.
2. **A reusable component owns its look, but lets every caller override any part
   of it.** That is the bar for "extensible".

The **universal principles** are binding everywhere. The **component
conventions** are the concrete shape those principles take in one stack — Vue is
the worked example, and the intent carries into any other stack.

## How to use this skill

Load the reference that fits the task, then run
[`references/checklist.md`](./references/checklist.md) before finishing.

| Task | Reference |
| --- | --- |
| Writing or reviewing any code | [`coding-principles.md`](./references/coding-principles.md) — typing, scope and footprint, checking a library before building, code style, comments, design-system fidelity |
| Building, extending, or styling a UI component | also [`component-conventions.md`](./references/component-conventions.md) — declaration order, class-override pattern, style maps, props, binding, `$attrs`, slots, accessibility, SCSS, icons |
| Working in React Native or Expo | [`react-native-conventions`](../react-native-conventions/SKILL.md) for the stack specifics; the principles here still apply unchanged |

The workflow around the code — when to act, when to verify, when to commit —
lives in [`.agents/rules/`](../../rules/), not here.

## The non-negotiables

- **Verify before writing.** Confirm data shapes, helper signatures, and library
  APIs against source plus two or three real usages. Never code on a guess.
- **Check the library first.** Before wrapping an external library, read its
  source and types for a feature that already does the job.
- **No cast to paper over a type**, no speculative abstractions, no edits beyond
  the request's scope.
- **Nothing but markup in the template.** No ternary — including one picking a
  label inside `{{ }}` — no inline class array or style object, no multi-line
  inline handler. Each is a named value declared above the template.
- **No banner comments** (`<!-- Logo -->`, `// 1. Composables`), and never a
  comment stating the rule being complied with. Comments carry the *why*, or
  they don't exist.
- **One statement per line**; guards exactly as specific as their scope.
- **Reusable components are caller-overridable.** Every distinct region of one
  gets a `*Class` override; singular one-call-site layout blocks are exempt.
  Variants stay variants and toggles stay toggles — never `!important`.
- **Design-system fidelity.** Named lookups over hardcoded values, non-deprecated
  tokens, AA-contrast text, on-scale typography.
- **Native-semantic accessibility.** Real elements over ARIA-roled generics, ARIA
  driven by state, no duplicated refs.

Full detail and rationale live in the reference files above.
