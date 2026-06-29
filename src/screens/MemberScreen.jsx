import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ReserveHeader from '../components/ReserveHeader';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const MemberScreen = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [memberShip, setMemberShip] = useState('');

  const fetchUser = async () => {
    try {
      const name = await AsyncStorage.getItem('name');
      const membershipNum = await AsyncStorage.getItem('membershipNumber');

      setUserName(name || 'Member');
      setMemberShip(membershipNum || 'N/A');
    } catch (error) {
      console.log('Error fetching user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={T.cream || '#FFF8F2'}
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Member Rewards</Text>
          <Text style={styles.heroSub}>
            Collect points, unlock rewards and enjoy your CRAV membership
            benefits.
          </Text>
        </View>

        <View style={styles.memberCard}>
          <View style={styles.memberCardTop}>
            <View>
              <Text style={styles.cardKicker}>MEMBER PROFILE</Text>
              <Text style={styles.memberName}>{userName}</Text>
              <Text style={styles.memberId}>Membership no. {memberShip}</Text>
            </View>

            <View style={styles.memberPill}>
              <Text style={styles.memberPillText}>MEMBER</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.memberCardBottom}>
            <TouchableOpacity activeOpacity={0.8} style={styles.eCardBtn}>
              <Text style={styles.eCardBtnText}>VIEW E-CARD</Text>
            </TouchableOpacity>

            <Text style={styles.memberHint}>Premium dining rewards</Text>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <Text style={styles.pointsKicker}>AVAILABLE BALANCE</Text>
          <Text style={styles.pointsValue}>0</Text>
          <Text style={styles.pointsLabel}>Jumeirah One Points</Text>

          <TouchableOpacity activeOpacity={0.8} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>PAY WITH POINTS →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.collectCard}>
          <View style={styles.imageWrap}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80',
              }}
              style={styles.imageBanner}
            />
          </View>

          <View style={styles.collectContent}>
            <Text style={styles.cardKicker}>REWARDS</Text>
            <Text style={styles.collectTitle}>Collect your points</Text>
            <Text style={styles.collectSub}>
              You'll need to collect points before you can exchange them for
              rewards.
            </Text>

            <TouchableOpacity activeOpacity={0.8} style={styles.textBtn}>
              <Text style={styles.textBtnText}>COLLECT POINTS →</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <View>
              <Text style={styles.cardKicker}>TIER STATUS</Text>
              <Text style={styles.tierTitle}>Tier Points</Text>
            </View>

            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>0</Text>
            </View>
          </View>

          <Text style={styles.tierDescription}>
            Spend an additional USD 2,500 to collect 5,000 Tier Points to become
            a Silver member.
          </Text>

          <View style={styles.progressWrap}>
            <View style={styles.progressLine}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.progressDotRow}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
              <View style={styles.progressDot} />
            </View>
          </View>

          <View style={styles.tierLabels}>
            <Text style={[styles.tierLabel, styles.tierLabelActive]}>
              Member
            </Text>
            <Text style={styles.tierLabel}>Silver</Text>
            <Text style={styles.tierLabel}>Gold</Text>
            <Text style={styles.tierLabel}>Platinum</Text>
          </View>
        </View>

        <View style={styles.bottomBtns}>
          <TouchableOpacity activeOpacity={0.8} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>% MY OFFERS</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.darkBtn}>
            <Text style={styles.darkBtnText}>⇄ EXCHANGE POINTS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MemberScreen;

