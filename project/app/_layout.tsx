import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Literata_400Regular, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReaderIntentProvider } from '@/context/ReaderIntentContext';
import { LastPositionProvider } from '@/context/LastPositionContext';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // Sans for chrome, serif for scripture. Every stylesheet names these keys,
  // so swapping a family is a change to this map alone.
  const [fontsLoaded] = useFonts({
    'Sans-Regular': PlusJakartaSans_400Regular,
    'Sans-Medium': PlusJakartaSans_500Medium,
    'Sans-Bold': PlusJakartaSans_700Bold,
    'Serif-Regular': Literata_400Regular,
    'Serif-SemiBold': Literata_600SemiBold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LastPositionProvider>
            <ReaderIntentProvider>
              <RootLayout fontsLoaded={fontsLoaded} />
            </ReaderIntentProvider>
          </LastPositionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function RootLayout({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { colors, isDark, isReady } = useTheme();

  // Both gates, or a dark-mode user gets a light frame before the saved
  // preference resolves.
  const canPaint = fontsLoaded && isReady;

  useEffect(() => {
    if (canPaint) {
      SplashScreen.hideAsync();
    }
  }, [canPaint]);

  // The root view sits behind everything React renders, including the gap as
  // the native splash tears down. Left alone it is white in both themes.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  const statusBarStyle = isDark ? 'light' : 'dark';

  if (!canPaint) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={statusBarStyle} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: '',
          }}
        />
      </Stack>
    </View>
  );
}