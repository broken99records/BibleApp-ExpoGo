import { useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type TabIcon = { default: ImageSourcePropType; selected: ImageSourcePropType };

/**
 * iOS takes the SF Symbol pair and swaps to the filled glyph itself. Android
 * gets a rasterised Ionicon instead, coloured here rather than by
 * expo-router's `VectorIcon`, which rasterises every glyph at a hardcoded
 * white and leaves it invisible on a light tab bar.
 *
 * react-native-screens 4.16 declares `selectedIcon` iOS-only and reads only
 * `icon` for Android, so the selected raster is passed but currently ignored
 * there — Android distinguishes the active tab by colour until that lands.
 */
function useTabIcon(outline: IoniconName, filled: IoniconName): TabIcon | undefined {
  const { colors } = useTheme();
  const [icon, setIcon] = useState<TabIcon>();

  useEffect(() => {
    let active = true;

    Promise.all([
      Ionicons.getImageSource(outline, 24, colors.textSecondary),
      Ionicons.getImageSource(filled, 24, colors.primary),
    ]).then(([defaultSource, selectedSource]) => {
      if (active && defaultSource && selectedSource) {
        setIcon({ default: defaultSource, selected: selectedSource });
      }
    });

    return () => {
      active = false;
    };
  }, [outline, filled, colors.textSecondary, colors.primary]);

  return icon;
}

export default function TabsLayout() {
  const { colors } = useTheme();

  const homeIcon = useTabIcon('home-outline', 'home');
  const bibleIcon = useTabIcon('book-outline', 'book');
  const searchIcon = useTabIcon('search-outline', 'search');

  const labelStyle = {
    default: { color: colors.textSecondary, fontFamily: 'Sans-Medium' },
    selected: { color: colors.primary, fontFamily: 'Sans-Medium' },
  };

  return (
    <NativeTabs
      backgroundColor={colors.background}
      tintColor={colors.primary}
      indicatorColor={colors.surfaceSelected}
      iconColor={{ default: colors.textSecondary, selected: colors.primary }}
      labelStyle={labelStyle}
      labelVisibilityMode="labeled"
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} androidSrc={homeIcon} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bible">
        <Label>Bible</Label>
        <Icon sf={{ default: 'book', selected: 'book.fill' }} androidSrc={bibleIcon} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Label>Search</Label>
        <Icon
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
          androidSrc={searchIcon}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
