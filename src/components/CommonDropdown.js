import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const CommonDropdown = ({
  label,
  data,
  value,
  onChange,
  placeholder = '',
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const isLabelActive = isFocus || value;

  return (
    <View style={styles.container}>
      {/* Floating Label */}
      {label && (
        <Text
          style={[
            styles.label,
            isLabelActive && styles.labelActive,
          ]}
        >
          {label}
        </Text>
      )}

      {/* Dropdown */}
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
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
const styles = StyleSheet.create({
  container: {
    // marginTop: 24,
    position: 'relative',
  },

  label: {
    position: 'absolute',
    left: 0,
    top: 5,
    fontSize: 14,
    color: '#5a5959',
  },

  labelActive: {
    top: -8,
    fontSize: 12,
    color: '#000',
    letterSpacing: 1,
  },

  dropdown: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingHorizontal: 0,
  },

  placeholder: {
    fontSize: 16,
    color: '#000',
  },

  selectedText: {
    fontSize: 16,
    color: '#000',
  },

  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    // marginTop: 8,
  },
});
