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
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputText from '../components/InputText';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import ActivityIndicator from '../components/ActivityIndicator';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { postApi } from '../services/network/api';
import { SignUpSchema } from '../schema/SignUpSchema';
import { setMembershipNumber } from '../redux/slices/authSlice';
import { showToast } from '../services/Toast';

const T = PremiumTheme;

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const heroHeight = Math.max(230, Math.min(height * 0.34, 330));
  const formWidth = Math.min(width, 720);

  const validate = async () => {
    try {
      await SignUpSchema.validate(
        { name: name.trim(), phone: phone.trim(), password },
        { abortEarly: false },
      );
      setErrors({});
      return true;
    } catch (error) {
      const nextErrors = {};
      (error?.inner || []).forEach(item => {
        if (item?.path && !nextErrors[item.path]) {
          nextErrors[item.path] = item.message;
        }
      });
      setErrors(nextErrors);
      return false;
    }
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    const isValid = await validate();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await postApi('register', {
        name: name.trim(),
        phone: phone.trim(),
        password,
      });

      if (!response?.success) {
        showToast('error', response?.message || 'Registration failed');
        return;
      }

      const membershipNumber =
        response?.data?.memberShipNumber ||
        response?.data?.membership_number ||
        response?.data?.membershipNumber ||
        '';

      if (!membershipNumber) {
        showToast('error', 'Membership number not received from server');
        return;
      }

      dispatch(setMembershipNumber(membershipNumber));
      await AsyncStorage.setItem('membershipNumber', String(membershipNumber));

      const otpResponse = await postApi('send-otp', {
        phone: phone.trim(),
        membership_number: membershipNumber,
      });

      if (!otpResponse?.success) {
        showToast('error', otpResponse?.message || 'Failed to send OTP');
        return;
      }

      showToast(
        'success',
        otpResponse?.message || 'OTP sent successfully via voice call',
      );
      navigation.navigate('SignupOTPValidate', {
        phone: phone.trim(),
        membership_number: membershipNumber,
      });
    } catch (error) {
      showToast('error', 'Something went wrong during signup');
    } finally {
      setIsLoading(false);
    }
  };

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
          onPress={() => navigation.goBack()}
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
          contentContainerStyle={styles.scroll}
        >
          <View style={[styles.formCard, { width: formWidth }]}>
            <Text style={styles.eyebrow}>JOIN COLONY</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Become a Colony member and access reservations, rewards and your digital membership card.
            </Text>

            <InputText
              label="Full name"
              placeholder="Enter your full name"
              value={name}
              autoCapitalize="words"
              containerStyle={styles.firstInput}
              onChangeText={value => {
                setName(value);
                if (value.trim().length >= 2) {
                  setErrors(current => ({ ...current, name: '' }));
                }
              }}
            />
            <ErrorView text={errors.name} show={Boolean(errors.name)} />

            <InputText
              label="Phone number"
              placeholder="Enter 10-digit phone number"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={value => {
                const cleanValue = value.replace(/[^0-9]/g, '');
                setPhone(cleanValue);
                if (cleanValue.length === 10) {
                  setErrors(current => ({ ...current, phone: '' }));
                }
              }}
            />
            <ErrorView text={errors.phone} show={Boolean(errors.phone)} />

            <View style={styles.passwordWrap}>
              <InputText
                label="Password"
                placeholder="Create a secure password"
                secureTextEntry={hidePassword}
                value={password}
                onChangeText={value => {
                  setPassword(value);
                  if (value.length >= 8) {
                    setErrors(current => ({ ...current, password: '' }));
                  }
                }}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setHidePassword(value => !value)}
                activeOpacity={0.7}
              >
                <Image
                  source={hidePassword ? AppImages.closeeye : AppImages.openeye}
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>
            <ErrorView text={errors.password} show={Boolean(errors.password)} />

            <View style={styles.passwordHint}>
              <Text style={styles.passwordHintText}>
                Use 8–20 characters with uppercase, lowercase, number and special character.
              </Text>
            </View>

            <Button
              title="Create account"
              onPress={handleSignUp}
              disabled={isLoading}
              style={styles.primaryButton}
            />

            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
              style={styles.loginLink}
              activeOpacity={0.7}
            >
              <Text style={styles.loginText}>
                Already a member? <Text style={styles.loginStrong}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} text="Creating your account..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  hero: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(14,11,8,0.34)',
  },
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
  logo: { width: 180, height: 106, tintColor: T.surface },
  keyboard: { flex: 1, marginTop: -26 },
  scroll: { flexGrow: 1, alignItems: 'center' },
  formCard: {
    flexGrow: 1,
    backgroundColor: T.surfaceSoft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 44 : 30,
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
    fontSize: 38,
    lineHeight: 46,
    textAlign: 'center',
    marginTop: 9,
  },
  subtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  firstInput: { marginTop: 22 },
  passwordWrap: { position: 'relative' },
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
  passwordHint: {
    marginHorizontal: '6%',
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 2,
    borderLeftColor: T.primary,
    backgroundColor: T.primarySoft,
  },
  passwordHintText: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 11,
    lineHeight: 17,
  },
  primaryButton: { marginTop: 22 },
  loginLink: { alignItems: 'center', paddingVertical: 24 },
  loginText: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 13,
  },
  loginStrong: { color: T.primaryDark, fontFamily: Fonts.luxurySansMedium },
});
