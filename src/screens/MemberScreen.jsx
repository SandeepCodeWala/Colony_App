import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar, Animated, Easing } from 'react-native';
import ReserveHeader from '../components/ReserveHeader';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { LuxeTabs, MiniStat, PremiumCard, CravButton } from '../components/CravPremium';

const T = PremiumTheme;
const fontReg = Fonts.instrumentSansRegular;
const fontMed = Fonts.instrumentSansMedium;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

const MemberScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [memberShip, setMemberShip] = useState('');
  const [tab, setTab] = useState('overview');
  const anim = useRef(new Animated.Value(0)).current;

  const fetchUser = async () => {
    try {
      const storedName = await AsyncStorage.getItem('name');
      const membershipNum = await AsyncStorage.getItem('membershipNumber');
      setUserName(storedName || 'Member');
      setMemberShip(membershipNum || 'N/A');
    } catch (error) {
      console.log('❌ Error fetching user:', error);
    }
  };

  useFocusEffect(useCallback(() => { fetchUser(); }, []));

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 620, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={T.paper} barStyle="dark-content" />
      <ReserveHeader title="Loyalty" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.kicker}>COLONY PRIVILEGE</Text>
                <Text style={styles.memberName}>{userName}</Text>
                <Text style={styles.memberId}>Membership {memberShip}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('LoyaltyPass')} style={styles.ecardBtn} activeOpacity={0.84}>
                <Text style={styles.ecardText}>E-CARD</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.memberType}>MEMBER TIER</Text>
          </View>

          <LuxeTabs tabs={[{ key: 'overview', label: 'Overview' }, { key: 'tier', label: 'Tier' }, { key: 'offers', label: 'Offers' }]} activeKey={tab} onChange={setTab} style={styles.tabs} />

          {tab === 'overview' && (
            <>
              <View style={styles.statsRow}>
                <MiniStat label="Points" value="0" />
                <View style={{ width: 12 }} />
                <MiniStat label="Offers" value="2" />
              </View>
              <PremiumCard style={styles.collectContainer}>
                <Image source={AppImages.restaurant} style={styles.imageBanner} />
                <View style={styles.collectTextContainer}>
                  <Text style={styles.collectTitle}>Collect your points</Text>
                  <Text style={styles.collectSub}>Collect points on every eligible visit and exchange them for premium rewards.</Text>
                  <CravButton title="Collect Points" variant="outline" style={{ marginTop: 14 }} />
                </View>
              </PremiumCard>
            </>
          )}

          {tab === 'tier' && (
            <PremiumCard style={styles.tierContainer}>
              <Text style={styles.tierTitle}>Tier Points</Text>
              <Text style={styles.tierValue}>0</Text>
              <Text style={styles.tierDescription}>Spend an additional USD 2,500 to collect 5,000 Tier Points and move closer to Silver.</Text>
              <View style={styles.progressBar}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
                <View style={styles.dot} />
              </View>
              <View style={styles.tierLabels}><Text style={styles.tierLabel}>Member</Text><Text style={styles.tierLabel}>Silver</Text><Text style={styles.tierLabel}>Gold</Text><Text style={styles.tierLabel}>Platinum</Text></View>
            </PremiumCard>
          )}

          {tab === 'offers' && (
            <View style={styles.bottomBtns}>
              <TouchableOpacity style={styles.offerBtn} activeOpacity={0.84}><Text style={styles.offerText}>% MY OFFERS</Text></TouchableOpacity>
              <TouchableOpacity style={styles.exchangeBtn} activeOpacity={0.84}><Text style={styles.offerText}>⇄ EXCHANGE POINTS</Text></TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
  scrollContainer: { paddingHorizontal: 18, paddingBottom: 118 },
  heroCard: { backgroundColor: T.ink, borderRadius: 34, padding: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', shadowColor: T.shadow, shadowOpacity: 0.22, shadowRadius: 24, shadowOffset: { width: 0, height: 16 }, elevation: 8 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { fontFamily: fontBold, color: T.champagne, fontSize: 10, letterSpacing: 2.2, textTransform: 'uppercase' },
  memberName: { fontSize: 28, fontFamily: fontBold, color: T.surface, marginTop: 10, letterSpacing: -0.5 },
  memberId: { fontSize: 13, color: 'rgba(255,255,255,0.68)', marginTop: 5, fontFamily: fontReg },
  memberType: { fontSize: 11, color: T.champagne, marginTop: 16, letterSpacing: 2, fontFamily: fontBold },
  ecardBtn: { backgroundColor: T.primary, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 9 },
  ecardText: { color: T.surface, fontSize: 11, fontFamily: fontBold, letterSpacing: 1.2 },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.14)', marginTop: 20 },
  tabs: { marginTop: 18, marginBottom: 18 },
  statsRow: { flexDirection: 'row', marginBottom: 18 },
  collectContainer: { padding: 0, overflow: 'hidden', marginBottom: 18 },
  imageBanner: { width: '100%', height: 190, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  collectTextContainer: { padding: 20 },
  collectTitle: { fontSize: 22, fontFamily: fontBold, color: T.ink },
  collectSub: { fontSize: 14, color: T.muted, marginTop: 8, lineHeight: 22, fontFamily: fontReg },
  tierContainer: { marginBottom: 18 },
  tierTitle: { fontSize: 14, color: T.muted, fontFamily: fontBold, letterSpacing: 1, textTransform: 'uppercase' },
  tierValue: { fontSize: 42, color: T.ink, fontFamily: fontBold, marginTop: 8 },
  tierDescription: { fontSize: 14, color: T.muted, lineHeight: 22, marginTop: 8, fontFamily: fontReg },
  progressBar: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: T.champagne, borderWidth: 2, borderColor: T.surface },
  dotActive: { backgroundColor: T.primary },
  line: { flex: 1, height: 2, backgroundColor: T.line },
  tierLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  tierLabel: { fontSize: 12, color: T.muted, fontFamily: fontReg },
  bottomBtns: { gap: 12, marginBottom: 24 },
  offerBtn: { borderWidth: 1, borderColor: T.primary, borderRadius: 24, paddingVertical: 15, alignItems: 'center', backgroundColor: T.surface },
  exchangeBtn: { borderWidth: 1, borderColor: T.border, borderRadius: 24, paddingVertical: 15, alignItems: 'center', backgroundColor: T.primarySoft },
  offerText: { color: T.primaryDark, fontSize: 13, fontFamily: fontBold, letterSpacing: 1.2 },
});
