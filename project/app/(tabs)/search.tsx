import { StyleSheet, Text } from 'react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import PageLayout from '@/components/PageLayout';

export default function SearchScreen() {
  const { colors } = useTheme();

  return (
    <PageLayout>
      <Text style={[styles.heading, { color: colors.text }]}>Search</Text>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: tokens.fontSize['2xl'],
    fontFamily: 'Sans-Bold',
  },
});
