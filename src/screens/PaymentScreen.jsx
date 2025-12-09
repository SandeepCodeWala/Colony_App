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
// Assuming putApiWithBase1 is defined or imported, I'll use the definition from your prompt
// import { putApiWithBase1 } from '../services/network/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- STATIC DATA FOR DEMONSTRATION ---
// In a real app, this data would be fetched from an API
const STATIC_CARDS = [
  { id: '1', name: 'John Doe', last4: '4242', expiry: '12/26', type: 'Visa' },
  {
    id: '2',
    name: 'Jane Smith',
    last4: '0000',
    expiry: '05/25',
    type: 'Mastercard',
  },
];

// Re-defining putApiWithBase1 locally for a runnable example
async function putApiWithBase1(method, data, authKey, token) {
  const fullUrl = baseURL.base_url1 + method;
  console.log('➡️ API Request (PUT/Base1):', fullUrl);
  let response = {};

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (authKey) {
      headers['Authorization'] = `Bearer ${token}`; // Use the token state here
    }

    const res = await axios.put(fullUrl, data, { headers });
    console.log('✅ API Response (PUT/Base1):', res.data);
    response = res.data;
  } catch (e) {
    console.log('❌ API Error (PUT/Base1):', e?.response?.data || e.message);
    response = e?.response?.data || { success: false, message: e.message };
  }
  return response;
}
// --- END STATIC DATA/HELPER ---

