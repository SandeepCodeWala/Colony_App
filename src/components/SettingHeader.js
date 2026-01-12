
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppImages, Colors, Fonts } from '../res';

const SettingHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Image source={AppImages.Back} style={styles.backIcon} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>{title}</Text>

      <View style={styles.rightSpace} />
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
    marginTop: 40,
    backgroundColor:Colors.LIGHT_GRAY
    // backgroundColor:"#F7F7F7"
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { height: 20, width: 20, tintColor: Colors.OFF_GREY },
  bellIcon: { height: 24, width: 24, tintColor: Colors.BLACK },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 15,
    color: "#434242",
  },
   rightSpace: {
    width: 40, 
  },
});

export default SettingHeader;
