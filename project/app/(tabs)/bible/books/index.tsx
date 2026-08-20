import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { tokens, useTheme } from '@/context/ThemeContext';
import { BIBLE_BOOKS } from '@/utils/bibleData';
import SearchField from '@/components/SearchField';
import ListRow from '@/components/ListRow';

export default function BooksScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { testament } = useLocalSearchParams<{ testament?: string }>();
  const [query, setQuery] = useState('');

  const inTestament = testament
    ? BIBLE_BOOKS.filter((book) => book.testament === testament)
    : BIBLE_BOOKS;

  const term = query.trim().toLowerCase();
  const books = term
    ? inTestament.filter((book) => book.name.toLowerCase().includes(term))
    : inTestament;

  const openBook = (name: string) =>
    router.push({ pathname: '/(tabs)/bible/books/[book]', params: { book: name } });

  const title =
    testament === 'old' ? 'Old Testament' : testament === 'new' ? 'New Testament' : 'Books';

  return (
    <>
      <Stack.Screen options={{ title }} />

      <View style={[styles.search, { backgroundColor: colors.background }]}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Find a book"
          label={`Search ${title.toLowerCase()}`}
        />
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: insets.bottom + tokens.spacing[6] }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {books.map((book) => (
          <ListRow
            key={book.name}
            title={book.name}
            subtitle={`${book.chapters} chapters`}
            onPress={() => openBook(book.name)}
          />
        ))}

        {books.length === 0 ? (
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            No book matches “{query.trim()}”.
          </Text>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  search: {
    paddingHorizontal: tokens.spacing[5],
    paddingTop: tokens.spacing[2],
    paddingBottom: tokens.spacing[3],
  },
  empty: {
    fontSize: tokens.fontSize.md,
    fontFamily: 'Sans-Regular',
    textAlign: 'center',
    paddingHorizontal: tokens.spacing[5],
    paddingVertical: tokens.spacing[8],
  },
});
