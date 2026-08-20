import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useLastPosition } from '@/context/LastPositionContext';
import BibleReader from '@/components/BibleReader';

export default function BibleTab() {
  const { colors } = useTheme();
  const { lastPosition, isLoaded } = useLastPosition();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Mounting before the saved position resolves would start the reader on
          Genesis 1 and save that over the real one. */}
      {isLoaded ? <BibleReader initialPosition={lastPosition} /> : null}
    </View>
  );
}
