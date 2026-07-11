import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
  Easing,
  StatusBar,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Fonts, AppImages } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import {
  CravPage,
  Hero,
  PremiumCard,
  MiniStat,
  CravButton,
  LuxeTabs,
} from '../components/CravPremium';

const T = PremiumTheme;
const fontReg = Fonts.instrumentSansRegular;
const fontMed = Fonts.instrumentSansMedium;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

export default function Loyalty() {
  const navigation = useNavigation();
  const token = useSelector(state => state.auth.token);
  const loyaltyPoints = 200;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  if (!token) {
    return (
      <ImageBackground
        source={AppImages.loginBg}
        style={styles.guestContainer}
        resizeMode="cover"
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <View style={styles.guestDim} />
        <View style={styles.guestBottomFade} />
        <View style={styles.guestCard}>
          <View style={styles.guestHandle} />
          <Text style={styles.guestKicker}>COLONY PRIVILEGE</Text>
          <Text style={styles.colonyTitle}>
            Fresh rewards, served with luxury.
          </Text>
          <Text style={styles.guestSub}>
            Sign in or join to unlock benefits, offers and quick member access.
          </Text>

          <View style={styles.authActions}>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.authPrimaryBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.authPrimaryText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.authSecondaryBtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.authSecondaryText}>JOIN NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-90, 150],
  });

  return (
    <CravPage title={null}>
      <Hero
        kicker="Colony Privilege"
        title="Your loyalty, served premium."
        subtitle="Collect points, unlock rewards and access member benefits through a calmer luxury dashboard."
      />

      <LuxeTabs
        tabs={[
          { key: 'card', label: 'Card' },
          { key: 'points', label: 'Points' },
          { key: 'benefits', label: 'Benefits' },
        ]}
        activeKey="card"
        onChange={key =>
          key === 'benefits' && navigation.navigate('MyBenefits')
        }
        style={styles.tabs}
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
        <Animated.View
          style={[
            styles.shimmer,
            { transform: [{ translateX }, { rotate: '18deg' }] },
          ]}
        />
        <View style={styles.cardTopRow}>
          <Text style={styles.cardType}>COLONY CARD</Text>
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
  tabs: { marginBottom: 18 },
  clubCard: {
    backgroundColor: T.ink,
    minHeight: 238,
    borderRadius: 34,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: T.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 8,
  },
  shimmer: {
    position: 'absolute',
    top: -50,
    bottom: -60,
    width: 42,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  cardWatermark: {
    position: 'absolute',
    right: -8,
    bottom: -24,
    width: 190,
    height: 190,
    opacity: 0.08,
    tintColor: T.surface,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: T.champagne,
    fontSize: 17,
    fontFamily: fontBold,
    letterSpacing: 2,
  },
  tierBadge: {
    backgroundColor: T.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tierText: {
    color: T.surface,
    fontFamily: fontBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  tapText: {
    color: T.surface,
    fontSize: 30,
    fontFamily: fontBold,
    letterSpacing: -0.4,
  },
  tapSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    marginTop: 4,
    fontFamily: fontReg,
  },
  statsRow: { flexDirection: 'row', marginTop: 18 },
  pointsWrapper: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsNumber: { fontSize: 54, fontFamily: fontBold, color: T.ink },
  pointsLabelText: {
    fontSize: 14,
    color: T.muted,
    marginTop: -8,
    fontFamily: fontReg,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 48,
    paddingBottom: Platform.OS === 'ios' ? 124 : 112,
    backgroundColor: T.ink,
  },
  guestDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,15,10,0.12)',
  },
  guestBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
    backgroundColor: 'rgba(20,15,10,0.38)',
  },
  guestCard: {
    width: '100%',
    backgroundColor: 'rgba(255,253,248,0.91)',
    borderRadius: 36,
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.78)',
    alignItems: 'center',
    shadowColor: T.shadow,
    shadowOpacity: 0.28,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 14,
  },
  guestHandle: {
    width: 48,
    height: 4,
    borderRadius: 4,
    backgroundColor: T.champagne,
    marginBottom: 18,
  },
  guestKicker: {
    color: T.primary,
    letterSpacing: 2.4,
    fontSize: 11,
    fontFamily: fontBold,
  },
  colonyTitle: {
    fontSize: 31,
    lineHeight: 38,
    color: T.ink,
    fontFamily: fontBold,
    marginTop: 13,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  guestSub: {
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  authActions: { width: '100%', marginTop: 20 },
  authPrimaryBtn: {
    width: '100%',
    height: 58,
    borderRadius: 999,
    backgroundColor: T.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.primary,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },
  authPrimaryText: {
    color: T.surface,
    fontFamily: fontBold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
  authSecondaryBtn: {
    width: '100%',
    height: 58,
    borderRadius: 999,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  authSecondaryText: {
    color: T.ink,
    fontFamily: fontBold,
    fontSize: 13,
    letterSpacing: 1.6,
  },
});
