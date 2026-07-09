import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const AppButton = ({ text, onPress, style, textStyle, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = value => Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 22, bounciness: 7 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.975)}
        onPressOut={() => !disabled && animateTo(1)}
        style={[styles.button, disabled && styles.disabled, style]}
      >
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const T = PremiumTheme;

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    marginHorizontal: 20,
    backgroundColor: T.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 22,
    shadowColor: T.primary,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  disabled: { opacity: 0.55 },
  buttonText: {
    color: T.surface,
    fontSize: 13,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
  },
});

export default AppButton;
