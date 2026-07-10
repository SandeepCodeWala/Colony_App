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
    const translateY = intro.interpolate({ inputRange: [0, 1], outputRange: [34, 0] });
    const imageScale = intro.interpolate({ inputRange: [0, 1], outputRange: [1.08, 1] });
    return (
      <View style={styles.card}>
        <Animated.View style={[styles.fullImageWrap, { transform: [{ scale: imageScale }] }]}>
          <ImageBackground source={item.image} style={styles.fullImage} resizeMode="cover" />
        </Animated.View>

        <View style={styles.overlay}>
          <Animated.View style={[styles.copyWrap, item.disabled && styles.disabledCard, { opacity: intro, transform: [{ translateY }] }]}> 
            <View style={styles.floatMetaRow}>
              <Text style={styles.slideCount}>0{index + 1} / 03</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>{item.disabled ? 'SOON' : 'OPEN'}</Text>
              </View>
            </View>

            <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            <View style={styles.paginationContainer}>
              {DATA.map((_, dotIndex) => (
                <View key={dotIndex} style={[styles.dot, currentIndex === dotIndex && styles.activeDot]} />
              ))}
            </View>

            <TouchableOpacity activeOpacity={0.84} disabled={item.disabled} style={[styles.button, item.disabled && styles.disabledButton]} onPress={() => handleReserveTable(item)}>
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
  root: {
    flex: 1,
    backgroundColor: T.ink,
  },
  card: {
    width,
    height,
    overflow: 'hidden',
    backgroundColor: T.ink,
  },
  fullImageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  fullImage: {
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 112 : 98,
    paddingHorizontal: 18,
  },
  copyWrap: {
    width: '100%',
    borderRadius: 34,
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,250,244,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  disabledCard: {
    opacity: 0.82,
  },
  floatMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slideCount: {
    fontFamily: fontBold,
    fontSize: 10,
    color: T.softMuted,
    letterSpacing: 2.3,
  },
  statusPill: {
    paddingHorizontal: 12,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(183,120,46,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(183,120,46,0.28)',
  },
  statusPillText: {
    color: T.primaryDark,
    fontFamily: fontBold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  eyebrow: {
    fontFamily: fontBold,
    fontSize: 11,
    letterSpacing: 2.4,
    color: T.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontFamily: fontBold,
    fontSize: Math.min(44, width * 0.112),
    lineHeight: Math.min(52, width * 0.132),
    color: T.ink,
    textTransform: 'uppercase',
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    color: T.muted,
    marginTop: 8,
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: T.champagne,
    marginRight: 7,
  },
  activeDot: {
    width: 30,
    backgroundColor: T.primary,
  },
  button: {
    backgroundColor: T.primary,
    width: '100%',
    height: 54,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: T.primary,
    shadowOpacity: 0.30,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 7,
  },
  disabledButton: {
    backgroundColor: T.line,
    borderWidth: 1,
    borderColor: T.border,
    shadowOpacity: 0,
  },
  buttonText: {
    fontFamily: fontBold,
    color: T.surface,
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  disabledButtonText: {
    color: T.softMuted,
  },
});

export default Home;
