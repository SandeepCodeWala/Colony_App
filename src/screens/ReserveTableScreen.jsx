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
import Button from '../components/Button';
import PopupDropdown from '../components/PopupDropdown';
import CustomModal from '../components/ModalComponent';
import { showToast } from '../services/Toast';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import baseURL from '../services/network/base_url';
import { setMembershipNumber } from '../redux/authSlice';

const ReserveTableScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, selectedData, screen } = route?.params ?? {};

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

  const arrayToObject = arr => Object.fromEntries(arr.map(item => [item, false]));

  const [occasions, setOccasions] = useState(arrayToObject(userData?.obj?.dropdownOptions?.occasions));
  const [occasionsList] = useState(userData?.obj?.dropdownOptions?.occasions);

  const [dietary, setDietary] = useState(arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByUser));
  const [dietaryList] = useState(userData?.obj?.dropdownOptions?.dietaryRestrictionByUser);

  const [dietaryByParty, setDietaryByParty] = useState(arrayToObject(userData?.obj?.dropdownOptions?.dietaryRestrictionByParty));
  const [dietaryListbyParty] = useState(userData?.obj?.dropdownOptions?.dietaryRestrictionByParty);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const guestOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guests, setGuests] = useState(null);

  // Toggle functions
  const toggleOccasion = key => setOccasions(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDietary = key => setDietary(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDietaryByParty = key => setDietaryByParty(prev => ({ ...prev, [key]: !prev[key] }));

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
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );
      showToast('success', response.data?.message);
      navigation.navigate('Payment', {
        reservationId: userData?.obj?.reservation?.reservationId,
        NoOfGuest: selectedData?.partySize,
      });
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
      const response = await fetch(`${baseURL.base_url1}reservations/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: amountInCents, currency: 'gbp', phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch payment intent.');
      return data;
    } catch (error) {
      console.error('Payment Error:', error);
      showToast('error', 'Failed to fetch payment intent');
      return null;
    }
  };

  const initializePaymentSheet = async totalAmount => {
    setLoading(true);
    const paymentData = await fetchPaymentIntentClientSecret(totalAmount, phone);

    if (!paymentData || !paymentData.clientSecret || !paymentData.ephemeralKey || !paymentData.customer) {
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
      if (error.code !== 'Canceled') showToast('error', `Payment failed: ${error.message}`);
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.WHITE} />

      {/* Header */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <Image source={AppImages.restaurant} style={styles.image} />
        <View style={styles.detailsContainer}>
          <Text style={styles.summaryTitle}>Afternoon tea on top</Text>
          <Text style={styles.summaryText}>{`${selectedData?.date1 || selectedData?.date} | ${selectedData?.time1 || selectedData?.time} | ${selectedData?.guests || selectedData?.partySize} Guests`}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput value={name} style={styles.textInput} editable={false} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput value={phone} style={styles.textInput} editable={false} />

          {screen !== 'Lounge' && (
            <>
              <Text style={styles.subSectionTitle}>Special Occasion?</Text>
              {occasionsList.map(item => (
                <TouchableOpacity key={item} style={styles.checkboxRow} onPress={() => toggleOccasion(item)}>
                  <View style={[styles.checkboxBox, occasions[item] && { backgroundColor: Colors.WHITE, borderColor: Colors.Muted_Gold }]}>
                    {occasions[item] && <Text style={{ color: '#fff' }}>✔️</Text>}
                  </View>
                  <Text style={{ marginLeft: 8 }}>{item}</Text>
                </TouchableOpacity>
              ))}

              <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Dietary restrictions</Text>
              {dietaryList.map(item => (
                <TouchableOpacity key={item} style={styles.checkboxRow} onPress={() => toggleDietary(item)}>
                  <View style={[styles.checkboxBox, dietary[item] && { backgroundColor: Colors.WHITE, borderColor: Colors.Muted_Gold }]}>
                    {dietary[item] && <Text style={{ color: '#fff' }}>✔️</Text>}
                  </View>
                  <Text style={{ marginLeft: 8 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Anything else we should know?</Text>
          <TextInput value={notes} onChangeText={setNotes} style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]} multiline />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button title="Proceed to Pay=======>>>>>>>" style={styles.payButton} textStyle={styles.payText} onPress={proceed} />
      </View>
    </View>
  );
};

export default ReserveTableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE },
  image: { width: '92%', height: 200, borderRadius: 16, alignSelf: 'center', marginTop: 15 },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 20 },
  summaryTitle: { fontFamily: Fonts.instrumentSansRegular, fontSize: 12, color: Colors.DARK_GREY },
  summaryText: { fontFamily: Fonts.instrumentSansMedium, fontSize: 14, color: Colors.BLACK, marginVertical: 6 },
  label: { fontFamily: Fonts.instrumentSansMedium, fontSize: 16, color: Colors.BLACK, marginTop: 16, marginBottom: 8 },
  textInput: { borderWidth: 1, borderColor: Colors.BORDERGREY, borderRadius: 10, paddingHorizontal: 12, height: 48, fontFamily: Fonts.instrumentSansRegular, fontSize: 15, color: Colors.BLACK },
  subSectionTitle: { fontFamily: Fonts.instrumentSansMedium, fontSize: 14, color: Colors.BLACK, marginTop: 16, marginBottom: 8 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxBox: { height: 18, width: 18, borderWidth: 1, borderColor: Colors.BORDERGREY, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: Colors.WHITE, paddingHorizontal: 16, paddingVertical: 12, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 8 },
  payButton: { backgroundColor: Colors.Muted_Gold, borderRadius: 30, paddingVertical: 10, width: '100%' },
  payText: { fontFamily: Fonts.instrumentSansMedium, color: Colors.WHITE, fontSize: 14 },
});
