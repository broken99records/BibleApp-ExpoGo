import { StyleSheet, Text } from 'react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import PageLayout from '@/components/PageLayout';

export default function AnthemScreen() {
  const { colors } = useTheme();

  return (
    <PageLayout>
      <Text style={[styles.heading, { color: colors.text }]}>
        UEC National Church Anthem
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        O Lamb of God,{'\n'}
        And Saviour of the world,{'\n'}
        Who by your Blood re-deemed{'\n'}
        Us unto God; Make us a pure and holy{'\n'}
        United Evangelical Church.
      </Text>

      <Text style={[styles.chorus, { color: colors.text }]}>
        CHORUS:{'\n'}
        Sanctify us by your{'\n'}
        Truth Lord (3 times){'\n'}
        Sanctify us Lord{'\n'}
        We pray your word is truth.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        Oh gracious Father,{'\n'}
        Teach us to obey,{'\n'}
        Your word and free us{'\n'}
        From all earthly strife;{'\n'}
        And keep us shining{'\n'}
        Where ever we are as light{'\n'}
        Unto the world.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        Great Father, Son and{'\n'}
        Blessed Holy Ghost,{'\n'}
        Please make us strong,{'\n'}
        Your Gospel to proclaim,{'\n'}
        Oh may our lives your{'\n'}
        True example be,{'\n'}
        For all the World to see.
      </Text>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: tokens.fontSize['2xl'],
    fontFamily: 'Sans-Bold',
    marginBottom: 20,
  },

  body: {
    fontSize: tokens.fontSize.base,
    fontFamily: 'Sans-Regular',
    lineHeight: 26,
    marginBottom: 24,
  },

  chorus: {
    fontSize: tokens.fontSize.base,
    fontFamily: 'Sans-Bold',
    lineHeight: 26,
    marginBottom: 24,
  },
});
