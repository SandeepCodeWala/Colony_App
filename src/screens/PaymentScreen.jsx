







import React, { useState } from 'react';

import { View, Button, Alert } from 'react-native';

import { CardField, useStripe } from '@stripe/stripe-react-native';



export default function CardDetailsScreen({ route, navigation }) { // Pass reservationId as prop

  const { confirmSetupIntent } = useStripe();

  const [loading, setLoading] = useState(false);

  const { reservationId } = route.params || {};



  const saveCardForAutoPay = async () => {

    if (!reservationId) {

      console.error("CRITICAL: No reservationId found in props!");

      Alert.alert('Error', 'Reservation ID missing. Please restart the booking.');

      return;

    }

    try {

      setLoading(true);

      console.log("--- Starting Save Card Process ---");



      // 1️⃣ Get SetupIntent client secret from backend

      // Note: Make sure your backend create-setup-intent also returns the 'customer' ID

      const response = await fetch(`https://1dcd4f52f9cf.ngrok-free.app/reservations/create-setup-intent`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

      });



      const setupData = await response.json();

      console.log("1. Backend SetupData Response:", setupData);



      const { clientSecret, customer } = setupData;



      if (!clientSecret) {

        throw new Error("Missing clientSecret from backend");

      }



      // 2️⃣ Confirm setup intent with Stripe (This is where the card is validated)

      console.log("2. Confirming SetupIntent with Stripe...");

      const { setupIntent, error } = await confirmSetupIntent(clientSecret, {

        paymentMethodType: 'Card',

      });



      if (error) {

        console.error("Stripe confirmSetupIntent Error:", error);

        Alert.alert('Stripe Error', error.message);

        return;

      }



      console.log("3. Stripe SetupIntent Success:", setupIntent);

      const paymentMethodId = setupIntent.paymentMethodId;



      // 3️⃣ Store IDs in your Reservation table

      console.log("4. Sending IDs to backend store-card API...", {

        reservationId,

        stripeCustomerId: customer,

        stripePaymentMethodId: paymentMethodId

      });



      const storeResponse = await fetch(`https://1dcd4f52f9cf.ngrok-free.app/reservations/store-card`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          reservationId: reservationId, // Ensure this is not null

          stripeCustomerId: customer,

          stripePaymentMethodId: paymentMethodId,

        }),

      });



      const storeResult = await storeResponse.json();

      console.log("5. Final Database Store Result:", storeResult);



      if (storeResponse.ok) {

        Alert.alert('Success', 'Card saved and linked to reservation!');

      } else {

        throw new Error(storeResult.message || "Failed to store card in database");

      }



    } catch (err) {

      console.error("Frontend Process Error:", err);

      Alert.alert('Process Error', err.message);

    } finally {

      setLoading(false);

      console.log("--- End Save Card Process ---");

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
