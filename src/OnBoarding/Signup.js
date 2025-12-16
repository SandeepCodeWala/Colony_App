import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import InputText from '../components/InputText';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import ActivityIndicator from '../components/ActivityIndicator';
import { colors, fonts } from '../themes';
import { AppImages } from '../res';
import { postApi } from '../services/network/api';
import { SignUpSchema } from '../schema/SignUpSchema';
import { setMembershipNumber } from '../redux/slices/authSlice';
import { showToast } from '../services/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const [name, setUserName] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const randomOTP = Math.floor(1000 + Math.random() * 9000);

//   const handleSignUp = async () => {
//     try {
//       // await SignUpSchema.validate(
//       //   { name, phone, password },
//       //   { abortEarly: false },
//       // );
//       setErrors({});
//       setIsLoading(true);
//       const response = await postApi('register', { name, phone, password });
//       console.log('THIS IS SINGUP API RESPONSE==', response);
//       setIsLoading(false);

//       // if (response?.success) {
//       //   const membershipNumber = response?.data?.memberShipNumber || '';
//       //   dispatch(setMembershipNumber(membershipNumber));
//       // await AsyncStorage.setItem('membershipNumber', membershipNumber);

//       //   showToast(
//       //     'success',
//       //     'Please verify your OTP sent to your phone number.',
//       //   );
//       //   const sendOTP = await postApi('send-otp', { phone });
//       //   console.log("THIS IS SENPOTP API RESPONSE==+++",sendOTP)
//       //   if (sendOTP?.success) {
//       //     navigation.navigate('OTPValidate',{phone});
//       //   } else {
//       //     showToast('error', sendOTP.message || 'Failed to send OTP.');
//       //   }
//       // } else {
//       //   showToast(
//       //     'error',
//       //     response.message || 'Registration failed. Please try again.',
//       //   );
//       // }

//       if (response?.success) {
//   const membershipNumber = response?.data?.memberShipNumber || '';

//   // Store in redux + async storage
//   dispatch(setMembershipNumber(membershipNumber));
//   await AsyncStorage.setItem('membershipNumber', membershipNumber);

//   showToast('success', 'Please verify your OTP sent to your phone number.');

//   // ✅ FIXED — send phone + membership_number
//   const sendOTP = await postApi('send-otp', { 
//     phone, 
//     membership_number: membershipNumber 
//   });

//   console.log("THIS IS SENDOTP API RESPONSE==+++", sendOTP);

//   if (sendOTP?.success) {
//     navigation.navigate('OTPValidate', { 
//       phone, 
//       membership_number: membershipNumber 
//     });
//   } else {
//     showToast('error', sendOTP.message || 'Failed to send OTP.');
//   }
// }

//     } catch (err) {
//       console.log('THIS IS ERRORS===', err);
//       showToast('error', 'Registration failed. Please try again.');
//     } finally {
//       setIsLoading(false);

//       console.log('THIS IS ERRORS', errors);
//     }
//   };




const handleSignUp = async () => {
  try {
    setIsLoading(true);
    const response = await postApi('register', { name, phone, password });
    setIsLoading(false);

    if (response?.success) {
      const membershipNumber = response?.data?.memberShipNumber;
      if (!membershipNumber) {
        showToast('error', 'Membership number not received from server');
        return;
      }

      // ✅ Save to Redux
      dispatch(setMembershipNumber(membershipNumber));

      // ✅ Save to AsyncStorage if needed
      // await AsyncStorage.setItem('membershipNumber', membershipNumber);

      showToast('success', 'Please verify your OTP sent to your phone number.');

      // ✅ Send OTP with membership_number
      const sendOTP = await postApi('send-otp', { phone, membership_number: membershipNumber });
      if (sendOTP?.success) {
        // ✅ Navigate to OTP screen
        navigation.navigate('OTPValidate', { phone });
      } else {
        showToast('error', sendOTP?.message || 'Failed to send OTP.');
      }
    } else {
      showToast('error', response?.message || 'Registration failed');
    }
  } catch (err) {
    console.log('Signup error:', err);
    showToast('error', 'Something went wrong during signup');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <ImageBackground
      source={AppImages.ccc}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button + logo */}
          <View style={{ position: 'absolute', top: 40, left: 20 }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('BottomTabs', { screen: 'Explore' })
              }
            >
              <Image
                source={AppImages.Back}
                style={{ height: 25, width: 25, tintColor: colors.white }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              position: 'absolute',
              top: 70,
              width: '100%',
            }}
          >
            <Image
              source={AppImages.logo}
              style={{
                height: 150,
                width: 200,
                resizeMode: 'contain',
                tintColor: colors.white,
              }}
            />
          </View>

          {/* White rounded form area */}
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 0,
              paddingBottom: 40,
              paddingTop: 20,
            }}
          >
            <Text
              style={{
                fontFamily: 'InstrumentSans_Condensed-medium',
                textAlign: 'center',
                fontSize: fonts.fs_32,
                color: '#1A1A1A',
              }}
            >
              SIGN UP
            </Text>
            <Text
              style={{
                fontFamily: 'InstrumentSans_Condensed-medium',
                textAlign: 'center',
                fontSize: fonts.fs_22,
                color: colors.txtColor,
                marginTop: 5,
              }}
            >
              Your Colony Account
            </Text>

            {/* Name Input */}
            <InputText
              placeholder="Enter your full name"
              label="Name"
              value={name}
              onChangeText={setUserName}
              containerStyle={{ marginTop: 30, marginBottom: 0 }}
            />
            <ErrorView text={errors.name} show={!!errors.name} />

            {/* Phone Input */}
            <InputText
              placeholder="Enter your phone number"
              label="Phone Number"
              keyboardType="phone-pad"
              maxLength={13}
              value={phone}
              onChangeText={setPhoneNumber}
              containerStyle={{ marginTop: 15, marginBottom: 0 }}
            />
            <ErrorView text={errors.phone} show={!!errors.phone} />

            {/* Password Input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}
            >
              <InputText
                placeholder="Enter Password"
                label="Password"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={setPassword}
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 10,
                  marginTop: 30,
                  marginRight: 25,
                }}
                onPress={() => setHidePassword(!hidePassword)}
              >
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    tintColor: colors.black,
                  }}
                  source={hidePassword ? AppImages.closeeye : AppImages.openeye}
                />
              </TouchableOpacity>
            </View>
            <ErrorView text={errors.password} show={!!errors.password} />

            {/* Sign Up Button */}
            <Button
            title={isLoading ? "Loading .." :"sign-up"}
              style={{
                alignSelf: 'center',
                marginTop: 25,
              }}
              onPress={handleSignUp}
            />

            {/* Footer */}
            <View style={{ alignSelf: 'center', marginTop: 15 }}>
              <Text
                style={{
                  fontSize: fonts.fs_16,
                  fontFamily: 'InstrumentSans_Condensed-regular',
                  color: colors.txtColor,
                  textAlign: 'center',
                }}
              >
                Already have an account?{' '}
                <Text
                  style={{ color: colors.blue }}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign In.
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator onRequestClose={false} isLoading={isLoading} />
    </ImageBackground>
  );
}
