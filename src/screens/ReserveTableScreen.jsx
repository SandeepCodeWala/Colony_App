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
import { Colors, Fonts, AppImages } from '../res';
import Button from '../components/Button';
import PopupDropdown from '../components/PopupDropdown';
import CustomModal from '../components/ModalComponent';
import colors from '../themes/colors';
import ReserveHeader from '../components/ReserveHeader';
import { showToast } from '../services/Toast';
import { useStripe } from '@stripe/stripe-react-native';
import { postApi } from '../services/network/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../services/network/base_url';

const fetchPaymentIntentClientSecret = async (amountInCents, phone, token) => {
  console.log('amountInCents amountInCents', amountInCents);
  let data1 = {
    amount: 1000,
  };
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
          phone: phone,
        }),
      },
    );

    const data = await response.json();
    console.log('amountInCents amountInCents', amountInCents, data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment details.');
    }
    console.log('❌ data received================:', data);

    return {
      clientSecret: data.clientSecret,
      ephemeralKey: data.ephemeralKey,
      customer: data.customer,
    };
  } catch (error) {
    console.log('THIS IS THE ERRRO', error);
    showToast('error', '❌ Failed to fetch payment intent:');
    return null;
  }

  // // PLACEHOLDER: Returning dummy data to allow the initialization to proceed
  // return {
  //   clientSecret: 'pi_3Nz0HyGABCD12345_secret_67890xyzABCDE',
  //   ephemeralKey: 'ek_test_1Nz0HyGABCD12345',
  //   customer: 'cus_PqrSTUvWxYZaBC',
  // };
};

const ReserveTableScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, selectedData, screen } = route?.params ?? {};
  console.log('THIS IS USERDATA==', userData);
  const [token, setToken] = useState('');

  const arrayToObject = (arr = []) =>
    Object.fromEntries(arr.map(item => [item, false]));

  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);

  const [name, setName] = useState(
    userData?.obj?.userObj?.name || 'Ankit Sharma',
  );
  const [phone, setPhone] = useState(
    userData?.obj?.userObj?.phone || '+91 7042094710',
  );
  const [occasions, setOccasions] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.occasions),
  );
  const [occasionsList, setOccasionsList] = useState(
    userData?.obj?.dropdownOptions?.occasions,
  );
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);
  const [sheetInitialized, setSheetInitialized] = useState(false);
  const [newOccasionCount, setNewOccasionCount] = useState(0);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guests, setGuests] = useState(null);
  const [dietary, setDietary] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByUser),
  );
  const [dietaryList, setDietaryList] = useState(
    userData?.obj?.dropdownOptions?.dietaryRestrictionByUser,
  );
  const [dietaryByParty, setDietaryByParty] = useState(
    arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByParty),
  );
  const [dietaryListbyParty, setDietaryListByParty] = useState(
    userData?.obj?.dropdownOptions?.dietaryRestrictionByParty,
  );

  const [notes, setNotes] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isAdult, setIsAdult] = useState(false);

  const addOccasion = () => {
    setShowGuestPopup(true);
  };

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setToken(token);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const toggleDietary = key => {
    setDietary(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDietaryByParty = key => {
    setDietaryByParty(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOccasion = key => {
    setOccasions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const proceed = async () => {
    // setModalVisible(true);

    let data = {
      reservationId: userData?.obj?.reservation?.reservationId,
      userOccasion: occasions,
      userDietary: dietary,
      userNotes: notes,
      userDietaryByParty: dietaryByParty,
      cancellationPolicy: userData?.obj?.cancellationPolicy,
    };

    console.log('THIS IS DATA SENDING++===', data);

    try {
      const response = await axios.put(
        `${baseURL.base_url1}reservations/updateRes`,
        data, // ✅ send PURE DATA (not wrapped in body)
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        },
      );

      console.log('THIS IS API RESPONSE TO STORE IN DB', response.data);
      showToast('success', response.data?.message);
      setModalVisible(true);
    } catch (err) {
      console.log('THIS IS API ERROR', err?.response?.data || err);
      showToast('error', 'Something went wrong, Try Again!');
    }
  };

  // Navigate or submit; for now navigate ahead
  // navigation.navigate('Confirmation', {
  //   name,
  //   phone,
  //   occasions,
  //   dietary,
  //   notes,
  // });

  const initializePaymentSheet = async totalAmount => {
    setLoading(true);

    // Fetch the client secret, ephemeral key, and customer ID from your server
    const data = await fetchPaymentIntentClientSecret(
      totalAmount,
      phone,
      token,
    );
    console.log('Payment setup data from server:', data);

    if (!data || !data.clientSecret || !data.ephemeralKey || !data.customer) {
      showToast(
        'error',
        'Payment gateway could not be initialized. Please check backend response.',
      );
      setLoading(false);
      return;
    }

    // Initialize the sheet configuration
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Colony App',
      customerId: data.customer,
      customerEphemeralKeySecret: data.ephemeralKey,
      paymentIntentClientSecret: data.clientSecret,
      allowsDelayedPaymentMethods: true,

      // Customize appearance (optional)
      appearance: {
        colors: {
          primary: Colors.Muted_Gold || '#D4AF37',
        },
      },
    });

    if (error) {
      showToast('error', `Error initializing payment sheet: ${error.message}`);
    } else {
      setSheetInitialized(true);
      openPaymentSheet();
    }
    setLoading(false);
  };

  // 2. Handle the "Pay Now" action

  const openPaymentSheet = async () => {
    console.log('OPENBOTTOMSHEET CALLED');
    if (!sheetInitialized) {
      showToast(
        'error',
        'Payment system is still initializing. Please try again in a moment.',
      );
      return;
    }

    setLoading(true);

    const { error } = await presentPaymentSheet();

    setLoading(false);

    if (error) {
      console.log('THIS IS openPaymentSheet== ', error);

      if (error.code !== 'Canceled') {
        // Ignore user cancellation of the sheet
        showToast('error', `Payment Failed: ${error.message}`);
      }
    } else {
      // Payment was successful or processing started
      showToast(
        'success',
        'Your payment was successfully processed and booking is confirmed.',
      );
      setBookingConfirmModal(true);
      // Navigate to the success screen
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />
      <ReserveHeader
        title={'Booking Details'}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <Image source={AppImages.restaurant} style={styles.image} />

        <View style={styles.detailsContainer}>
          <Text style={styles.summaryTitle}>Afternoon tea on top</Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}
          >
            <Text style={styles.summaryText}>
              {`${selectedData?.date} | ${selectedData?.time} | ${selectedData?.partySize}`}
            </Text>
            <View
              style={{
                marginLeft: 8,
                height: 6,
                width: 6,
                borderRadius: 3,
                backgroundColor: Colors.Muted_Gold,
              }}
            />
          </View>

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.textInput}
            placeholder="Enter your name"
            editable={false}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.textInput}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            editable={false}
          />

          <Text style={styles.helperInfo}>
            If you'd like, tell us more about yourself and your preferences so
            we can provide a better experience.
          </Text>

          <Text style={styles.subSectionTitle}>
            Is this a Special Occasion?
          </Text>
          <View style={styles.chipsWrap}>
            <View style={styles.checkboxGrid}>
              {occasionsList &&
                occasionsList.map(item => (
                  <TouchableOpacity
                    key={item}
                    style={styles.checkboxRow}
                    onPress={() => toggleOccasion(item)}
                  >
                    <View
                      style={[
                        styles.checkboxBox,
                        occasions[item] && {
                          backgroundColor: Colors.WHITE,
                          borderColor: Colors.Muted_Gold,
                        },
                      ]}
                    >
                      {occasions[item] && (
                        <Text style={[styles.checkboxLabel, { color: '#fff' }]}>
                          ✔️
                        </Text>
                      )}
                    </View>

                    <Text style={[styles.checkboxLabel, { marginLeft: 8 }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* {occasions.map((o, idx) => (
              <View key={`${o}-${idx}`} style={styles.chip}>
                <Text style={styles.chipText}>{o}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setOccasions(prev => prev.filter((_, i) => i !== idx))
                  }
                  style={styles.closeChip}
                >
                  <Text style={styles.closeChipText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={addOccasion} style={styles.addChip}>
              <Text style={styles.addChipText}>＋</Text>
            </TouchableOpacity> */}
          </View>
          {screen != 'Lounge' ? (
            <>
              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
                Do you have any dietary restrictions?
              </Text>
              <View style={styles.checkboxGrid}>
                {dietaryList &&
                  dietaryList.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={styles.checkboxRow}
                      onPress={() => toggleDietary(item)}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          dietary[item] && {
                            backgroundColor: Colors.WHITE,
                            borderColor: Colors.Muted_Gold,
                          },
                        ]}
                      >
                        {dietary[item] && (
                          <Text
                            style={[styles.checkboxLabel, { color: '#fff' }]}
                          >
                            ✔️
                          </Text>
                        )}
                      </View>

                      <Text style={[styles.checkboxLabel, { marginLeft: 8 }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>

              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
                Dietary restrictions by Party!
              </Text>
              <View style={styles.checkboxGrid}>
                {dietaryListbyParty &&
                  dietaryListbyParty.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={styles.checkboxRow}
                      onPress={() => toggleDietaryByParty(item)}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          dietaryByParty[item] && {
                            backgroundColor: Colors.WHITE,
                            borderColor: Colors.Muted_Gold,
                          },
                        ]}
                      >
                        {dietaryByParty[item] && (
                          <Text
                            style={[styles.checkboxLabel, { color: '#fff' }]}
                          >
                            ✔️
                          </Text>
                        )}
                      </View>

                      <Text style={[styles.checkboxLabel, { marginLeft: 8 }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>

              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
                Anything else we should know?
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                style={[
                  styles.textInput,
                  { height: 90, textAlignVertical: 'top' },
                ]}
                placeholder="Write anything else"
                multiline
              />
            </>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setAgreePolicy(p => !p)}
              style={[
                styles.checkboxBox,
                agreePolicy && {
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.Muted_Gold,
                },
              ]}
            >
              {agreePolicy ? (
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: '#fff', fontSize: 12 },
                  ]}
                >
                  ✔️
                </Text>
              ) : null}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { marginLeft: 8 }]}>
              Cancellation Policy*
            </Text>
            <Text onPress={() => setCancelModalVisible(true)}>ⓘ</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsAdult(p => !p)}
              style={[
                styles.checkboxBox,
                isAdult && {
                  backgroundColor: Colors.WHITE,
                  borderColor: Colors.Muted_Gold,
                },
              ]}
            >
              {isAdult ? (
                <Text
                  style={[
                    styles.checkboxLabel,
                    { color: '#fff', fontSize: 12 },
                  ]}
                >
                  ✔️
                </Text>
              ) : null}
            </TouchableOpacity>
            <Text style={[styles.checkboxLabel, { marginLeft: 8 }]}>
              I certify I am above the age of 21
            </Text>
          </View>

          <Text style={styles.terms}>
            By clicking "submit" you agree to SevenRooms{' '}
            <Text style={styles.termsLink}>Terms and Conditions</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.totalLabel}>Booking Total</Text>
          <Text style={styles.totalValue}>10.00 EUR</Text>
        </View>
        <Button
          title="Proceed to Pay"
          style={styles.payButton}
          textStyle={styles.payText}
          onPress={proceed}
        />
      </View>
      <PopupDropdown
        label="Party Size"
        visible={showGuestPopup}
        data={guestOptions}
        selectedValue={guests ? `${guests} Guests` : null}
        onSelect={value => {
          setGuests(value);
          const next = `${value}`;
          setNewOccasionCount(prev => prev + 1);
          setOccasions(prev => [...prev, next]);
          setShowGuestPopup(false);
        }}
        onClose={() => setShowGuestPopup(false)}
        placeholder="Select"
      />
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Note"
        titleAlign="center"
        // imageSource={{ uri: 'https://via.placeholder.com/200' }}
        description="To confirm your booking, a booking confirmation payment of ₹500 is required. Bookings without payment will not be considered confirmed."
        buttonText="OK"
        onButtonPress={() => {
          setModalVisible(false), initializePaymentSheet(1000); // Pass the amount in cents (49.00 AED * 100)
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        titleStyle={{ color: '#e63946' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold }}
        showCloseIcon={true}
        // Optional custom close image
        // closeIconImage={require('../assets/close.png')}
      />
      <CustomModal
        visible={bookingConfirmModal}
        onClose={() => setBookingConfirmModal(false)}
        title=""
        titleAlign="center"
        imageSource={require('../res/images/icons/confirm.png')}
        description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        buttonText="Share"
        onButtonPress={() => {
          setBookingConfirmModal(false),
            navigation.navigate('BottomTabs', { screen: 'Loyalty' });
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        titleStyle={{ color: '#e63946' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold, marginBottom: 20 }}
        showCloseIcon={true}
        description1="Booking Successful!"
        // Optional custom close image
        // closeIconImage={require('../assets/close.png')}
      />
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.policyTitle}>Cancellation Policy</Text>
              <TouchableOpacity onPress={() => setCancelModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.policySubtitle}>
              The Deposited Amount Is Non-Refundable If:
            </Text>
            <View style={{ marginTop: 8 }}>
              {[
                'The reservation is cancelled with less than 48 hours prior to the booking date',
                'A sudden reduction of the number of guests',
                'A “No Show”',
              ].map((line, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>·</Text>
                  <Text style={styles.modalBodyText}>{line}</Text>
                </View>
              ))}
            </View>
            <Button
              title="Ok"
              style={styles.modalCta}
              textStyle={styles.payText}
              onPress={() => setCancelModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReserveTableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 45,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: Colors.BLACK,
    marginLeft: 10,
  },
  image: {
    width: '92%',
    height: 200,
    borderRadius: 16,
    alignSelf: 'center',
    marginTop: 15,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  summaryTitle: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
  },
  summaryText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    color: Colors.BLACK,
    letterSpacing: 1,
  },
  label: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 16,
    color: Colors.BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 15,
    color: Colors.BLACK,
  },
  helperInfo: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
    marginTop: 8,
  },
  subSectionTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    color: Colors.BLACK,
    marginTop: 16,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#F0F1F3',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.BLACK,
  },
  closeChip: {
    marginLeft: 6,
  },
  closeChipText: {
    fontSize: 14,
    color: Colors.DARK_GREY,
  },
  addChip: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addChipText: {
    fontSize: 16,
    color: Colors.BLACK,
  },
  checkboxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: Colors.BORDERGREY,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    height: 10,
    width: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 13,
    color: Colors.BLACK,
    // marginLeft: 8,
    textAlign: 'center',
  },
  terms: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
    marginTop: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  totalLabel: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 12,
    color: Colors.DARK_GREY,
  },
  totalValue: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 18,
    color: Colors.GREEN,
    marginTop: 4,
  },
  payButton: {
    backgroundColor: Colors.Muted_Gold,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '38%',
    height: 40,
  },
  payText: {
    fontFamily: Fonts.instrumentSansMedium,
    color: Colors.WHITE,
    fontSize: 14,
  },
  termsLink: {
    color: 'blue',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.DARK_GREY,
  },
  noteTitle: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 20,
    color: '#E15A5A',
  },
  policyTitle: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 20,
    color: Colors.BLACK,
  },
  policySubtitle: {
    marginTop: 20,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 15,
    color: Colors.BLACK,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  bulletDot: {
    fontSize: 22,
    lineHeight: 22,
    color: Colors.DARK_GREY,
    marginRight: 8,
  },
  modalBodyText: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.DARK_GREY,
  },
  modalCta: {
    backgroundColor: Colors.Muted_Gold,
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 16,
    alignSelf: 'center',
    width: '100%',
  },
  successIconCircle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#2BB24C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    textAlign: 'center',
    marginTop: 16,
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 22,
    color: '#2BB24C',
  },
});
