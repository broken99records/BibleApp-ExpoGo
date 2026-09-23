import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';

type SearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** Announced to screen readers — say what is being searched. */
  label: string;
};

export default function SearchField({
  value,
  onChangeText,
  placeholder,
  autoFocus,
  label,
}: SearchFieldProps) {
  const { colors } = useTheme();

  const clear = () => onChangeText('');

  return (
    <View style={[styles.field, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
      <Search size={18} color={colors.textSecondary} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoFocus={autoFocus}
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel={label}
        style={[styles.input, { color: colors.text }]}
      />

      {value.length > 0 ? (
        <TouchableOpacity
          onPress={clear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={tokens.spacing[2]}
        >
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing[2],
    borderWidth: 1,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing[3],
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    // Android pads above and below the glyphs, which sits the text low in a
    // centred row.
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: tokens.spacing[2],
  },
});
