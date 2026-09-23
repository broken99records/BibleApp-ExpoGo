import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Sparkles } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import { getChapterSummary } from '@/utils/chapterSummary';

type SummarySheetProps = {
  isVisible: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
};

/**
 * A bottom sheet rather than a centred dialog: a summary is reference
 * material, so the chapter it describes should stay visible above it.
 */
export default function SummarySheet({ isVisible, onClose, book, chapter }: SummarySheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [summary, setSummary] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setSummary(null);
      return;
    }

    let active = true;
    getChapterSummary(book, chapter).then(result => {
      if (active) setSummary(result);
    });

    return () => {
      active = false;
    };
  }, [isVisible, book, chapter]);

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} accessibilityLabel="Close summary" />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, paddingBottom: insets.bottom + tokens.spacing[6] },
          ]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Sparkles size={20} color={colors.primary} />
            <Text style={[styles.title, { color: colors.text }]}>
              {book} {chapter}
            </Text>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close summary">
              <X size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {summary === null ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : (
              <Text style={[styles.summaryText, { color: colors.text }]}>{summary}</Text>
            )}
          </ScrollView>

          <Text style={[styles.footnote, { color: colors.textSecondary }]}>
            Summary, not scripture — read the chapter itself.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: tokens.radius.xl,
    borderTopRightRadius: tokens.radius.xl,
    paddingHorizontal: tokens.spacing[5],
    paddingTop: tokens.spacing[2],
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: tokens.radius.full,
    marginBottom: tokens.spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[2],
    marginBottom: tokens.spacing[3],
  },
  title: {
    flex: 1,
    fontSize: tokens.fontSize.lg,
    fontFamily: 'Sans-Medium',
  },
  body: {
    flexGrow: 0,
  },
  loader: {
    paddingVertical: tokens.spacing[8],
  },
  summaryText: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    lineHeight: tokens.fontSize.md * tokens.lineHeight.relaxed,
  },
  footnote: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    marginTop: tokens.spacing[4],
  },
});
