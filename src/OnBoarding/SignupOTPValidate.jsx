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
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '../components/ActivityIndicator';
import Button from '../components/Button';
import ErrorView from '../components/ErrorView';
import InputText from '../components/InputText';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';
import { postApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

export default function SignupOTPValidate({ navigation, route }) {
  const routePhone = route?.params?.phone || '';
  const routeMembership = route?.params?.membership_number || '';
  const reduxMembership = useSelector(
    state =>
      state.auth?.membershipNumber || state.auth?.membership_number || '',
  );
  const firstLoad = useFirstRenderSkeleton(520);

  const [membershipNumber, setMembershipNumber] = useState(
    routeMembership || reduxMembership,
  );
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    const loadMembership = async () => {
      if (membershipNumber) return;
      const stored = await AsyncStorage.getItem('membershipNumber');
      if (stored) setMembershipNumber(stored);
    };
    loadMembership();
  }, [membershipNumber]);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = setInterval(() => setSeconds(value => value - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const verifyOtp = async () => {
    Keyboard.dismiss();
    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError('Enter the six-digit OTP received through the voice call.');
      return;
    }
    if (!routePhone || !membershipNumber) {
      showToast('error', 'Signup information is missing. Please register again.');
      navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });
      return;
    }

    setIsLoading(true);
    const response = await postApi('verify-otp', {
      phone: routePhone,
      code: otp.trim(),
      membership_number: membershipNumber,
    });
    setIsLoading(false);

    if (!response?.success) {
      showToast('error', response?.message || 'Invalid OTP');
      return;
    }

    showToast('success', response?.message || 'Account verified successfully');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const resendOtp = async () => {
    if (seconds > 0 || !routePhone || !membershipNumber) return;

    setIsLoading(true);
    const response = await postApi('send-otp', {
      phone: routePhone,
      membership_number: membershipNumber,
    });
    setIsLoading(false);

    if (response?.success) {
      setSeconds(45);
      showToast(
        'success',
        response?.message || 'OTP sent successfully via voice call',
      );
    } else {
      showToast('error', response?.message || 'Unable to resend OTP');
    }
  };

  if (firstLoad) return <ScreenSkeleton variant="page" />;

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={T.cream} barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Account</Text>
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
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VOICE OTP</Text>
          </View>
          <Text style={styles.title}>Confirm your membership</Text>
          <Text style={styles.subtitle}>
            Enter the six-digit code sent through a voice call to {routePhone || 'your phone'}.
          </Text>

          <View style={styles.membershipBox}>
            <Text style={styles.membershipLabel}>MEMBERSHIP NUMBER</Text>
            <Text style={styles.membershipValue}>{membershipNumber || 'N/A'}</Text>
          </View>

          <InputText
            label="Six-digit OTP"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            inputStyle={styles.otpInput}
            onChangeText={value => {
              const cleanValue = value.replace(/[^0-9]/g, '');
              setOtp(cleanValue);
              if (cleanValue.length === 6) setOtpError('');
            }}
          />
          <ErrorView text={otpError} show={Boolean(otpError)} />

          <Button
            title="Verify account"
            onPress={verifyOtp}
            disabled={isLoading}
            style={styles.verifyButton}
          />

          <TouchableOpacity
            onPress={resendOtp}
            disabled={seconds > 0}
            style={styles.resendButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.resendText, seconds > 0 && styles.disabledText]}>
              {seconds > 0
                ? `Resend voice OTP in ${seconds}s`
                : 'Resend voice OTP'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} text="Verifying your account..." />
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
  headerTitle: {
    color: T.ink,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 24,
  },
  keyboard: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 38,
    paddingBottom: 42,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.champagne,
  },
  badgeText: {
    color: T.primaryDark,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 9,
    letterSpacing: 2,
  },
  title: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 38,
    lineHeight: 46,
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 520,
  },
  membershipBox: {
    width: '100%',
    maxWidth: 560,
    marginTop: 28,
    marginBottom: 8,
    padding: 16,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
  },
  membershipLabel: {
    color: T.primary,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 9,
    letterSpacing: 2,
  },
  membershipValue: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 25,
    marginTop: 6,
  },
  otpInput: {
    fontSize: 25,
    letterSpacing: 10,
    textAlign: 'center',
    fontFamily: Fonts.luxurySansMedium,
  },
  verifyButton: { marginTop: 22 },
  resendButton: { paddingVertical: 24 },
  resendText: {
    color: T.primaryDark,
    fontFamily: Fonts.luxurySans,
    fontSize: 13,
  },
  disabledText: { color: T.softMuted },
});
