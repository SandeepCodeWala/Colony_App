import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const ReserveHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.78}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={styles.kicker}>Luxury Dining</Text>
          <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
        </View>

        <TouchableOpacity style={styles.iconButton} activeOpacity={0.78}>
          <Image source={AppImages.bell} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const T = PremiumTheme;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: T.paper,
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  header: {
    minHeight: 72,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: T.glass,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: T.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  iconButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
  },
  titleWrap: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
  kicker: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: T.primary,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
  },
  backIcon: { height: 21, width: 21, tintColor: T.ink, resizeMode: 'contain' },
  bellIcon: { height: 20, width: 20, tintColor: T.ink, resizeMode: 'contain' },
  headerTitle: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 18,
    color: T.ink,
    marginTop: 3,
  },
});

export default ReserveHeader;
