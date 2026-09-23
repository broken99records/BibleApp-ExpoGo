import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

type ReadingPreferences = {
  fontSize: number;
  lineHeight: number;
};

// Scripture is read in long sittings, so the body runs a step larger than the
// rest of the app and loose enough to track across a full column.
const DEFAULT_PREFERENCES: ReadingPreferences = {
  fontSize: 17,
  lineHeight: 29,
};

export const useReadingPreferences = () => {
  const [preferences, setPreferences] = useState<ReadingPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('readingPreferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading reading preferences:', error);
    }
  };

  const updatePreferences = async (updates: Partial<ReadingPreferences>) => {
    try {
      const newPrefs = { ...preferences, ...updates };
      await AsyncStorage.setItem('readingPreferences', JSON.stringify(newPrefs));
      setPreferences(newPrefs);
    } catch (error) {
      console.error('Error saving reading preferences:', error);
    }
  };

  return {
    fontSize: preferences.fontSize,
    lineHeight: preferences.lineHeight,
    setFontSize: (size: number) => updatePreferences({ fontSize: size }),
    setLineHeight: (height: number) => updatePreferences({ lineHeight: height }),
  };
};
