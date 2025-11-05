import Toast from 'react-native-toast-message';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../themes/colors';

export const showToast = (type, text1, text2 = '') => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'top', // 👈 show from top
    visibilityTime: 3000, // auto hide after 3 sec
    topOffset: 50, // spacing from top
  });
};

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={[styles.toastContainer, { borderLeftColor: colors.buttonBgColor }]}
    >
      <Text style={styles.text1}>{text1}</Text>
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, { borderLeftColor: '#ef4444' }]}>
      <Text style={styles.text1}>{text1}</Text>
      {text2 ? <Text style={styles.text2}>{text2}</Text> : null}
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 20,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  text2: {
    fontSize: 14,
    color: '#555',
    marginTop: 3,
  },
});
