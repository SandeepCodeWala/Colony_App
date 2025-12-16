// screens/ReserveLoungeScreen.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors, Fonts, AppImages } from '../res';
import Button from '../components/Button';
import ReserveHeader from '../components/ReserveHeader';
import LoungeDetails from '../components/LoungeDetails';
import DateTimeSection from '../components/DateTimeSection';
import TimeSlotList from '../components/TimeSlotList';
import axios from 'axios';

import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';
import { useDispatch, useSelector } from 'react-redux';

const ReserveLoungeScreen = ({ route }) => {
   const tokenR  = useSelector(state => state.auth?.token)
     const membershipNumR = useSelector(state => state.auth.membershipNumber);
       const userR = useSelector(state => state.auth?.user);
          console.log('Fetched redux in reser page:', userR);
  const navigation = useNavigation();
  const { screen } = route?.params || '';
  console.log('screen screen', screen);
  const [guests, setGuests] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [date1, setDate1] = useState(new Date());
  const [time1, setTime1] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoding] = useState(false);
  const [token, setToken] = useState(tokenR);
  const [UserName, setUserName] = React.useState('');
  const [membership, setMembershipNumber] = React.useState('');
  

  const guestOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
   
      setToken(tokenR);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const generateTimeSlots = (start = '17:00', end = '22:00', interval = 30) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    while (current <= endTime) {
      slots.push(
        `${String(current.getHours()).padStart(2, '0')}:${String(
          current.getMinutes(),
        ).padStart(2, '0')}`,
      );
      current.setMinutes(current.getMinutes() + interval);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    fetchUser();
    // Any side effects if needed
  }, []);

  const fetchUser = async () => {
 
    setUserName(userR);
    setMembershipNumber(membershipNumR);

    // Fetch user data logic here
  };

  const Continue = async () => {
      console.log('🟢 Reserving table with details:', {
        date1,
        time1,
        guests,
        token,
      });
    if (
      (!UserName && !membership) ||
      UserName === null ||
      membership === null
    ) {
      showToast('error', 'User details not found. Please log in again.');
      setTimeout(() => {
        navigation.navigate('Login');
        return;
      }, 1500);
    }

    try {
      if (!date1 || !time1 || !guests) {
        showToast('error', 'Please select date, time, and number of guests.');
        return;
      }
      if (!token) {
        showToast('error', 'Authentication error. Please log in again.');
        return;
      }

      setLoding(true);
      console.log('🟢 Reserving table with details:', {
        date1,
        time1,
        guests,
        token,
      });
      let data = {
        date: date1,
        time: time1,
        partySize: guests,
      };
      const response = await axios.post(
        `${baseURL.base_url1}reservations/createRes`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // optional: handle slow network timeout (10s)
        },
      );

      console.log('✅ Reservation created successfully:', response.data);
      showToast('success', 'Your table has been reserved successfully.');
      if (navigation && navigation.navigate) {
        if (UserName && membership) {
          navigation.navigate('ReserveTableScreen', {
            userData: response?.data,
            selectedData: data,
            screen: screen == 'Lounge' ? screen : 'Restaurant',
          });
        } else {
          showToast('error', 'User details not found. Please log in again.');
        }
      } else {
        console.warn('⚠️ Navigation object is missing or invalid.');
      }
    } catch (error) {
      console.error(
        '❌ Error creating reservation:',
        error.response?.data || error.message,
      );

      // ✅ 6. Handle known & unknown errors gracefully
      if (error.code === 'ECONNABORTED') {
        showToast(
          'error',
          'Request timed out. Please check your internet and try again.',
        );
      } else if (error.response?.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
      } else {
        showToast(
          'error',
          error.response?.data?.message ||
            'Something went wrong while creating your reservation. Please try again.',
        );
      }
    } finally {
      setLoding(false);
    }
  };

  const ContinueLounge = async () => {
    try {
      if (!date1 || !time1 || !guests) {
        showToast('error', 'Please select date, time, and number of guests.');
        return;
      }
      // if (!token) {
      //   showToast('error', 'Authentication error. Please log in again.');
      //   return;
      // }

      setLoding(true);
      console.log('🟢 Reserving table with details:', {
        date1,
        time1,
        guests,
        token,
      });
      let data = {
        date: date1,
        time: time1,
        partySize: guests,
      };

      navigation.navigate('ReserveTableScreen', {
        userData: response?.data,
        selectedData: data,
        screen: 'Lounge',
      });

      const response = await axios.post(
        `${baseURL.base_url1}reservations/createRes`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // optional: handle slow network timeout (10s)
        },
      );

      console.log('✅ Reservation created successfully:', response.data);
      showToast('success', 'Your table has been reserved successfully.');
      if (navigation && navigation.navigate) {
        if (UserName && membership) {
          navigation.navigate('ReserveTableScreen', {
            userData: response?.data,
            selectedData: data,
          });
        } else {
          showToast('error', 'User details not found. Please log in again.');
        }
      } else {
        console.warn('⚠️ Navigation object is missing or invalid.');
      }
    } catch (error) {
      console.error(
        '❌ Error creating reservation:',
        error.response?.data || error.message,
      );

      // ✅ 6. Handle known & unknown errors gracefully
      if (error.code === 'ECONNABORTED') {
        showToast(
          'error',
          'Request timed out. Please check your internet and try again.',
        );
      } else if (error.response?.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
      } else {
        showToast(
          'error',
          error.response?.data?.message ||
            'Something went wrong while creating your reservation. Please try again.',
        );
      }
    } finally {
      setLoding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ReserveHeader title={'Restaurant'} onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Image source={AppImages.restaurant} style={styles.image} />
        <View style={styles.detailsContainer}>
          <LoungeDetails />

          <Text style={styles.label}>Guests</Text>
          <Dropdown
            data={guestOptions}
            labelField="label"
            valueField="value"
            placeholder="Select (1 - 10)"
            value={guests}
            onChange={item => setGuests(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
          />

          <DateTimeSection
            date={date}
            time={time}
            openDatePicker={showDatePicker}
            openTimePicker={showTimePicker}
            setOpenDatePicker={setShowDatePicker}
            setOpenTimePicker={setShowTimePicker}
            onChangeDate={selectedDate => {
              const formattedDate = `${selectedDate.getFullYear()}-${
                selectedDate.getMonth() + 1
              }-${selectedDate.getDate()}`;

              setDate(selectedDate);
              setDate1(formattedDate);

              console.log('Formatted Date:', formattedDate);
            }}
            onChangeTime={selectedTime => {
              const hours = selectedTime.getHours().toString().padStart(2, '0');
              const minutes = selectedTime
                .getMinutes()
                .toString()
                .padStart(2, '0');
              const formattedTime = `${hours}:${minutes}`;

              setTime(selectedTime);
              setTime1(formattedTime);

              console.log('Formatted Time:', formattedTime);
            }}
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Select Time</Text>
          <TimeSlotList
            timeSlots={timeSlots}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          style={styles.confirmButton}
          textStyle={styles.confirmText}
          onPress={() => {
            screen == 'Lounge' ? ContinueLounge() : Continue();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  image: {
    width: '92%',
    height: 200,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 15,
  },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  label: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
    marginTop: 20,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
  },
  dropdownText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.BLACK,
  },
  footer: {
    width: '100%',
    backgroundColor: '#fff',
    elevation: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  confirmButton: {
    backgroundColor: Colors.Muted_Gold,
    marginTop: 25,
    borderRadius: 30,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 10,
  },
  confirmText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: Colors.WHITE,
    fontSize: 15,
  },
});

export default ReserveLoungeScreen;
