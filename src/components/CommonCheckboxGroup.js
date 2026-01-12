import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CommonCheckboxGroup = ({
  options = [],
  values = [],
  onChange,
}) => {
  const toggleItem = value => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <View style={styles.container}>
      {options.map(item => {
        const checked = values.includes(item.value);

        return (
          <TouchableOpacity
            key={item.value}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => toggleItem(item.value)}
          >
            {/* Checkbox */}
            <View
              style={[
                styles.checkbox,
                checked && styles.checkboxChecked,
              ]}
            >
              {checked && <View style={styles.checkMark} />}
            </View>

            {/* Label */}
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CommonCheckboxGroup;


const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#4a4949',
    borderRadius: 2, // square look
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#242424',
  },

  checkMark: {
    width: 8,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }],
    marginBottom: 2,
  },

  label: {
    marginLeft: 12,
    fontSize: 14,
    letterSpacing: 1,
    color: '#363636',
  },
});
