import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');
const T = PremiumTheme;
const fontReg = Fonts.instrumentSansRegular;
const fontMed = Fonts.instrumentSansMedium;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

const DATA = [
  {
    id: '1',
    eyebrow: 'SIGNATURE DINING',
    title: 'Restaurant',
    subtitle: 'Reserve a table for a polished dining experience with warm hospitality and fresh cuisine.',
    image: AppImages.restaurant,
    buttonText: 'Reserve a Table',
    screen: 'RightArrow',
  },
  {
    id: '2',
    eyebrow: 'PRIVATE LOUNGE',
    title: 'Lounge',
    subtitle: 'A refined lounge experience is being crafted for your next premium evening.',
    image: AppImages.lounge,
    buttonText: 'Coming Soon',
    screen: 'Lounge',
    disabled: true,
  },
  {
    id: '3',
    eyebrow: 'CURATED MOMENTS',
    title: 'Events',
    subtitle: 'Discover intimate events, live ambience, celebrations and memorable experiences.',
    image: AppImages.events,
    buttonText: 'Reserve an Event',
    screen: 'Event',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const intro = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useSelector(state => state.auth?.user);
  const membership = useSelector(state => state.auth?.membershipNumber);

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 760,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [intro]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DATA.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5200);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const handleReserveTable = item => {
    if (item?.disabled) return;
    if (item?.screen === 'Event') return navigation.navigate('BookEvent');
    if (item?.screen === 'Lounge') return;
    if ((user?.name && membership) || user?.name != null) {
      navigation.navigate('ReserveLounge', { screen: 'table' });
    } else {
      navigation.navigate('Login');
    }
  };

  const renderItem = ({ item, index }) => {
    const translateY = intro.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
    return (
      <View style={styles.card}>
        <ImageBackground source={item.image} style={styles.image} resizeMode="cover">
          <View style={styles.imageWash} />
          <View style={styles.deepGradient} />
        </ImageBackground>

        <Animated.View style={[styles.brandStrip, { opacity: intro, transform: [{ translateY }] }]}>
          <Text style={styles.brandKicker}>COLONY PRIVILEGE</Text>
          <Text style={styles.brandStripText}>Luxury dining · reservations · rewards</Text>
        </Animated.View>

        <View style={styles.overlay}>
          <Animated.View style={[styles.copyCard, item.disabled && styles.disabledCard, { opacity: intro, transform: [{ translateY }] }]}>
            <View style={styles.cardHandle} />
            <Text style={styles.slideCount}>0{index + 1} / 03</Text>
            <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            <View style={styles.paginationContainer}>
              {DATA.map((_, dotIndex) => <View key={dotIndex} style={[styles.dot, currentIndex === dotIndex && styles.activeDot]} />)}
            </View>

            <TouchableOpacity activeOpacity={0.82} disabled={item.disabled} style={[styles.button, item.disabled && styles.disabledButton]} onPress={() => handleReserveTable(item)}>
              <Text style={[styles.buttonText, item.disabled && styles.disabledButtonText]}>{item.buttonText}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.paper },
  card: { width, height, backgroundColor: T.paper },
  image: { width, height: height * 0.77 },
  imageWash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(27,23,19,0.20)' },
  deepGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: height * 0.36, backgroundColor: 'rgba(27,23,19,0.45)' },
  brandStrip: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 44,
    left: 18,
    right: 18,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.66)',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: T.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  brandKicker: { color: T.primary, fontFamily: fontBold, fontSize: 9, letterSpacing: 2.2, textTransform: 'uppercase' },
  brandStripText: { color: T.ink, fontFamily: fontMed, fontSize: 12, marginTop: 2 },
  overlay: { position: 'absolute', left: 0, right: 0, bottom: Platform.OS === 'ios' ? 110 : 96, alignItems: 'center', paddingHorizontal: 18 },
  copyCard: {
    width: '100%',
    backgroundColor: T.glass,
    borderRadius: 36,
    paddingVertical: 24,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.74)',
    shadowColor: T.shadow,
    shadowOpacity: 0.20,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  cardHandle: { width: 42, height: 4, borderRadius: 4, backgroundColor: T.border, marginBottom: 15 },
  disabledCard: { opacity: 0.78 },
  slideCount: { fontFamily: fontBold, fontSize: 10, color: T.softMuted, letterSpacing: 2.2, marginBottom: 8 },
  eyebrow: { fontFamily: fontBold, fontSize: 11, letterSpacing: 2.4, color: T.primary, textTransform: 'uppercase' },
  title: { fontFamily: fontBold, fontSize: 41, lineHeight: 48, textAlign: 'center', color: T.ink, textTransform: 'uppercase', marginTop: 4, letterSpacing: -0.8 },
  subtitle: { fontFamily: fontReg, fontSize: 14, lineHeight: 22, textAlign: 'center', color: T.muted, marginTop: 8, marginBottom: 18 },
  paginationContainer: { flexDirection: 'row', marginBottom: 18 },
  dot: { width: 7, height: 7, borderRadius: 7, backgroundColor: T.champagne, marginHorizontal: 4 },
  activeDot: { width: 26, backgroundColor: T.primary },
  button: { backgroundColor: T.primary, width: '100%', height: 54, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowColor: T.primary, shadowOpacity: 0.28, shadowRadius: 16, shadowOffset: { width: 0, height: 9 }, elevation: 6 },
  disabledButton: { backgroundColor: T.line, borderWidth: 1, borderColor: T.border, shadowOpacity: 0 },
  buttonText: { fontFamily: fontBold, color: T.surface, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase' },
  disabledButtonText: { color: T.softMuted },
});

export default Home;
