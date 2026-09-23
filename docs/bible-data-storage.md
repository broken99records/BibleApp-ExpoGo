# Bible data storage

Plan for moving the bundled scripture text out of a JavaScript module and into
SQLite. Agreed in principle, not scheduled. Nothing here is implemented.

## Current state

`project/utils/bibleData.ts` holds the entire text as a module-scope object
literal.

| Measure | Value |
| --- | --- |
| File size | 5.5 MB (5,816,915 bytes) |
| Lines | 127,024 |
| All other source in the app, combined | 61 KB |
| As minified JSON | 4.5 MB |
| Gzipped | 1.2 MB |
| Largest single book | 0.26 MB |

The file exports `BIBLE_BOOKS`, `getBibleData()` and `getChapterVerses()`. Both
functions are synchronous. `SAMPLE_VERSES` is module-private and reached through
a cast, documented at its use site.

Consequences of the current shape:

- Metro parses and evaluates all 5.5 MB during startup.
- The whole object stays resident for the process lifetime, whatever is read.
- Content cannot change without shipping a build.
- Every diff, blame and checkout touching the file is slow.

## Target

A prebuilt SQLite database shipped as an asset, copied to the document
directory on first launch, queried per chapter.

Properties this buys: memory proportional to what is on screen rather than to
the corpus; word-boundary search with ranking via FTS5; content replaceable by
swapping a file.

### Modules

Bundled with Expo Go at SDK 54, per `expo/bundledNativeModules.json`, so no
development build is required:

| Module | Version |
| --- | --- |
| `expo-sqlite` | ~16.0.10 |
| `expo-asset` | ~12.0.13 |
| `expo-file-system` | ~19.0.23 |

### Schema

```sql
CREATE TABLE books (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  testament TEXT NOT NULL CHECK (testament IN ('old', 'new')),
  chapters  INTEGER NOT NULL,
  position  INTEGER NOT NULL          -- canonical order
);

CREATE TABLE verses (
  id       INTEGER PRIMARY KEY,
  book_id  INTEGER NOT NULL REFERENCES books(id),
  chapter  INTEGER NOT NULL,
  verse    INTEGER NOT NULL,
  text     TEXT NOT NULL
);

CREATE UNIQUE INDEX verses_reference ON verses (book_id, chapter, verse);

CREATE VIRTUAL TABLE verses_fts USING fts5 (
  text,
  content = 'verses',
  content_rowid = 'id'
);
```

`verses_reference` serves chapter reads. `verses_fts` serves search, and is
populated once at build time rather than maintained by triggers, since the
content is read-only at runtime.

### Build step

A script under `project/scripts/` reads the existing module, writes the
database, and leaves it at `project/assets/bible.db`. It runs on demand, not as
part of the app build — the database is committed, and regenerated only when the
text changes.

Committing a ~4.5 MB binary is a deliberate trade: the source file it replaces
is larger, and the binary changes far less often than a text file that currently
shows every edit as a diff.

### First launch

`expo-sqlite` opens databases from the document directory, not from the bundle,
so the asset is copied once:

1. Resolve the asset with `expo-asset`.
2. If no database exists at the expected path, copy it with
   `expo-file-system`.
3. Open it and keep the handle for the process lifetime.

A version marker stored alongside the database drives replacement when a build
ships new text.

## Consequences for existing code

The functions become asynchronous. Three call sites depend on their being
synchronous today:

- `project/hooks/useBibleData.ts` calls `getChapterVerses` inside an effect and
  sets state from the return value.
- `project/utils/verseOfTheDay.ts` calls `getChapterVerses` and returns the
  verse directly, so `getVerseOfTheDay` becomes asynchronous too.
- `project/app/(tabs)/index.tsx` derives the daily verse during render through
  `useMemo`, which cannot await.

The home screen therefore needs a loading state for its verse-of-the-day card,
and the reader needs one for a chapter. Both already have a shape to follow:
`SummarySheet` renders an `ActivityIndicator` while `getChapterSummary`
resolves.

`BIBLE_BOOKS` is read synchronously by the books pages, the reader's caption and
`verseOfTheDay`. Book metadata is 66 rows and can stay a plain module export,
leaving only verse text in the database.

## Interim option

Splitting the module into 66 per-book JSON files, `require`d inside
`getChapterVerses` rather than at module scope, drops peak parse and residency
from 4.5 MB to 0.26 MB without new dependencies and without making the API
asynchronous. It does nothing for search, which needs the whole corpus at once,
and is therefore a stepping stone rather than a destination.

## Rollback

The database and the module can coexist during migration: `getChapterVerses`
reads from SQLite and falls back to the module when a query returns nothing.
Removing the module is the last step, after the database is confirmed on
device, and is a separate commit so it can be reverted alone.
