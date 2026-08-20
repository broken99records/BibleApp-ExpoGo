# JSX and component structure

## The return is markup only

The render return renders. It does not decide, compute, or transform. Everything
it needs is a named value declared above it.

### No conditional or ternary logic inline in JSX

Derive it as a named variable before the return.

```tsx
// ❌
<Text style={isDark ? styles.textDark : styles.textLight}>
  {count > 0 ? `${count} unread` : "All caught up"}
</Text>

// ✅
const textStyle = isDark ? styles.textDark : styles.textLight;
const summary = count > 0 ? `${count} unread` : "All caught up";

<Text style={textStyle}>{summary}</Text>
```

### No inline complex data structures

Arrays and objects passed as props are derived above the return — including
style arrays with more than a token or two.

This holds for every element, including ones nested deep in a derived view or
inside a `.map()`. A single leftover `style={[styles.x, { color }]}` is the usual
survivor of an otherwise clean refactor:

```tsx
// ❌ still an inline array, however small
<Text style={[styles.checkoutButtonText, { color: colors.white }]}>Checkout</Text>

// ✅
const checkoutButtonTextStyle = [styles.checkoutButtonText, { color: colors.white }];

<Text style={checkoutButtonTextStyle}>Checkout</Text>
```

Before finishing, grep the file for `style={[` and `style={{`. Both should
return nothing.

### No multi-line logic inside inline function props

An inline arrow is acceptable only when its body is a single trivial call.

```tsx
// ❌
<Pressable
  onPress={() => {
    setOpen(false);
    setValue(null);
    logger.info("Closed modal");
  }}>

// ✅
const handleClose = () => {
  setOpen(false);
  setValue(null);
  logger.info("Closed modal");
};

<Pressable onPress={handleClose}>

// ✅ trivial inline is fine
<Pressable onPress={() => setOpen(false)}>
```

Extract a handler when it:

- contains conditional logic (if/else, ternary chains),
- updates more than one piece of state,
- calls other functions or performs side effects,
- would carry a comment explaining what it does,
- or runs past ~60 characters on one line.

### No comments in JSX

Unless the logic is genuinely non-obvious.

## Look for the hook before writing state

**Before adding `useState`, search the project for a hook that already owns this
state.** A screen managing form values, validation errors, submission status,
pagination, or selection is very often re-implementing something the codebase
already exports.

```tsx
// ❌ nine useState calls and a hand-rolled email regex, next to a
//    useCheckoutForm.ts that already returns values/errors/isSubmitting/submit
const [email, setEmail] = useState("");
const [emailError, setEmailError] = useState("");
// …

// ✅
const { values, errors, isSubmitting, isValid, setField, submit } = useCheckoutForm();
```

Reading the hook and then writing another version anyway is the failure mode.
Finding it is not enough — it has to be used. Where the existing hook genuinely
doesn't fit, say why and ask before duplicating it.

Check the project's hooks directory and any barrel near the feature. Grep the
source tree for `use<Feature>` before the first `useState`.

## Declaration order

Read enough of the surrounding file to identify its existing ordering before
inserting anything. New refs go near the other refs, handlers near the other
handlers, effects in the effects section. Don't park a declaration at the first
convenient line just because it sits near a related one.

The usual top-to-bottom flow:

```
imports
  → types
  → constants / style maps
  → props destructure
  → context + store hooks
  → local state (useState / useRef)
  → derived values (useMemo, plain consts)
  → handlers
  → effects
  → early returns
  → return
```

If a file mixes orderings, match its most common one rather than introducing a
new one. The same rule applies inside the markup: group new props and handlers
with similar ones instead of wedging them between unrelated lines.

## Shared layouts and navigation

- **Screens of the same class share a layout component.** Where a settings or
  detail layout exists, pass it a title plus children. It owns the safe-area
  shell, the header, and the scroll container; no screen re-implements those.
- **Back navigation uses the platform icon set's chevron**, in the theme's
  primary colour, wrapped in the project's pressable-feedback component. A
  hardcoded-colour SVG asset is wrong where the icon must follow the theme.

## Simultaneously mounted screens

Tab and stack navigators are frequently configured to keep every screen mounted
at once (`lazy: false`) for smooth switching. Every mounted instance runs its
effects.

Guard every screen-specific action against the active screen:

```tsx
if (screenMode !== currentMode) return;
```

Without the guard, a shared action fires once per mounted instance — a fetch
triggered on three mounted tabs fires three times. This applies to load-more
handlers, search resets, focus effects, and anything else calling into shared
state.

See also: guards are exactly as specific as their intended scope, in
[coding-principles](../../code-and-component-standards/references/coding-principles.md).

## Comments

Default to none. The sections above are structural conventions, not headings to
label.

**No banner comments.** `// Handlers`, `// Derived Values`, `// Styles derived
above the return`, `// ---- state ----` — all noise. The declarations already say
what they are, and a comment restating the convention adds nothing a reader
can't see.

```tsx
// ❌
// Theme-dependent colors derived above the return
const textColor = isDark ? colors.textOnDark : colors.textOnLight;

// ✅
const textColor = isDark ? colors.textOnDark : colors.textOnLight;
```

A comment earns its place only by stating a non-obvious condition or domain fact
the code cannot — never the tooling mechanism, never the rule being followed,
never the product outcome.

## Platform guards

Keep platform guards even for platforms not currently shipped. Development
builds and unintended execution paths can still reach this code.

## Permission prompts

Fire operating-system permission prompts only from direct user actions. Never
trigger a prompt or query an API during a component mount or in a side effect.
Persisted onboarding state is the source of truth.

---

The general code rules — no speculative abstractions, no error handling for
impossible cases, no comments or annotations added to untouched code, editing
existing files over creating new ones — are in
[coding-principles](../../code-and-component-standards/references/coding-principles.md)
and apply here unchanged.
