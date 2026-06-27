import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Fonts, AppImages } from '../res';
import AppButton from '../components/AppButton';
import PremiumTheme from '../res/PremiumTheme';
import {
  CravPage,
  Hero,
  PremiumCard,
  MiniStat,
  CravButton,
} from '../components/CravPremium';

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
          <AppButton
            text={'LOGIN'}
            onPress={() => navigation.navigate('Login')}
            style={styles.authBtn}
          />
          <AppButton
            text={'JOIN NOW'}
            onPress={() => navigation.navigate('Signup')}
            style={styles.authBtnAlt}
            textStyle={styles.authBtnAltText}
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <CravPage title={null}>
      <Hero
        kicker="CRAV CLUB"
        title="Your loyalty, served premium."
        subtitle="Collect points, unlock rewards, and keep the same loyalty actions with a lighter CRAV editorial look."
      />
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.clubCard}
        onPress={() => navigation.navigate('LoyaltyPass')}
      >
        <Image
          source={AppImages.logo}
          style={styles.cardWatermark}
          resizeMode="contain"
        />
        <View style={styles.cardTopRow}>
          <Text style={styles.cardType}>CLUBCARD</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>GOLD</Text>
          </View>
        </View>
        <View>
          <Text style={styles.tapText}>Tap to scan</Text>
          <Text style={styles.tapSub}>Collect rewards on every visit</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.statsRow}>
        <MiniStat
          label="Vouchers"
          value={`£${(loyaltyPoints / 10).toFixed(2)}`}
        />
        <View style={{ width: 12 }} />
        <MiniStat label="Coupons" value="6" />
      </View>
      <PremiumCard style={styles.pointsWrapper}>
        <View>
          <Text style={styles.pointsNumber}>{loyaltyPoints}</Text>
          <Text style={styles.pointsLabelText}>Total Points</Text>
        </View>
        <CravButton
          title="View Activity"
          variant="outline"
          style={{ marginTop: 0 }}
        />
      </PremiumCard>
    </CravPage>
  );
}

const styles = StyleSheet.create({
  clubCard: {
    backgroundColor: PremiumTheme.cream,
    minHeight: 230,
    borderRadius: 32,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    shadowColor: PremiumTheme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  cardWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -20,
    width: 190,
    height: 190,
    opacity: 0.1,
    tintColor: PremiumTheme.goldDark,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: PremiumTheme.ink,
    fontSize: 18,
    fontFamily: Fonts.instrumentSansMedium,
    letterSpacing: 2,
  },
  tierBadge: {
    backgroundColor: PremiumTheme.ink,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tierText: {
    color: PremiumTheme.surface,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  tapText: {
    color: PremiumTheme.ink,
    fontSize: 29,
    fontFamily: Fonts.instrumentSansMedium,
  },
  tapSub: {
    color: PremiumTheme.muted,
    fontSize: 13,
    marginTop: 4,
    fontFamily: Fonts.instrumentSansRegular,
  },
  statsRow: { flexDirection: 'row', marginTop: 18 },
  pointsWrapper: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 56,
    fontFamily: Fonts.instrumentSansMedium,
    color: PremiumTheme.ink,
  },
  pointsLabelText: {
    fontSize: 15,
    color: PremiumTheme.muted,
    marginTop: -8,
    fontFamily: Fonts.instrumentSansRegular,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guestCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    alignItems: 'center',
  },
  guestKicker: {
    color: PremiumTheme.gold,
    letterSpacing: 2.4,
    fontSize: 11,
    fontWeight: '700',
  },
  colonyTitle: {
    fontSize: 32,
    lineHeight: 37,
    color: PremiumTheme.ink,
    fontWeight: '800',
    marginVertical: 18,
    textAlign: 'center',
  },
  authBtn: {
    backgroundColor: PremiumTheme.ink,
    width: '100%',
    marginTop: 8,
    marginHorizontal: 0,
  },
  authBtnAlt: {
    backgroundColor: PremiumTheme.surface,
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    width: '100%',
    marginTop: 12,
    marginHorizontal: 0,
  },
  authBtnAltText: { color: PremiumTheme.ink },
});
