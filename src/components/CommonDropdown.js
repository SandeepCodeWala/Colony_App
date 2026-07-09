import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const CommonDropdown = ({ label, data, value, onChange, placeholder = '' }) => {
  const [isFocus, setIsFocus] = useState(false);
  const isLabelActive = isFocus || value;

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, isLabelActive && styles.labelActive]}>{label}</Text> : null}
      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocused]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        itemTextStyle={styles.itemText}
        activeColor={PremiumTheme.primarySoft}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder={!isLabelActive ? placeholder : ''}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default CommonDropdown;
const T = PremiumTheme;
const styles = StyleSheet.create({
  container: { position: 'relative' },
  label: {
    position: 'absolute',
    left: 16,
    top: -7,
    fontSize: 11,
    color: T.primary,
    backgroundColor: T.surface,
    paddingHorizontal: 7,
    zIndex: 2,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelActive: { color: T.primaryDark },
  dropdown: {
    height: 54,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 20,
    backgroundColor: T.surface,
    paddingHorizontal: 15,
  },
  dropdownFocused: {
    borderColor: T.primary,
    shadowColor: T.primary,
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  placeholder: { fontSize: 14, color: T.softMuted, fontFamily: Fonts.instrumentSansRegular },
  selectedText: { fontSize: 14, color: T.ink, fontFamily: Fonts.instrumentSansMedium },
  itemText: { fontSize: 14, color: T.ink, fontFamily: Fonts.instrumentSansRegular },
  dropdownContainer: { borderWidth: 1, borderColor: T.border, borderRadius: 18, backgroundColor: T.surface },
});
