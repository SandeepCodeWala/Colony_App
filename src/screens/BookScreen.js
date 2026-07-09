import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppImages, Fonts } from '../res';
import { showToast } from '../services/Toast';
import { useSelector } from 'react-redux';
import { CravPage, FoodImageCard, CravButton, Hero, LuxeTabs, LuxeSectionHeader, PremiumCard } from '../components/CravPremium';
import PremiumTheme from '../res/PremiumTheme';

const BookScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth?.user);
  const membershipNumber = useSelector(state => state.auth?.membershipNumber);

  const [UserName, setUserName] = useState('');
  const [membership, setMembership] = useState('');
  const [activeTab, setActiveTab] = useState('dining');

  useEffect(() => {
    setUserName(user?.name || '');
    setMembership(user?.membership_number || membershipNumber || '');
  }, [user, membershipNumber]);

  const handleReserveTable = () => {
    if (user?.membership_number || membershipNumber || UserName || membership) {
      navigation.navigate('ReserveLounge', { screen: 'table' });
    } else {
      navigation.navigate('Login');
      showToast('error', 'User details not found. Please log in again.');
    }
  };

  const sections = [
    {
      title: 'Restaurant',
      tag: 'Signature dining',
      image: AppImages.restaurant,
      desc: 'Choose your time, guest count and enjoy a premium Colony dining experience with seamless reservation flow.',
      cta: 'Reserve a Table',
      onPress: handleReserveTable,
      key: 'dining',
    },
    {
      title: 'Lounge',
      tag: 'Private ambience',
      image: AppImages.lounge,
      desc: 'A refined lounge experience with intimate comfort, premium service and curated ambience is coming soon.',
      cta: 'Coming Soon',
      disabled: true,
      key: 'lounge',
    },
  ];

  const visibleSections = activeTab === 'all' ? sections : sections.filter(item => item.key === activeTab);

  return (
    <CravPage title="" header="reserve">
      <Hero
        kicker="Reservation"
        title="Reserve Your Experience"
        subtitle="A lighter, premium booking journey with luxury-inspired cards, animated tabs and refined spacing."
      />

      <LuxeTabs
        tabs={[
          { key: 'dining', label: 'Dining' },
          { key: 'lounge', label: 'Lounge' },
          { key: 'all', label: 'All' },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
        style={styles.tabs}
      />

      <PremiumCard style={styles.memberCard} delay={80}>
        <Text style={styles.memberKicker}>Fast booking</Text>
        <Text style={styles.memberTitle}>{UserName ? `Welcome, ${UserName}` : 'Sign in for member booking'}</Text>
        <Text style={styles.memberSub}>{membership ? `Membership ${membership}` : 'Your member details will auto-fill after login.'}</Text>
      </PremiumCard>

      <LuxeSectionHeader eyebrow="Curated sections" title="Choose a destination" />
      {visibleSections.map((item, index) => (
        <FoodImageCard key={item.title} image={item.image} title={item.title} kicker={item.tag} subtitle={item.desc} disabled={item.disabled} delay={index * 80}>
          <CravButton title={item.cta} disabled={item.disabled} onPress={item.onPress} />
        </FoodImageCard>
      ))}

      <View style={{ height: 28 }} />
    </CravPage>
  );
};

export default BookScreen;

const T = PremiumTheme;
const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

const styles = StyleSheet.create({
  tabs: { marginBottom: 18 },
  memberCard: { marginBottom: 18, padding: 18, backgroundColor: T.pearl },
  memberKicker: { color: T.primary, fontFamily: fontBold, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  memberTitle: { color: T.ink, fontFamily: fontMed, fontSize: 19, marginTop: 6 },
  memberSub: { color: T.muted, fontFamily: fontReg, fontSize: 13, marginTop: 4, lineHeight: 20 },
});
