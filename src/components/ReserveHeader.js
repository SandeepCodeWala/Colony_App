// components/ReserveHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppImages, Colors, Fonts } from '../res';

const ReserveHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Image source={AppImages.Back} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <TouchableOpacity>
        <Image source={AppImages.bell} style={styles.bellIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingRight: 20,
    marginTop: 45,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { height: 24, width: 24, tintColor: Colors.BLACK },
  bellIcon: { height: 24, width: 24, tintColor: Colors.BLACK },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: Colors.BLACK,
  },
});

export default ReserveHeader;
