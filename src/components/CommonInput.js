import React from 'react';
import { TextInput, StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { Fonts } from '../res';
import Utility from './Utility';
import PremiumTheme from '../res/PremiumTheme';

export default function CommonInput(props) {
  const [focus, setFocus] = React.useState(false);
  const placeholderTextColor = props.placeholderTextColor || PremiumTheme.softMuted;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputview, focus && styles.focused, props.inputView]}>
        <TextInput
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          style={[
            styles.input,
            props.customStyle,
            props.iconSource ? styles.inputWithIcon : null,
            props.multiline ? styles.multilineInput : null,
          ]}
          onChangeText={props.onChangeText}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={props.value}
          editable={props.editable}
          placeholderTextColor={placeholderTextColor}
          multiline={!!props.multiline}
          numberOfLines={props.numberOfLines || 1}
          scrollEnabled={props.scrollEnabled}
          includeFontPadding={false}
          textAlignVertical="center"
        />
        {props.rightIcon && (
          <TouchableOpacity activeOpacity={0.8}>
            <Image source={props.rightIcon} style={[styles.icon, props.multiline ? styles.multilineIcon : null, props.icon]} />
          </TouchableOpacity>
        )}
      </View>
      {props.errorMsg && typeof props.errorMsg === 'string' && <Text style={styles.errorMsg}>{props.errorMsg}</Text>}
    </View>
  );
}

const T = PremiumTheme;
const styles = StyleSheet.create({
  wrapper: { width: '100%' },
  inputview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    marginVertical: Utility.getPerCentage(2.2),
    backgroundColor: T.surface,
    borderRadius: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 14,
  },
  focused: {
    borderColor: T.primary,
    shadowColor: T.primary,
    shadowOpacity: 0.11,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  errorMsg: {
    color: T.danger,
    fontSize: 11,
    fontFamily: Fonts.instrumentSansRegular,
    marginLeft: 25,
  },
  icon: { width: 20, height: 20, marginLeft: 10, resizeMode: 'contain', tintColor: T.primary },
  input: {
    flex: 1,
    minHeight: 56,
    color: T.ink,
    fontSize: 15,
    fontFamily: Fonts.instrumentSansRegular,
  },
  inputWithIcon: { paddingRight: 0 },
  multilineInput: { textAlignVertical: 'top', height: '100%', padding: 10 },
  multilineIcon: { alignSelf: 'flex-start', marginTop: 10 },
});
