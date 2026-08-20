# TODO

Working order, and the reasoning behind each step. Items under **Blocked** are
not being built until they are explicitly approved.

## Done

### Theme ramps and layout tokens — `context/ThemeContext.tsx`
**Why:** `primary` sat at 3.4:1 on the dark card and 3.6:1 on the dark
background, so verse numbers, active tab icons and every accent control failed
WCAG AA in dark mode; `secondary` was 1.4:1 on white and unusable as text. The
first fix cleared AA but was still seventeen unrelated hexes.
**How:** five ramps — one neutral, four hues — generated in OKLCH over one set
of lightness stops, so a step means the same thing in every ramp and the dark
theme is the light theme's steps inverted. Semantic tokens map to ramp steps;
nothing outside this file names a colour. Tightest text pair is 5.07:1.
Spacing, font size, line height and radius now sit in the same module as a
`tokens` export, so layout values stop being magic numbers.

### Hardcoded colours removed — splash, reader, drawer, chapter selector
**Why:** a hex inside `StyleSheet.create` cannot react to the theme, so the
light-grey `#E1E1E8` dividers glared on the dark background, the translucent
black chapter chips vanished on it, and the splash screen flashed white.
**How:** colours derived above each render return off the theme; the
stylesheets now hold structure only. `grep '#'` over `app/` and `components/`
returns nothing.

### Native bottom tabs — `app/(tabs)/_layout.tsx`
**Why:** a hardcoded 50pt height overrode React Navigation's own inset handling,
so the bar collided with the home indicator; and a JS-drawn bar never quite
matches the platform.
**How:** `expo-router/unstable-native-tabs`, so the inset, the blur and the
accessibility behaviour are the system's. Three tabs — Home, Bible, Search —
with SF Symbols on iOS and Ionicons rasterised in theme colours for Android,
because expo-router's own helper rasterises every glyph at a hardcoded white.

**Known limit:** on SDK 54 with react-native-screens 4.16, `selectedIcon` is
declared iOS-only and the Android path reads only `icon`, so the active tab
shows a filled icon on iOS and a colour change on Android. SDK 56 fixes it, and
there is no Expo Go build for 56.

### Settings off the tab bar — `app/settings.tsx`
**Why:** settings is a detour, not a destination, and it was taking a quarter
of the bar.
**How:** a pushed stack route with a native back control and no title, reached
from the button in the top-right of the page shell.

### Screen layout convention
**Why:** each screen re-implemented its own shell, and the placeholder screens
were a bare `SafeAreaView` wrapped around a `Text` — disconnected from how
screens are built in `ctrelp/sources/mobile`, which is the reference.
**How:** ported that convention — no `SafeAreaView` anywhere, the scroll
container *is* the shell, `useSafeAreaInsets()` feeds `contentContainerStyle`
padding, and spacing comes off the shared scale. The reader keeps its pinned
header and nav bar but takes the top and bottom insets directly, which the
floating native tab bar now requires.

### Style extraction convention
**Why:** hoisting every style into a named const above the return moved the
reader around the file for no gain.
**How:** plain merges of a stylesheet entry and theme colours stay inline where
they are read; only a value carrying a decision — a ternary between colours, a
derived string — earns a name above the return.

### Splash lands on Home
**Why:** the app jumped straight into the reader, which leaves no room for a
home screen.
**How:** `router.replace('/(tabs)')` instead of `/(tabs)/bible`.

### Page layout shell — `components/PageLayout.tsx`
**Why:** every screen was re-implementing the same safe-area padding and scroll
container, and each copy drifted from the others.
**How:** one shell that owns the insets, the scroll container and the top
action row, whose default action is the settings button. Screens pass content
and nothing else; `scrollable` and `gutter` cover the cases that differ.

### Home screen — `app/(tabs)/index.tsx`
**Why:** the app opened straight into whatever chapter was last read, with no
surface for anything that is not the reader.
**How:** a continue-reading card, the verse of the day, and search plus the two
testaments as cards — a card list that takes devotional and hymns later without
restructuring. No streaks.

### Verse of the day — `utils/verseOfTheDay.ts`
**Why:** the home screen needs a daily anchor, and there is no network in the
app.
**How:** the calendar date seeds an index into a curated chapter list, so the
verse is fixed until midnight and nothing is fetched or stored. Curated rather
than whole-Bible so it never lands on a genealogy.

### Psalms verse data fix — `utils/bibleData.ts`
**Why:** `BIBLE_BOOKS` named the book `Psalms` while the verse data keyed it
`Psalm`, so all 150 chapters silently fell back to generated placeholder text.
**How:** the `SAMPLE_VERSES` key renamed to `Psalms`, which fixes the lookup
and keeps the displayed book name correct.

## Blocked — awaiting approval

The Search tab is still a placeholder — the page shell with a single heading.

### Search screen
**Why:** the Search tab is a placeholder, and 66 books are only reachable by
scrolling the drawer.
**How:** substring match over the bundled verse text, capped result count,
tapping a result opens that chapter in the reader.
