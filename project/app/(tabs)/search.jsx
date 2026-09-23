
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Pressable,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useTheme, tokens } from '@/context/ThemeContext';
import PageLayout from '@/components/PageLayout';

export default function SearchScreen() {
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');

  // Replace this with your Bible data/search function
  const results = [];

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderResult = ({ item }) => (
    <Pressable
      style={[
        styles.resultCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.reference, { color: colors.primary }]}>
        {item.book} {item.chapter}:{item.verse}
      </Text>

      <Text style={[styles.verseText, { color: colors.text }]}>
        {item.text}
      </Text>
    </Pressable>
  );

  return (
    <PageLayout>
      <Text style={[styles.heading, { color: colors.text }]}>
        Search Bible
      </Text>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Search
          size={22}
          color={colors.textSecondary || colors.text}
        />

        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="Search the Bible..."
          placeholderTextColor={colors.textSecondary || '#888'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearch}>
            <X
              size={20}
              color={colors.textSecondary || colors.text}
            />
          </Pressable>
        )}
      </View>

      {searchQuery.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Search
            size={48}
            color={colors.textSecondary || colors.text}
          />

          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Search the Bible
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary || colors.text },
            ]}
          >
            Search for words, phrases, verses, or passages.
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No results found
          </Text>

          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary || colors.text },
            ]}
          >
            Try searching for another word or phrase.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) =>
            `${item.book}-${item.chapter}-${item.verse}-${index}`
          }
          renderItem={renderResult}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: tokens.fontSize['2xl'],
    fontFamily: 'Sans-Bold',
    marginBottom: 20,
  },

  searchContainer: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Sans-Regular',
    marginLeft: 10,
    paddingVertical: 0,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Sans-Bold',
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 15,
    fontFamily: 'Sans-Regular',
    lineHeight: 23,
    textAlign: 'center',
  },

  resultsList: {
    paddingBottom: 30,
  },

  resultCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },

  reference: {
    fontSize: 15,
    fontFamily: 'Sans-Bold',
    marginBottom: 8,
  },

  verseText: {
    fontSize: 17,
    fontFamily: 'Lora_400Regular',
    lineHeight: 28,
  },
});

