import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Colors, Fonts, AppImages } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import Button from '../components/Button';
import CustomModal from '../components/ModalComponent';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';
import ReserveHeader from '../components/ReserveHeader';

const T = PremiumTheme;

const toArray = value => (Array.isArray(value) ? value.filter(Boolean) : []);
const createSelectionMap = value =>
  Object.fromEntries(toArray(value).map(item => [String(item), false]));

const getResponseObject = value => value?.obj || value?.data?.obj || value || {};

const ReserveTableScreen = ({ navigation, route }) => {
  const { userData = {}, selectedData = {}, screen = 'Restaurant' } =
    route?.params || {};
  const token = useSelector(state => state.auth?.token);
  const reduxUser = useSelector(state => state.auth?.user);
  const responseObject = getResponseObject(userData);
  const responseUser = responseObject?.userObj || responseObject?.user || {};
  const dropdownOptions = responseObject?.dropdownOptions || {};
  const isLounge = String(screen).toLowerCase().includes('lounge');

  const occasionList = useMemo(
    () => toArray(dropdownOptions?.occasions).map(String),
    [dropdownOptions?.occasions],
  );
  const dietaryList = useMemo(
    () => toArray(dropdownOptions?.dietaryRestrictionByUser).map(String),
    [dropdownOptions?.dietaryRestrictionByUser],
  );

  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);
  const [name] = useState(
    String(responseUser?.name || reduxUser?.name || reduxUser || ''),
  );
  const [phone] = useState(
    String(responseUser?.phone || reduxUser?.phone || ''),
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [occasions, setOccasions] = useState(() =>
    createSelectionMap(dropdownOptions?.occasions),
  );
  const [dietary, setDietary] = useState(() =>
    createSelectionMap(dropdownOptions?.dietaryRestrictionByUser),
  );

  const toggleOccasion = key =>
    setOccasions(previous => ({ ...previous, [key]: !previous[key] }));
  const toggleDietary = key =>
    setDietary(previous => ({ ...previous, [key]: !previous[key] }));

  const reservationId =
    responseObject?.reservation?.reservationId ||
    responseObject?.reservation?.id ||
    userData?.reservationId ||
    userData?.id;

  const updateReservation = async () => {
    if (loading) return;

    if (!token) {
      showToast('error', 'Session expired. Please log in again.');
      navigation?.navigate?.('Login');
      return;
    }

    if (!reservationId) {
      showToast(
        'error',
        'Reservation details are incomplete. Please create the reservation again.',
      );
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${baseURL.base_url1}reservations/updateRes`,
        {
          reservationId,
          userOccasion: occasions,
          userDietary: dietary,
          userNotes: notes.trim(),
          userDietaryByParty: {},
          cancellationPolicy: responseObject?.cancellationPolicy || null,
        },
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
          response.data?.message || 'Booking could not be confirmed.',
        );
      }

      setBookingConfirmModal(true);
    } catch (error) {
      if (error?.response?.status === 401) {
        showToast('error', 'Session expired. Please log in again.');
        navigation?.navigate?.('Login');
      } else if (error?.code === 'ECONNABORTED') {
        showToast('error', 'Request timed out. Please try again.');
      } else {
        showToast(
          'error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong. Please try again.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.paper} />
      <ReserveHeader
        title="Confirmation"
        onBack={() => navigation?.goBack?.()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <Image
          source={isLounge ? AppImages.lounge : AppImages.restaurant}
          style={styles.image}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.summaryTitle}>Afternoon tea on top</Text>
          <Text style={styles.summaryText}>{`${
            selectedData?.date1 || selectedData?.date || 'Date pending'
          } | ${
            selectedData?.time1 || selectedData?.time || 'Time pending'
          } | ${
            selectedData?.guests || selectedData?.partySize || 1
          } Guests`}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput value={name} style={styles.textInput} editable={false} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput value={phone} style={styles.textInput} editable={false} />

          {!isLounge && (
            <>
              <Text style={styles.subSectionTitle}>Special Occasion?</Text>
              {occasionList.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleOccasion(item)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      occasions[item] && styles.checkboxBoxSelected,
                    ]}
                  >
                    {occasions[item] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxText}>{item}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
                Dietary restrictions
              </Text>
              {dietaryList.map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleDietary(item)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      dietary[item] && styles.checkboxBoxSelected,
                    ]}
                  >
                    {dietary[item] && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
            Anything else we should know?
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={[styles.textInput, styles.notesInput]}
            multiline
            maxLength={500}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={loading ? 'Please wait' : 'Proceed to Pay'}
          disabled={loading}
          style={styles.payButton}
          textStyle={styles.payText}
          onPress={updateReservation}
        />
      </View>

      <CustomModal
        visible={bookingConfirmModal}
        onClose={() => setBookingConfirmModal(false)}
        imageSource={require('../res/images/icons/confirm.png')}
        description="Booking Successful! Your card will only be charged in case of a no-show."
        description1="Confirmed!"
        buttonText="View Details"
        onButtonPress={() => {
          setBookingConfirmModal(false);
          setTimeout(
            () => navigation?.navigate?.('BottomTabs', { screen: 'Account' }),
            200,
          );
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold, marginBottom: 20 }}
        showCloseIcon
      />
    </View>
  );
};

export default ReserveTableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
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
    padding: 16,
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
  summaryTitle: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 11,
    color: T.primary,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 16,
    color: T.ink,
    marginTop: 7,
    marginBottom: 12,
    lineHeight: 23,
  },
  label: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 11,
    color: T.primary,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  textInput: {
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    minHeight: 54,
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 15,
    color: T.ink,
    backgroundColor: T.surface,
  },
  notesInput: { height: 90, textAlignVertical: 'top', paddingTop: 14 },
  subSectionTitle: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 14,
    color: T.ink,
    marginTop: 18,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: T.surfaceSoft,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: T.line,
  },
  checkboxText: {
    marginLeft: 10,
    fontFamily: Fonts.instrumentSansRegular,
    color: T.ink,
    flex: 1,
  },
  checkboxBox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.surface,
  },
  checkboxBoxSelected: {
    backgroundColor: T.primary,
    borderColor: T.primary,
  },
  checkmark: { color: T.surface, fontSize: 13, lineHeight: 15 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: T.glass,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: T.border,
    elevation: 12,
    shadowColor: T.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
  },
  payButton: {
    borderRadius: 999,
    paddingVertical: 10,
    width: '100%',
  },
  payText: {
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    color: T.surface,
    fontSize: 13,
  },
});
