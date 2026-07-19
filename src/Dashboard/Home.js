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
import PremiumTheme from '../res/PremiumTheme';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';

const T = PremiumTheme;

const EXPERIENCES = [
  {
    id: 'restaurant',
    eyebrow: 'RESTAURANTS',
    title: 'Exceptional taste',
    description: 'Discover thoughtful menus, warm hospitality and memorable dining moments at Colony.',
    cta: 'RESERVE A TABLE',
    image: AppImages.restaurant,
    destination: 'table',
  },
  {
    id: 'events',
    eyebrow: 'CURATED EVENTS',
    title: 'Moments to remember',
    description: 'Celebrate intimate occasions, live ambience and carefully curated Colony experiences.',
    cta: 'DISCOVER EVENTS',
    image: AppImages.events,
    destination: 'event',
  },
  // {
  //   id: 'lounge',
  //   eyebrow: 'PRIVATE LOUNGE',
  //   title: 'A refined escape',
  //   description: 'A private lounge experience is being prepared for evenings of comfort and understated luxury.',
  //   cta: 'COMING SOON',
  //   image: AppImages.lounge,
  //   disabled: true,
  // },
];

export default function Home() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const user = useSelector(state => state.auth?.user);
  const membership = useSelector(state => state.auth?.membershipNumber);
  const loading = useFirstRenderSkeleton(900);
  const sectionHeight = Math.max(590, height - (Platform.OS === 'ios' ? 94 : 78));

  const openExperience = item => {
    if (item.disabled) return;
    if (item.destination === 'event') {
      navigation.navigate('BookEvent');
      return;
    }

    if (user?.name || user?.membership_number || membership) {
      navigation.navigate('ReserveLounge', { screen: 'table' });
    } else {
      navigation.navigate('Login');
    }
  };

  if (loading) return <ScreenSkeleton variant="image" />;

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {EXPERIENCES.map((item, index) => (
          <ImageBackground
            key={item.id}
            source={item.image}
            resizeMode="cover"
            style={[styles.section, { minHeight: sectionHeight }]}
          >
            <View style={styles.darkWash} />
            <View style={styles.topWash} />
            <View style={styles.copy}>
              <Text style={styles.eyebrow}>{item.eyebrow}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <TouchableOpacity
                activeOpacity={0.86}
                disabled={item.disabled}
                onPress={() => openExperience(item)}
                style={[styles.cta, item.disabled && styles.ctaDisabled]}
              >
                <Text style={[styles.ctaText, item.disabled && styles.ctaDisabledText]}>
                  {item.cta}
                </Text>
              </TouchableOpacity>
              <Text style={styles.sectionNumber}>0{index + 1} / 02</Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.ink },
  scrollContent: { backgroundColor: T.ink },
  section: { width: '100%', justifyContent: 'flex-end' },
  darkWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12,10,8,0.30)',
  },
  topWash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 190,
    backgroundColor: 'rgba(15,12,9,0.12)',
  },
  copy: {
    paddingHorizontal: 26,
    paddingBottom: 48,
    paddingTop: 120,
    alignItems: 'center',
  },
  eyebrow: {
    color: T.surface,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    letterSpacing: 2.2,
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
  description: {
    color: 'rgba(255,255,255,0.94)',
    fontFamily: Fonts.luxurySansLight,
    fontSize: 17,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 620,
  },
  cta: {
    width: '100%',
    maxWidth: 620,
    minHeight: 62,
    marginTop: 30,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.ink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  ctaDisabled: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(255,255,255,0.65)',
  },
  ctaText: {
    color: T.ink,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 13,
    letterSpacing: 3,
    textAlign: 'center',
  },
  ctaDisabledText: { color: T.muted },
  sectionNumber: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: Fonts.luxurySansLight,
    fontSize: 11,
    letterSpacing: 1.8,
    marginTop: 20,
  },
});
