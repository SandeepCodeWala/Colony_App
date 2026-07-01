import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppImages, Fonts } from '../res';
import { showToast } from '../services/Toast';
import { useSelector } from 'react-redux';
import { CravPage, FoodImageCard, CravButton } from '../components/CravPremium';
import PremiumTheme from '../res/PremiumTheme';

const BookScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth?.user);
  const membershipNumber = useSelector(state => state.auth?.membershipNumber);

  const [UserName, setUserName] = useState('');
  const [membership, setMembership] = useState('');

  useEffect(() => {
    setUserName(user?.name || '');
    setMembership(user?.membership_number || membershipNumber || '');
  }, [user, membershipNumber]);

  const handleReserveTable = () => {
    if (user?.membership_number || membershipNumber || UserName || membership) {
      navigation.navigate('ReserveLounge', {
        screen: 'table',
      });
    } else {
      navigation.navigate('Login');
      showToast('error', 'User details not found. Please log in again.');
    }
  };

  const sections = [
    {
      title: 'LOUNGE',
      tag: 'SIGNATURE VIBE',
      image: AppImages.lounge,
      desc: 'Relax, unwind, and enjoy every moment as we serve comfort, luxury, and happiness—one refreshing sip and soothing vibe at a time.',
      cta: 'Coming Soon',
      disabled: true,
    },
    {
      title: 'RESTAURANT',
      tag: 'SMASHED FRESH',
      image: AppImages.restaurant,
      desc: 'We bring joy to your table every day, crafting memorable dining experiences with love, flavor, and one delicious plate at a time.',
      cta: 'Reserve a Table',
      onPress: handleReserveTable,
    },
  ];

  return (
    <CravPage title="" header="reserve">
      <View style={styles.hero}>
        <Text style={styles.kicker}></Text>

        <Text style={styles.heroTitle}>Reserve Your Experience</Text>

        <Text style={styles.heroSub}>
          Reserve your table in seconds and enjoy the complete Colony dining
          experience.
        </Text>

        {/* {!!UserName && (
          <View style={styles.infoCard}>
            <Text style={styles.name}>{UserName}</Text>

            {!!membership && (
              <Text style={styles.member}>Membership #{membership}</Text>
            )}
          </View>
        )} */}
      </View>

      {sections.map(item => (
        <FoodImageCard
          key={item.title}
          image={item.image}
          title={item.title}
          kicker={item.tag}
          subtitle={item.desc}
          disabled={item.disabled}
        >
          <CravButton
            title={item.cta}
            disabled={item.disabled}
            onPress={item.onPress}
          />
        </FoodImageCard>
      ))}

      <View style={{ height: 20 }} />
    </CravPage>
  );
};

export default BookScreen;

const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;

const T = PremiumTheme;

const styles = StyleSheet.create({
  hero: {
    paddingTop: 30,
    paddingBottom: 25,
  },

  kicker: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  heroTitle: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 30,
    lineHeight: 40,
    marginTop: 8,
    textTransform: 'uppercase',
  },

  heroSub: {
    marginTop: 12,
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 15,
    lineHeight: 24,
  },

  infoCard: {
    marginTop: 22,
    backgroundColor: '#FFF8F3',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F2E3D7',
  },

  name: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 18,
  },

  member: {
    marginTop: 5,
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
  },
});
