import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Fonts, AppImages } from '../res';
import AppButton from '../components/AppButton';
import PremiumTheme from '../res/PremiumTheme';

export default function Loyalty() {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const loyaltyPoints = 200;

  if (!token) {
    return (
      <ImageBackground source={AppImages.loginBg} style={styles.guestContainer}>
        <View style={styles.guestCard}>
          <Text style={styles.guestKicker}>CRAV LOYALTY</Text>
          <Text style={styles.colonyTitle}>Fresh rewards for every bite.</Text>
          <AppButton text={'LOGIN'} onPress={() => navigation.navigate('Login')} style={styles.authBtn} />
          <AppButton text={'JOIN NOW'} onPress={() => navigation.navigate('Signup')} style={styles.authBtnAlt} textStyle={styles.authBtnAltText} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>CRAV CLUB</Text>
      <Text style={styles.heading}>Your loyalty, served premium.</Text>
      <TouchableOpacity activeOpacity={0.9} style={styles.clubCard} onPress={() => navigation.navigate('LoyaltyPass')}>
        <Image source={AppImages.logo} style={styles.cardWatermark} resizeMode="contain" />
        <View style={styles.cardTopRow}>
          <Text style={styles.cardType}>CLUBCARD</Text>
          <View style={styles.tierBadge}><Text style={styles.tierText}>GOLD</Text></View>
        </View>
        <View>
          <Text style={styles.tapText}>Tap to scan</Text>
          <Text style={styles.tapSub}>Collect rewards on every visit</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Vouchers</Text>
          <Text style={styles.statValue}>£{(loyaltyPoints / 10).toFixed(2)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Coupons</Text>
          <Text style={styles.statValue}>6</Text>
        </View>
      </View>

      <View style={styles.pointsWrapper}>
        <View>
          <Text style={styles.pointsNumber}>{loyaltyPoints}</Text>
          <Text style={styles.pointsLabelText}>Total Points</Text>
        </View>
        <TouchableOpacity style={styles.activityBtn} activeOpacity={0.75}>
          <Text style={styles.activityText}>View Activity ❯</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumTheme.paper },
  content: { padding: 18, paddingBottom: 36 },
  kicker: { color: PremiumTheme.gold, fontSize: 11, letterSpacing: 2.4, fontFamily: Fonts.instrumentSansMedium, marginTop: 18 },
  heading: { color: PremiumTheme.ink, fontSize: 34, lineHeight: 39, fontFamily: Fonts.instrumentSansMedium, marginTop: 6, marginBottom: 18 },
  clubCard: {
    backgroundColor: PremiumTheme.cream,
    minHeight: 230,
    borderRadius: 30,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    shadowColor: PremiumTheme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 6,
  },
  cardWatermark: { position: 'absolute', right: -10, bottom: -20, width: 190, height: 190, opacity: 0.1, tintColor: PremiumTheme.goldDark },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { color: PremiumTheme.ink, fontSize: 18, fontWeight: '700', letterSpacing: 2 },
  tierBadge: { backgroundColor: PremiumTheme.ink, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tierText: { color: PremiumTheme.surface, fontWeight: '800', fontSize: 11, letterSpacing: 1.2 },
  tapText: { color: PremiumTheme.ink, fontSize: 27, fontWeight: '800' },
  tapSub: { color: PremiumTheme.muted, fontSize: 13, marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: PremiumTheme.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 42, backgroundColor: PremiumTheme.border },
  statLabel: { fontSize: 12, color: PremiumTheme.muted, marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: '900', color: PremiumTheme.ink },
  pointsWrapper: { marginTop: 20, padding: 24, borderRadius: 24, backgroundColor: PremiumTheme.surface, borderWidth: 1, borderColor: PremiumTheme.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsNumber: { fontSize: 56, fontWeight: '900', color: PremiumTheme.ink },
  pointsLabelText: { fontSize: 15, color: PremiumTheme.muted, marginTop: -8 },
  activityBtn: { paddingVertical: 8 },
  activityText: { color: PremiumTheme.goldDark, fontWeight: '800', fontSize: 15 },
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  guestCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 30, padding: 24, borderWidth: 1, borderColor: PremiumTheme.border, alignItems: 'center' },
  guestKicker: { color: PremiumTheme.gold, letterSpacing: 2.4, fontSize: 11, fontWeight: '700' },
  colonyTitle: { fontSize: 32, lineHeight: 37, color: PremiumTheme.ink, fontWeight: '800', marginVertical: 18, textAlign: 'center' },
  authBtn: { backgroundColor: PremiumTheme.ink, width: '100%', marginTop: 8, marginHorizontal: 0 },
  authBtnAlt: { backgroundColor: PremiumTheme.surface, borderWidth: 1, borderColor: PremiumTheme.border, width: '100%', marginTop: 12, marginHorizontal: 0 },
  authBtnAltText: { color: PremiumTheme.ink },
});
