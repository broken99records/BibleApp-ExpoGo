# Styling, theming, and accessibility

## Design tokens

- **Read the token module before using a name.** Token modules accumulate
  deprecated aliases — an old export kept as an alias of the current one, a
  colour renamed, a literal name superseded by a semantic one. Check for
  `@deprecated` JSDoc first.
- **Never introduce a new usage of a deprecated token.**
- **Leave pre-existing deprecated usages in untouched code alone.** Scope of
  action = scope of request; clean them up only when asked.
- **Never hardcode a value that has a named lookup.** Where a map resolves a
  stable key to a volatile value, use it.

## Theme-dependent values

Derive theme-dependent colours as named variables above the return, off the
project's theme selector:

```tsx
const colors = selectColors(isDark);
const helpTextColor = isDark ? colors.textMutedDark : colors.textMutedLight;
```

Never compute a theme branch inline inside a style prop — that is conditional
logic in the render return.

## Contrast

**Secondary and help text must meet WCAG AA contrast on both themes.** A single
mid-grey token typically fails AA on light *and* dark; use a theme-aware pair
instead. Verify the actual ratio rather than assuming the token was chosen for
contrast.

## Typographic scale

Keep one scale, taken from the project's type tokens.

**Help and secondary text sit at the same size as body text** — including notes,
empty-state copy, and anything under a total or field. Don't drop help text a
step to make it look subordinate: subordinate is the *colour's* job, not the
size's.

Don't introduce an off-scale one-off because it looks better in one place. That
is how the scale erodes.

## Every colour goes through the theme

**No hardcoded hex in a `StyleSheet.create` block.** A static stylesheet cannot
react to the theme, so any colour placed there is wrong in one mode by
definition — most often a light-grey control that vanishes on a dark background.

Structural values — spacing, radii, border widths, flex — belong in the
stylesheet. Colours are derived above the return and merged in:

```tsx
// ❌ invisible in dark mode
const styles = StyleSheet.create({
  removeButton: { backgroundColor: "#E2E8F0" },
  removeButtonText: { color: "#4A5568" },
});

// ✅
const removeButtonStyle = [styles.removeButton, { backgroundColor: colors.surfaceMuted }];
const removeButtonTextStyle = [styles.removeButtonText, { color: secondaryTextColor }];
```

This applies to every secondary control — remove and cancel buttons, chips,
badges, dividers, banners. Auditing a screen for theme correctness means
grepping its stylesheet for `#` and finding nothing.

## Shadows

- **Bottom-only shadow:** set `shadowOffset.height` greater than `shadowRadius`
  and omit `elevation`. Android's `elevation` casts a shadow on all sides, so
  including it defeats a directional shadow.
- **Shadows are invisible on dark surfaces.** Use a hairline bottom border in
  dark mode instead of a shadow that renders as nothing.

## Layout changes

**Prefer the smallest non-hacky diff.** Before editing, ask what the smallest
change is that fixes the root cause without a hack.

- For row layouts, adjust `flex` and alignment on existing elements — e.g.
  `flex: 1` on both side controls to keep a centre element centred.
- **Don't introduce wrapper views or magic-number fixed widths** where a flex or
  alignment tweak does the job. Both add maintenance surface, and magic numbers
  are brittle.
- Reuse props the component already forwards.

**Trace the full computed style chain before changing any style-bearing
element** — a tag swap, a moved or removed wrapper, a class change. That means
base styles, platform defaults for both the old and new element, responsive and
dark variants, and any centring or spacing the removed wrapper was providing.
Confirm the result resolves identically at every breakpoint and in both colour
schemes. Removing a centring wrapper usually means re-adding the centring
somewhere else.

## Accessibility

- **Use the real interactive primitive.** A touchable is a button, never a
  tappable plain view. Icon-only controls get an accessibility label.
- **Drive accessibility state off actual state** — busy, disabled, invalid,
  selected — rather than hardcoding it.
- **Don't duplicate accessibility references.** Where a container is already
  labelled by a heading, an inner grouping element doesn't re-point at the same
  heading.
- **Keep visually-hidden controls focusable.** A hidden-but-present control must
  stay within its parent's bounds so it can still receive focus.
