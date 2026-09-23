
import { StyleSheet, Text } from 'react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import PageLayout from '@/components/PageLayout';

export default function CreedScreen() {
  const { colors } = useTheme();

  return (
    <PageLayout>
      <Text style={[styles.heading, { color: colors.text }]}>
        Church Creed
      </Text>

      <Text style={[styles.intro, { color: colors.text }]}>
        The Doctrine of United Evangelical Church
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        is and shall be that United Evangelical Church affirms its faith in
        the Supreme Authority and Sufficiency of the Holy Scripture as the
        Word of God; the Eternal oneness in the Godhead of the Father, the
        Son and the Holy Spirit.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        We affirm the love of God to the world manifested in the gift of His
        Son, the Virgin Birth of our Lord Jesus Christ, His sinless life, His
        atoning death, His bodily resurrection, His ascension and His coming
        again.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        We affirm man's fall, alienation, spiritual death, eternal
        punishment, the necessity of repentance, and redemption from sin
        through the propitiatory sacrifice of the Lord Jesus Christ.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        We affirm justification by faith alone, the necessity of the direct
        work of the Holy Spirit to impart and sustain spiritual life, and the
        essential unity of all who believe on the Lord Jesus Christ.
      </Text>

      <Text style={[styles.body, { color: colors.text }]}>
        We affirm the obligation resting on those who bear His Name to afford
        evidence of their discipleship by a life of obedience to His
        commands.
      </Text>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: tokens.fontSize['2xl'],
    fontFamily: 'Sans-Bold',
    marginBottom: 24,
  },

  intro: {
    fontSize: 18,
    fontFamily: 'serif-bold',
    lineHeight: 28,
    marginBottom: 12,
  },

  body: {
    fontSize: 17,
    fontFamily: 'serif-regular-lora',
    lineHeight: 29,
    marginBottom: 22,
  },
});

