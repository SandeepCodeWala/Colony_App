import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text, Easing } from 'react-native';
import PremiumTheme from '../res/PremiumTheme';
import { Fonts } from '../res';

const Loader = () => {
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate1, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(rotate2, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.15,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const spin1 = rotate1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin2 = rotate2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.loader}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: spin1 }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.middleRing,
          {
            transform: [{ rotate: spin2 }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.centerCircle,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    </View>
  );
};

const ActivityIndicator = ({
  isLoading,
  text = 'Preparing your experience...',
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Loader />

        <Text style={styles.brand}>Colony</Text>

        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

export default ActivityIndicator;

const T = PremiumTheme;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,18,15,.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },

  card: {
    width: 220,
    height: 240,
    backgroundColor: T.surface || '#FFFDF9',
    borderWidth: 1,
    borderColor: T.border || '#F1DFCD',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 15,
  },

  loader: {
    width: 110,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  outerRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F1DEC7',
    borderTopColor: T.primary || '#B7782E',
    borderRightColor: T.gold || '#B7782E',
  },

  middleRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FFEAD6',
    borderBottomColor: T.primary || '#B7782E',
    borderLeftColor: T.primary || '#B7782E',
  },

  centerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.primary || '#B7782E',

    shadowColor: T.primary || '#B7782E',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },

  brand: {
    marginTop: 28,
    fontSize: 22,
    letterSpacing: 7,
    color: T.ink || '#21110A',
    fontFamily: Fonts.instrumentSansMedium,
  },

  text: {
    marginTop: 10,
    color: T.muted || '#7B6654',
    fontSize: 13,
    fontFamily: Fonts.instrumentSansRegular,
  },
});
