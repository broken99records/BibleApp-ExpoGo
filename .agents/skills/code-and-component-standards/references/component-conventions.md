# Component conventions — Vue reference stack

These patterns are expressed in Vue + Tailwind + a headless UI primitive
library, as the worked example of the [universal
principles](./coding-principles.md). In another stack, keep the intent —
caller-overridable styling, strict declaration order, business logic out of the
view, native-semantic accessibility — and map the mechanics to that stack's
idioms.

The bar for "extensible": **a reusable component owns its look, but lets every
caller override any part of it.**

## Naming and layout

A compound component — one that is really several files — gets its own folder:
an `Index.vue` entry, its siblings, and a co-located `use<Thing>.ts` composable.

```
<Thing>/{Index.vue,<Part>.vue,use<Thing>.ts}
```

Pick the smallest structure that fits. A one-file component does not get a
folder.

**Extract a component when any of these is true**, rather than leaving the
markup inline in a page:

- the same markup appears in two places,
- a page's template runs past roughly one screen,
- a region owns its own state, or is repeated in a `v-for` with more than a
  couple of elements inside it,
- a region is the natural unit a caller would want to restyle.

Building a whole app out of pages alone is the failure mode here. It is invisible
in review — every page works — and it means nothing in this file's
caller-override pattern ever applies.

## File skeleton and declaration order

`<script setup lang="ts">` first and `<template>` first both appear in
codebases. Match the file being edited; for a new file, lead with `<script
setup lang="ts">`. The order inside is strict:

```vue
<script setup lang="ts">
import type { ClassValue } from "clsx";        // 1. type imports
import { SomePrimitive } from "@ui-lib";       //    + runtime imports

defineOptions({ inheritAttrs: false });        // 2. defineOptions (only when forwarding $attrs manually)

const StyleVariants = { /* ... */ } as const;  // 3. module-level style maps

export type ThingProps = { /* ... */ };        // 4. exported prop/variant types

const emit = defineEmits([...]);               // 5. emits
const props = withDefaults(defineProps<ThingProps>(), { /* ... */ }); // 6. props

const { variant, disabled } = toRefs(props);   // 7. refs derived from props
const modelValue = /* writable computed over props.modelValue */;      // 8. binding
// 9. composables → local refs → computeds → handlers → watchers → defineExpose → lifecycle
</script>
```

Respect the top-to-bottom flow:

- **Nothing goes between `defineProps` and the `toRef(s)(props)` lines.** The
  refs belong immediately after props.
- New refs go near the other refs, handlers near handlers, watchers in the
  watchers section. The same holds for template attributes and handlers — group
  them with similar ones.
- If a file mixes orderings, match its most common one.

## Props: the class-override pattern

This is the single most important component convention. A reusable component
must let callers restyle it without forking. Every visually distinct element
exposes a `*Class` prop, typed `ClassValue` and defaulting to `""`, and the
template merges defaults with caller classes through `cn()`:

**This applies to reusable components — the ones placed in more than one context,
or repeated in a list.** A singular layout block with exactly one call site — an
app header, a page shell, a page's own summary panel — does not need an override
surface, and adding one to every such block is ceremony, not extensibility. The
test is whether a second caller could plausibly want it to look different.

```vue
<template>
  <div
    :class="cn([
      StyleVariants[variant].base,   // component's own defaults
      active && StyleVariants[variant].active,
      wrapperClass,                  // caller override, wins via tailwind-merge
      active && activeClass,
    ])"
  >
```

`cn` is `twMerge(clsx(...))` — later classes beat earlier ones, so caller
overrides win naturally.

Follow the codebase's existing `*Class` prop names so callers already know them.
Grep a few sibling components before inventing one. The usual shapes are a
whole-component override, a `<part>Class` per named region, and state-paired
names such as `activeClass` / `inactiveClass`.

## Opt-out toggles: variants stay variants, toggles stay toggles

