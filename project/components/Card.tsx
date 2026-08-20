import { ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';

type CardProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onPress?: () => void;
  /** Fills the card with the primary colour — one per screen at most. */
  emphasis?: boolean;
  /** A single-row strip instead of a stacked block. */
  compact?: boolean;
  children?: ReactNode;
};

export default function Card({
  title,
  subtitle,
  icon,
  onPress,
  emphasis,
  compact,
  children,
}: CardProps) {
  const { colors } = useTheme();

  const surfaceColor = emphasis ? colors.primary : colors.card;
  const titleColor = emphasis ? colors.onPrimary : colors.text;
  const subtitleColor = emphasis ? colors.onPrimary : colors.textSecondary;
  const borderColor = emphasis ? colors.primary : colors.border;

  // A card without a handler is a panel, and a screen reader should not hear
  // it announced as a button.
  const Container = onPress ? TouchableOpacity : View;

  if (compact) {
    return (
      <Container
        onPress={onPress}
        accessibilityRole={onPress ? 'button' : undefined}
        style={[styles.strip, { backgroundColor: surfaceColor, borderColor }]}
      >
        {icon}
        <Text style={[styles.stripTitle, { color: titleColor }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.stripSubtitle, { color: subtitleColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {onPress ? <ChevronRight size={20} color={subtitleColor} /> : null}
      </Container>
    );
  }

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}
    >
      {icon}
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text> : null}
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    padding: tokens.spacing[4],
    marginBottom: tokens.spacing[3],
  },
  title: {
    fontSize: tokens.fontSize.lg,
    fontFamily: 'Sans-Medium',
    marginTop: tokens.spacing[2],
  },
  subtitle: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    marginTop: tokens.spacing[1],
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[2],
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    paddingVertical: tokens.spacing[3],
    paddingHorizontal: tokens.spacing[4],
    marginBottom: tokens.spacing[3],
  },
  // Android pads above and below the glyphs, which drops text a few pixels
  // against an icon in the same centred row.
  stripTitle: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Medium',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  stripSubtitle: {
    flex: 1,
    textAlign: 'right',
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
