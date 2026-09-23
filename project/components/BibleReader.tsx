import { useState, useEffect, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler';
import { useBibleData } from '@/hooks/useBibleData';
import { tokens, useTheme } from '@/context/ThemeContext';
import { useLastPosition } from '@/context/LastPositionContext';
import { BIBLE_BOOKS } from '@/utils/bibleData';
import { useReadingPreferences } from '@/hooks/useReadingPreferences';
import { useReaderIntent } from '@/context/ReaderIntentContext';
import SummarySheet from '@/components/SummarySheet';
import { router } from 'expo-router';
import { Sparkles, BookOpen } from 'lucide-react-native';
import { Position } from '@/types/bible';

/** Clears the floating native tab bar, which exposes no height to measure. */
const FAB_CLEARANCE = 84;

interface BibleReaderProps {
  initialPosition: Position;
}

export default function BibleReader({ initialPosition }: BibleReaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { 
    currentBook, 
    currentChapter, 
    verseData, 
    totalChapters,
    setCurrentBook, 
    setCurrentChapter 
  } = useBibleData(initialPosition);
  const { saveLastPosition } = useLastPosition();
  const { fontSize, lineHeight } = useReadingPreferences();
  
  const { pendingReference, clearReference } = useReaderIntent();
  const [summarySheetVisible, setSummarySheetVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    if (verseData.length > 0) {
      saveLastPosition(currentBook, currentChapter);
    }
  }, [currentBook, currentChapter, verseData]);

  const handleSelectReference = (bookName: string, chapter: number) => {
    setCurrentBook(bookName);
    setCurrentChapter(chapter);
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
  };

  const navigateToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const navigateToNextChapter = () => {
    if (currentChapter < totalChapters) {
      setCurrentChapter(currentChapter + 1);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  // A reference picked on the books pages lands here, since the reader's tab
  // is already mounted and would not receive it as a route param.
  useEffect(() => {
    if (!pendingReference) return;
    handleSelectReference(pendingReference.book, pendingReference.chapter);
    clearReference();
  }, [pendingReference]);

  const openBooks = () => router.push('/(tabs)/bible/books');

  // Memoised, or every render rebinds the recognisers and can drop a swipe
  // mid-gesture. runOnJS, because a gesture callback is a worklet on the UI
  // thread by default and these handlers set React state.
  const gesture = useMemo(() => {
    const flingLeft = Gesture.Fling()
      .direction(Directions.LEFT)
      .runOnJS(true)
      .onStart(navigateToNextChapter);

    const flingRight = Gesture.Fling()
      .direction(Directions.RIGHT)
      .runOnJS(true)
      .onStart(navigateToPreviousChapter);

    return Gesture.Race(flingLeft, flingRight);
  }, [currentChapter, totalChapters]);
  const headerText = `${currentBook} ${currentChapter}`;
  const testament =
    BIBLE_BOOKS.find(entry => entry.name === currentBook)?.testament === 'new'
      ? 'New Testament'
      : 'Old Testament';
  const chapterCaption = `${testament} · Chapter ${currentChapter} of ${totalChapters}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <GestureDetector gesture={gesture}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingTop: insets.top + tokens.spacing[6],
              paddingBottom: insets.bottom + FAB_CLEARANCE,
            },
          ]}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={openBooks}
            style={styles.reference}
            accessibilityRole="button"
            accessibilityLabel={`${headerText}, ${chapterCaption}. Tap to change book or chapter.`}
          >
            <BookOpen size={32} color={colors.primary} />
            <Text style={[styles.referenceText, { color: colors.text }]}>{headerText}</Text>
            <Text style={[styles.referenceCaption, { color: colors.textSecondary }]}>
              {chapterCaption}
            </Text>
          </TouchableOpacity>

          {/* One paragraph per verse: numbers stay inline, but a chapter does
              not collapse into an unbroken wall of text. A long-press handler
              attaches to the verse Text below. */}
          {verseData.map((verse) => (
            <Text
              key={verse.verse}
              style={[styles.verseParagraph, { fontSize, lineHeight, color: colors.text }]}
            >
              <Text style={[styles.verseNumberInline, { color: colors.primary }]}>
                {verse.verse}
              </Text>
              {'  '}
              {verse.text}
            </Text>
          ))}
        </ScrollView>
      </GestureDetector>

      {/* Summary Modal */}
      <TouchableOpacity
        onPress={() => setSummarySheetVisible(true)}
        style={[
          styles.fab,
          { backgroundColor: colors.primary, bottom: insets.bottom + FAB_CLEARANCE },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`Summary of ${headerText}`}
      >
        <Sparkles size={22} color={colors.onPrimary} />
      </TouchableOpacity>

      <SummarySheet
        isVisible={summarySheetVisible}
        onClose={() => setSummarySheetVisible(false)}
        book={currentBook}
        chapter={currentChapter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reference: {
    alignItems: 'center',
    gap: tokens.spacing[2],
    marginBottom: tokens.spacing[7],
  },
  referenceText: {
    fontSize: tokens.fontSize['2xl'],
    fontFamily: 'Sans-Bold',
  },
  referenceCaption: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
  },
  fab: {
    position: 'absolute',
    right: tokens.spacing[5],
    width: 56,
    height: 56,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: tokens.spacing[6],
    paddingTop: tokens.spacing[5],
  },
  verseParagraph: {
    fontFamily: 'Serif-Regular',
    marginBottom: tokens.spacing[3],
  },
  verseNumberInline: {
    fontFamily: 'Serif-SemiBold',
  },
});