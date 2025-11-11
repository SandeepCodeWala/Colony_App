import React, { useEffect, useState, useMemo } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { AppImages } from '../res';
import { colors, fonts } from '../themes';
import InputText from '../components/InputText';
import Button from '../components/Button';
import ActivityIndicator from '../components/ActivityIndicator';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';

export default function BookEventScreen({ navigation }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load user data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedMobile = await AsyncStorage.getItem('phone');
        if (storedName) setName(storedName);
        if (storedMobile) setMobile(storedMobile);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    getUserData();
  }, []);

  // Format date + time display
  const formattedDateTime = useMemo(() => {
    if (!date) return '';
    const datePart = date.toDateString();
    const timePart = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${datePart} at ${timePart}`;
  }, [date]);

  // Date picker logic
  const openDateTimePicker = () => setShowDatePicker(true);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      updatedDate.setSeconds(0);
      updatedDate.setMilliseconds(0);
      setDate(updatedDate);
    }
  };

  // Submit booking
  const submitBooking = async () => {
    if (!name.trim() || !mobile.trim() || !date) {
      showToast('error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      name,
      mobile,
      eventDate: date.toISOString(),
      note,
    };

    console.log("bookingData",bookingData)

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        showToast('error', 'User not authenticated. Please login again.');
        return;
      }

      setIsLoading(true);

      const response = await axios.post(
        `${baseURL.base_url1}event/add`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      if (response?.data?.success) {
        showToast(
          'success',
          '🎉 Thanks for booking!'
        );
        navigation.goBack();
      } else {
        showToast(
          'error',
          response?.data?.message || 'Booking failed. Please try again later.'
        );
      }
    } catch (error) {
      console.error('Booking Error:', error);
      showToast(
        'error',
        error.response?.data?.message || 'Something went wrong. Try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard offset (iOS only)
  const keyboardOffset = Platform.select({ ios: 150, android: 0 });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Background Header */}
      <ImageBackground source={AppImages.ccc} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={AppImages.Back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={AppImages.logo} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>

      {/* Form Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
        style={styles.bottomSheetWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.bottomSheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>BOOK AN EVENT</Text>

          {/* Name Input */}
          <InputText
            label="Name"
            value={name}
            onChangeText={setName}
            inputStyle={styles.inputText}
            containerStyle={{ marginTop: 25 }}
          />

          {/* Mobile Input */}
          <InputText
            label="Mobile Number"
            value={mobile}
            maxLength={13}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            inputStyle={styles.inputText}
          />

          {/* Date & Time */}
          <TouchableOpacity onPress={openDateTimePicker} style={{ marginTop: 10 }}>
            <InputText
              label="Event Date & Time"
              placeholder="Select Date and Time"
              editable={false}
              value={formattedDateTime}
              inputStyle={styles.inputText}
            />
          </TouchableOpacity>

          {/* Note */}
          <InputText
            label="Note"
            placeholder="Enter any note..."
            multiline
            value={note}
            onChangeText={setNote}
            containerStyle={{ marginTop: 10 }}
            inputStyle={[styles.inputText, { height: 100, textAlignVertical: 'top' }]}
          />

          {/* Submit */}
          <Button
            title="Submit"
            style={styles.submitBtn}
            textTitle={styles.submitBtnText}
            onPress={submitBooking}
            disabled={isLoading}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          onChange={handleDateChange}
          minimumDate={new Date()}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={date}
          onChange={handleTimeChange}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        />
      )}

      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator isLoading={true} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    height: '60%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 5,
  },
  backIcon: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  logoContainer: {
    alignSelf: 'center',
    marginTop: 100,
  },
  logo: {
    height: 130,
    width: 180,
    tintColor: colors.white,
  },
  bottomSheetWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '80%',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
    paddingTop: 25,
    paddingBottom: 30,
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fs_22,
    color: '#1A1A1A',
    fontFamily: 'InstrumentSans_Condensed-medium',
  },
  inputText: {
    fontSize: fonts.fs_16,
    color: colors.black,
    fontFamily: 'InstrumentSans_Condensed-medium',
    minHeight: 40,
  },
  submitBtn: {
    alignSelf: 'center',
    marginTop: 25,
    backgroundColor: '#b49b5e',
    borderRadius: 25,
    paddingHorizontal: 30,
    minHeight: 50,
  },
  submitBtnText: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    fontSize: fonts.fs_16,
    color: colors.white,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
