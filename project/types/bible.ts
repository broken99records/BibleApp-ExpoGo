export interface Verse {
  verse: number;
  text: string;
}

export type Testament = 'old' | 'new';

export interface Book {
  name: string;
  chapters: number;
  testament: Testament;
}

export interface Position {
  book: string;
  chapter: number;
}
