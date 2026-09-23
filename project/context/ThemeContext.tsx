import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Five ramps over one set of lightness stops, generated in OKLCH so a step
 * means the same thing in every ramp: 300 is always the light-on-dark value,
 * 600 the dark-on-light one. Steps outside 100–800 exist for headroom.
 *
 * Themes are mirror mappings of these ramps — read a light token, invert the
 * step, and you have its dark counterpart. Reach for a semantic token below,
 * not a ramp step, in components.
 */
const ink = {
  0: '#FCFDFF',
  50: '#F5F7FB',
  100: '#EBEDF1',
  200: '#D9DCE5',
  300: '#BABEC6',
  400: '#989EAE',
  500: '#7A808F',
  600: '#5D6371',
  700: '#474D5B',
  800: '#292E3A',
  900: '#161A26',
  950: '#0B0F1A',
};

const blue = {
  100: '#DFEDFF',
  200: '#C9DDFF',
  300: '#9FBDFB',
  400: '#749CF1',
  500: '#4A7AE4',
  600: '#3B5FAE',
  700: '#304A84',
  800: '#1F2D4A',
};

const gold = {
  100: '#F8ECD1',
  300: '#D6BA7F',
  500: '#A97600',
  700: '#634800',
};

const teal = {
  100: '#DAF4EA',
  300: '#93CCB7',
  500: '#009775',
  700: '#195A47',
};

const red = {
  100: '#FFE3DF',
  300: '#F5A69F',
  500: '#D24C49',
  700: '#7B3330',
};

/**
 * Layout metrics are static, so they sit outside the theme and are imported
 * directly. Spacing is a 4pt scale keyed by its multiple.
 */
export const tokens = {
  spacing: {
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    4.5: 18,
    5: 20,
    5.5: 22,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
  },

  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;

/**
 * Every text pair here clears WCAG AA against every surface it can land on —
 * 5.07:1 at the tightest. Verify a ratio before changing a step.
 */
const lightTheme = {
  background: ink[0],
  backgroundSecondary: ink[50],
  card: ink[0],
  surfaceMuted: ink[100],
  surfaceSelected: blue[100],
  border: ink[200],
  text: ink[900],
  textSecondary: ink[600],
  primary: blue[600],
  onPrimary: ink[0],
  accent: gold[700],
  success: teal[700],
  error: red[700],
  overlay: 'rgba(11, 15, 26, 0.45)',
};

const darkTheme: typeof lightTheme = {
  background: ink[950],
  backgroundSecondary: ink[900],
  card: ink[900],
  surfaceMuted: ink[800],
  surfaceSelected: blue[800],
  border: ink[800],
  text: ink[50],
  textSecondary: ink[300],
  primary: blue[300],
  onPrimary: ink[950],
  accent: gold[300],
  success: teal[300],
  error: red[300],
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export type ThemeColors = typeof lightTheme;

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
  /** False until the saved preference has been read, so nothing paints early. */
  isReady: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: lightTheme,
  isReady: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(colorScheme === 'dark');
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // If no saved preference, use system default
          setIsDark(colorScheme === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadThemePreference();
  }, [colorScheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
