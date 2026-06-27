import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppImages, Fonts } from '../res';
import CommonDropdown from '../components/CommonDropdown';
import PremiumTheme from '../res/PremiumTheme';
import { CravPage, Hero, PremiumCard } from '../components/CravPremium';

const titleData = [{ label: 'MEMBER', value: 'member' }, { label: 'SILVER', value: 'silver' }, { label: 'GOLD', value: 'gold' }];
const benefits = ['Member-Only Rates', 'Complimentary Wi-Fi', 'Welcome Back Reward on Longer Stays', 'Exclusive dining privileges'];

const MyBenefits = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('member');
  return (
    <CravPage title="TIER BENEFITS" onBack={() => navigation.goBack()}>
      <Hero kicker="CRAV BENEFITS" title="Member Benefits" subtitle="Discover enticing privileges to make your moments with Jumeirah even more special." />
      <View style={styles.dropdownWrap}><CommonDropdown data={titleData} value={title} onChange={setTitle} /></View>
      <Image source={AppImages.lounge} style={styles.image} />
      <PremiumCard style={styles.card}>
        <Text style={styles.sectionTitle}>Stay benefits</Text>
        {benefits.map(item => <View key={item} style={styles.bulletRow}><Text style={styles.bullet}>—</Text><Text style={styles.bulletText}>{item}</Text></View>)}
      </PremiumCard>
    </CravPage>
  );
};
export default MyBenefits;
const styles = StyleSheet.create({
  dropdownWrap: { width: 170, marginBottom: 16 },
  image: { width: '100%', height: 220, borderRadius: 30, marginBottom: 18 },
  card: { marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.instrumentSansMedium, color: PremiumTheme.tomato, fontSize: 12, letterSpacing: 2, marginBottom: 14, textTransform: 'uppercase' },
  bulletRow: { flexDirection: 'row', marginBottom: 12 },
  bullet: { color: PremiumTheme.gold, fontSize: 18, marginRight: 10 },
  bulletText: { color: PremiumTheme.ink, fontFamily: Fonts.instrumentSansRegular, fontSize: 15, flex: 1 },
});
