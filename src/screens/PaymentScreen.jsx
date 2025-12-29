import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';

export default function CardDetailsScreen() {
  const { confirmSetupIntent } = useStripe();
  const [loading, setLoading] = useState(false);

  const saveCardForAutoPay = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get SetupIntent client secret from backend
      const response = await fetch('https://aa5c98955f8d.ngrok-free.app/reservations/create-setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      
      });
console.log(response,"response client secret response")
      const { clientSecret } = await response.json();
console.log(clientSecret,"----clientSecret")
      // 2️⃣ Confirm setup intent (OTP happens here if needed)
      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert('Success', 'Card saved for auto-pay!');
      console.log('Saved PaymentMethod:', setupIntent);

    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <CardField
        postalCodeEnabled={false}
        style={{ height: 50, marginVertical: 30 }}
      />

      <Button
        title={loading ? 'Saving...' : 'Save Card'}
        onPress={saveCardForAutoPay}
        disabled={loading}
      />
    </View>
  );
}