import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { CravPage, Hero, PremiumCard, MiniStat, EmptyState } from '../components/CravPremium';

const MyStatement = () => {
  const navigation = useNavigation();
  return (
    <CravPage title="MY STATEMENT" onBack={() => navigation.goBack()}>
      <Hero kicker="CRAV STATEMENT" title="Points activity" subtitle="View your points summary and transaction history." />
      <View style={styles.row}>
        <MiniStat label="Points due to expire by invalid date" value="0" />
        <View style={{ width: 12 }} />
        <MiniStat label="Total points expired" value="0" />
      </View>
      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <Text style={styles.note}>There are no statement transactions available right now.</Text>
      </PremiumCard>
      <EmptyState title="No transactions" subtitle="Your future points and rewards activity will appear here." />
    </CravPage>
  );
};
export default MyStatement;
const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 16 },
  card: { marginBottom: 16 },
  sectionTitle: { fontFamily: Fonts.instrumentSansMedium, color: PremiumTheme.tomato, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  note: { fontFamily: Fonts.instrumentSansRegular, color: PremiumTheme.muted, fontSize: 14, lineHeight: 21 },
});
