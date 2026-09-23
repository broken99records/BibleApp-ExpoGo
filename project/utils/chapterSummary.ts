/**
 * Chapter summaries, behind an async call so swapping the canned text for a
 * real service is a change to this file alone. The reader already treats it as
 * a promise and shows a loading state.
 */

const SUMMARIES: Record<string, string> = {
  'Genesis-1':
    "Genesis 1 describes the creation of the world. God creates light and darkness, the sky, land and sea, plants, sun, moon and stars, sea creatures, birds, land animals, and finally humans. After each act God sees that it is good. Humans are made in God's image and given responsibility for living things, and the chapter closes with creation declared very good.",
  'Exodus-20':
    'Exodus 20 gives the Ten Commandments, spoken to Moses at Sinai. They establish the foundation of the law: worship God alone, make no idols, do not misuse his name, keep the Sabbath, honour your parents, and the prohibitions on murder, adultery, theft, false witness and coveting. The people, afraid, ask Moses to speak with God on their behalf.',
  'Psalms-23':
    'Psalm 23 is a statement of trust in God as a shepherd who provides, protects and guides. He leads to green pastures and still waters and restores the soul; even in the darkest valley his presence removes fear. It closes with goodness and mercy following the psalmist all his days.',
  'Matthew-5':
    'Matthew 5 opens the Sermon on the Mount. It begins with the Beatitudes, blessing the poor in spirit, those who mourn, the meek, those hungry for righteousness, the merciful, the pure in heart, peacemakers and the persecuted. Jesus then says he came to fulfil the law rather than abolish it, and reinterprets several commandments to address the heart rather than only outward action.',
  'Revelation-21':
    'Revelation 21 describes a new heaven and a new earth, with the New Jerusalem coming down from heaven. God dwells with humanity and wipes away every tear; death, mourning and pain are gone. The city is described in detail — gold and precious stones, twelve gates of pearl — and needs no sun or temple, because God\'s glory is its light.',
};

function fallbackSummary(book: string, chapter: number) {
  return `${book} ${chapter} has no written summary yet. Read the chapter itself — the text above is the source, and a summary is only ever a pointer back to it.`;
}

export async function getChapterSummary(book: string, chapter: number): Promise<string> {
  const summary = SUMMARIES[`${book}-${chapter}`];
  return summary ?? fallbackSummary(book, chapter);
}