const CardDetailsScreen = ({ route }) => {
  const { reservationId, NoOfGuest } = route?.params || {};
  const navigation = useNavigation();

  // New State for Card Management
  const [savedCards, setSavedCards] = useState(STATIC_CARDS);
  const [selectedCardId, setSelectedCardId] = useState(null);
  // State to toggle between Card List and New Card Form
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  // Existing States for New Card Form
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
    // Initially select the first card if available
    if (STATIC_CARDS.length > 0) {
      setSelectedCardId(STATIC_CARDS[0].id);
      setIsAddingNewCard(false);
    } else {
      // If no cards, default to adding a new one
      setIsAddingNewCard(true);
    }
  }, []);

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const clearNewCardForm = () => {
    setName('');
    setNumber('');
    setExpiry('');
    setCvv('');
  };

  const handleAddNewCard = () => {
    setIsAddingNewCard(!isAddingNewCard);
    setSelectedCardId(null); // Deselect any saved card
    clearNewCardForm(); // Clear the form fields
  };

  const handleSubmit = async () => {
    if (!accepted) {
      Alert.alert('OOPs!', 'Please accept the cancellation policy.');
      return;
    }

    let cardDetailsToSend = null;

    if (isAddingNewCard) {
      // Logic for new card entry
      if (!name || !number || !expiry || !cvv) {
        Alert.alert(
          'OOPs!',
          'Please fill in all card details for the new card.',
        );
        return;
      }
      // Prepare details from the form
      cardDetailsToSend = {
        cardNumber: number.replace(/\s/g, ''), // Remove spaces for API
        cardExpiry: expiry,
        CVV: cvv,
      };
    } else if (selectedCardId) {
      // Logic for selected saved card
      // NOTE: In a real app, you would fetch the full card details (minus CVV, which may be asked on-the-fly)
      // For this static example, we'll use a placeholder/simplified structure.
      // Assuming the API supports reserving with a saved card ID or token:

      // *** IMPORTANT: The current API payload requires cardNumber, cardExpiry, and CVV.
      // For a real app using a selected card, you would likely send a `cardToken` or `cardId`
      // and maybe ask the user to re-enter the CVV for security.
      // For a safe static example, we will simulate passing the selected card's basic info + a dummy CVV (in a real app, a token is better)
      const selected = savedCards.find(c => c.id === selectedCardId);
      if (!selected) {
        Alert.alert('Error', 'Selected card details not found.');
        return;
      }

      // *** You'll need to decide how to handle the CVV for saved cards.
      // For this example, we'll ask for it in a separate input or assume it's not needed
      // if the API uses a card token. Since your API requires CVV, this is a blocker for
      // *securely* using a static saved card list without changes.
      // For demonstration, we'll just show an alert and stop.

      Alert.alert(
        'Note',
        'For a selected saved card, the API typically requires a card Token/ID, and sometimes a re-entered CVV. The current form only supports a full card entry, please use "Add New Card" for the demonstration.',
      );
      return;
    } else {
      Alert.alert('OOPs!', 'Please select a card or add a new one.');
      return;
    }

    // --- API Call Preparation (Only reaches here if isAddingNewCard is true in this simplified example) ---

    try {
      setLoading(true);

      const authKey = token; // Use the state token

      if (!authKey) {
        Alert.alert(
          'Error',
          'Authentication token not found. Please log in again.',
        );
        setLoading(false);
        return;
      }

      // Prepare the data payload
      let data = {
        reservationId: reservationId,
        amount: NoOfGuest ? NoOfGuest * 12 : 12,
        cardDetails: cardDetailsToSend, // Use the prepared card details
        isAcceptCancellation: true,
      };

      console.log('WHAT IS data====data data', data);

      const endpoint = 'reservations/save_card_details';

      // Use the putApiWithBase1 helper
      const response = await putApiWithBase1(endpoint, data, authKey, token); // Pass token to helper

      if (response && response.success === true) {
        setBookingConfirmModal(true);
      } else {
        showToast('error', response.message || 'Payment processing failed.');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Components for Card Selection and Input ---

  const SavedCardList = () => (
    <View style={styles.cardListContainer}>
      <Text
        style={[
          styles.header,
          { color: '#fff', textAlign: 'left', marginBottom: 15 },
        ]}
      >
        Select a Card
      </Text>
      <TouchableOpacity
        style={styles.addNewCardButton}
        onPress={handleAddNewCard}
      >
        <Text style={styles.addNewCardButtonText}>+ Add New Card</Text>
      </TouchableOpacity>
      {savedCards.map(card => (
        <TouchableOpacity
          key={card.id}
          style={[
            styles.cardItem,
            selectedCardId === card.id && styles.selectedCardItem,
          ]}
          onPress={() => {
            setSelectedCardId(card.id);
            setIsAddingNewCard(false);
          }}
        >
          <Text style={styles.cardTypeText}>{card.type}</Text>
          <Text style={styles.cardText}>**** **** **** {card.last4}</Text>
          <Text style={styles.cardTextSmall}>Exp: {card.expiry}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const NewCardForm = () => (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.header,
          { color: '#fff', textAlign: 'left', marginBottom: 15 },
        ]}
      >
        Enter Card Details
      </Text>
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
                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
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
      <Text
        onPress={() => handleAddNewCard()}
        style={{
          color: '#fff',
          fontSize: 12,
          textAlign: 'center',
          textDecorationLine: 'underline',
        }}
      >
        + Add from Saved Cards
      </Text>
    </View>
  );

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
              <View style={styles.policyBox}>
                <Text style={[styles.header, { color: '#000' }]}>
                  Cancellation Policy
                </Text>
                <Text style={styles.policyText}>
                  Please confirm your reservation. Your card will not be
                  charged. In the event of a late cancellation or no-show, the
                  following fee may be applied.
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
              {/* Card Selection List */}
              {savedCards.length > 0 && !isAddingNewCard && <SavedCardList />}

              {/* Add New Card Button / Toggle */}
              {/* {(savedCards.length > 0 && !isAddingNewCard) && (
                <TouchableOpacity 
                    style={styles.addNewCardButton} 
                    onPress={handleAddNewCard}
                >
                    <Text style={styles.addNewCardButtonText}>+ Add New Card</Text>
                </TouchableOpacity>
              )} */}

              {/* New Card Form (Shown if no saved cards or explicitly toggled) */}
              {(isAddingNewCard || savedCards.length === 0) && <NewCardForm />}

              {/* Cancellation Policy */}

              {/* Checkbox and Button */}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
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

  // --- New Styles for Card Selection ---
  cardListContainer: {
    marginBottom: 20,
  },
  cardItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCardItem: {
    borderColor: Colors.GREEN,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'center',
  },
  cardTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.Muted_Gold,
    flex: 1,
  },
  cardTextSmall: {
    fontSize: 12,
    color: '#777',
    flex: 1,
    textAlign: 'right',
  },
  addNewCardButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addNewCardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CardDetailsScreen;
