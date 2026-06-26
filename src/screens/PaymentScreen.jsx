import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
  ImageBackground, Alert, ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

import { AppImages, Colors } from '../res';
import ReserveHeader from '../components/ReserveHeader';
import { showToast } from '../services/Toast';
import baseURL from '../services/network/base_url';
import CustomModal from '../components/ModalComponent';

const CardDetailsScreen = ({ route }) => {
  const token = useSelector(state => state.auth?.token);
  const { reservationId, NoOfGuest } = route?.params || {};
  const navigation = useNavigation();
  const { createPaymentMethod } = useStripe();

  // State Management
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isAddingNewCard, setIsAddingNewCard] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingConfirmModal, setBookingConfirmModal] = useState(false);

  // Stripe Form State
  const [name, setName] = useState('');
  const [cardDetails, setCardDetails] = useState(null);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token && reservationId) {
      fetchSavedCards();
    }
  }, [token, reservationId]);

  const fetchSavedCards = async () => {
    try {
      const res = await axios.get(`${baseURL.base_url1}reservations/get_by_id`, { headers });
     if (res.data?.success && Array.isArray(res.data.data)) {
      const cards = res.data.data; // This is the array of {brand, last4, stripePaymentMethodId}
      
      console.log("Cards received from Backend:", cards);
      
      setSavedCards(cards);

      if (cards.length > 0) {
        // Auto-select the first card in the list
        setSelectedCardId(cards[0].stripePaymentMethodId);
        setIsAddingNewCard(false);
      } else {
        setIsAddingNewCard(true);
      }
    }
  } catch (error) {
    console.log("Fetch Error", error);
    setIsAddingNewCard(true); // Show form if fetch fails
  }}

  // REAL STRIPE ADD CARD LOGIC
  const handleAddCardToList = async () => {
    if (!name || !cardDetails?.complete) {
      Alert.alert('Error', 'Please enter your name and complete card details.');
      return;
    }

    try {
      setLoading(true);

      // 1. Get Setup Intent from Backend
      const intentRes = await axios.post(`${baseURL.base_url1}reservations/create-setup-intent`, {}, { headers });
      const { customer } = intentRes.data;

      // 2. Create Payment Method via Stripe SDK
      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
        billingDetails: { name: name },
      });

      if (error) {
        showToast('error', error.message);
        setLoading(false);
        return;
      }

      // 3. Send REAL PaymentMethod ID to Backend
      const storeData = {
        reservationId,
        stripeCustomerId: customer,
        stripePaymentMethodId: paymentMethod.id, // This is now dynamic!
        name: name,
      };

      const storeRes = await axios.post(`${baseURL.base_url1}reservations/store-card`, storeData, { headers });

      if (storeRes.data.success) {
        showToast('success', 'Card saved securely');
        await fetchSavedCards();
        setIsAddingNewCard(false);
        setName('');
      }
    } catch (err) {
      showToast('error', 'Failed to save card');
    } finally {
      setLoading(false);
    }
  };

  // const handleFinalConfirmation = async () => {
  //   if (!accepted) {
  //     Alert.alert('Attention', 'Please accept the cancellation policy.');
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const finalData = {
  //       reservationId,
  //       isAcceptCancellation: true,
  //       stripePaymentMethodId: selectedCardId 
  //     };
  //     const response = await axios.put(`${baseURL.base_url1}reservations/save_card_details`, finalData, { headers });
  //     if (response.data.success) {
  //       setBookingConfirmModal(true);
  //     }
  //   } catch (err) {
  //     showToast('error', 'Confirmation failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFinalConfirmation = async () => {
  if (!accepted) {
    Alert.alert('Attention', 'Please accept the cancellation policy.');
    return;
  }
  
  try {
    setLoading(true);

    // Find the full card object from your state to get the customer ID
    const selectedFECard = savedCards.find(
      (card) => card.stripePaymentMethodId === selectedCardId
    );

    const finalData = {
      reservationId,
      isAcceptCancellation: true,
      stripePaymentMethodId: selectedCardId,
      // CRITICAL: Send the Customer ID so the backend can link it to this specific reservation
      stripeCustomerId: selectedFECard?.stripeCustomerId || null 
    };

    const response = await axios.put(
      `${baseURL.base_url1}reservations/save_card_details`, 
      finalData, 
      { headers }
    );

    if (response.data.success) {
      setBookingConfirmModal(true);
    }
  } catch (err) {
    console.log("Confirmation Error:", err.response?.data);
    showToast('error', 'Confirmation failed');
  } finally {
    setLoading(false);
  }
};