For an opt-out style toggle, extract the toggleable tokens into their own
constant and include it conditionally in the `cn([...])` array:

```ts
const BASE_SPACING = "px-3 py-2";
// ...
:class="cn([ base, !disableSpacing && BASE_SPACING, extraClass ])"
```

A consumer's own class then wins naturally through tailwind-merge order. Two
things to avoid:

- **`!important`.** `!px-0 !py-0` blocks every downstream override from setting
  its own padding.
- **A parallel `baseNoSpacing` variant.** It pollutes the user-facing variant
  set.

## Style maps over inline class soup

Variant styling lives in a `const` object literal at module scope (`as const`),
keyed by variant — not hardcoded inline. This keeps logic out of the template
and makes the variants enumerable as a type:

```ts
const ButtonStyle = {
  base: "rounded-full ...",
  standard: "font-bold ...",
  alternate: "border ...",
} as const;

export type ButtonVariant = keyof typeof ButtonStyle | "unstyled";
```

Derive the variant type from the map with `keyof typeof`, so adding a key
extends the type for free. Split long strings with `+` concatenation. Nested
state maps (`{ root: { base, states: { active, inactive } } }`) are fine for
multi-part components. Use design tokens, and always pair a light class with its
`dark:` variant.

## Props definition rules

- Always `withDefaults(defineProps<...Props>(), { ... })`. Export the props type
  where callers need it.
- Default every `*Class` prop to `""`, and every optional object or array to
  `undefined` (or a factory, `() => ({})`).
- Use a discriminated union where options are mutually exclusive — e.g.
  `{ variant } | { variant: "unstyled"; variants: [...] }`.
- Derive working refs immediately after the props block: `toRef(props, "x")` for
  one, `const { a, b } = toRefs(props)` for several.
- Don't cast to silence TS. Type the data properly — see
  [Typing](./coding-principles.md#typing).

## Two-way binding

Three patterns, by component kind:

1. **Single `v-model`** — a writable computed over `props.modelValue` that emits
   `update:modelValue` on write, via the codebase's sync-prop helper. Declare
   `defineEmits(["update:modelValue"])`.
2. **Custom-named model** (e.g. `enabled`) — emit `update:<name>` explicitly,
   plus a paired event (`changed` / `clicked`).
3. **Form elements** — the codebase's form-element helper, taking the main prop,
   the model, and the emit. Initialize it and spread its emits; it returns input
   listeners to bind with `v-on`, and model state.

**Don't over-engineer binding that already works.** A working `ref` + `v-model`
+ watch-writeback does not get restructured into a computed `get`/`set` (plus a
cast) unless asked.

## `$attrs` forwarding

Where the public-facing element isn't the root — a modal dialog, an input, a
button — set `defineOptions({ inheritAttrs: false })` and `v-bind="$attrs"` onto
the real target, so callers' native attributes (`type`, `placeholder`, `aria-*`,
listeners) land where expected.

Where a component already forwards `$attrs`, pass attributes directly rather
than adding a redundant pass-through prop. A modal that forwards `$attrs` to its
dialog does not need an `ariaLabelledBy` prop.

## Slots

- Default slot for content, with a sensible fallback:
  `<slot>{{ submitText }}</slot>`.
- Guard optional slots: `<slot v-if="$slots?.default" />`.
- Named slots for swappable regions (`left` / `right`, `loading`,
  `wrapper-left` / `outside-top`).
- Expose scope where the caller needs internal state:
  `<slot name="right" :invalidated="invalidated" :disabled="disabled" />`,
  `<slot :close="closeModal" />`.

## Accessibility

- **Prefer native semantic elements over ARIA-roled generics.**
  `<button class="as-link">` beats `<a role="button">` — native buttons are
  keyboard-accessible without `tabindex` or `keydown`. Clickable controls are a
  real `<button type="button">`, never a clickable `<div>`. Icon-only buttons
  get an `aria-label`.
