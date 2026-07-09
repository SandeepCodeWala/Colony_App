import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoginField,
  setMembershipNumber,
  setUserData,
} from '../redux/slices/authSlice';
import { checkNormalData } from '../components/Validation';
import ActivityIndicator from '../components/ActivityIndicator';
import { AppImages } from '../res';
import InputText from '../components/InputText';
import ErrorView from '../components/ErrorView';
import Button from '../components/Button';
import { postApi } from '../services/network/api';
import { colors, fonts, styles as commonStyles } from '../themes';
import { showToast } from '../services/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ correct import
import PremiumTheme from '../res/PremiumTheme';
import { Fonts } from '../res';

export default function SignIn(props) {
  const dispatch = useDispatch();
  const membershipNumber = useSelector(state => state.auth.membershipNumber);

  const [loginField, setUserName] = useState(membershipNumber || '');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [userNameError, setUserNameError] = useState({
    status: false,
    text: '',
  });
  const [passwordError, setPasswordError] = useState({
    status: false,
    text: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const setErrorState = () => {
    if (password === '') {
      setPasswordError(checkNormalData(password, 'Please enter password'));
    }
  };

  // const signIn = async () => {
  //   const data = { loginField, password };
  //   setIsLoading(true);
  //   const response = await postApi('login', data);
  //   setIsLoading(false);

  //   if (response.success) {
  //     dispatch(setLoginField(loginField));
  //     await AsyncStorage.setItem('token', response.data.access_token);
  //     await AsyncStorage.setItem('phone', response.data.phone);
  //     await AsyncStorage.setItem('name', response.data.name);
  //     dispatch(setMembershipNumber(loginField));
  //     await AsyncStorage.setItem('membershipNumber', loginField);
  //     props.navigation.navigate('BottomTabs', { screen: 'Book' });

  //     showToast('success', response.message);
  //   } else {
  //     showToast('error', response.message);
  //   }
  // };

  const signIn = async () => {
    const data = { loginField, password };
    console.log(data, '=====>data fathima');
    setIsLoading(true);

    const response = await postApi('login', data);
    setIsLoading(false);

    if (response.success) {
      const userData = {
        name: response.data.name,
        phone: response.data.phone,
        membership_number: response.data.membership_number,
      };

      await AsyncStorage.setItem('token', response.data.access_token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('name', response.data.name || '');
      await AsyncStorage.setItem(
        'membershipNumber',
        response.data.membership_number || '',
      );

      dispatch(
        setUserData({
          user: userData,
          token: response.data.access_token,
        }),
      );

      props.navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs', params: { screen: 'Book' } }],
      });

      showToast('success', response.message);
    } else {
      showToast('error', response.message);
    }
  };

  const submit = () => {
    Keyboard.dismiss();
    if (
      !checkNormalData(loginField, '').status &&
      !checkNormalData(password, '').status
    ) {
      setErrorState();
      signIn();
    } else {
      setErrorState();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Fixed Background */}
      <ImageBackground
        source={AppImages.ccc}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        {/* Back Button */}
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('BottomTabs', { screen: 'Explore' })
          }
          style={styles.backBtn}
        >
          <Image
            source={AppImages.Back}
            style={{ height: 25, width: 25, tintColor: PremiumTheme.surface }}
          />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={AppImages.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* Bottom Sheet (Moves with Keyboard) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.bottomSheetWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.bottomSheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>SIGN IN</Text>
          <Text style={styles.subtitle}>Your Colony Account</Text>

          <InputText
            placeholder="Enter membership no."
            label="Membership number"
            placeholderTextColor="#6D6D6D"
            containerStyle={{ marginTop: 30, marginBottom: 0 }}
            inputStyle={styles.inputText}
            value={loginField}
            onChangeText={value => {
              setUserName(value);
              setUserNameError(
                checkNormalData(value, 'Please enter Email ID.'),
              );
            }}
          />
          <ErrorView text={userNameError.text} show={userNameError.status} />

          {/* Password Field */}
          <View style={styles.passwordContainer}>
            <InputText
              placeholder="Enter Password"
              label="Password"
              placeholderTextColor="#6D6D6D"
              secureTextEntry={hidePassword}
              value={password}
              containerStyle={{ flex: 1, marginBottom: 0 }}
              inputStyle={styles.inputText}
              onChangeText={value => {
                setPassword(value);
                setPasswordError(
                  checkNormalData(value, 'Please enter password'),
                );
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              activeOpacity={0.3}
              onPress={() => setHidePassword(!hidePassword)}
            >
              <Image
                style={styles.eyeImg}
                source={hidePassword ? AppImages.closeeye : AppImages.openeye}
              />
            </TouchableOpacity>
          </View>

          <ErrorView text={passwordError.text} show={passwordError.status} />
          <View style={{ paddingHorizontal: 25 }}>
            <Button
              title="Sign In"
              style={styles.signInBtn}
              textTitle={styles.signInBtnText}
              onPress={submit}
            />
          </View>
          <Text
            style={styles.forgot}
            onPress={() => props.navigation.navigate('ForgotPassword')}
          >
            Forgot Password?
          </Text>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer (Fixed) */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.signUpText}
            onPress={() => props.navigation.push('Signup')}
          >
            Sign Up.
          </Text>
        </Text>
      </View>

      <ActivityIndicator onRequestClose={false} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    height: '70%',
    width: '100%',
    // justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,23,19,0.38)', // semi-transparent black overlay
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  logo: {
    height: 140,
    width: 200,
    tintColor: PremiumTheme.surface,
  },
  bottomSheetWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  bottomSheet: {
    backgroundColor: PremiumTheme.glass,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 0,
    paddingBottom: 30,
    paddingTop: 25,
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fs_32,
    color: PremiumTheme.ink,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fonts.fs_22,
    color: PremiumTheme.muted,
    fontFamily: Fonts.instrumentSansRegular,
  },
  inputText: {
    fontSize: fonts.fs_16,
    color: PremiumTheme.ink,
    fontFamily: Fonts.instrumentSansRegular,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 30,
    top: 32,
  },
  eyeImg: {
    height: 24,
    width: 24,
    tintColor: PremiumTheme.primary,
    marginTop: 15,
  },
  forgot: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: fonts.fs_18,
    color: PremiumTheme.muted,
    fontFamily: Fonts.instrumentSansRegular,
    // marginBottom: 20,
  },
  signInBtn: {
    alignSelf: 'center',
    marginTop: 25,
    // backgroundColor: '#B7782E', // golden brown tone
    borderRadius: 25,
  },
  signInBtnText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: fonts.fs_16,
    color: PremiumTheme.surface,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: fonts.fs_16,
    fontFamily: Fonts.instrumentSansRegular,
    color: PremiumTheme.muted,
  },
  signUpText: {
    color: PremiumTheme.primary,
  },
});
