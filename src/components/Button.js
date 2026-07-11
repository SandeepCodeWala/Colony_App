import React, { useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const Button = ({ title, onPress, style, textStyle, textTitle, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = value =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.button, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.985)}
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
    minHeight: 58,
    width: '100%',
    backgroundColor: T.primary,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: T.primaryDark,
  },
  disabled: { opacity: 0.52 },
  text: {
    fontSize: 13,
    fontFamily: Fonts.luxurySansMedium,
    color: T.surface,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },
});
