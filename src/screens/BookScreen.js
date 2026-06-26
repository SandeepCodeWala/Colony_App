import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Fonts, AppImages } from '../res';
import Button from '../components/Button';
import ReserveHeader from '../components/ReserveHeader';
import { showToast } from '../services/Toast';
import { useSelector } from 'react-redux';
import PremiumTheme from '../res/PremiumTheme';

const BookScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth?.user);
  const membershipNumber = useSelector(state => state.auth?.membershipNumber);

  const [UserName, setUserName] = React.useState('');
  const [membership, setMembership] = React.useState('');

  useEffect(() => {
    if (user?.name) setUserName(user.name);
    if (membershipNumber) setMembership(membershipNumber);
  }, [user, membershipNumber]);

  const handleReserveLounge = () => {
    navigation.navigate('ReserveLounge', { screen: 'Lounge' });
  };

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
      title: 'LOUNGE',
      tag: 'SIGNATURE VIBE',
      image: AppImages.lounge,
      desc: 'Relax, unwind, and enjoy every moment as we serve comfort, luxury, and happiness—one refreshing sip and soothing vibe at a time.',
      cta: 'Reserve a Lounge',
      onPress: handleReserveLounge,
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
    <View style={styles.container}>
      <ReserveHeader title={'Book'} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.pageKicker}>CRAV BOOKINGS</Text>
        <Text style={styles.pageTitle}>Choose your next craving.</Text>
        {sections.map((item, index) => (
          <View key={item.title} style={[styles.card, index > 0 && styles.cardGap]}>
            <ImageBackground source={item.image} imageStyle={styles.imageRadius} style={styles.imageCard}>
              <View style={styles.imageWash} />
            </ImageBackground>
            <View style={styles.cardBody}>
              <Text style={styles.tag}>{item.tag}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.desc}</Text>
              <Button title={item.cta} style={styles.reserveButton} textStyle={styles.reserveText} onPress={item.onPress} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumTheme.paper },
  content: { paddingHorizontal: 16, paddingBottom: 36 },
  pageKicker: {
    marginTop: 18,
    color: PremiumTheme.gold,
    fontSize: 11,
    letterSpacing: 2.4,
    fontFamily: Fonts.instrumentSansMedium,
  },
  pageTitle: {
    color: PremiumTheme.ink,
    fontSize: 34,
    lineHeight: 39,
    marginTop: 6,
    marginBottom: 18,
    fontFamily: Fonts.instrumentSansMedium,
  },
  card: {
    backgroundColor: PremiumTheme.surface,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    shadowColor: PremiumTheme.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  cardGap: { marginTop: 22 },
  imageRadius: { borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  imageCard: { width: '100%', height: 230 },
  imageWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,249,239,0.14)' },
  cardBody: { padding: 20, alignItems: 'flex-start' },
  tag: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 11,
    letterSpacing: 2,
    color: PremiumTheme.tomato,
  },
  title: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 28,
    color: PremiumTheme.ink,
    letterSpacing: 0.5,
    marginTop: 6,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: PremiumTheme.muted,
    marginTop: 8,
    lineHeight: 21,
  },
  reserveButton: { width: '100%', marginTop: 18, backgroundColor: PremiumTheme.ink },
  reserveText: { color: PremiumTheme.surface, fontFamily: Fonts.instrumentSansMedium },
});
