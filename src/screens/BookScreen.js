import React from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AppImages, Fonts } from '../res';
import { showToast } from '../services/Toast';
import PremiumTheme from '../res/PremiumTheme';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';

const T = PremiumTheme;

export default function BookScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const user = useSelector(state => state.auth?.user);
  const membershipNumber = useSelector(state => state.auth?.membershipNumber);
  const loading = useFirstRenderSkeleton(820);
  const sectionHeight = Math.max(
    560,
    (height - (Platform.OS === 'ios' ? 94 : 78)) * 0.76,
  );

  const openReservation = experience => {
    const isAuthenticated = Boolean(
      user?.name || user?.membership_number || membershipNumber,
    );

    if (!isAuthenticated) {
      navigation.navigate('Login');
      showToast('error', 'Please sign in to make a reservation.');
      return;
    }

    navigation.navigate('ReserveLounge', { screen: experience });
  };

  if (loading) return <ScreenSkeleton variant="image" />;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <ImageBackground
          source={AppImages.restaurant}
          style={[styles.section, { minHeight: sectionHeight }]}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.copy}>
            <Text style={styles.category}>RESTAURANTS</Text>
            <Text style={styles.title}>Reserve your table</Text>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.button}
              onPress={() => openReservation('Restaurant')}
            >
              <Text style={styles.buttonText}>RESERVE A TABLE</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <ImageBackground
          source={AppImages.lounge}
          style={[styles.section, { minHeight: sectionHeight }]}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.copy}>
            <Text style={styles.category}>PRIVATE LOUNGE</Text>
            <Text style={styles.title}>An intimate escape</Text>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.button}
              onPress={() => openReservation('Lounge')}
            >
              <Text style={styles.buttonText}>RESERVE A LOUNGE</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <ImageBackground
          source={AppImages.events}
          style={[styles.section, { minHeight: sectionHeight }]}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.copy}>
            <Text style={styles.category}>COLONY EVENTS</Text>
            <Text style={styles.title}>Celebrate beautifully</Text>
            <TouchableOpacity
              activeOpacity={0.86}
              style={styles.button}
              onPress={() => navigation.navigate('BookEvent')}
            >
              <Text style={styles.buttonText}>RESERVE AN EVENT</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.ink },
  section: { width: '100%', justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,8,6,0.31)',
  },
  copy: { paddingHorizontal: 28, paddingBottom: 54, alignItems: 'center' },
  category: {
    color: T.surface,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    letterSpacing: 2.4,
    textAlign: 'center',
  },
  title: {
    color: T.surface,
    fontFamily: Fonts.displaySerif,
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
    marginTop: 22,
  },
  button: {
    width: '100%',
    minHeight: 64,
    marginTop: 34,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.ink,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  buttonText: {
    color: T.ink,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 13,
    letterSpacing: 3.1,
  },
});
