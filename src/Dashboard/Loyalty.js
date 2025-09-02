import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { AppImages, Fonts, Colors } from '../res';
import AppButton from '../components/AppButton';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
export default function Loyalty(props) {
  const navigation = useNavigation();
  return (
    <ImageBackground source={AppImages.loginBg} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.colony}>COLONY</Text>
        <AppButton
          text={'LOGIN'}
          onPress={() => navigation.navigate('Login')}
          style={{ backgroundColor: Colors.WHITE, width: 250, marginTop: 40 }}
          textStyle={{
            color: Colors.BLACK,
            fontFamily: Fonts.regular,
            letterSpacing: 2,
          }}
        />
        <Text style={styles.colony1}>OR</Text>
        <AppButton
          text={'JOIN NOW'}
          onPress={() => navigation.navigate('Signup')}
          style={{ backgroundColor: Colors.WHITE, width: 250, marginTop: 20 }}
          textStyle={{
            color: Colors.BLACK,
            fontFamily: Fonts.regular,
            letterSpacing: 2,
          }}
        />
        <Text style={styles.colony1}>ABOUT COLONY</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    // You don’t really need extra alignment here now
  },
  colony: {
    fontSize: 50,
    fontFamily: Fonts.SemiBold,
    color: Colors.WHITE,
    textAlign: 'center',
  },
  colony1: {
    fontSize: 15,
    fontFamily: Fonts.SemiBold,
    color: Colors.WHITE,
    textAlign: 'center',
    marginTop: 20,
  },
});
