import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

const ReserveHeader = ({ onBack, title, containerStyle }) => (
  <View style={[styles.header, containerStyle]}>
    {onBack ? (
      <TouchableOpacity onPress={onBack} style={styles.sideButton} activeOpacity={0.75}>
        <Image source={AppImages.Back} style={styles.backIcon} />
      </TouchableOpacity>
    ) : (
      <View style={styles.sideButton} />
    )}
    <Text numberOfLines={1} style={styles.title}>{title}</Text>
    <View style={styles.sideButton} />
  </View>
);

export default ReserveHeader;

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 112 : 92,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    paddingHorizontal: 14,
    backgroundColor: T.cream,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  backIcon: { width: 22, height: 22, resizeMode: 'contain', tintColor: T.ink },
  title: {
    flex: 1,
    textAlign: 'center',
    color: T.ink,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 24,
  },
});
