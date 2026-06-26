import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CommonDropdown = ({
  label,
  data,
  value,
  onChange,
  placeholder = 'Select option',
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const isLabelActive = isFocus || !!value;

  return (
    <View style={styles.container}>
      {/* Floating Label */}
      {label && (
        <Text style={[styles.label, isLabelActive && styles.labelActive]}>
          {label}
        </Text>
      )}

      {/* Dropdown */}
      <Dropdown
        style={[styles.dropdown, isLabelActive && styles.dropdownActive]}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder={isLabelActive ? '' : placeholder}
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
    height: 68, // Increased height to prevent overlap
  },

  label: {
    position: 'absolute',
    left: 4,
    top: 22,
    fontSize: 15,
    color: '#666',
    zIndex: 2,
    backgroundColor: 'transparent',
  },

  labelActive: {
    top: 4,
    fontSize: 12,
    color: '#8C6B4B', // Luxury gold accent (matches your new theme)
    fontWeight: '600',
  },

  dropdown: {
    height: 52,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CCCCCC',
    paddingHorizontal: 4,
    paddingTop: 22, // Important: Space for floating label
    backgroundColor: 'transparent',
  },

  dropdownActive: {
    borderBottomColor: '#000', // Dark border when focused/selected
  },

  placeholder: {
    fontSize: 16,
    color: '#6d6c6c',
  },

  selectedText: {
    fontSize: 16,
    color: '#1A1A1A',
  },

  dropdownContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    backgroundColor: '#fff',
  },
});
