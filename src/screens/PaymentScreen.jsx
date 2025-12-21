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
import { useSelector } from 'react-redux';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { AppImages, Colors } from '../res';
import ReserveHeader from '../components/ReserveHeader';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';
import CustomModal from '../components/ModalComponent';
import { useNavigation } from '@react-navigation/native';

// --- SUB-COMPONENTS (Defined OUTSIDE to prevent re-render focus loss) ---

const SavedCardList = ({ savedCards, selectedCardId, setSelectedCardId, setIsAddingNewCard, handleAddNewCard }) => (
  <View style={styles.cardListContainer}>
    <Text style={[styles.header, { color: '#fff', textAlign: 'left', marginBottom: 15 }]}>
      Select a Card
    </Text>
    <TouchableOpacity style={styles.addNewCardButton} onPress={handleAddNewCard}>
      <Text style={styles.addNewCardButtonText}>+ Add New Card</Text>
    </TouchableOpacity>
    {savedCards.map(card => (
      <TouchableOpacity
        key={card.id}
        style={[styles.cardItem, selectedCardId === card.id && styles.selectedCardItem]}
        onPress={() => {
          setSelectedCardId(card.id);
          setIsAddingNewCard(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTypeText}>{card?.name}</Text>
          <Text style={styles.cardText}>**** **** **** {card?.last4}</Text>
        </View>
        <Text style={styles.cardTextSmall}>Exp: {card?.cardExpiry}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const NewCardForm = ({ name, setName, number, setNumber, expiry, setExpiry, cvv, setCvv, onCancel, showCancel }) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.header, { color: '#fff', textAlign: 'left', marginBottom: 15 }]}>
      Enter Card Details
    </Text>
    
    <Text style={styles.label}>Card Holder Name</Text>
    <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#999" value={name} onChangeText={setName} />

    <Text style={styles.label}>Card Number</Text>
    <TextInput 
      style={styles.input} 
      placeholder="4242 4242 4242 4242" 
      placeholderTextColor="#999" 
      keyboardType="numeric" 
      maxLength={19} 
      value={number} 
      onChangeText={text => {
        const formatted = text.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
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
            if (formatted.length >= 3) formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
            setExpiry(formatted);
          }} 
        />
      </View>
      <View style={styles.rowItem}>
        <Text style={styles.label}>CVV</Text>
        <TextInput style={styles.input} placeholder="123" placeholderTextColor="#999" keyboardType="numeric" secureTextEntry maxLength={4} value={cvv} onChangeText={setCvv} />
      </View>
    </View>

    {showCancel && (
      <TouchableOpacity onPress={onCancel}>
        <Text style={{ color: '#fff', fontSize: 12, textAlign: 'center', textDecorationLine: 'underline', marginTop: 10 }}>
          Cancel and use saved card
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

// --- MAIN COMPONENT ---

const CardDetailsScreen = ({ route }) => {
  const token = useSelector(state => state.auth?.token);
  const { reservationId, NoOfGuest } = route?.params || {};
  const navigation = useNavigation();
const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const fullUrl = baseURL.base_url1 + "card_detail/get";
      const res = await axios.get(fullUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data?.data) {
        setSavedCards(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedCardId(res.data.data[0].id);
        } else {
          setIsAddingNewCard(true);
        }
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
  };
const initializePaymentSheet = async () => {
    try {
      const amount = NoOfGuest ? NoOfGuest * 12 * 100 : 1200; // Total in pence/cents
      
      const response = await axios.post(`${baseURL.base_url1}reservations/create-payment-intent`, {
        amount: amount,
        currency: 'gbp',
        reservationId: reservationId
      }, { headers: { Authorization: `Bearer ${token}` } });

      const { clientSecret, ephemeralKey, customer } = response.data;

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Colony App',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: name },
        appearance: { colors: { primary: Colors.Muted_Gold } },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to initialize payment');
      return false;
    }
  };
  const handleAddNewCardToggle = () => {
    setIsAddingNewCard(true);
    setSelectedCardId(null);
    setName(''); setNumber(''); setExpiry(''); setCvv('');
  };

  const handleSubmit = async () => {
    if (!accepted) return Alert.alert('Wait', 'Please accept the cancellation policy.');
    
    setLoading(true);

    // 4. Trigger Stripe Payment Sheet first
    const isInitialized = await initializePaymentSheet();
    if (isInitialized) {
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code !== 'Canceled') {
          showToast('error', `Payment failed: ${error.message}`);
        }
        setLoading(false);
      } else {
        // Payment Succeeded! Now update the backend reservation
        await finalizeBooking();
      }
    } else {
      setLoading(false);
    }
  };

  const finalizeBooking = async () => {
    try {
      // Logic to save reservation status after payment
      const finalData = {
        reservationId,
        isAcceptCancellation: true,
        paymentStatus: 'success',
        cardDetailId: selectedCardId // if needed by your backend
      };

      const response = await axios.put(baseURL.base_url1 + 'reservations/save_card_details', finalData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.success) {
        setBookingConfirmModal(true);
      } else {
        showToast('error', response.data?.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Payment successful but booking update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={AppImages.ccc} style={styles.bg} resizeMode="cover">
      <View style={{ backgroundColor: 'white' }}>
        <ReserveHeader title={'Confirm Your Reservation'} onBack={() => navigation.goBack()} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
              
              <View style={styles.policyBox}>
                <Text style={[styles.header, { color: '#000' }]}>Cancellation Policy</Text>
                <View style={styles.feeBox}>
                  <Text style={styles.feeAmount}>£{NoOfGuest ? NoOfGuest * 12 : 12}</Text>
                  <Text style={styles.feeNote}>(£12 per person)</Text>
                </View>
              </View>

              {savedCards.length > 0 && !isAddingNewCard ? (
                <SavedCardList 
                  savedCards={savedCards} 
                  selectedCardId={selectedCardId} 
                  setSelectedCardId={setSelectedCardId} 
                  setIsAddingNewCard={setIsAddingNewCard}
                  handleAddNewCard={handleAddNewCardToggle}
                />
              ) : (
                <NewCardForm 
                  name={name} setName={setName} 
                  number={number} setNumber={setNumber} 
                  expiry={expiry} setExpiry={setExpiry} 
                  cvv={cvv} setCvv={setCvv} 
                  showCancel={savedCards.length > 0}
                  onCancel={() => setIsAddingNewCard(false)}
                />
              )}

              <View style={styles.checkboxContainer}>
                <CheckBox
                  value={accepted}
                  onValueChange={setAccepted}
                  tintColors={{ true: Colors.Muted_Gold, false: '#aaa' }}
                />
                <Text style={styles.checkboxLabel}>I accept the cancellation policy.</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, (!accepted || loading) && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={!accepted || loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Confirm Reservation'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      <CustomModal
        visible={bookingConfirmModal}
        onClose={() => setBookingConfirmModal(false)}
        imageSource={require('../res/images/icons/confirm.png')}
        description="Booking Successful!"
        buttonText="View Bookings"
        onButtonPress={() => {
          setBookingConfirmModal(false);
          navigation.navigate('BottomTabs', { screen: 'Account' });
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { padding: 20, paddingBottom: 60 },
  header: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  policyBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  feeBox: { alignItems: 'center', marginTop: 10 },
  feeAmount: { fontSize: 24, fontWeight: 'bold', color: '#d71b6b' },
  feeNote: { color: '#777' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#fff', marginBottom: 5, fontSize: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 10, color: '#000' },
  row: { flexDirection: 'row' },
  rowItem: { flex: 1 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkboxLabel: { color: '#fff', marginLeft: 8 },
  button: { backgroundColor: Colors.Muted_Gold, padding: 16, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cardListContainer: { marginBottom: 20 },
  cardItem: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedCardItem: { borderColor: '#4CAF50' },
  cardTypeText: { fontWeight: 'bold', color: Colors.Muted_Gold },
  cardText: { color: '#333' },
  cardTextSmall: { fontSize: 12, color: '#999' },
  addNewCardButton: { borderWeight: 1, borderColor: '#fff', borderWidth: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  addNewCardButtonText: { color: '#fff' }
});

export default CardDetailsScreen;