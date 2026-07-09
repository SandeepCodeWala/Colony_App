//

///////////

////REDUX

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Fonts, AppImages } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import Button from '../components/Button';
import PopupDropdown from '../components/PopupDropdown';
import CustomModal from '../components/ModalComponent';
import { showToast } from '../services/Toast';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import baseURL from '../services/network/base_url';
import ReserveHeader from '../components/ReserveHeader';

const ReserveTableScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, selectedData, screen } = route?.params ?? {};
  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);
  // Redux
  const token = useSelector(state => state.auth.token);
  const membershipNumber = useSelector(state => state.auth.membershipNumber);
  const dispatch = useDispatch();

  // Local state
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [name, setName] = useState(userData?.obj?.userObj?.name || '');
  const [phone, setPhone] = useState(userData?.obj?.userObj?.phone || '');
  const [notes, setNotes] = useState('');
  const [sheetInitialized, setSheetInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const arrayToObject = arr =>
    Object.fromEntries((arr || []).map(item => [item, false]));

  const [occasions, setOccasions] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.occasions),
  );
  const [occasionsList] = useState(userData?.obj?.dropdownOptions?.occasions);

  const [dietary, setDietary] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByUser),
  );
  const [dietaryList] = useState(
    userData?.obj?.dropdownOptions?.dietaryRestrictionByUser,
  );

  const [dietaryByParty, setDietaryByParty] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByParty),
  );
  const [dietaryListbyParty] = useState(
    userData?.obj?.dropdownOptions?.dietaryRestrictionByParty,
  );

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guests, setGuests] = useState(null);

  // Toggle functions
  const toggleOccasion = key =>
    setOccasions(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDietary = key =>
    setDietary(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDietaryByParty = key =>
    setDietaryByParty(prev => ({ ...prev, [key]: !prev[key] }));

  // ---- API Calls ----
  const updateReservation = async () => {
    const data = {
      reservationId: userData?.obj?.reservation?.reservationId,
      userOccasion: occasions,
      userDietary: dietary,
      userNotes: notes,
      userDietaryByParty: dietaryByParty,
      cancellationPolicy: userData?.obj?.cancellationPolicy,
    };

    try {
      const response = await axios.put(
        `${baseURL.base_url1}reservations/updateRes`,
        data,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 },
      );
      showToast('success', response.data?.message);
      if (response.data.success) {
        setBookingConfirmModal(true);
      }
      // navigation.navigate('Payment', {
      //   reservationId: userData?.obj?.reservation?.reservationId,
      //   NoOfGuest: selectedData?.partySize,
      // });
    } catch (err) {
      console.error('API Error:', err?.response?.data || err);
      showToast('error', 'Something went wrong, try again!');
      navigation.navigate('Payment', {
        reservationId: userData?.obj?.reservation?.reservationId,
        NoOfGuest: selectedData?.partySize,
      });
    }
  };

  const fetchPaymentIntentClientSecret = async (amountInCents, phone) => {
    try {
      const response = await fetch(
        `${baseURL.base_url1}reservations/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: amountInCents,
            currency: 'gbp',
            phone,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch payment intent.');
      return data;
    } catch (error) {
      console.error('Payment Error:', error);
      showToast('error', 'Failed to fetch payment intent');
      return null;
    }
  };

  const initializePaymentSheet = async totalAmount => {
    setLoading(true);
    const paymentData = await fetchPaymentIntentClientSecret(
      totalAmount,
      phone,
    );

    if (
      !paymentData ||
      !paymentData.clientSecret ||
      !paymentData.ephemeralKey ||
      !paymentData.customer
    ) {
      showToast('error', 'Payment initialization failed.');
      setLoading(false);
      return;
    }

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Colony App',
      customerId: paymentData.customer,
      customerEphemeralKeySecret: paymentData.ephemeralKey,
      paymentIntentClientSecret: paymentData.clientSecret,
      allowsDelayedPaymentMethods: true,
      appearance: { colors: { primary: Colors.Muted_Gold || '#D4AF37' } },
    });

    if (error) {
      showToast('error', `Payment sheet error: ${error.message}`);
    } else {
      setSheetInitialized(true);
      openPaymentSheet();
    }
    setLoading(false);
  };

  const openPaymentSheet = async () => {
    if (!sheetInitialized) {
      showToast('error', 'Payment is still initializing. Try again.');
      return;
    }

    setLoading(true);
    const { error } = await presentPaymentSheet();
    setLoading(false);

    if (error) {
      if (error.code !== 'Canceled')
        showToast('error', `Payment failed: ${error.message}`);
    } else {
      showToast('success', 'Payment successful and booking confirmed.');
    }
  };

  const proceed = async () => {
    await updateReservation();
    // optionally, you can also initializePaymentSheet(totalAmount) here if you want auto payment
  };

  // ---- Render ----
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={PremiumTheme.paper} />
      <ReserveHeader
        title={'Confirmation'}
        onBack={() => navigation.goBack()}
      />
      {/* Header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <Image source={screen === 'Lounge' ? AppImages.lounge : AppImages.restaurant} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.summaryTitle}>Afternoon tea on top</Text>
          <Text style={styles.summaryText}>{`${
            selectedData?.date1 || selectedData?.date
          } | ${selectedData?.time1 || selectedData?.time} | ${
            selectedData?.guests || selectedData?.partySize
          } Guests`}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput value={name} style={styles.textInput} editable={false} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput value={phone} style={styles.textInput} editable={false} />

          {screen !== 'Lounge' && (
            <>
              <Text style={styles.subSectionTitle}>Special Occasion?</Text>
              {(occasionsList || []).map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleOccasion(item)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      occasions[item] && {
                        backgroundColor: PremiumTheme.primary,
                        borderColor: PremiumTheme.primary,
                      },
                    ]}
                  >
                    {occasions[item] && (
                      <Text style={{ color: '#fff' }}>✔️</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxText}>{item}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
                Dietary restrictions
              </Text>
              {(dietaryList || []).map(item => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleDietary(item)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      dietary[item] && {
                        backgroundColor: PremiumTheme.primary,
                        borderColor: PremiumTheme.primary,
                      },
                    ]}
                  >
                    {dietary[item] && <Text style={{ color: '#fff' }}>✔️</Text>}
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
            style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
            multiline
          />
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Proceed to Pay"
          style={styles.payButton}
          textStyle={styles.payText}
          onPress={proceed}
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
            () => navigation.navigate('BottomTabs', { screen: 'Account' }),
            200,
          );
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold, marginBottom: 20 }}
        showCloseIcon={true}
      />
    </View>
  );
};

export default ReserveTableScreen;

const T = PremiumTheme;
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
