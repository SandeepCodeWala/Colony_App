import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
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

const DATA = [
  {
    id: '1',
    eyebrow: 'SMASHED FRESH',
    title: 'Restaurant',
    subtitle: 'Experience fine dining with exquisite cuisines.',
    image: AppImages.restaurant,
    buttonText: 'Reserve a Table',
    screen: 'RightArrow',
  },
  {
    id: '2',
    eyebrow: 'SIGNATURE VIBE',
    title: 'Lounge',
    subtitle: 'Relax with signature cocktails and cozy ambiance.',
    image: AppImages.lounge,
    buttonText: 'Coming Soon',
    screen: 'Lounge',
    disabled: true,
  },
  {
    id: '3',
    eyebrow: 'LIVE TABLES',
    title: 'Events',
    subtitle: 'Join our special events and live performances.',
    image: AppImages.events,
    buttonText: 'Reserve an Event',
    screen: 'Event',
  },
];

const Home = () => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useSelector(state => state.auth?.user);
  const membership = useSelector(state => state.auth?.membershipNumber);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % DATA.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  const handleReserveTable = item => {
    if (item?.disabled) return;
    if (item?.screen === 'Event') return navigation.navigate('BookEvent');
    if (item?.screen === 'Lounge') return;
    if ((user?.name && membership) || user?.name != null)
      navigation.navigate('ReserveLounge', { screen: 'table' });
    else navigation.navigate('Login');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.topWash} />
      <View style={styles.brandStrip}>
        <Text style={styles.brandStripText}>
          Colony · ARTISAN SMASHED BURGERS
        </Text>
      </View>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.copyCard,
            item.disabled && styles.disabledCard,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.brand}>EST. 1997 — FRESHLY BUILT</Text>
          <Text style={styles.eyebrow}>{item.eyebrow}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <View style={styles.paginationContainer}>
            {DATA.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
          <TouchableOpacity
            activeOpacity={0.78}
            disabled={item.disabled}
            style={[styles.button, item.disabled && styles.disabledButton]}
            onPress={() => handleReserveTable(item)}
          >
            <Text
              style={[
                styles.buttonText,
                item.disabled && styles.disabledButtonText,
              ]}
            >
              {item.buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
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
  root: { flex: 1, backgroundColor: PremiumTheme.paper },
  card: { width, height, backgroundColor: PremiumTheme.paper },
  image: { width, height: height * 0.73, resizeMode: 'cover' },
  topWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.73,
    backgroundColor: 'rgba(255,248,237,0.18)',
  },
  brandStrip: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 42,
    left: 18,
    right: 18,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  brandStripText: {
    color: PremiumTheme.goldDark,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 10,
    letterSpacing: 2,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 96 : 80,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  copyCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 34,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    shadowColor: PremiumTheme.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  disabledCard: { opacity: 0.78 },
  brand: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 10,
    letterSpacing: 2.6,
    color: PremiumTheme.gold,
    marginBottom: 10,
  },
  eyebrow: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 13,
    letterSpacing: 1.8,
    color: PremiumTheme.tomato,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 42,
    textAlign: 'center',
    color: PremiumTheme.ink,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    color: PremiumTheme.muted,
    marginTop: 8,
    marginBottom: 18,
  },
  paginationContainer: { flexDirection: 'row', marginBottom: 18 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: PremiumTheme.sand,
    marginHorizontal: 4,
  },
  activeDot: { width: 24, backgroundColor: PremiumTheme.gold },
  button: {
    backgroundColor: PremiumTheme.primary || '#B7782E',
    width: '100%',
    height: 52,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: PremiumTheme.line,
    borderWidth: 1,
    borderColor: PremiumTheme.border,
  },
  buttonText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: PremiumTheme.surface,
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  disabledButtonText: { color: PremiumTheme.softMuted },
});

export default Home;
