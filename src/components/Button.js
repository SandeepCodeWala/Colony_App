import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { fonts, styles as themeStyles } from '../themes';
import PremiumTheme from '../res/PremiumTheme';

const Button = ({ title, onPress, style, textStyle, textTitle, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = value => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 22,
      bounciness: 7,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
      <TouchableOpacity
        activeOpacity={0.86}
        style={[styles.button, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.97)}
        onPressOut={() => !disabled && animateTo(1)}
      >
        <Text style={[styles.text, textTitle, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    width: '100%',
    backgroundColor: PremiumTheme.primary || '#B7782E',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    shadowColor: PremiumTheme.primary || PremiumTheme.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
    ...themeStyles.row,
  },
  disabled: { opacity: 0.55 },
  text: {
    fontSize: fonts.fs_14 || 14,
    fontFamily: fonts.familyBlack || 'Verlag-Black',
    color: PremiumTheme.surface,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
