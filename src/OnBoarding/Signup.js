import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputText from '../components/InputText';
import ActivityIndicator from '../components/ActivityIndicator';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import { colors, fonts, styles } from '../themes';
import { AppImages } from '../res';
import * as Yup from 'yup';
import { postApi } from '../services/network/api';
import { SignUpSchema } from '../schema/SignUpSchema';
import { useDispatch } from 'react-redux';
import { setMembershipNumber } from '../redux/slices/authSlice';
// Yup schema


export default function SignUp({ navigation }) {
   const dispatch = useDispatch();
  const [name, setUserName] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  // const handleSignUp = async () => {
  //   Keyboard.dismiss();

  //   try {
  //     // Validate form
  //     await SignUpSchema.validate({ name, phone, password }, { abortEarly: false });

  //     // Clear previous errors
  //     setErrors({});

  //     // API call
  //     setIsLoading(true);
  //     const response = await postApi('register', { name: name, phone, password });
  //     setIsLoading(false);

  //     if (response.success) {
  //       Alert.alert('Colony', response.message, [
  //         { text: 'OK', onPress: () => navigation.navigate('Login') },
  //       ]);
  //     } else {
  //       Alert.alert('Colony', response.message);
  //     }
  //   } catch (validationError) {
  //     if (validationError.inner) {
  //       const formErrors = {};
  //       validationError.inner.forEach(err => {
  //         formErrors[err.path] = err.message;
  //       });
  //       setErrors(formErrors);
  //     }
  //   }
  // };

  const handleSignUp = async () => {
  Keyboard.dismiss();
  console.log('Sign Up pressed'); // <-- log button press

  try {
    // Validate form
    console.log('Validating form...', { name, phone, password });
    await SignUpSchema.validate({ name: name, phone, password }, { abortEarly: false });

    // Clear previous errors
    setErrors({});

    // API call
    setIsLoading(true);
    console.log('Calling API...');
    const response = await postApi('register', { name: name, phone, password });
    setIsLoading(false);

    console.log('API response:', response);

    if (response.success) {
       const membershipNumber = response?.data?.memberShipNumber || '';
       console.log("mmem",membershipNumber)
        dispatch(setMembershipNumber(membershipNumber));
      Alert.alert('Colony', response.message, [
        { text: 'OK',  onPress: () =>
            navigation.navigate('Login', 
              // membership: membershipNumber || '', // pass membership to login
            ), },
      ]);
    } else {
      Alert.alert('Colony', response.message);
    }
  } catch (err) {
    console.log('Error caught:', err);

    if (err.inner) {
      const formErrors = {};
      err.inner.forEach(e => {
        console.log('Validation error:', e.path, e.message);
        formErrors[e.path] = e.message;
      });
      setErrors(formErrors);
    } else {
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  }
};


  return (
    <ImageBackground style={style.container} source={AppImages.ccc}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Explore' })}
            style={{ alignSelf: 'flex-start', marginTop: 50, marginLeft: 20 }}
          >
            <Image source={AppImages.Back} style={{ height: 25, width: 25 }} />
          </TouchableOpacity>

          <Image
            style={{ height: 150, width: 200, resizeMode: 'contain', marginTop: 40 }}
            source={AppImages.logo}
          />
        </View>

        {/* Form */}
        <KeyboardAwareScrollView
          enableOnAndroid
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          style={{
            flex: 1,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={style.getStart}>SIGN UP</Text>
          <Text style={style.getStart1}>Your Colony Account</Text>

          {/* Name */}
          <InputText
            placeholder="Enter your full name"
            label="Name"
            value={name}
            onChangeText={setUserName}
            containerStyle={{ marginTop: 30 }}
          />
          <ErrorView text={errors.name} show={!!errors.name} />

          {/* Phone */}
          <InputText
            placeholder="Enter your phone number"
            label="Phone Number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhoneNumber}
            containerStyle={{ marginTop: 15 }}
          />
          <ErrorView text={errors.phone} show={!!errors.phone} />

          {/* Password */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <InputText
              placeholder="Enter Password"
              label="Password"
              secureTextEntry={hidePassword}
              value={password}
              onChangeText={setPassword}
              containerStyle={{ flex: 1 }}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 10 }}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Image
                style={{ height: 25, width: 25, tintColor: colors.black }}
                source={hidePassword ? AppImages.closeeye : AppImages.openeye}
              />
            </TouchableOpacity>
          </View>
          <ErrorView text={errors.password} show={!!errors.password} />

          {/* Sign Up Button */}
          <Button
            title="Sign Up"
            style={{ alignSelf: 'center', marginTop: 25 }}
            onPress={handleSignUp}
          />

          {/* Footer */}
          <View style={{ alignSelf: 'center', marginTop: 15 }}>
            <Text style={style.already}>
              Already have an account?{' '}
              <Text style={{ color: '#FF0007' }} onPress={() => navigation.navigate('Login')}>
                Sign In.
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>

        {/* Loader */}
        <ActivityIndicator onRequestClose={false} isLoading={isLoading} />
      </View>
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  container: { ...styles.container },
  getStart: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    textAlign: 'center',
    fontSize: fonts.fs_32,
    color: '#1A1A1A',
    marginTop: 30,
  },
  getStart1: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    textAlign: 'center',
    fontSize: fonts.fs_22,
    color: colors.txtColor,
    marginTop: 5,
  },
  already: {
    fontSize: fonts.fs_16,
    fontFamily: 'InstrumentSans_Condensed-regular',
    color: colors.txtColor,
    textAlign: 'center',
  },
});
