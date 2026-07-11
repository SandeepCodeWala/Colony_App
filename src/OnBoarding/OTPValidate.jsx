import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActivityIndicator from '../components/ActivityIndicator';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import InputText from '../components/InputText';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';
import { postAbsoluteApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;
const NEW_PASSWORD_URL =
  'https://moistness-shudder-partition.ngrok-free.dev/user/new-password';
const FORGOT_PASSWORD_URL =
  'https://moistness-shudder-partition.ngrok-free.dev/user/forgat-password';

export default function OTPValidate({ navigation, route }) {
  const identifier = route?.params?.identifier || '';
  const firstLoad = useFirstRenderSkeleton(620);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setInterval(() => setSeconds(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const validate = () => {
    const nextErrors = {};
    if (!/^\d{6}$/.test(otp.trim())) nextErrors.otp = 'Enter the six-digit OTP.';
    if (newPassword.length < 8) nextErrors.newPassword = 'Password must contain at least 8 characters.';
    if (confirmPassword !== newPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updatePassword = async () => {
    Keyboard.dismiss();
    if (!identifier) {
      showToast('error', 'Identifier is missing. Please request OTP again.');
      navigation.replace('ForgotPassword');
      return;
    }
    if (!validate()) return;

    setIsLoading(true);
    const response = await postAbsoluteApi(NEW_PASSWORD_URL, {
      identifier,
      otp: otp.trim(),
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    setIsLoading(false);

    if (!response?.success) {
      showToast('error', response?.message || 'Unable to update password.');
      return;
    }

    showToast('success', response?.message || 'Password updated successfully.');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const resendOtp = async () => {
    if (seconds > 0 || !identifier) return;
    setIsLoading(true);
    const response = await postAbsoluteApi(FORGOT_PASSWORD_URL, { identifier });
    setIsLoading(false);

    if (response?.success) {
      setSeconds(45);
      showToast('success', response?.message || 'OTP sent successfully via voice call.');
    } else {
      showToast('error', response?.message || 'Unable to resend OTP.');
    }
  };

  if (firstLoad) return <ScreenSkeleton variant="page" />;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={T.cream} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.8}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Password</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.eyebrow}>SECURE YOUR ACCOUNT</Text>
          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Enter the OTP received through the voice call, then create your new password.
          </Text>

          <View style={styles.identifierBox}>
            <Text style={styles.identifierLabel}>OTP sent for</Text>
            <Text numberOfLines={1} style={styles.identifierValue}>{identifier}</Text>
          </View>

          <InputText
            label="Six-digit OTP"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={value => {
              setOtp(value.replace(/[^0-9]/g, ''));
              if (value.length) setErrors(current => ({ ...current, otp: '' }));
            }}
          />
          <ErrorView text={errors.otp} show={Boolean(errors.otp)} />

          <View style={styles.passwordWrap}>
            <InputText
              label="New password"
              placeholder="Minimum 8 characters"
              secureTextEntry={hidePassword}
              value={newPassword}
              onChangeText={value => {
                setNewPassword(value);
                if (value.length >= 8) setErrors(current => ({ ...current, newPassword: '' }));
              }}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setHidePassword(value => !value)}>
              <Image source={hidePassword ? AppImages.closeeye : AppImages.openeye} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
          <ErrorView text={errors.newPassword} show={Boolean(errors.newPassword)} />

          <View style={styles.passwordWrap}>
            <InputText
              label="Confirm password"
              placeholder="Repeat new password"
              secureTextEntry={hideConfirm}
              value={confirmPassword}
              onChangeText={value => {
                setConfirmPassword(value);
                if (value === newPassword) setErrors(current => ({ ...current, confirmPassword: '' }));
              }}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setHideConfirm(value => !value)}>
              <Image source={hideConfirm ? AppImages.closeeye : AppImages.openeye} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
          <ErrorView text={errors.confirmPassword} show={Boolean(errors.confirmPassword)} />

          <Button title="Update password" onPress={updatePassword} style={styles.button} />

          <TouchableOpacity
            onPress={resendOtp}
            disabled={seconds > 0}
            style={styles.resendButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.resendText, seconds > 0 && styles.resendDisabled]}>
              {seconds > 0 ? `Resend voice OTP in ${seconds}s` : 'Resend voice OTP'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} text="Updating your password..." />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  header: {
    height: Platform.OS === 'ios' ? 112 : 92,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    backgroundColor: T.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.border,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 15,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 23, height: 23, tintColor: T.ink },
  headerTitle: { color: T.ink, fontFamily: Fonts.luxurySansLight, fontSize: 24 },
  keyboard: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 30, paddingBottom: 42 },
  eyebrow: {
    color: T.primary,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 10,
    letterSpacing: 2.2,
    textAlign: 'center',
  },
  title: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 38,
    lineHeight: 46,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  identifierBox: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: T.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: T.primary,
  },
  identifierLabel: { color: T.muted, fontFamily: Fonts.luxurySansLight, fontSize: 11 },
  identifierValue: { color: T.ink, fontFamily: Fonts.luxurySansMedium, fontSize: 15, marginTop: 3 },
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
  button: { marginTop: 24 },
  resendButton: { alignItems: 'center', paddingVertical: 24 },
  resendText: { color: T.primaryDark, fontFamily: Fonts.luxurySans, fontSize: 13 },
  resendDisabled: { color: T.softMuted },
});
