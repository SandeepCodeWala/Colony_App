// components/ReserveHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const ReserveHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.header, containerStyle]}>
      <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.75}>
        <Image source={AppImages.Back} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.titleWrap}>
        <Text style={styles.kicker}>CRAV</Text>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <TouchableOpacity style={styles.iconButton} activeOpacity={0.75}>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: 14,
    backgroundColor: PremiumTheme.paper,
    borderBottomWidth: 1,
    borderBottomColor: PremiumTheme.border,
  },
  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PremiumTheme.surface,
    borderWidth: 1,
    borderColor: PremiumTheme.border,
  },
  titleWrap: { alignItems: 'center' },
  kicker: {
    fontSize: 10,
    letterSpacing: 2.4,
    color: PremiumTheme.gold,
    fontFamily: Fonts.instrumentSansMedium,
  },
  backIcon: { height: 22, width: 22, tintColor: PremiumTheme.ink },
  bellIcon: { height: 21, width: 21, tintColor: PremiumTheme.ink },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: PremiumTheme.ink,
    marginTop: 2,
  },
});

export default ReserveHeader;
