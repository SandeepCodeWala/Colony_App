import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const AppButton = ({ text, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    marginHorizontal: 20,
    backgroundColor: PremiumTheme.ink,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    paddingHorizontal: 22,
    shadowColor: PremiumTheme.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  buttonText: {
    color: PremiumTheme.surface,
    fontSize: 14,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontFamily: Fonts.SemiBold,
  },
});

export default AppButton;
