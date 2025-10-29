import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { postApi } from '../services/network/api'; // same as in SignUp
import { Alert } from 'react-native'; // for RN alert style (if you're using web, use window.alert)

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function ReservationFormInner() {
  const stripe = useStripe();
  const elements = useElements();

  const { user, token } = useSelector(state => state.auth); // get user/token from redux

  const [form, setForm] = useState({
    date: '',
    time: '',
    partySize: 1,
    note: '',
  });
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create Payment Intent (backend)
      const paymentRes = await postApi(
        'reservations/create-payment',
        {
          date: form.date,
          time: form.time,
          partySize: form.partySize,
          note: form.note,
          amount: 1000, // test amount in pence (£10.00)
        },
        token // pass token for Authorization header
      );

      if (!paymentRes?.success && !paymentRes?.clientSecret) {
        throw new Error(paymentRes?.message || 'Payment creation failed');
      }

      const clientSecret = paymentRes.clientSecret;
      const cardElement = elements.getElement(CardElement);

      // 2️⃣ Confirm payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.name || 'Customer',
            email: user?.email || 'test@example.com',
          },
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message);
      }

      if (paymentResult.paymentIntent.status === 'succeeded') {
        // 3️⃣ Confirm reservation on backend
        const confirmRes = await postApi(
          'reservations/confirm',
          {
            date: form.date,
            time: form.time,
            partySize: form.partySize,
            note: form.note,
            paymentIntentId: paymentResult.paymentIntent.id,
          },
          token
        );

        if (!confirmRes?.success && !confirmRes?.reservationId) {
          throw new Error(confirmRes?.message || 'Reservation confirmation failed');
        }

        Alert.alert('Success', `✅ Reservation confirmed! Ref: ${confirmRes.reservationId}`);
        setForm({ date: '', time: '', partySize: 1, note: '' });
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
      <h2>Reserve a Table</h2>

      <label>Date</label>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={onChange}
        required
      />

      <label>Time</label>
      <input
        type="time"
        name="time"
        value={form.time}
        onChange={onChange}
        required
      />

      <label>Party Size</label>
      <input
        type="number"
        name="partySize"
        min="1"
        max="20"
        value={form.partySize}
        onChange={onChange}
        required
      />

      <label>Note (optional)</label>
      <textarea
        name="note"
        value={form.note}
        onChange={onChange}
      />

      <label>Card Details</label>
      <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: 12,
          backgroundColor: '#000',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 6,
          border: 'none',
        }}
      >
        {loading ? 'Processing…' : 'Reserve & Pay (test)'}
      </button>
    </form>
  );
}

export default function ReservationForm() {
  return (
    <Elements stripe={stripePromise}>
      <ReservationFormInner />
    </Elements>
  );
}
