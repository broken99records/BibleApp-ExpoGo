# Writing voice

Applies to docs, dev notes, release notes, changelogs, MR titles, and MR
descriptions. Code comments have their own, stricter rules — see
[code-and-component-standards](../skills/code-and-component-standards/references/coding-principles.md).

## No narrator voice

Body copy describes the thing, not the reader. Strip "you", "we", "please",
"reach for", "if you're…", "action item:".

- "Preferred over X" — not "use this instead of X".
- "For Y cases" — not "reach for this when Y".

Headers may be imperative. Body copy stays declarative and third-person about the
artifact.

## No editorialising

- No bold-title framing on bullets.
- No hype, no marketing language, no over-promising.
- No "revolutionary", "awesome", "blazing".

## Every claim is grounded in source

When documenting an API, a composable, or a utility, every row is read out of the
implementation — not inferred, not pattern-matched, not "probably".

- **Read the source for every claim.** Grep the symbol in the implementation and
  in its consumers. One symbol, one source check.
- **Describe behaviour, not intent.** "Fired by `applyFilters`; existing callers
  pass `() => {}`" — not "used to refetch the page's data".
- **Never add a helpful-sounding warning without verifying it.** Where a
  constraint is asserted, the source must enforce it.
- **Don't document sections the codebase doesn't have.** No Testing section where
  tests aren't committed.
- **Don't put unrelated concerns in a doc about X.**
- **When one wrong claim is caught, audit the whole document line-by-line against
  source** before re-asking for approval. Don't fix one row and hope.
- **Fetch reference and API documentation from canonical sources.** Never author
  API definitions from memory. High-level overviews and structure are fine to
  write; technical specifications are retrieved directly.

## Changelogs

Verify every entry against the base branch. Never infer from the diff surface.

- **A `+` diff line does not mean a new symbol.** A modified line also shows as
  `+`. Confirm with `git show <base>:<file> | grep "<symbol>"` before any
  **Added** bullet.
- **A feature-flag flip whose gated code already exists is Changed, not Added**
  ("Enabled X").
- **Same-batch rule:** a "Fixed" or "Removed" entry is valid only where the thing
  existed on the base branch before this batch.
- **One feature = one bullet.** Don't fragment across storage, page, and detail
  layers. Name the right kind of thing — an action is not an endpoint is not a
  composable.

Where a project splits technical and user-facing changelogs:

- **Technical:** developers are the audience. Concrete, backticked symbols,
  implementation detail, outcome-focused. Sections `Added` / `Changed` / `Fixed`
  / `Removed` / `Deprecated`.
- **User-facing:** no library names, no SDK upgrades, no architecture jargon.
  Never imply something was broken — "improved", not "fixed" or "restored".
  Never frame an existing feature as new. One line per item.

**Don't update changelog files until explicitly asked.** Finish the code, then
mention that changelogs are pending.
