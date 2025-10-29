import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { colors, fonts, styles as themeStyles } from '../themes';

const Button = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 48,
    width: '90%',
    backgroundColor: colors.buttonBgColor || '#FFD700',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...themeStyles.row, // optional row styles from your theme
  },
  text: {
    fontSize: fonts.fs_14 || 16,
    fontFamily: fonts.familyBlack || 'Verlag-Black',
    color: colors.white || '#fff',
  },
});
