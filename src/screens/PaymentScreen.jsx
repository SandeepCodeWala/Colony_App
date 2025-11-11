import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ImageBackground,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import { AppImages, Colors } from '../res';
import ReserveHeader from '../components/ReserveHeader';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';
import CustomModal from '../components/ModalComponent';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CardDetailsScreen = ({ route }) => {
  const { reservationId, NoOfGuest } = route?.params || '';
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);
  const [token, setToken] = useState('');

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

  const handleSubmit = async () => {
    if (!accepted) {
      Alert.alert('OOPs!', 'Please accept the cancellation policy.');
      return;
    }
    if (!name || !number || !expiry || !cvv) {
      Alert.alert('OOPs!', 'Please fill in all card details.');
      return;
    }

    try {
      setLoading(true);

      // ⭐ 1. Asynchronously retrieve the token
      const authKey = await AsyncStorage.getItem('token');

      if (!authKey) {
        Alert.alert(
          'Error',
          'Authentication token not found. Please log in again.',
        );
        setLoading(false);
        return;
      }

      // 2. Prepare the data payload
      let data = {
        reservationId: reservationId,
        amount: NoOfGuest ? NoOfGuest * 12 : 12,
        cardDetails: {
          cardNumber: number,
          cardExpiry: expiry,
          CVV: cvv,
        },
        isAcceptCancellation: true,
      };

      const endpoint = 'reservations/save_card_details';

      // 3. Use the putApiWithBase1 helper with the retrieved token
      // The payload structure { data } is preserved to match the original requirement.
      const response = await putApiWithBase1(endpoint, { data }, authKey);
      console.log('WHAT IS RESPONSE====', response);
      // Check the response for API-specific errors before confirming
      if (response?.data && response.success === true) {
        setBookingConfirmModal(true);
      } else {
        showToast('error', response.message || 'Payment processing failed.');
      }
    } catch (error) {
      console.error(error);
      // Display a generic error if the network request itself fails
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  async function putApiWithBase1(method, data, authKey) {
    // ⭐ Key Change: Using baseURL.base_url1
    const fullUrl = baseURL.base_url1 + method;
    console.log('➡️ API Request (PUT/Base1):', fullUrl);
    let response = {};

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // ✅ Add token if available
      if (authKey) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // ⭐ Constructing the request using the new full URL
      const res = await axios.put(fullUrl, data, { headers });

      console.log('✅ API Response (PUT/Base1):', res.data);
      response = res.data;
    } catch (e) {
      // Handle both Axios error with response data and generic JS errors
      console.log('❌ API Error (PUT/Base1):', e?.response?.data || e.message);
      response = e?.response?.data || { success: false, message: e.message };
    }

    return response;
  }

  return (
    <ImageBackground
      source={AppImages.ccc}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={{ backgroundColor: 'white', justifyContent: 'center' }}>
        <ReserveHeader
          containerStyle={{ top: -5, height: 55 }}
          title={'Confirm Your Reservation'}
          onBack={() => navigation.goBack()}
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.container}
              showsVerticalScrollIndicator={false}
            >
              {/* Card Preview */}

              {/* Cancellation Policy */}
              <View style={styles.policyBox}>
                <Text style={[styles.header, { color: '#000' }]}>
                  Cancellation Policy
                </Text>
                <Text style={styles.policyText}>
                  Please enter your card details below to confirm your
                  reservation. Your card will not be charged. In the event of a
                  late cancellation or no-show, the following fee may be
                  applied.
                </Text>
                <View style={styles.feeBox}>
                  <Text style={styles.feeTitle}>Cancellation Fee</Text>
                  <Text style={styles.feeAmount}>
                    £{NoOfGuest ? NoOfGuest * 12 : 12}
                  </Text>
                  <Text style={styles.feeNote}>(£12 per person)</Text>
                  <Text style={styles.feeDetail}>
                    £24 fee for a no-show or a cancellation done less than 24
                    hours prior to the reservation.
                  </Text>
                </View>
              </View>

              {/* Form */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Card Holder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />

                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={19}
                  value={number}
                  onChangeText={text => {
                    const formatted = text
                      .replace(/\s?/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim();
                    setNumber(formatted);
                  }}
                />

                <View style={styles.row}>
                  <View style={[styles.rowItem, { marginRight: 10 }]}>
                    <Text style={styles.label}>Expiry Date</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                      value={expiry}
                      onChangeText={text => {
                        let formatted = text.replace(/\D/g, '');
                        if (formatted.length >= 3) {
                          formatted =
                            formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
                        }
                        setExpiry(formatted);
                      }}
                    />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      secureTextEntry
                      maxLength={4}
                      value={cvv}
                      onChangeText={setCvv}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={accepted}
                  onValueChange={setAccepted}
                  tintColors={{ true: Colors.Muted_Gold, false: '#aaa' }}
                />
                <Text style={styles.checkboxLabel}>
                  I accept the cancellation policy and agree to the terms.
                </Text>
              </View>

              {/* Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  (!accepted || loading) && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={!accepted || loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Submitting...' : 'Confirm Reservation'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
      <CustomModal
        visible={bookingConfirmModal}
        onClose={() => setBookingConfirmModal(false)}
        title=""
        titleAlign="center"
        imageSource={require('../res/images/icons/confirm.png')}
        description="Thank you for your booking! You can view all the details in your Profile → Bookings section."
        buttonText="Share"
        onButtonPress={() => {
          setBookingConfirmModal(false),
            navigation.navigate('BottomTabs', { screen: 'Account' });
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        titleStyle={{ color: '#e63946' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold, marginBottom: 20 }}
        showCloseIcon={true}
        description1="Booking Successful!"
        // Optional custom close image
        // closeIconImage={require('../assets/close.png')}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fffe',
    textAlign: 'center',
    marginBottom: 20,
  },

  chip: {
    width: 40,
    height: 30,
    backgroundColor: '#f1c40f',
    borderRadius: 6,
  },
  cardNumber: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    // position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent dark overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  cardName: {
    color: '#fff',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  cardExpiry: {
    color: '#fff',
    fontSize: 14,
  },
  policyBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  policyText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  feeBox: {
    backgroundColor: '#f9f1f5',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d71b6b',
  },
  feeAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d71b6b',
    marginVertical: 4,
  },
  feeNote: {
    fontSize: 13,
    color: '#777',
  },
  feeDetail: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  rowItem: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13.5,
    color: '#fff',
    lineHeight: 20,
    marginTop: 5,
  },
  button: {
    backgroundColor: Colors.Muted_Gold,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CardDetailsScreen;
