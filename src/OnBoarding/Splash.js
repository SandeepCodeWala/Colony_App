import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { AppImages, Colors } from '../res';
export default function Splash() {
  return (
    <View style={styles.container}>
      <Image source={AppImages.logo} style={styles.img} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.APPCOLOR,
    alignItems: 'center',
  },
  img: {
    // height: 80,
    // width: 200,
  },
});
