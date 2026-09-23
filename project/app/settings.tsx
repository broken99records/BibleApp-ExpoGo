import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens, useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Info, Mail, Star, Github } from 'lucide-react-native';

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const themeOptionText = isDark ? 'Dark Mode' : 'Light Mode';
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: tokens.spacing[4],
        paddingBottom: insets.bottom + tokens.spacing[4],
      }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Display</Text>
        
        <TouchableOpacity
          style={[styles.option, { backgroundColor: colors.backgroundSecondary }]}
          onPress={toggleTheme}
        >
          <View style={styles.optionContent}>
            <Text style={[styles.optionText, { color: colors.text }]}>
              {themeOptionText}
            </Text>
            <ThemeIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { borderBottomColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Info size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>1.0.0</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Github size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Source Code</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Mail size={20} color={colors.text} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Contact</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: tokens.spacing[4],
    paddingHorizontal: tokens.spacing[4],
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Sans-Medium',
    marginBottom: tokens.spacing[4],
    marginTop: tokens.spacing[1],
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing[3],
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: tokens.spacing[3],
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Sans-Regular',
  },
  settingValue: {
    fontSize: 16,
    fontFamily: 'Sans-Regular',
  },
  option: {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing[4],
    marginBottom: tokens.spacing[3],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Sans-Medium',
  },
});