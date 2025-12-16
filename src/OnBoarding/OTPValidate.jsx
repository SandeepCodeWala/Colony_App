import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppImages } from '../res';
import Button from '../components/Button';
import ActivityIndicator from '../components/ActivityIndicator';
import { colors, fonts } from '../themes';
import OTPTextView from 'react-native-otp-textinput';
import { showToast } from '../services/Toast';
import { postApi } from '../services/network/api';

export default function OTPValidate({ navigation, route }) {
  const { phone } = route?.params || {};
  
  // Redux membership number
  const reduxMembership = useSelector(state => state.auth?.membership_number || '');
  console.log(reduxMembership,"reduxMembershipreduxMembershipreduxMembership=====>")

  const [membershipNumber, setMembershipNumber] = useState(reduxMembership);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Fetch membership number from AsyncStorage if Redux is empty
  useEffect(() => {
    const fetchMembership = async () => {
      if (!membershipNumber) {
        const storedNumber = await AsyncStorage.getItem('membershipNumber');
        if (storedNumber) {
          setMembershipNumber(storedNumber);
        } else {
          showToast('error', 'Membership number not found. Please go back and signup again.');
          navigation.goBack();
        }
      }
    };
    fetchMembership();
  }, [membershipNumber]);

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Verify OTP
  const handleVerify = async () => {
    if (!membershipNumber) return;

    if (otp.length < 6) {
      showToast('error', 'Please enter valid OTP');
      return;
    }

    const data = { phone, code: otp, membership_number: membershipNumber };

    setIsLoading(true);
    const response = await postApi('verify-otp', data);
    setIsLoading(false);

    if (response?.success) {
      showToast('success', 'OTP Verified Successfully!');
      navigation.replace('Login');
    } else {
      showToast('error', response?.message || 'Invalid OTP. Please try again.');
      setOtp('');
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!membershipNumber) return;

    setCanResend(false);
    setResendTimer(30);

    const data = { phone, membership_number: membershipNumber };

    setIsLoading(true);
    const sendOTP = await postApi('send-otp', data);
    setIsLoading(false);

    if (sendOTP?.success) {
      showToast('success', 'OTP resent successfully!');
    } else {
      showToast('error', sendOTP?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Background */}
      <ImageBackground source={AppImages.ccc} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={AppImages.Back} style={{ height: 25, width: 25, tintColor: 'white' }} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={AppImages.logo} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>

      {/* OTP Bottom Sheet */}
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
          <Text style={styles.title}>OTP VERIFICATION</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to your registered mobile number
          </Text>

          {/* OTP Input */}
          <View style={{ alignSelf: 'center', marginVertical: 30 }}>
            <OTPTextView
              handleTextChange={setOtp}
              containerStyle={styles.otpContainer}
              textInputStyle={styles.otpInput}
              tintColor="#b49b5e"
              inputCount={6}
              keyboardType="numeric"
            />
          </View>

          <Button title="Verify OTP" style={styles.verifyBtn} textTitle={styles.verifyBtnText} onPress={handleVerify} />

          {/* Resend OTP Section */}
          <View style={{ alignSelf: 'center', marginTop: 25 }}>
            {!canResend ? (
              <Text style={styles.timerText}>
                Resend OTP in <Text style={styles.timerNumber}>{resendTimer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendText}>
                  Didn’t receive OTP? <Text style={styles.resendLink}>Resend OTP</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ActivityIndicator isLoading={isLoading} onRequestClose={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: { height: '85%', width: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  logoContainer: { alignSelf: 'center', marginTop: 150 },
  logo: { height: 140, width: 200, tintColor: colors.white },
  bottomSheetWrapper: { flex: 1, position: 'absolute', bottom: 0, width: '100%' },
  bottomSheet: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, paddingHorizontal: 0, paddingBottom: 40, paddingTop: 30 },
  title: { textAlign: 'center', fontSize: fonts.fs_28, color: '#1A1A1A', fontFamily: 'InstrumentSans_Condensed-medium' },
  subtitle: { textAlign: 'center', fontSize: fonts.fs_18, color: colors.txtColor, fontFamily: 'InstrumentSans_Condensed-regular', marginTop: 10, marginHorizontal: 20 },
  otpContainer: { width: '80%', alignSelf: 'center' },
  otpInput: { borderWidth: 1, borderRadius: 10, borderColor: '#b49b5e', backgroundColor: '#F7F7F7', color: '#000', fontSize: fonts.fs_20, fontFamily: 'InstrumentSans_Condensed-medium' },
  verifyBtn: { alignSelf: 'center', backgroundColor: '#b49b5e', borderRadius: 25, marginTop: 10 },
  verifyBtnText: { color: colors.white, fontFamily: 'InstrumentSans_Condensed-medium', fontSize: fonts.fs_16 },
  resendText: { textAlign: 'center', fontSize: fonts.fs_16, color: colors.txtColor, fontFamily: 'InstrumentSans_Condensed-regular' },
  resendLink: { fontFamily: 'InstrumentSans_Condensed-medium', color: '#2E43C5' },
  timerText: { textAlign: 'center', fontSize: fonts.fs_16, color: colors.txtColor, fontFamily: 'InstrumentSans_Condensed-regular' },
  timerNumber: { fontFamily: 'InstrumentSans_Condensed-medium', color: '#b49b5e' },
});
