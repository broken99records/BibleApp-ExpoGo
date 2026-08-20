import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Book } from 'lucide-react-native';

export default function CustomHeader() {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.leftContainer}>
        <Book size={24} color={colors.primary} style={styles.icon} />
        <Text style={[styles.title, { color: colors.text }]}>Holy Bible</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Sans-Bold',
  },
});