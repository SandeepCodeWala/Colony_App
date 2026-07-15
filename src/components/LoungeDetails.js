import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const LoungeDetails = ({ isLounge = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.locationPill}>
        <Text style={styles.location}>UK · COLONY</Text>
      </View>
      <Text style={styles.restaurantName}>
        {isLounge ? 'Colony Private Lounge' : 'Colony Restaurant'}
      </Text>
      <Text style={styles.description}>
        {isLounge
          ? 'An intimate premium setting with refined hospitality, crafted drinks and relaxed private moments.'
          : 'Hypnotic views, refined hospitality and exquisite mixology in an inviting premium atmosphere.'}
      </Text>
    </View>
  );
};

const T = PremiumTheme;
const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  locationPill: {
    alignSelf: 'flex-start',
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  location: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 10,
    color: T.primaryDark,
    letterSpacing: 1.6,
  },
  restaurantName: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 24,
    color: T.ink,
    marginTop: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: T.muted,
    marginTop: 6,
    lineHeight: 22,
  },
});

export default LoungeDetails;
