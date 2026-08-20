---
name: react-native-conventions
description: How I prefer React Native / Expo code to be written — JSX structure, theming and design tokens, accessibility, navigation, logging, and testing. Drop into any RN or Expo project so an agent writes screens and components the way I do. Use when writing or reviewing React Native code, building screens or shared UI, styling with theme tokens, or setting up Jest for Expo.
---

# React Native conventions

React Native and Expo standards. These build on
[code-and-component-standards](../code-and-component-standards/SKILL.md) — the
universal principles (verify before writing, minimal footprint, no speculative
abstractions, minimal comments) apply here unchanged. This skill covers what is
specific to the RN stack.

One idea runs through all of it: **the render return is declarative markup, and
everything else happens above it.**

## How to use this skill

Load the reference that fits the task, then run
[`references/checklist.md`](./references/checklist.md) before finishing.

| Task | Reference |
| --- | --- |
| Writing or reviewing any screen or component | [`jsx-and-structure.md`](./references/jsx-and-structure.md) |
| Styling, theming, or accessibility work | [`styling-and-theming.md`](./references/styling-and-theming.md) |
| Setting up or debugging Jest | [`testing-expo.md`](./references/testing-expo.md) |

## The non-negotiables

**Structure**

- **Nothing but markup in the return.** No ternaries, no conditional strings, no
  inline arrays or objects, no multi-line inline handlers. Derive every one as a
  named `const` or handler above the return.
- **Inline arrow props are one trivial call, or they get extracted.**
  `onPress={() => setOpen(false)}` is fine; anything with a second statement, a
  branch, or a side effect becomes a named handler.
- **Search for an existing hook before writing state.** Form values, validation,
  submission, pagination, and selection usually already have one. Reading it and
  then re-implementing it anyway is the failure mode.
- **Shared screen layouts own their shell.** A settings or detail screen takes a
  title plus children from the shared layout. It does not re-implement the safe
  area, header, or scroll container.
- **Mount-related side effects are guarded.** Where a navigator keeps several
  screens mounted at once, guard every screen-specific effect against the active
  screen — otherwise it fires once per mounted instance.

**Theming**

- **Non-deprecated design tokens only.** Read the token module for `@deprecated`
  markers before reaching for a name. Never introduce a new usage of a deprecated
  alias.
- **Theme-dependent values are derived as named vars above the return**, off the
  project's theme selector — never computed inline in a style prop.
- **No colour inside `StyleSheet.create`.** A static stylesheet can't react to
  the theme, so a hex there is wrong in one mode by definition. Structure in the
  stylesheet, colour derived above the return.
- **Secondary and help text meets WCAG AA contrast** on both themes. A mid-grey
  that fails AA on light and dark is not an option.
- **One typographic scale.** Help and secondary copy sit at body size;
  subordinate copy is made subordinate by colour, not by shrinking it.

**Everything else**

- **No banner comments.** `// Handlers`, `// Derived values` and friends restate
  the convention and earn nothing.
- **The project logger, minimally.** One well-placed log with full context beats
  scattered `console.log` calls. Never strip existing logs.

Full detail and rationale in the reference files.
