import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Position } from '@/types/bible';

type LastPositionContextType = {
  lastPosition: Position;
  /** False until storage has been read — nothing should save before then. */
  isLoaded: boolean;
  saveLastPosition: (book: string, chapter: number) => void;
};

const DEFAULT_POSITION: Position = { book: 'Genesis', chapter: 1 };

const LastPositionContext = createContext<LastPositionContextType>({
  lastPosition: DEFAULT_POSITION,
  isLoaded: false,
  saveLastPosition: () => {},
});

/**
 * One shared position rather than a hook instance per screen. Separate
 * instances each read storage once at mount, so the home screen kept showing
 * whatever was saved when it first mounted while the reader moved on.
 */
export const LastPositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastPosition, setLastPosition] = useState<Position>(DEFAULT_POSITION);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('lastPosition');
        if (saved) {
          setLastPosition(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading last position:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    load();
  }, []);

  const saveLastPosition = async (book: string, chapter: number) => {
    const position = { book, chapter };
    setLastPosition(position);

    try {
      await AsyncStorage.setItem('lastPosition', JSON.stringify(position));
    } catch (error) {
      console.error('Error saving last position:', error);
    }
  };

  return (
    <LastPositionContext.Provider value={{ lastPosition, isLoaded, saveLastPosition }}>
      {children}
    </LastPositionContext.Provider>
  );
};

export const useLastPosition = () => useContext(LastPositionContext);