- **Drive ARIA off state:** `:aria-busy`, `:aria-invalid`, `:aria-disabled`,
  `:aria-errormessage` pointing at a `useId()`-derived id.
- **Don't duplicate ARIA references or grouping semantics.** A dialog with
  `aria-labelledby` doesn't need an inner `fieldset` re-pointing at the same
  heading, and a group already named by a heading doesn't need a `<legend>` —
  wrap in `<form>` for structure instead. Let `$attrs` carry caller-supplied
  aria refs.
- **Keep visually-hidden form controls focusable.** The parent `<label>` of an
  `sr-only` radio needs `position: relative` so the absolutely-positioned input
  stays in bounds. Use `:has(input:focus-visible)` or `focus-within` on the
  label for a visible focus ring.

## Scoped SCSS (BEM block)

Styles go in `<style lang="scss" scoped>`; drop `scoped` only deliberately, for
global animation cases. Use a BEM block matching the root class, `@apply` for
Tailwind utilities, and `&__el` / `&--modifier` nesting:

```scss
.thing {
  @apply relative max-w-fit;

  &--active { @apply border-accent; }
  &__indicator { @apply absolute rounded-full flex items-center justify-center; }
}
```

Structural and animation CSS — keyframes, `@property`, `clip-path`,
`transition-property` — belongs here. Themeable utility classes stay in the JS
style maps, where callers can override them. Use `:deep()` to reach into child
component internals.

## Comments in a component

The general comment rules are in
[coding-principles](./coding-principles.md#comments) and apply to `.vue` files
unchanged. Two of them are missed in components specifically, so they are
restated here.

**No banner comments in the template.** `<!-- Logo -->`, `<!-- Loading state -->`,
`<!-- Card actions -->`, `<!-- Filters -->` — all noise. The element, its class,
and its `v-if` already say what the block is.

```vue
<!-- ❌ -->
<!-- Loading state -->
<div v-if="isPending" class="empty-state">

<!-- ✅ -->
<div v-if="isPending" class="empty-state">
```

The same applies to numbered section banners in `<script setup>` —
`// 1. Composables`, `// 2. Refs`, `// 3. Computed` — which restate the
declaration order this file already mandates.

**Never comment the rule being complied with.** A comment saying
`// Collapse demand by SKU before checking the budget` or
`// Storage keys as named constants` documents the convention, not the code. The
convention is in this skill; the reader does not need it repeated at every site
that follows it.

## Vue-specific checks

The stack-neutral gate is
[`checklist.md`](./checklist.md). These are the mechanics that only mean
anything in this stack, with the greps that express them here. In another stack,
run the equivalent for that stack instead — the constraint carries, the syntax
does not.

- `<script setup>` ordered: imports → defineOptions → style maps → types →
  emits → props → refs → composables → logic.
- Nothing wedged between `defineProps` and `toRefs`.
- Caller overrides merged with `cn()`, caller classes last.
- Variant map declared `as const`; variant type via `keyof typeof`.
- Light classes paired with their `dark:` variant.
- Binding via the codebase's sync-prop helper, a custom `update:*`, or the
  form-element helper. Working binding left as-is.
- `$attrs` forwarded with `inheritAttrs: false` where the public element isn't
  the root.
- Ids from `useId()`; no duplicated ARIA references.
- Scoped SCSS BEM block: structural CSS in SCSS, themeable utilities in the
  style maps.

```bash
grep ':class="\[' <file>      # inline class array — should return nothing
grep ':class="{' <file>       # inline class object — should return nothing
grep ':style="' <file>        # inline style object — should return nothing
grep 'style="' <file>         # hardcoded inline style — should return nothing
grep '?' <file>               # in the template region: every hit is a ternary to extract
grep '<!--' <file>            # banner comments in the template
```

## Icons

Reference icons through the codebase's icon provider component, which resolves a
string key to the icon. For a small local map, import a specific `*Icon.vue` and
render it through `<component :is="...">`.
