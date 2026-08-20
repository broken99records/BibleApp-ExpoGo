# Checklist before finishing — React Native

## Render return

- No ternary, conditional string, or conditional template literal inside JSX.
- No inline array or object literal passed as a prop, including inside `.map()`
  and derived views. (`grep 'style={\[' <file>` and `grep 'style={{' <file>`
  both return nothing.)
- Every inline arrow prop is a single trivial call; anything longer is a named
  handler.
- No comments in JSX, except for genuinely non-obvious logic.
- No banner comments anywhere in the file (`// Handlers`, `// Derived Values`,
  `// Styles`).

## Structure

- The source tree was searched for an existing hook before the first `useState`.
  (`grep -ri "use<Feature>"`)
- Where such a hook exists it is used, not re-implemented alongside.
- New declarations sit in the file's existing section — refs with refs, handlers
  with handlers, effects with effects.
- The screen uses the shared layout component rather than re-implementing the
  safe area, header, or scroll container.
- Every screen-specific side effect is guarded against the active screen where
  the navigator keeps screens mounted.
- Platform-specific guards retained, even for platforms not currently shipped.
- Permission prompts and status queries fire only on explicit user action.

## Theming

- No newly introduced deprecated token usage. (Grep the token module for
  `@deprecated` and check each name used.)
- Theme-dependent colours derived as named vars above the return, never inline
  in a style prop.
- No colour inside `StyleSheet.create`. (`grep '#' <file>`)
- That includes secondary controls — remove and cancel buttons, chips, badges,
  dividers.
- Secondary and help text verified against WCAG AA on both light and dark.
- Help and secondary copy at the same type size as body text; no off-scale
  one-offs.
- Directional shadow uses `shadowOffset.height` > `shadowRadius`, with no
  `elevation`.
- Dark mode uses a hairline border rather than a shadow.

## Diff quality

- Smallest non-hacky change.
- No wrapper views or magic-number widths where a flex or alignment tweak
  suffices.
- Full computed style chain traced before any tag swap or wrapper removal.
- Centring and spacing re-added wherever the removed wrapper provided it.
- No edits to consumers or adjacent files that were not requested.

## Accessibility

- Real interactive primitives, not tappable plain views.
- Icon-only controls labelled.
- Accessibility state driven off real state.
- No duplicated accessibility references.

## Logging and tests

- Project logger used, not `console.log`; existing logs left in place.
- Global mocks limited to native modules with no JS fallback.
- `waitFor` wraps assertions; `render()` is not wrapped in `act`.
- Fixtures committed to the repo, not read from a build cache.
- One statement per line, including in test setup.
