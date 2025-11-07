// components/LoungeDetails.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../res';
// const ic_pin = require('../res/images/icons/pin.png');

const LoungeDetails = () => {
  return (
    <View style={styles.container}>
      <View style={styles.locationRow}>
        {/* <Image source={ic_pin} style={styles.pinIcon} /> */}
        <Text style={styles.location}>UK</Text>
      </View>
      <Text style={styles.restaurantName}>Colony Restaurant</Text>
      <Text style={styles.description}>
        Hypnotic views of the cityscape inspire exquisite mixology in an inviting atmosphere
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  locationRow: { flexDirection: 'row' },
  pinIcon: { width: 15, height: 15 },
  location: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 13,
    color: Colors.Muted_Gold,
    paddingLeft: 5,
  },
  restaurantName: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 20,
    color: Colors.BLACK,
    marginTop: 6,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.DARK_GREY,
    marginTop: 4,
    lineHeight: 20,
  },
});

export default LoungeDetails;
