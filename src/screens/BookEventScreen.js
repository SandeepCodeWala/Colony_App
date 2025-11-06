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
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppImages } from '../res'; // Assuming these paths are correct
import { colors, fonts } from '../themes'; // Assuming these paths are correct
import InputText from '../components/InputText'; // Assuming this component is correct
import Button from '../components/Button'; // Assuming this component is correct
import ActivityIndicator from '../components/ActivityIndicator'; // Assuming this component is correct
import { postApi } from '../services/network/api'; // Assuming this function is correct
import { showToast } from '../services/Toast'; // Assuming this function is correct

export default function BookEventScreen({ navigation }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedMobile = await AsyncStorage.getItem('phone');
      if (storedName) setName(storedName);
      if (storedMobile) setMobile(storedMobile);
    };
    getUserData();
  }, []);

  // Format the date and time for display in the input field
  const formattedDateTime = useMemo(() => {
    // Only display a time if the date is not the default unselected value (or similar logic)
    // For simplicity, we assume 'date' always holds a valid Date object.
    const datePart = date.toDateString();
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${datePart} at ${timePart}`;
  }, [date]);

  const openDateTimePicker = () => {
    // Start with the date picker
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Set the selected date, but keep the current time initially
      setDate(selectedDate);
      // Immediately show the time picker after date selection
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // The selectedTime argument for mode='time' on iOS is actually a Date object
      // with the selected time components, but possibly an old date component.
      // We must only update the hour and minute of the existing 'date' state.
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      // Set seconds and milliseconds to 0 for consistency
      updatedDate.setSeconds(0);
      updatedDate.setMilliseconds(0);
      setDate(updatedDate);
    }
  };

  const submitBooking = async () => {
    // Check if the current date is in the past (only compare date part, not time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to 00:00 for comparison
    const eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);

    if (eventDay < today || !note.trim()) {
     showToast(
        'error',
        'Please select a future date and time, and enter a note.'
      );
      return;
    }

    const bookingData = {
      name,
      mobile,
      eventDate: date.toISOString(), // Send combined date and time
      note,
    };

    setIsLoading(true);
    // Replace with your actual postApi call
    // const response = await postApi('bookEvent', bookingData); 
    
    // Mock response for testing until postApi is available
    const response = { success: true, message: 'Booking successful!' }; 

    setIsLoading(false);

    if (response.success) {
      showToast('success', 'Your event has been booked successfully!');
      navigation.goBack();
    } else {
      showToast('error', response.message || 'Booking failed, please try again.');
    }
  };

  // Determine the keyboard offset for better positioning
  // Using a higher offset like 150 often provides a good balance across devices
  const keyboardOffset = Platform.select({
    ios: 150, 
    android: 0, 
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Background Image */}
      <ImageBackground source={AppImages.ccc} style={styles.bgImage} resizeMode="cover">
        <View style={styles.overlay} />

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={AppImages.Back} style={{ height: 25, width: 25, tintColor: 'white' }} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={AppImages.logo} style={styles.logo} resizeMode="contain" />
        </View>
      </ImageBackground>

      {/* Bottom Sheet and Keyboard Avoiding View */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use 'height' for Android might be better
        keyboardVerticalOffset={keyboardOffset}
        style={styles.bottomSheetWrapper}
      >
        <ScrollView
          contentContainerStyle={styles.bottomSheet}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>BOOK AN EVENT</Text>

          {/* Name - Made editable=false as per initial thought, but can be changed */}
          <InputText
            label="Name"
            value={name}
            // editable={false}
            inputStyle={styles.inputText}
            containerStyle={{ marginTop: 25 }}
          />

          {/* Mobile - Made editable=false as per initial thought, but can be changed */}
          <InputText
            label="Mobile Number"
            value={mobile}
            // editable={false}
            inputStyle={styles.inputText}
          />

          {/* Combined Date & Time Picker */}
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
            // Use a specific reference for keyboard avoidance focus (optional, but good practice)
            // ref={noteRef} 
            containerStyle={{ marginTop: 10 }}
            inputStyle={[styles.inputText, { height: 100, textAlignVertical: 'top' }]}
          />

          {/* Submit Button */}
          <Button
            title="Submit"
            style={styles.submitBtn}
            textTitle={styles.submitBtnText}
            onPress={submitBooking}
            disabled={isLoading}
          />

          <View style={{ height: 0 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date & Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date}
          onChange={handleDateChange}
          minimumDate={new Date()} // Ensure future dates only
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

      <ActivityIndicator isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  bgImage: {
    height: '65%', // Keeping the height reasonable
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
    zIndex: 10,
    // Add padding for larger hit area
    padding: 5, 
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
    // This wrapper takes up the remaining space and positions the sheet correctly
    flex: 1,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // Adjust max height to leave space for the top header if needed, or let it scroll
    maxHeight: '80%', 
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 10,
    paddingTop: 25,
    paddingBottom: 30,
    // minHeight: '100%', // Removed to allow scrollview content to determine height
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.fs_22,
    color: '#1A1A1A',
    fontFamily: 'InstrumentSans_Condensed-medium',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: fonts.fs_18,
    color: colors.txtColor,
    fontFamily: 'InstrumentSans_Condensed-medium',
    marginBottom: 10,
  },
  inputText: {
    fontSize: fonts.fs_16,
    color: colors.black,
    fontFamily: 'InstrumentSans_Condensed-medium',
    // Ensure sufficient height for text inside InputText
    minHeight: 40, 
  },
  submitBtn: {
    alignSelf: 'center',
    marginTop: 25,
    backgroundColor: '#b49b5e',
    borderRadius: 25,
    paddingHorizontal: 30,
    minHeight: 50, // Added minHeight for better touch target
  },
  submitBtnText: {
    fontFamily: 'InstrumentSans_Condensed-medium',
    fontSize: fonts.fs_16,
    color: colors.white,
  },
});