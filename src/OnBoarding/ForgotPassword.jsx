import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppImages } from '../res';
import Button from '../components/Button';
// import BottomSheet from '../components/BottomSheet';
import OTPTextView from 'react-native-otp-textinput';
import { postApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { colors, fonts } from '../themes';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginField, setMembershipNumber } from '../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function ForgotPassword({ navigation }) {
   const dispatch = useDispatch();
  const membershipNumber = useSelector(state => state.auth.membershipNumber);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sheets
  const otpSheetRef = useRef(null);
  const newPassSheetRef = useRef(null);

  // OTP
  const [otp, setOtp] = useState('');

  // New Password
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
  async function loadData() {
    const stored = await AsyncStorage.getItem('membershipNumber');
    if (stored) {
      dispatch(setMembershipNumber(stored));
    }
  }
  loadData();
}, []);

  // 1️⃣ ✅ SEND OTP API
  // const sendOtp = async () => {
  //   if (!phone || phone.length < 10) {
  //     showToast('error', 'Please enter valid mobile number');
  //     return;
  //   }

  //   setIsLoading(true);
  //   const res = await postApi('send-otp', { phone });
  //   setIsLoading(false);

  //   if (res?.success) {
  //     showToast('success', 'OTP Sent Successfully');
  //     otpSheetRef.current.open(); // ✅ OPEN OTP SHEET
  //   } else {
  //     showToast('error', res?.message || 'Failed to send OTP');
  //     otpSheetRef.current.open();
  //   }
  // };

  const sendOtp = async () => {
  if (!phone || phone.length < 10) {
    showToast('error', 'Please enter valid mobile number');
    return;
  }

  // Get membership number from Redux
  const storedMembership = membershipNumber;

  if (!storedMembership) {
    showToast('error', 'Membership number not found. Please login again.');
    return;
  }

  setIsLoading(true);

  const res = await postApi('send-otp', {
    phone,
    membership_number: storedMembership, // ✅ Auto from Redux
  });

  setIsLoading(false);

  if (res?.success) {
    showToast('success', 'OTP Sent Successfully');
    otpSheetRef.current.open();
  } else {
    showToast('error', res?.message || 'Failed to send OTP');
  }
};


  // 2️⃣ ✅ VERIFY OTP
  const verifyOtp = async () => {
    if (otp.length < 6) {
      showToast('error', 'Enter valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    const res = await postApi('verify-otp', { phone, code: otp });
    setIsLoading(false);

    if (res?.success) {
      otpSheetRef.current.close(); // ✅ CLOSE OTP SHEET
      newPassSheetRef.current.open(); // ✅ OPEN NEW PASSWORD SHEET
    } else {
      showToast('error', 'Invalid OTP');
      setOtp('');
    }
  };

  // 3️⃣ ✅ SET NEW PASSWORD
  const handleResetPassword = async () => {
    if (!password || !confirm) {
      showToast('error', 'All fields required');
      return;
    }
    if (password !== confirm) {
      showToast('error', 'Password mismatch');
      return;
    }

    setIsLoading(true);
    const res = await postApi('reset-password', { phone, password });
    setIsLoading(false);

    if (res?.success) {
      showToast('success', 'Password Updated!');
      newPassSheetRef.current.close();

      setTimeout(() => {
        navigation.replace('Login'); // ✅ GO TO LOGIN
      }, 500);
    } else {
      showToast('error', res?.message || 'Failed to set password');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={AppImages.ccc}
        style={styles.bgImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Image
            source={AppImages.Back}
            style={{ height: 25, width: 25, tintColor: 'white' }}
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={AppImages.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      {/* ✅ MAIN MOBILE INPUT BOTTOMSHEET STYLE */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.bottomWrapper}
      >
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to receive OTP
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            keyboardType="numeric"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />

          <Button
            title="Send OTP===="
            style={styles.verifyBtn}
            textTitle={styles.verifyBtnText}
            onPress={sendOtp}
          />
        </View>
      </KeyboardAvoidingView>

      {/* ✅ OTP SHEET */}
      <RBSheet
        ref={otpSheetRef}
        height={350}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 20,
          },
          draggableIcon: { backgroundColor: '#ccc' },
        }}
      >
        <Text style={styles.sheetTitle}>Verify OTP====</Text>

        <OTPTextView
          handleTextChange={setOtp}
          containerStyle={{
            width: '100%',
            alignSelf: 'center',
            marginVertical: 20,
            // marginHorizontal: 20,
          }}
          textInputStyle={styles.otpInput}
          inputCount={6}
        />

        <Button
          title="Verify OTP===="
          onPress={verifyOtp}
          style={styles.verifyBtn}
          textTitle={styles.verifyBtnText}
        />
      </RBSheet>

      {/* ✅ NEW PASSWORD SHEET */}
      <RBSheet
        ref={newPassSheetRef}
        height={420}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 20,
          },
          draggableIcon: { backgroundColor: '#ccc' },
        }}
      >
        <Text style={styles.sheetTitle}>Set New Password</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Button
          title="Update Password"
          onPress={handleResetPassword}
          style={styles.verifyBtn}
          textTitle={styles.verifyBtnText}
        />
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: { height: '85%', width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  logoContainer: { alignSelf: 'center', marginTop: 150 },
  logo: { height: 140, width: 200, tintColor: colors.white },
  bottomWrapper: { flex: 1, position: 'absolute', bottom: 0, width: '100%' },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fs_28,
    color: '#1A1A1A',
    fontFamily: 'InstrumentSans_Condensed-medium',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fonts.fs_16,
    color: colors.txtColor,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#b49b5e',
    borderRadius: 10,
    padding: 14,
    marginTop: 15,
    fontSize: fonts.fs_16,
    backgroundColor: '#F7F7F7',
  },
  verifyBtn: {
    alignSelf: 'center',
    backgroundColor: '#b49b5e',
    borderRadius: 25,
    marginTop: 25,
    paddingHorizontal: 20,
  },
  verifyBtnText: {
    color: colors.white,
    fontFamily: 'InstrumentSans_Condensed-medium',
    fontSize: fonts.fs_16,
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: fonts.fs_24,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'InstrumentSans_Condensed-medium',
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#b49b5e',
    backgroundColor: '#F7F7F7',
    color: '#000',
    fontSize: fonts.fs_20,
  },
});
