import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CommonRadioGroup = ({
  options = [],
  value,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      {options.map(item => {
        const selected = value === item.value;

        return (
          <TouchableOpacity
            key={item.value}
            style={styles.option}
            activeOpacity={0.7}
            onPress={() => onChange(item.value)}
          >
            {/* Radio Circle */}
            <View
              style={[
                styles.outerCircle,
                selected && styles.outerCircleSelected,
              ]}
            >
              {selected && <View style={styles.innerCircle} />}
            </View>

            {/* Label */}
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CommonRadioGroup;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',        // 2 items per row
    marginBottom: 12,
  },

  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  innerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
  },

  label: {
    marginLeft: 8,
    fontSize: 14,
    letterSpacing: 1,
    color: '#000',
  },
  outerCircleSelected:{
    backgroundColor:"transparent"
  }
});