const T = PremiumTheme;
const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  scrollContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(8),
  },

  hero: {
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(2.4),
  },

  kicker: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.35),
    letterSpacing: 2.8,
    color: T.tomato || '#D84A2B',
    textTransform: 'uppercase',
  },

  heroTitle: {
    marginTop: responsiveHeight(0.7),
    fontFamily: fontMed,
    fontSize: responsiveFontSize(4),
    lineHeight: responsiveFontSize(4.6),
    color: T.ink || '#201A17',
    textTransform: 'uppercase',
    letterSpacing: -0.6,
  },

  heroSub: {
    marginTop: responsiveHeight(1),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.75),
    lineHeight: responsiveFontSize(2.55),
    color: T.muted || '#7B6B60',
  },

  memberCard: {
    backgroundColor: T.surface || '#FFFFFF',
    borderRadius: 30,
    padding: responsiveWidth(5),
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    shadowColor: '#7E3F18',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  memberCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardKicker: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.25),
    letterSpacing: 2,
    color: T.tomato || '#D84A2B',
    textTransform: 'uppercase',
  },

  memberName: {
    marginTop: responsiveHeight(0.8),
    fontFamily: fontMed,
    fontSize: responsiveFontSize(3.1),
    color: T.ink || '#201A17',
    letterSpacing: -0.4,
  },

  memberId: {
    marginTop: responsiveHeight(0.4),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.6),
    color: T.muted || '#7B6B60',
  },

  memberPill: {
    paddingHorizontal: responsiveWidth(3.5),
    paddingVertical: responsiveHeight(0.8),
    borderRadius: 18,
    backgroundColor: T.gold || '#F5B544',
  },

  memberPillText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.2),
    color: T.ink || '#201A17',
    letterSpacing: 1.2,
  },

  cardDivider: {
    height: 1,
    backgroundColor: T.border || '#F1DFCD',
    marginVertical: responsiveHeight(2),
  },

  memberCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eCardBtn: {
    borderRadius: 18,
    backgroundColor: '#FFF4E7',
    borderWidth: 1,
    borderColor: '#EBCDAC',
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.1),
  },

  eCardBtnText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.4),
    color: T.goldDark || '#9C652A',
    letterSpacing: 0.7,
  },

  memberHint: {
    flex: 1,
    marginLeft: responsiveWidth(3),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.45),
    color: T.muted || '#7B6B60',
    textAlign: 'right',
  },

  pointsCard: {
    marginTop: responsiveHeight(2.5),
    backgroundColor: T.ink || '#201A17',
    borderRadius: 34,
    paddingVertical: responsiveHeight(3.4),
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  pointsKicker: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.25),
    color: T.gold || '#F5B544',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },

  pointsValue: {
    marginTop: responsiveHeight(0.8),
    fontFamily: fontMed,
    fontSize: responsiveFontSize(6),
    color: '#FFFFFF',
  },

  pointsLabel: {
    marginTop: responsiveHeight(0.2),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.75),
    color: '#E8D8C8',
  },

  primaryBtn: {
    marginTop: responsiveHeight(1.8),
    backgroundColor: T.gold || '#F5B544',
    borderRadius: 22,
    paddingHorizontal: responsiveWidth(7),
    paddingVertical: responsiveHeight(1.25),
  },

  primaryBtnText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.55),
    color: T.ink || '#201A17',
    letterSpacing: 0.6,
  },

  collectCard: {
    marginTop: responsiveHeight(2.6),
    backgroundColor: T.surface || '#FFFFFF',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    shadowColor: '#7E3F18',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  imageWrap: {
    padding: responsiveWidth(3),
    paddingBottom: 0,
  },

  imageBanner: {
    width: '100%',
    height: responsiveHeight(22),
    borderRadius: 24,
  },

  collectContent: {
    padding: responsiveWidth(5),
  },

  collectTitle: {
    marginTop: responsiveHeight(0.8),
    fontFamily: fontMed,
    fontSize: responsiveFontSize(2.8),
    color: T.ink || '#201A17',
  },

  collectSub: {
    marginTop: responsiveHeight(0.8),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveFontSize(2.45),
    color: T.muted || '#7B6B60',
  },

  textBtn: {
    marginTop: responsiveHeight(1.6),
    alignSelf: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: T.tomato || '#D84A2B',
    paddingBottom: 3,
  },

  textBtnText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.55),
    color: T.tomato || '#D84A2B',
    letterSpacing: 0.6,
  },

  tierCard: {
    marginTop: responsiveHeight(2.6),
    backgroundColor: T.surface || '#FFFFFF',
    borderRadius: 30,
    padding: responsiveWidth(5),
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    shadowColor: '#7E3F18',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
  },

  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  tierTitle: {
    marginTop: responsiveHeight(0.8),
    fontFamily: fontMed,
    fontSize: responsiveFontSize(2.5),
    color: T.ink || '#201A17',
  },

  tierBadge: {
    width: responsiveWidth(13),
    height: responsiveWidth(13),
    borderRadius: responsiveWidth(6.5),
    backgroundColor: '#FFF4E7',
    borderWidth: 1,
    borderColor: '#EBCDAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tierBadgeText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(2.2),
    color: T.goldDark || '#9C652A',
  },

  tierDescription: {
    marginTop: responsiveHeight(1.4),
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.65),
    lineHeight: responsiveFontSize(2.45),
    color: T.muted || '#7B6B60',
  },

  progressWrap: {
    marginTop: responsiveHeight(2.4),
    height: responsiveHeight(3),
    justifyContent: 'center',
  },

  progressLine: {
    height: 8,
    borderRadius: 20,
    backgroundColor: '#F1E1D1',
    overflow: 'hidden',
  },

  progressFill: {
    width: '8%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: T.gold || '#F5B544',
  },

  progressDotRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressDot: {
    width: responsiveWidth(4.3),
    height: responsiveWidth(4.3),
    borderRadius: responsiveWidth(2.15),
    backgroundColor: '#D8C8B7',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  progressDotActive: {
    backgroundColor: T.gold || '#F5B544',
  },

  tierLabels: {
    marginTop: responsiveHeight(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  tierLabel: {
    fontFamily: fontReg,
    fontSize: responsiveFontSize(1.45),
    color: T.muted || '#7B6B60',
  },

  tierLabelActive: {
    fontFamily: fontMed,
    color: T.ink || '#201A17',
  },

  bottomBtns: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2.6),
    marginBottom: responsiveHeight(4),
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: T.surface || '#FFFFFF',
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    borderRadius: 22,
    paddingVertical: responsiveHeight(1.4),
    alignItems: 'center',
    marginRight: responsiveWidth(2),
  },

  darkBtn: {
    flex: 1,
    backgroundColor: T.ink || '#201A17',
    borderRadius: 22,
    paddingVertical: responsiveHeight(1.4),
    alignItems: 'center',
    marginLeft: responsiveWidth(2),
  },

  secondaryBtnText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.5),
    color: T.ink || '#201A17',
  },

  darkBtnText: {
    fontFamily: fontMed,
    fontSize: responsiveFontSize(1.5),
    color: '#FFFFFF',
  },
});
