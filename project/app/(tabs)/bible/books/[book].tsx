import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { tokens, useTheme } from '@/context/ThemeContext';
import { useReaderIntent } from '@/context/ReaderIntentContext';
import { BIBLE_BOOKS } from '@/utils/bibleData';

const GRID_PADDING = tokens.spacing[4];
const GRID_GAP = tokens.spacing[2];
const MIN_TILE = 56;

export default function ChaptersScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { requestReference } = useReaderIntent();
  const { book } = useLocalSearchParams<{ book: string }>();

  const bookName = decodeURIComponent(book ?? '');
  const bookData = BIBLE_BOOKS.find((entry) => entry.name === bookName);
  const chapters = Array.from(
    { length: bookData?.chapters ?? 0 },
    (_, index) => index + 1,
  );

  const openChapter = (chapter: number) => {
    requestReference(bookName, chapter);
    router.dismissAll();
  };

  // Tiles are sized to divide the row exactly, so the grid fills the width
  // instead of leaving a ragged edge at whatever a fixed tile width lands on.
  const { width } = useWindowDimensions();
  const rowWidth = width - GRID_PADDING * 2;
  const columns = Math.max(4, Math.floor((rowWidth + GRID_GAP) / (MIN_TILE + GRID_GAP)));
  const tileSize = (rowWidth - GRID_GAP * (columns - 1)) / columns;

  return (
    <>
      <Stack.Screen options={{ title: bookName }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: insets.bottom + tokens.spacing[6] },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridInner}>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter}
              onPress={() => openChapter(chapter)}
              style={[
                styles.chapter,
                { backgroundColor: colors.surfaceMuted, width: tileSize, height: tileSize },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${bookName} chapter ${chapter}`}
            >
              <Text style={[styles.chapterNumber, { color: colors.text }]}>
                {chapter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: GRID_PADDING,
  },
  gridInner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  chapter: {
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumber: {
    fontSize: tokens.fontSize.lg,
    fontFamily: 'Sans-Medium',
  },
});
