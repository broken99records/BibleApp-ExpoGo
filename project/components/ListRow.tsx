import { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';

type ListRowProps = {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leading?: ReactNode;
  /** Replaces the chevron — a badge, a count, a switch. */
  trailing?: ReactNode;
};

/** A titled row in a scrolling list: books today, articles or hymns later. */
export default function ListRow({ title, subtitle, onPress, leading, trailing }: ListRowProps) {
  const { colors } = useTheme();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[styles.row, { borderBottomColor: colors.border }]}
    >
      {leading}

      <View style={styles.text}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      {trailing ?? (onPress ? <ChevronRight size={20} color={colors.textSecondary} /> : null)}
    </Container>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[3],
    paddingVertical: tokens.spacing[3],
    paddingHorizontal: tokens.spacing[5],
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: tokens.fontSize.lg,
    fontFamily: 'Sans-Medium',
    includeFontPadding: false,
  },
  subtitle: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    includeFontPadding: false,
    marginTop: tokens.spacing[0.5],
  },
});
