import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useStripe,
  StripeError, // Import for better type handling if needed
} from '@stripe/stripe-react-native'; // Cleaned up imports
import Button from '../components/Button';
import { Colors } from '../res'; // Assuming Colors is imported correctly

// --- IMPORTANT: DUMMY SERVER FUNCTION ---
// In a REAL application, this function MUST be implemented on your secured backend server.
// It securely creates a PaymentIntent and a Customer in Stripe, and returns the clientSecret,
// ephemeralKey, and customer ID.
const fetchPaymentIntentClientSecret = async amountInCents => {
  try {
    const response = await fetch('http://localhost:3000/create-payment-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInCents }),
    });

    const data = await response.json();

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
    console.error('❌ Failed to fetch payment intent:', error);
    return null;
  }

  // // PLACEHOLDER: Returning dummy data to allow the initialization to proceed
  // return {
  //   clientSecret: 'pi_3Nz0HyGABCD12345_secret_67890xyzABCDE',
  //   ephemeralKey: 'ek_test_1Nz0HyGABCD12345',
  //   customer: 'cus_PqrSTUvWxYZaBC',
  // };
};

const PaymentGatewayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Ensure totalAmount is safely accessed and is in cents
  const { totalAmount = 0 } = route.params || {};

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(true);
  const [sheetInitialized, setSheetInitialized] = useState(false);

  // 1. Initialize the Payment Sheet on component mount
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    setLoading(true);

    // Fetch the client secret, ephemeral key, and customer ID from your server
    const data = await fetchPaymentIntentClientSecret(totalAmount);
    console.log('Payment setup data from server:', data);

    if (!data || !data.clientSecret || !data.ephemeralKey || !data.customer) {
      Alert.alert(
        'Setup Error',
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
      Alert.alert(
        `Error initializing payment sheet: ${error.code}`,
        error.message,
      );
    } else {
      setSheetInitialized(true);
    }
    setLoading(false);
  };

  // 2. Handle the "Pay Now" action
  const openPaymentSheet = async () => {
    if (!sheetInitialized) {
      Alert.alert(
        'Wait',
        'Payment system is still initializing. Please try again in a moment.',
      );
      return;
    }

    setLoading(true);

    const { error } = await presentPaymentSheet();

    setLoading(false);

    if (error) {
      if (error.code !== 'Canceled') {
        // Ignore user cancellation of the sheet
        console.log(`Payment Failed: ${error.code}`, error.message);
      }
    } else {
      // Payment was successful or processing started
      Alert.alert(
        'Success!',
        'Your payment was successfully processed and booking is confirmed.',
      );
      // Navigate to the success screen
      navigation.navigate('BottomTabs');
    }
  };

  // Format amount for display
  const displayAmount = (totalAmount / 100).toFixed(2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm & Pay</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.Muted_Gold || '#D4AF37'}
          />
          <Text style={styles.loadingText}>Initializing Payment...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.amount}>Total: {displayAmount} AED</Text>

          <Text style={styles.infoText}>
            Your payment is processed securely via Stripe. Tap "Pay Now" to
            continue.
          </Text>

          <Button
            title={'Pay Now'}
            style={styles.payButton}
            textStyle={styles.payText}
            onPress={openPaymentSheet}
            // Disable if sheet wasn't initialized successfully
            disabled={!sheetInitialized}
          />
          {!sheetInitialized && (
            <Text style={styles.errorText}>
              Payment setup failed. Please try reloading the screen.
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default PaymentGatewayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.WHITE || '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150, // Ensure it has a visible space
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.BLACK || '#000000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.BLACK || '#000000',
  },
  amount: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 30,
    color: Colors.GREEN || '#34C759',
    padding: 10,
    backgroundColor: Colors.LIGHT_GREY || '#f0f0f0',
    borderRadius: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: Colors.GREY || '#8e8e93',
    marginBottom: 40,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.RED || '#FF3B30',
    marginTop: 15,
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: Colors.Muted_Gold || '#D4AF37',
    borderRadius: 12,
    marginTop: 20,
    height: 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  payText: {
    color: Colors.WHITE || '#ffffff',
    fontWeight: '700',
    fontSize: 18,
  },
});