////////remove card

// Function to handle card deletion
// 1. Add this function inside your CardDetailsScreen component
const handleDeleteCard = async (card) => {
  try {
    setLoading(true);
    const payload = {
      id: reservationId, // This MUST match the 'id' column in your pgAdmin screenshot
      customerId: card.stripeCustomerId,
      paymentId: card.stripePaymentMethodId,
    };

    const res = await axios.delete(`${baseURL.base_url1}reservations/delete_data`, {
      headers: headers,
      data: payload
    });

    if (res.data.success) {
      // Update UI state locally first
      setSavedCards(prev => prev.filter(c => c.stripePaymentMethodId !== card.stripePaymentMethodId));
      showToast('success', 'Card deleted');
      
      // Refresh to confirm with DB
      await fetchSavedCards();
    }
  } catch (error) {
    showToast('error', 'Delete failed');
  } finally {
    setLoading(false);
  }
};

// 2. Update your SavedCardList component UI
const SavedCardList = () => (
  <View style={{ marginBottom: 20 }}>
    <Text style={styles.sectionHeader}>Select Card to Use</Text>
    {savedCards.map((card, index) => (
      <View 
        key={index} 
        style={[
          styles.cardItem, 
          selectedCardId === card.stripePaymentMethodId && styles.selectedCardItem,
          { flexDirection: 'row', alignItems: 'center' } // Ensure layout is horizontal
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          onPress={() => setSelectedCardId(card.stripePaymentMethodId)}
        >
          <View>
            <Text style={styles.cardTypeText}>{card.brand.toUpperCase()}</Text>
            <Text style={styles.cardText}>**** **** **** {card.last4}</Text>
            {/* Warning for null customers (Debugging only) */}
            {!card.stripeCustomerId && (
              <Text style={{ color: 'orange', fontSize: 10 }}>Inactive (No Customer ID)</Text>
            )}
          </View>
          {selectedCardId === card.stripePaymentMethodId && <View style={styles.checkCircle} />}
        </TouchableOpacity>

        {/* DELETE ICON / BUTTON */}
        <TouchableOpacity 
          onPress={() => handleDeleteCard(card)} 
          style={{ marginLeft: 15, padding: 8, backgroundColor: '#fee2e2', borderRadius: 5 }}
        >
          <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: 'bold' }}>DELETE</Text>
        </TouchableOpacity>
      </View>
    ))}
    
    <TouchableOpacity style={styles.addNewCardButton} onPress={() => setIsAddingNewCard(true)}>
      <Text style={styles.addNewCardButtonText}>+ Add Another Card</Text>
    </TouchableOpacity>
  </View>
);


  // const SavedCardList = () => (
  //   <View>
  //     <Text style={styles.sectionHeader}>Select Card to Use</Text>
  //     {savedCards.map((card, index) => (
  //       <TouchableOpacity
  //         key={index}
  //         style={[styles.cardItem, selectedCardId === card.stripePaymentMethodId && styles.selectedCardItem]}
  //         onPress={() => setSelectedCardId(card.stripePaymentMethodId)}
  //       >
  //         <View>
  //           <Text style={styles.cardTypeText}>{card.brand.toUpperCase()}</Text>
  //           <Text style={styles.cardText}>**** **** **** {card.last4}</Text>
  //         </View>
  //         {selectedCardId === card.stripePaymentMethodId && <View style={styles.checkCircle} />}
  //       </TouchableOpacity>
  //     ))}
  //     <TouchableOpacity style={styles.addNewCardButton} onPress={() => setIsAddingNewCard(true)}>
  //       <Text style={styles.addNewCardButtonText}>+ Add Another Card</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  return (
    <ImageBackground source={AppImages.ccc} style={styles.bg} resizeMode="cover">
      <View style={{backgroundColor: 'white'}}><ReserveHeader title={'Payment Details'} onBack={() => navigation.goBack()} /></View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
              
              <View style={styles.policyBox}>
                <Text style={styles.policyTitle}>Cancellation Policy</Text>
                <Text style={styles.policyText}>A fee of £12 per person applies for no-shows.</Text>
              </View>

              {isAddingNewCard ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.sectionHeader}>Enter Secure Card Details</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Card Holder Name" 
                    placeholderTextColor="#999"
                    value={name} 
                    onChangeText={setName} 
                  />
                  
                  {/* REAL STRIPE INPUT */}
                  <CardField
                    postalCodeEnabled={false}
                    cardStyle={{
                      backgroundColor: '#FFFFFF',
                      textColor: '#000000',
                      borderRadius: 8,
                    }}
                    style={styles.cardField}
                    onCardChange={(details) => setCardDetails(details)}
                  />
                  
                  <TouchableOpacity style={styles.button} onPress={handleAddCardToList} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Card Securely</Text>}
                  </TouchableOpacity>

                  {savedCards.length > 0 && (
                    <Text onPress={() => setIsAddingNewCard(false)} style={styles.linkText}>Back to Saved Cards</Text>
                  )}
                </View>
              ) : (
                <View>
                  <SavedCardList />
                  <View style={styles.checkboxContainer}>
                    <CheckBox value={accepted} onValueChange={setAccepted} tintColors={{ true: Colors.Muted_Gold }} />
                    <Text style={styles.checkboxLabel}>I accept the cancellation terms for {NoOfGuest} guests.</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.button, !accepted && { opacity: 0.5 }]} 
                    onPress={handleFinalConfirmation} 
                    disabled={!accepted || loading}
                  >
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirm Reservation</Text>}
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      <CustomModal
        visible={bookingConfirmModal}
        onClose={() => setBookingConfirmModal(false)}
        imageSource={require('../res/images/icons/confirm.png')}
        description="Booking Successful! Your card will only be charged in case of a no-show."
        description1="Confirmed!"
        buttonText="View Details"
        onButtonPress={() => {
          setBookingConfirmModal(false);
          setTimeout(() => navigation.navigate('BottomTabs', { screen: 'Account' }), 200);
        }}
        modalStyle={{ backgroundColor: '#fafafa' }}
        buttonStyle={{ backgroundColor: Colors.Muted_Gold, marginBottom: 20 }}
        showCloseIcon={true}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  container: { padding: 20 },
  policyBox: { backgroundColor: '#FFF9EF', borderRadius: 10, padding: 15, marginBottom: 20 },
  policyTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  policyText: { fontSize: 13, color: '#666' },
  sectionHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  cardItem: { backgroundColor: '#FFF9EF', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedCardItem: { borderWidth: 2, borderColor: Colors.Muted_Gold },
  cardTypeText: { color: Colors.Muted_Gold, fontWeight: 'bold', fontSize: 12 },
  cardText: { fontSize: 16, color: '#333' },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.Muted_Gold },
  addNewCardButton: { padding: 10, alignItems: 'center' },
  addNewCardButtonText: { color: '#fff', textDecorationLine: 'underline' },
  input: { backgroundColor: '#FFF9EF', borderRadius: 8, padding: 12, marginBottom: 10, color: '#000' },
  cardField: { width: '100%', height: 50, marginVertical: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  checkboxLabel: { color: '#fff', marginLeft: 10, fontSize: 13, flex: 1 },
  button: { backgroundColor: Colors.Muted_Gold, padding: 16, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { color: '#fff', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline' }
});

export default CardDetailsScreen;