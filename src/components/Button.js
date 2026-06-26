import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { fonts, styles as themeStyles } from '../themes';
import PremiumTheme from '../res/PremiumTheme';

const Button = ({ title, onPress, style, textStyle, disabled }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.72}
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    width: '90%',
    backgroundColor: PremiumTheme.ink,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: PremiumTheme.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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
