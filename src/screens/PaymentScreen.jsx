import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { AppImages } from '../res';

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [guests, setGuests] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedMobile = await AsyncStorage.getItem('userMobile');
      if (storedName) setName(storedName);
      if (storedMobile) setMobile(storedMobile);
    };
    loadUser();
  }, []);

  const handleBooking = async () => {
    if (!guests || !date) {
      Alert.alert('Missing Details', 'Please fill all required fields.');
      return;
    }

    try {
      setLoading(true);
      // 1️⃣ Call backend to create booking intent
      const response = await axios.post(
        'https://your-backend-url.com/api/bookings/create',
        {
          amount: 500, // $5 in cents
          bookingDateTime: date.toISOString(),
          userId: mobile,
        }
      );

      const { clientSecret, bookingId } = response.data;

      // 2️⃣ Confirm card authorization
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        console.log(error);
        Alert.alert('Payment failed', error.message);
      } else if (paymentIntent) {
        console.log('✅ Authorized:', paymentIntent.id);
        Alert.alert(
          'Booking Successful',
          `Booking created! ID: ${bookingId}\nFunds are held and not yet charged.`
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <View>
    {/* <Text>ss</Text> */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>🍽️ Book a Table</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Number of Guests"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {`Booking Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Note (optional)"
          multiline
          value={note}
          onChangeText={setNote}
        />

        <Text style={styles.cardLabel}>Card Details</Text>
        <CardField
          postalCodeEnabled={false}
          placeholders={{ number: '4242 4242 4242 4242' }}
          cardStyle={{
            backgroundColor: '#fff',
            textColor: '#000',
          }}
          style={{ width: '100%', height: 50, marginVertical: 10 }}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleBooking}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Book & Hold Card'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
 </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d71b6b',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  cardLabel: {
    marginTop: 15,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    backgroundColor: '#d71b6b',
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
