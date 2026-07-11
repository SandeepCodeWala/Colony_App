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
import ActivityIndicator from '../components/ActivityIndicator';
import Button from '../components/Button';
import InputText from '../components/InputText';
import ErrorView from '../components/ErrorView';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';
import { postAbsoluteApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;
const FORGOT_PASSWORD_URL =
  'https://moistness-shudder-partition.ngrok-free.dev/user/forgat-password';

export default function ForgotPassword({ navigation }) {
  const { height } = useWindowDimensions();
  const firstLoad = useFirstRenderSkeleton(620);
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async () => {
    Keyboard.dismiss();
    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError('Enter your phone number or membership number.');
      return;
    }

    setError('');
    setIsLoading(true);
    const response = await postAbsoluteApi(FORGOT_PASSWORD_URL, {
      identifier: cleanIdentifier,
    });
    setIsLoading(false);

    if (!response?.success) {
      showToast('error', response?.message || 'Unable to send OTP.');
      return;
    }

    showToast('success', response?.message || 'OTP sent successfully via voice call.');
    navigation.navigate('OTPValidate', { identifier: cleanIdentifier });
  };

  if (firstLoad) return <ScreenSkeleton variant="page" />;

  const heroHeight = Math.max(260, Math.min(height * 0.4, 360));

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={AppImages.cc}
        style={[styles.hero, { height: heroHeight }]}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heroEyebrow}>ACCOUNT RECOVERY</Text>
        <Text style={styles.heroTitle}>Forgot password</Text>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <Text style={styles.title}>Verify your account</Text>
          <Text style={styles.subtitle}>
            Enter your registered phone number or membership number. We will call you with a six-digit OTP.
          </Text>

          <InputText
            label="Phone or membership number"
            placeholder="Enter identifier"
            value={identifier}
            containerStyle={styles.input}
            onChangeText={value => {
              setIdentifier(value);
              if (value.trim()) setError('');
            }}
          />
          <ErrorView text={error} show={Boolean(error)} />

          <Button title="Send voice OTP" onPress={sendOtp} style={styles.button} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.replace('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>Return to sign in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} text="Calling with your OTP..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  hero: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 54 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(14,11,8,0.42)' },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 54 : 36,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 24, height: 24, tintColor: T.surface },
  heroEyebrow: {
    color: T.surface,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 12,
    letterSpacing: 2.4,
  },
  heroTitle: {
    color: T.surface,
    fontFamily: Fonts.displaySerif,
    fontSize: 44,
    lineHeight: 52,
    textAlign: 'center',
    marginTop: 12,
  },
  keyboard: { flex: 1, marginTop: -24 },
  form: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 34,
    paddingBottom: 36,
    backgroundColor: T.surfaceSoft,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  title: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 34,
    textAlign: 'center',
  },
  subtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },
  input: { marginTop: 28 },
  button: { marginTop: 24 },
  loginLink: { alignItems: 'center', paddingVertical: 24 },
  loginText: { color: T.primaryDark, fontFamily: Fonts.luxurySans, fontSize: 13 },
});
