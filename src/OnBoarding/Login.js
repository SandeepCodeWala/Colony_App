import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setLoginField,
  setMembershipNumber,
  setUserData,
} from '../redux/slices/authSlice';
import ActivityIndicator from '../components/ActivityIndicator';
import InputText from '../components/InputText';
import ErrorView from '../components/ErrorView';
import Button from '../components/Button';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';
import { postApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const savedMembership = useSelector(state => state.auth.membershipNumber);
  const { height } = useWindowDimensions();
  const firstLoad = useFirstRenderSkeleton(720);

  const [loginField, setLoginValue] = useState(savedMembership || '');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const cleanIdentifier = loginField.trim();
    const cleanPassword = password.trim();
    setIdentifierError(cleanIdentifier ? '' : 'Enter your phone or membership number.');
    setPasswordError(cleanPassword ? '' : 'Enter your password.');
    return Boolean(cleanIdentifier && cleanPassword);
  };

  const signIn = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    setIsLoading(true);
    const response = await postApi('login', {
      loginField: loginField.trim(),
      password,
    });
    setIsLoading(false);

    if (!response?.success) {
      showToast('error', response?.message || 'Unable to sign in.');
      return;
    }

    const responseData = response?.data || {};
    const userData = {
      ...responseData,
      name: responseData.name || '',
      phone: responseData.phone || '',
      membership_number:
        responseData.membership_number || loginField.trim(),
    };
    const token = responseData.access_token || responseData.token || '';

    await AsyncStorage.multiSet([
      ['token', token],
      ['user', JSON.stringify(userData)],
      ['name', userData.name],
      ['phone', String(userData.phone || '')],
      ['membershipNumber', String(userData.membership_number || '')],
    ]);

    dispatch(setLoginField(loginField.trim()));
    dispatch(setMembershipNumber(userData.membership_number));
    dispatch(setUserData({ user: userData, token }));

    showToast('success', response?.message || 'Welcome back.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'BottomTabs', params: { screen: 'Book' } }],
    });
  };

  if (firstLoad) return <ScreenSkeleton variant="page" />;

  const heroHeight = Math.max(280, Math.min(height * 0.43, 390));

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={AppImages.ccc}
        style={[styles.hero, { height: heroHeight }]}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay} />
        <TouchableOpacity
          onPress={() => navigation.navigate('BottomTabs', { screen: 'Explore' })}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Image source={AppImages.logo} style={styles.logo} resizeMode="contain" />
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          <Text style={styles.eyebrow}>COLONY MEMBERSHIP</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in with your phone number or membership number.
          </Text>

          <InputText
            label="Phone or membership number"
            placeholder="Enter identifier"
            value={loginField}
            keyboardType="default"
            containerStyle={styles.firstInput}
            onChangeText={value => {
              setLoginValue(value);
              if (value.trim()) setIdentifierError('');
            }}
          />
          <ErrorView text={identifierError} show={Boolean(identifierError)} />

          <View style={styles.passwordWrap}>
            <InputText
              label="Password"
              placeholder="Enter password"
              value={password}
              secureTextEntry={hidePassword}
              containerStyle={styles.passwordInput}
              onChangeText={value => {
                setPassword(value);
                if (value.trim()) setPasswordError('');
              }}
            />
            <TouchableOpacity
              onPress={() => setHidePassword(value => !value)}
              style={styles.eyeButton}
              activeOpacity={0.7}
            >
              <Image
                source={hidePassword ? AppImages.closeeye : AppImages.openeye}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <ErrorView text={passwordError} show={Boolean(passwordError)} />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotButton}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Sign in" onPress={signIn} style={styles.primaryButton} />

          <TouchableOpacity
            onPress={() => navigation.push('Signup')}
            style={styles.createAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.createText}>
              New to Colony? <Text style={styles.createLink}>Create an account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} text="Signing you in..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  hero: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,11,8,0.34)' },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 24, height: 24, tintColor: T.surface },
  logo: { width: 190, height: 118, tintColor: T.surface },
  keyboard: { flex: 1, marginTop: -26 },
  formContent: {
    flexGrow: 1,
    backgroundColor: T.surfaceSoft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: Platform.OS === 'ios' ? 42 : 28,
  },
  eyebrow: {
    color: T.primary,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 10,
    letterSpacing: 2.3,
    textAlign: 'center',
  },
  title: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 18,
  },
  firstInput: { marginTop: 24 },
  passwordWrap: { position: 'relative' },
  passwordInput: { marginTop: 2 },
  eyeButton: {
    position: 'absolute',
    right: 23,
    bottom: 20,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: { width: 21, height: 21, tintColor: T.muted },
  forgotButton: { alignSelf: 'flex-end', paddingVertical: 10, paddingHorizontal: 5 },
  forgotText: {
    color: T.primaryDark,
    fontFamily: Fonts.luxurySans,
    fontSize: 13,
  },
  primaryButton: { marginTop: 14 },
  createAccount: { alignItems: 'center', paddingVertical: 24 },
  createText: { color: T.muted, fontFamily: Fonts.luxurySansLight, fontSize: 13 },
  createLink: { color: T.primaryDark, fontFamily: Fonts.luxurySansMedium },
});
