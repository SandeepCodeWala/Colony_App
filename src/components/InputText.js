import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import PremiumTheme from '../res/PremiumTheme';
import { Fonts } from '../res';

const InputText = ({ label, placeholder, placeholderTextColor = PremiumTheme.softMuted, secureTextEntry, returnKeyType, keyboardType, maxLength, value, onChangeText, editable = true, containerStyle, inputStyle, labelStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={{ width: '90%' }}>
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
        />
      </View>
    </View>
  );
};

const T = PremiumTheme;
const styles = StyleSheet.create({
  container: { width: '100%', alignSelf: 'center', marginVertical: 10, alignItems: 'center' },
  label: { fontSize: 11, marginBottom: 7, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, color: T.primary, letterSpacing: 1.5, textTransform: 'uppercase' },
  input: { minHeight: 54, borderWidth: 1, borderColor: T.border, borderRadius: 20, paddingHorizontal: 14, fontSize: 15, backgroundColor: T.surface, color: T.ink, fontFamily: Fonts.instrumentSansRegular },
});

export default InputText;
