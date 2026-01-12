import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

const CommonTextInput = ({
  label,
  value,
  onChangeText,
  showRightIcon = false,
  iconName = null,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="flat"

        /* 🔴 IMPORTANT */
        dense={true}

        style={styles.input}
        contentStyle={styles.content}

        underlineColor="#000"
        activeUnderlineColor="#000"
        theme={{
          roundness: 0,
          colors: {
            onSurfaceVariant: '#666',
          },
        }}

        right={
          showRightIcon && iconName ? (
            <TextInput.Icon
              icon={() => iconName}
              style={styles.rightIcon}
            />
          ) : null
        }
      />
    </View>
  );
};

export default CommonTextInput;


const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
  },

  input: {
    backgroundColor: 'transparent',
    margin: 0,
    paddingHorizontal: 0,   // 🔥 remove left & right padding
    paddingVertical: 0,
    minHeight: 40,
    fontSize:14
  },

  content: {
    paddingHorizontal: 0,   // 🔥 typed text + placeholder spacing
    paddingVertical: 0,
    margin: 0,
  },

  rightIcon: {
    margin: 0,
    padding: 0,
    marginLeft:30
  },
});
