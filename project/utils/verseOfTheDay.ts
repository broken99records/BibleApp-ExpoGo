import { getChapterVerses } from '@/utils/bibleData';

/**
 * Curated so the daily verse never lands on a genealogy or a sentence
 * fragment. Chapters, not verses — the verse within is picked by the seed too.
 */
const DAILY_CHAPTERS = [
  { book: 'Psalms', chapter: 23 },
  { book: 'Psalms', chapter: 91 },
  { book: 'Psalms', chapter: 121 },
  { book: 'Psalms', chapter: 46 },
  { book: 'Psalms', chapter: 27 },
  { book: 'Proverbs', chapter: 3 },
  { book: 'Isaiah', chapter: 40 },
  { book: 'Isaiah', chapter: 41 },
  { book: 'Jeremiah', chapter: 29 },
  { book: 'Lamentations', chapter: 3 },
  { book: 'Matthew', chapter: 5 },
  { book: 'Matthew', chapter: 6 },
  { book: 'John', chapter: 14 },
  { book: 'John', chapter: 15 },
  { book: 'Romans', chapter: 8 },
  { book: 'Romans', chapter: 12 },
  { book: '1 Corinthians', chapter: 13 },
  { book: 'Galatians', chapter: 5 },
  { book: 'Ephesians', chapter: 6 },
  { book: 'Philippians', chapter: 4 },
  { book: 'Colossians', chapter: 3 },
  { book: 'Hebrews', chapter: 11 },
  { book: 'James', chapter: 1 },
  { book: '1 Peter', chapter: 5 },
  { book: '1 John', chapter: 4 },
];

export type DailyVerse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

/** Days since the epoch — changes at local midnight, same for every caller. */
function daySeed(date: Date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86400000);
}

/**
 * The same verse all day, a different one tomorrow, with no fetch and nothing
 * persisted — the date is the whole state.
 */
export function getVerseOfTheDay(date = new Date()): DailyVerse | null {
  const seed = daySeed(date);
  const reference = DAILY_CHAPTERS[seed % DAILY_CHAPTERS.length];
  const verses = getChapterVerses(reference.book, reference.chapter,);

  if (!verses.length) return null;

  // A second multiplier so two chapters of equal length don't move in lockstep.
  const verse = verses[(seed * 7) % verses.length];

  return {
    book: reference.book,
    chapter: reference.chapter,
    verse: verse.verse,
    text: verse.text,
  };
}
