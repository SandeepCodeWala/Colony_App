import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import PremiumTheme from '../res/PremiumTheme';
import { Fonts } from '../res';

const InputText = ({
  label,
  placeholder,
  placeholderTextColor = PremiumTheme.softMuted,
  secureTextEntry,
  returnKeyType,
  keyboardType,
  maxLength,
  value,
  onChangeText,
  editable = true,
  containerStyle,
  inputStyle,
  labelStyle,
  autoCapitalize = 'none',
}) => (
  <View style={[styles.container, containerStyle]}>
    <View style={styles.inner}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        underlineColorAndroid="transparent"
        secureTextEntry={secureTextEntry}
        returnKeyType={returnKeyType}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        autoCorrect={false}
        autoCapitalize={autoCapitalize}
      />
    </View>
  </View>
);

const T = PremiumTheme;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  inner: { width: '88%' },
  label: {
    fontSize: 10,
    marginBottom: 7,
    fontFamily: Fonts.luxurySansMedium,
    color: T.primary,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 52,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    paddingHorizontal: 2,
    fontSize: 15,
    backgroundColor: 'transparent',
    color: T.ink,
    fontFamily: Fonts.luxurySansLight,
  },
});

export default InputText;
