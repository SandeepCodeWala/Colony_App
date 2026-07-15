import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import Button from '../components/Button';
import ReserveHeader from '../components/ReserveHeader';
import LoungeDetails from '../components/LoungeDetails';
import DateTimeSection from '../components/DateTimeSection';
import TimeSlotList from '../components/TimeSlotList';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';

const T = PremiumTheme;
const pad = value => String(value).padStart(2, '0');

const formatApiDate = value =>
  `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate(),
  )}`;

const formatApiTime = value =>
  `${pad(value.getHours())}:${pad(value.getMinutes())}`;

const createInitialTime = () => {
  const value = new Date();
  value.setHours(17, 0, 0, 0);
  return value;
};

const generateTimeSlots = (
  start = '17:00',
  end = '22:00',
  interval = 30,
) => {
  const slots = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const current = new Date(2000, 0, 1, startHour, startMinute, 0, 0);
  const endTime = new Date(2000, 0, 1, endHour, endMinute, 0, 0);

  while (current <= endTime) {
    slots.push(`${pad(current.getHours())}:${pad(current.getMinutes())}`);
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
};

const normalizeExperience = value =>
  String(value || '').toLowerCase().includes('lounge')
    ? 'Lounge'
    : 'Restaurant';

const GuestPicker = ({ visible, selected, onClose, onSelect }) => (
  <Modal
    visible={Boolean(visible)}
    transparent
    animationType="fade"
    statusBarTranslucent
    onRequestClose={onClose}
  >
    <SafeAreaView style={styles.modalRoot}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select guests</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Close guest picker"
            style={styles.modalClose}
            activeOpacity={0.75}
            onPress={onClose}
          >
            <Text style={styles.modalCloseText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.guestList}
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map(item => {
            const active = selected === item;
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.8}
                style={[styles.guestOption, active && styles.guestOptionActive]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.guestOptionText,
                    active && styles.guestOptionTextActive,
                  ]}
                >
                  {item} {item === 1 ? 'Guest' : 'Guests'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  </Modal>
);

const ReserveLoungeScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const token = useSelector(state => state.auth?.token);
  const membershipNumber = useSelector(
    state => state.auth?.membershipNumber,
  );
  const user = useSelector(state => state.auth?.user);

  const experience = normalizeExperience(route?.params?.screen);
  const isLounge = experience === 'Lounge';
  const initialDate = useMemo(() => {
    const value = new Date();
    value.setHours(12, 0, 0, 0);
    return value;
  }, []);
  const initialTime = useMemo(createInitialTime, []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const [guests, setGuests] = useState(null);
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [apiDate, setApiDate] = useState(formatApiDate(initialDate));
  const [apiTime, setApiTime] = useState(formatApiTime(initialTime));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(formatApiTime(initialTime));
  const [loading, setLoading] = useState(false);

  const contentWidth = Math.min(width, 820);
  const isAuthenticated = Boolean(
    token && (user?.name || user?.membership_number || membershipNumber),
  );

  const goBack = () => {
    if (navigation?.canGoBack?.()) navigation.goBack();
    else navigation?.navigate?.('BottomTabs', { screen: 'Book' });
  };

  const continueReservation = async () => {
    if (loading) return;

    if (!isAuthenticated) {
      showToast('error', 'User details not found. Please log in again.');
      navigation?.navigate?.('Login');
      return;
    }

    if (!apiDate || !apiTime || !guests) {
      showToast('error', 'Please select date, time, and number of guests.');
      return;
    }

    const selectedData = {
      date: apiDate,
      time: selectedSlot || apiTime,
      partySize: guests,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseURL.base_url1}reservations/createRes`,
        selectedData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          timeout: 15000,
        },
      );

      if (response?.data?.success === false) {
        throw new Error(
          response.data?.message || 'Reservation could not be created.',
        );
      }

      navigation?.navigate?.('ReserveTableScreen', {
        userData: response?.data || {},
        selectedData,
        screen: experience,
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
        navigation?.navigate?.('Login');
      } else if (error?.code === 'ECONNABORTED') {
        showToast(
          'error',
          'Request timed out. Please check your internet and try again.',
        );
      } else {
        showToast(
          'error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong while creating your reservation. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ReserveHeader title={experience} onBack={goBack} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.content, { width: contentWidth }]}>
          <Image
            source={isLounge ? AppImages.lounge : AppImages.restaurant}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.detailsContainer}>
            <LoungeDetails isLounge={isLounge} />

            <Text style={styles.label}>Guests</Text>
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.84}
              onPress={() => setShowGuestPicker(true)}
              style={styles.dropdown}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !guests && styles.placeholderText,
                ]}
              >
                {guests ? `${guests}` : 'Select (1 - 10)'}
              </Text>
              <Text style={styles.dropdownArrow}>⌄</Text>
            </TouchableOpacity>

            <DateTimeSection
              date={date}
              time={time}
              openDatePicker={showDatePicker}
              openTimePicker={showTimePicker}
              setOpenDatePicker={setShowDatePicker}
              setOpenTimePicker={setShowTimePicker}
              onChangeDate={selectedDate => {
                setDate(selectedDate);
                setApiDate(formatApiDate(selectedDate));
              }}
              onChangeTime={selectedTime => {
                const formatted = formatApiTime(selectedTime);
                setTime(selectedTime);
                setApiTime(formatted);
                setSelectedSlot(formatted);
              }}
            />

            <Text style={[styles.label, styles.timeLabel]}>Select Time</Text>
            <TimeSlotList
              timeSlots={timeSlots}
              selectedSlot={selectedSlot}
              onSelect={item => {
                setSelectedSlot(item);
                setApiTime(item);
                const [hours, minutes] = item.split(':').map(Number);
                const updatedTime = new Date(time);
                updatedTime.setHours(hours, minutes, 0, 0);
                setTime(updatedTime);
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[styles.footerInner, { width: contentWidth }]}>
          <Button
            title={loading ? 'Please wait' : 'Continue'}
            disabled={loading}
            style={styles.confirmButton}
            textStyle={styles.confirmText}
            onPress={continueReservation}
          />
        </View>
      </View>

      <GuestPicker
        visible={showGuestPicker}
        selected={guests}
        onClose={() => setShowGuestPicker(false)}
        onSelect={value => {
          setGuests(value);
          setShowGuestPicker(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
  scrollContent: { paddingBottom: 40, alignItems: 'center' },
  content: { maxWidth: 820, alignSelf: 'center' },
  image: {
    width: '91%',
    height: 220,
    borderRadius: 32,
    alignSelf: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  detailsContainer: {
    marginHorizontal: 18,
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: T.glass,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: T.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
  },
  label: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 12,
    color: T.primary,
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  timeLabel: { marginTop: 20 },
  dropdown: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: T.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: T.ink,
  },
  placeholderText: { color: T.muted },
  dropdownArrow: { color: T.primary, fontSize: 22, marginTop: -4 },
  footer: {
    width: '100%',
    backgroundColor: T.glass,
    elevation: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: T.border,
    paddingTop: 8,
    alignItems: 'center',
  },
  footerInner: { maxWidth: 820, alignItems: 'center' },
  confirmButton: {
    marginTop: 14,
    borderRadius: 999,
    paddingVertical: 12,
    alignSelf: 'center',
    width: '90%',
    marginBottom: 14,
  },
  confirmText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    color: T.surface,
    fontSize: 13,
  },
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 16, 12, 0.48)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '74%',
    borderRadius: 28,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
  },
  modalHeader: {
    minHeight: 68,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.line,
  },
  modalTitle: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 16,
    color: T.ink,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: T.surfaceSoft,
  },
  modalCloseText: { color: T.ink, fontSize: 28, lineHeight: 30 },
  guestList: { padding: 14 },
  guestOption: {
    minHeight: 52,
    marginBottom: 9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.line,
    backgroundColor: T.surfaceSoft,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  guestOptionActive: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  guestOptionText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: T.ink,
  },
  guestOptionTextActive: { color: T.surface },
});

export default ReserveLoungeScreen;
