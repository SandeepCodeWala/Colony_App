import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../res';

const AppButton = ({ text, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    marginHorizontal: 20,
    backgroundColor: Colors.MEDIUMTURQUOISE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: Fonts.SemiBold,
  },
});

export default AppButton;
