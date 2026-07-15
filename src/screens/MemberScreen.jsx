import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReserveHeader from '../components/ReserveHeader';
import ProfileAvatar from '../components/ProfileAvatar';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import {
  LuxeTabs,
  MiniStat,
  PremiumCard,
  CravButton,
} from '../components/CravPremium';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';

const T = PremiumTheme;
const fontReg = Fonts.instrumentSansRegular;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

const MemberScreen = () => {
  const navigation = useNavigation();
  const reduxUser = useSelector(state => state.auth?.user);
  const reduxMembership = useSelector(
    state => state.auth?.membershipNumber || state.auth?.user?.membership_number,
  );
  const { width, height } = useWindowDimensions();

  const [userName, setUserName] = useState(reduxUser?.name || 'Member');
  const [memberShip, setMemberShip] = useState(reduxMembership || 'N/A');
  const [tab, setTab] = useState('overview');
  const [ecardVisible, setEcardVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const loading = useFirstRenderSkeleton(620);

  const fetchUser = async () => {
    try {
      const storedName = await AsyncStorage.getItem('name');
      const membershipNum = await AsyncStorage.getItem('membershipNumber');
      setUserName(reduxUser?.name || storedName || 'Member');
      setMemberShip(reduxMembership || membershipNum || 'N/A');
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [reduxMembership, reduxUser?.name]),
  );

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  if (loading) return <ScreenSkeleton variant="page" />;

  const modalWidth = Math.min(width - 30, 430);
  const qrSize = Math.min(220, modalWidth - 96, height * 0.28);
  const profilePicture =
    reduxUser?.profilePicture || reduxUser?.profile_picture || null;
  const qrValue = JSON.stringify({
    name: userName,
    phone: reduxUser?.phone || '',
    membership: memberShip,
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={T.paper} barStyle="dark-content" />
      <ReserveHeader title="Loyalty" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.memberRow}>
                <ProfileAvatar
                  name={userName}
                  profilePicture={profilePicture}
                  size={58}
                  style={styles.heroAvatar}
                />
                <View style={styles.heroMemberCopy}>
                  <Text style={styles.kicker}>COLONY PRIVILEGE</Text>
                  <Text numberOfLines={1} style={styles.memberName}>
                    {userName}
                  </Text>
                  <Text style={styles.memberId}>Membership {memberShip}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setEcardVisible(true)}
                style={styles.ecardBtn}
                activeOpacity={0.84}
              >
                <Ionicons name="card-outline" size={15} color={T.surface} />
                <Text style={styles.ecardText}>E-CARD</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroDivider} />
            <Text style={styles.memberType}>MEMBER TIER</Text>
          </View>

          <LuxeTabs
            tabs={[
              { key: 'overview', label: 'Overview' },
              { key: 'tier', label: 'Tier' },
              { key: 'offers', label: 'Offers' },
            ]}
            activeKey={tab}
            onChange={setTab}
            style={styles.tabs}
          />

          {tab === 'overview' ? (
            <>
              <View style={styles.statsRow}>
                <MiniStat
                  label="Points"
                  value={String(reduxUser?.loyalty_points ?? 0)}
                />
                <View style={{ width: 12 }} />
                <MiniStat label="Offers" value="2" />
              </View>
              <PremiumCard style={styles.collectContainer}>
                <Image source={AppImages.restaurant} style={styles.imageBanner} />
                <View style={styles.collectTextContainer}>
                  <Text style={styles.collectTitle}>Collect your points</Text>
                  <Text style={styles.collectSub}>
                    Collect points on every eligible visit and exchange them for premium rewards.
                  </Text>
                  <CravButton
                    title="Collect Points"
                    variant="outline"
                    style={{ marginTop: 14 }}
                  />
                </View>
              </PremiumCard>
            </>
          ) : null}

          {tab === 'tier' ? (
            <PremiumCard style={styles.tierContainer}>
              <Text style={styles.tierTitle}>Tier Points</Text>
              <Text style={styles.tierValue}>
                {String(reduxUser?.loyalty_points ?? 0)}
              </Text>
              <Text style={styles.tierDescription}>
                Continue collecting Tier Points on eligible visits to unlock your next Colony membership tier.
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
                <View style={styles.dot} />
              </View>
              <View style={styles.tierLabels}>
                <Text style={styles.tierLabel}>Member</Text>
                <Text style={styles.tierLabel}>Silver</Text>
                <Text style={styles.tierLabel}>Gold</Text>
                <Text style={styles.tierLabel}>Platinum</Text>
              </View>
            </PremiumCard>
          ) : null}

          {tab === 'offers' ? (
            <View style={styles.bottomBtns}>
              <TouchableOpacity style={styles.offerBtn} activeOpacity={0.84}>
                <Text style={styles.offerText}>% MY OFFERS</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exchangeBtn} activeOpacity={0.84}>
                <Text style={styles.offerText}>⇄ EXCHANGE POINTS</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>

      <Modal
        visible={ecardVisible}
        transparent
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => setEcardVisible(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setEcardVisible(false)}
          />

          <View style={[styles.modalCard, { width: modalWidth }]}>
            <View style={styles.modalAccent} />
            <TouchableOpacity
              onPress={() => setEcardVisible(false)}
              activeOpacity={0.75}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={22} color={T.ink} />
            </TouchableOpacity>

            <ProfileAvatar
              name={userName}
              profilePicture={profilePicture}
              size={76}
              style={styles.modalAvatar}
            />

            <Text style={styles.modalKicker}>COLONY PRIVILEGE</Text>
            <Text style={styles.modalTitle}>Digital membership</Text>
            <Text style={styles.modalSubtitle}>
              Present this card at the counter to collect points and access member benefits.
            </Text>

            <View style={styles.qrOuter}>
              <View style={styles.qrInner}>
                <QRCode
                  value={qrValue}
                  size={qrSize}
                  color={T.ink}
                  backgroundColor={T.surface}
                />
              </View>
            </View>

            <Text numberOfLines={1} style={styles.modalName}>
              {userName}
            </Text>
            <Text style={styles.modalMembership}>MEMBERSHIP {memberShip}</Text>

            <View style={styles.modalFooter}>
              <Ionicons name="shield-checkmark-outline" size={17} color={T.primary} />
              <Text style={styles.modalFooterText}>Verified Colony member card</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
  scrollContainer: { paddingHorizontal: 18, paddingBottom: 118 },
  heroCard: {
    backgroundColor: T.ink,
    borderRadius: 30,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: T.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  heroAvatar: { borderColor: 'rgba(255,255,255,0.32)' },
  heroMemberCopy: { flex: 1, marginLeft: 12, paddingRight: 6 },
  kicker: {
    fontFamily: fontBold,
    color: T.champagne,
    fontSize: 9,
    letterSpacing: 1.8,
  },
  memberName: {
    fontSize: 24,
    fontFamily: Fonts.displaySerif,
    color: T.surface,
    marginTop: 5,
  },
  memberId: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.68)',
    marginTop: 2,
    fontFamily: fontReg,
  },
  memberType: {
    fontSize: 10,
    color: T.champagne,
    marginTop: 15,
    letterSpacing: 2,
    fontFamily: fontBold,
  },
  ecardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginLeft: 8,
  },
  ecardText: {
    color: T.surface,
    fontSize: 9,
    fontFamily: fontBold,
    letterSpacing: 1,
    marginLeft: 5,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: 18,
  },
  tabs: { marginTop: 18, marginBottom: 18 },
  statsRow: { flexDirection: 'row', marginBottom: 18 },
  collectContainer: { padding: 0, overflow: 'hidden', marginBottom: 18 },
  imageBanner: { width: '100%', height: 190 },
  collectTextContainer: { padding: 20 },
  collectTitle: { fontSize: 22, fontFamily: fontBold, color: T.ink },
  collectSub: {
    fontSize: 14,
    color: T.muted,
    marginTop: 8,
    lineHeight: 22,
    fontFamily: fontReg,
  },
  tierContainer: { marginBottom: 18 },
  tierTitle: {
    fontSize: 13,
    color: T.muted,
    fontFamily: fontBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tierValue: { fontSize: 42, color: T.ink, fontFamily: fontBold, marginTop: 8 },
  tierDescription: {
    fontSize: 14,
    color: T.muted,
    lineHeight: 22,
    marginTop: 8,
    fontFamily: fontReg,
  },
  progressBar: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.champagne,
    borderWidth: 2,
    borderColor: T.surface,
  },
  dotActive: { backgroundColor: T.primary },
  line: { flex: 1, height: 2, backgroundColor: T.line },
  tierLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  tierLabel: { fontSize: 12, color: T.muted, fontFamily: fontReg },
  bottomBtns: { gap: 12, marginBottom: 24 },
  offerBtn: {
    borderWidth: 1,
    borderColor: T.primary,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: T.surface,
  },
  exchangeBtn: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: T.primarySoft,
  },
  offerText: {
    color: T.primaryDark,
    fontSize: 13,
    fontFamily: fontBold,
    letterSpacing: 1.2,
  },
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(18,14,11,0.68)',
  },
  modalCard: {
    maxHeight: '90%',
    alignItems: 'center',
    backgroundColor: T.surfaceSoft,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: T.champagne,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 16,
  },
  modalAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 7,
    backgroundColor: T.primary,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  modalAvatar: { marginTop: 4 },
  modalKicker: {
    color: T.primary,
    fontFamily: fontBold,
    fontSize: 9,
    letterSpacing: 2.2,
    marginTop: 14,
  },
  modalTitle: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 31,
    lineHeight: 38,
    marginTop: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
    paddingHorizontal: 10,
  },
  qrOuter: {
    marginTop: 20,
    padding: 9,
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.champagne,
    borderRadius: 24,
  },
  qrInner: {
    padding: 15,
    backgroundColor: T.surface,
    borderRadius: 17,
  },
  modalName: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 25,
    marginTop: 18,
  },
  modalMembership: {
    color: T.primaryDark,
    fontFamily: fontBold,
    fontSize: 10,
    letterSpacing: 1.6,
    marginTop: 4,
  },
  modalFooter: {
    width: '100%',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
    paddingTop: 15,
  },
  modalFooterText: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 11,
    marginLeft: 7,
  },
});
