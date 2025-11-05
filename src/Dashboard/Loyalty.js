import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { AppImages, Fonts, Colors } from '../res';
import AppButton from '../components/AppButton';
import {
  createStaticNavigation,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MemberScreen from '../screens/MemberScreen';
export default function Loyalty(props) {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');

  const fetchUser = async () => {
    try {
      const userName = await AsyncStorage.getItem('name');
      const membershipNum = await AsyncStorage.getItem('membershipNumber');

      console.log('🟢 Fetched user:', { userName, membershipNum });

      // ✅ Check if userName is missing or empty
      if (!userName || userName === 'null' || userName === 'undefined') {
        console.log('🔴 No user found, navigating to Loyalty screen...');
      } else {
        setUserName(userName);
        console.log('✅ User is logged in');
      }
    } catch (error) {
      console.log('❌ Error fetching user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [userName]),
  );

  return (
    <>
      {!userName || userName === 'null' || userName === 'undefined' ? (
         <>
          <ImageBackground source={AppImages.loginBg} style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.colony}>COLONY</Text>
              <AppButton
                text={'LOGIN'}
                onPress={() => navigation.navigate('Login')}
                style={{
                  backgroundColor: Colors.WHITE,
                  width: 250,
                  marginTop: 40,
                }}
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
                style={{
                  backgroundColor: Colors.WHITE,
                  width: 250,
                  marginTop: 20,
                }}
                textStyle={{
                  color: Colors.BLACK,
                  fontFamily: Fonts.regular,
                  letterSpacing: 2,
                }}
              />
              <Text style={styles.colony1}>ABOUT COLONY</Text>
            </View>
          </ImageBackground>
        </>
       
      ) : (
        <MemberScreen />
      )}
    </>
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
