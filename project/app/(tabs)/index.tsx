import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { BookOpen, Sunrise, Library, Scroll } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import { useLastPosition } from '@/context/LastPositionContext';
import { useReaderIntent } from '@/context/ReaderIntentContext';
import { getVerseOfTheDay } from '@/utils/verseOfTheDay';
import PageLayout from '@/components/PageLayout';
import Card from '@/components/Card';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { lastPosition } = useLastPosition();
  const { requestReference } = useReaderIntent();

  // Keyed to the date, so a session left open overnight still rolls over.
  const today = new Date().toDateString();
  const dailyVerse = useMemo(() => getVerseOfTheDay(), [today]);

  const resumeSubtitle = `${lastPosition.book} ${lastPosition.chapter}`;
  const verseReference = dailyVerse
    ? `${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse}`
    : 'Unavailable';

  // The reader's tab is already mounted, so the reference travels through the
  // intent context rather than as a route param.
  const openReference = (book: string, chapter: number) => {
    requestReference(book, chapter);
    router.navigate('/(tabs)/bible');
  };

  const openDailyVerse = () => {
    if (!dailyVerse) return;
    openReference(dailyVerse.book, dailyVerse.chapter);
  };

  const resumeReading = () => openReference(lastPosition.book, lastPosition.chapter);

  const browseTestament = (testament: 'old' | 'new') =>
    router.push({ pathname: '/(tabs)/bible/books', params: { testament } });

  const browseOldTestament = () => browseTestament('old');
  const browseNewTestament = () => browseTestament('new');

  return (
    <PageLayout>
      <Card
        title="Verse of the day"
        icon={<Sunrise size={24} color={colors.onPrimary} />}
        onPress={openDailyVerse}
        emphasis
      >
        <Text style={[styles.verseText, { color: colors.onPrimary }]}>{dailyVerse?.text}</Text>
        <Text style={[styles.verseReference, { color: colors.onPrimary }]}>{verseReference}</Text>
      </Card>

      <Card
        title="Continue reading"
        subtitle={resumeSubtitle}
        icon={<BookOpen size={20} color={colors.primary} />}
        onPress={resumeReading}
        compact
      />

      <View style={styles.testaments}>
        <View style={styles.testamentCard}>
          <Card
            title="Old Testament"
            subtitle="39 books"
            icon={<Scroll size={24} color={colors.primary} />}
            onPress={browseOldTestament}
          />
        </View>
        <View style={styles.testamentCard}>
          <Card
            title="New Testament"
            subtitle="27 books"
            icon={<Library size={24} color={colors.primary} />}
            onPress={browseNewTestament}
          />
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  verseText: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    lineHeight: tokens.fontSize.md * tokens.lineHeight.relaxed,
    marginTop: tokens.spacing[2],
  },
  verseReference: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Medium',
    marginTop: tokens.spacing[2],
  },
  testaments: {
    flexDirection: 'row',
    gap: tokens.spacing[3],
  },
  testamentCard: {
    flex: 1,
  },
});
