import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '../themes';

const InputText = ({
  label,
  placeholder,
  placeholderTextColor = '#999',
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
}) => {
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    fontFamily: 'InstrumentSans_Condensed-medium',
    // alignSelf: 'flex-start',

    color: '#000', // You can replace with colors.labelColor from your theme
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.black,
  },
});

export default InputText;
