import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const SettingHeader = ({ onBack, title, containerStyle }) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.75}
          style={styles.backButton}
        >
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.titleBox}>
          {/* <Text style={styles.kicker}>ACCOUNT</Text> */}
          <Text numberOfLines={1} style={styles.headerTitle}>
            {title}
          </Text>
        </View>

        {/* <View style={styles.rightBadge}>
          <Text style={styles.badgeText}>CRAV</Text>
        </View> */}
      </View>
    </View>
  );
};

export default SettingHeader;

const T = PremiumTheme;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 42,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: T.cream || '#FFF8F2',
  },

  header: {
    minHeight: 66,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1E1D5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,

    shadowColor: '#9C5A2E',
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  backButton: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: '#FFF2DF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECD7BA',
  },

  backIcon: {
    height: 18,
    width: 18,
    tintColor: T.ink || '#201A17',
    resizeMode: 'contain',
  },

  titleBox: {
    flex: 1,
    marginHorizontal: 12,
  },

  kicker: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 10,
    letterSpacing: 2,
    color: T.primary || '#B7782E',
    textTransform: 'uppercase',
  },

  headerTitle: {
    marginTop: 3,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 18,
    color: T.ink || '#201A17',
  },

  rightBadge: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: T.primary || '#B7782E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: '#201A17',
  },
});
