import { StyleSheet, Text } from 'react-native';
import { tokens, useTheme } from '@/context/ThemeContext';
import PageLayout from '@/components/PageLayout';

export default function creed() {
    const { colors } = useTheme();

    return (
        <PageLayout>
            <Text style={[styles.heading, { color: colors.text }]}>
                Church Creed
            </Text>

            <Text style={[styles.body, { color: colors.text }]}>
                The Doctrine of United Evangelical Church is and shall be that United Evangelical Church affirms its faith in the Supreme Authority and Sufficiency of the Holy Scripture as the word of God; the Eternal oneness in the Godhead of the Father, the Son and the Holy Spirit. The love of God to the world manifested in the gift of His Son, the Virgin Birth of our Lord Jesus Christ, His sinless life, His atoning death, His bodily resurrection, His ascension and His coming again.



                Man's fall, alienation, spiritual death, eternal punishment, the necessity of repentance, redemption from sin through the propitiatory sacrifice of the Lord Jesus Christ; Justification by faith alone, the necessity of the direct work of the Holy Spirit to impart and sustain spiritual life, the essential unity of all who believe on the Lord Jesus Christ and the obligation resting on those who bear His Name to afford evidence of their discipleship by a life of obedience to His commands.
            </Text>
        </PageLayout>
    );
}

const styles = StyleSheet.create({
    heading: {
        fontSize: tokens.fontSize['2xl'],
        fontFamily: 'Sans-Bold',
        marginBottom: 16,
    },

    body: {
        fontSize: tokens.fontSize.base,
        fontFamily: 'Sans-Regular',
        lineHeight: 26,
    },
});
