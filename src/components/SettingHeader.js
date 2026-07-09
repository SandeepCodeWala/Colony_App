import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const SettingHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.78}
          style={styles.backButton}
        >
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.titleBox}>
          <Text style={styles.kicker}>Colony Privilege</Text>
          <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
        </View>

        <View style={styles.rightBadge}>
          <Text style={styles.badgeText}>✦</Text>
        </View>
      </View>
    </View>
  );
};

export default SettingHeader;

const T = PremiumTheme;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: Platform.OS === 'ios' ? 52 : 38,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: T.paper,
  },
  header: {
    minHeight: 72,
    borderRadius: 28,
    backgroundColor: T.glass,
    borderWidth: 1,
    borderColor: T.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: T.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  backButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: T.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
  },
  backIcon: {
    height: 18,
    width: 18,
    tintColor: T.ink,
    resizeMode: 'contain',
  },
  titleBox: { flex: 1, marginHorizontal: 12 },
  kicker: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 9,
    letterSpacing: 1.8,
    color: T.primary,
    textTransform: 'uppercase',
  },
  headerTitle: {
    marginTop: 3,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 18,
    color: T.ink,
  },
  rightBadge: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: T.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: T.primary,
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  badgeText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 14,
    color: T.surface,
  },
});
