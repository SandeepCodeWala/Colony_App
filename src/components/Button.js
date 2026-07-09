import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const Button = ({ title, onPress, style, textStyle, textTitle, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = value => Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 22, bounciness: 7 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.button, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.975)}
        onPressOut={() => !disabled && animateTo(1)}
      >
        <Text style={[styles.text, textTitle, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Button;

const T = PremiumTheme;
const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    width: '100%',
    backgroundColor: T.primary,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    shadowColor: T.primary,
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
  },
  disabled: { opacity: 0.55 },
  text: {
    fontSize: 13,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    color: T.surface,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
