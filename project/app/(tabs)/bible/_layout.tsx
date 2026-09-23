import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

/**
 * The books pages live inside this tab rather than on the root stack, so
 * dismissing them returns to the reader instead of unwinding to whichever tab
 * was last active.
 */
export default function BibleLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="books/index" options={{ title: 'Books' }} />
      <Stack.Screen name="books/[book]" options={{ title: '' }} />
    </Stack>
  );
}
