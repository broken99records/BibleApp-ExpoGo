import { ReactNode } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { tokens, useTheme } from '@/context/ThemeContext';

type PageLayoutProps = {
  children: ReactNode;
  /** Replaces the settings button in the top-right corner. */
  action?: ReactNode;
  /** Sits at the top-left, where a page would otherwise carry a back control. */
  leading?: ReactNode;
  scrollable?: boolean;
  gutter?: number;
};

/**
 * The shell every screen sits in: safe-area padding, the top action row, and
 * the scroll container. Screens pass content and nothing else.
 */
export default function PageLayout({
  children,
  action,
  leading,
  scrollable = true,
  gutter = tokens.spacing[5],
}: PageLayoutProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const openSettings = () => router.push('/settings');

  const topBar = (
    <View style={[styles.topBar, { paddingTop: insets.top + tokens.spacing[2] }]}>
      <View style={styles.leading}>{leading}</View>
      {action ?? (
        <TouchableOpacity
          onPress={openSettings}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!scrollable) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingHorizontal: gutter,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {topBar}
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: gutter }}>{topBar}</View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingHorizontal: gutter,
          paddingBottom: insets.bottom + tokens.spacing[8],
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: tokens.spacing[2],
  },
  leading: {
    flex: 1,
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
});
