# Search screen

Specification for the Search tab, which currently renders the page shell and a
single heading. Nothing described here is implemented.

## Available data

Measured against `project/utils/bibleData.ts` as it stands:

| | Count |
| --- | --- |
| Books | 66 |
| Chapters | 1189 |
| Verses | 31,098 |

Every chapter carries real text. The `generateMockVerses` fallback in
`getChapterVerses` is unreachable with the current data.

A full case-insensitive substring scan across all 31,098 verses takes ~7ms on
the development machine. Six consecutive scans measured 45ms total.

## Structure

Top to bottom:

1. `SearchField` from `project/components/SearchField.tsx`, autofocused, inside
   the `PageLayout` shell.
2. Empty state, shown while the query is blank.
3. Results, in two sections — books, then verses.
4. No-match state.

### Empty state

A row of suggested terms, tappable, each setting the query. Terms are a fixed
list in source; no history is stored.

Hit counts against the bundled text, for choosing the list:

| Term | Verses |
| --- | --- |
| love | 578 |
| light | 414 |
| faith | 367 |
| mercy | 137 |
| shepherd | 99 |
| forgiveness | 7 |

`forgiveness` is a poor suggestion at 7 hits — this translation favours
`forgive` and `pardon`.

### Book results

Books whose name contains the query, matched case-insensitively, rendered as
`ListRow` with the chapter count as subtitle. Selecting one opens
`/(tabs)/bible/books/[book]`.

Omitted entirely when nothing matches, rather than shown as an empty section.

### Verse results

`ListRow` per verse: the reference as title, the verse text as subtitle, capped
at two lines. Selecting one sets the reference through `ReaderIntentContext` and
navigates to the reader, matching how the books pages already hand a reference
over.

Capped at 100 rendered results. Where the cap applies, the total is stated
above the list — "218 matches, showing the first 100" — rather than silently
truncating.

### No-match state

A single line naming the term searched for. No illustration.

## Matching

- Case-insensitive substring match over verse text.
- Substring matching means `love` also matches `beloved`. Word-boundary
  matching is the alternative and costs a regex per verse.
- No stemming, no synonyms, no ranking. Results appear in canonical book order.

## Performance

Input is debounced 200ms before a scan runs. At ~7ms per scan the debounce
exists to avoid scanning mid-word, not to avoid a stall.

The verse list is flattened once, lazily, on first search and held for the
process lifetime.

## Accessibility

- The search field carries an explicit label naming what is searched.
- The result count is rendered as text, so it is reachable by a screen reader
  rather than being conveyed only by list length.
- Rows are buttons and announce their reference.

## Deferred

Ranking by relevance, highlighting the matched span within the subtitle, search
history, and filtering by testament or book. Full-text search with ranking
arrives with the SQLite migration described in
[bible-data-storage.md](./bible-data-storage.md); this specification describes
the substring implementation that precedes it.
