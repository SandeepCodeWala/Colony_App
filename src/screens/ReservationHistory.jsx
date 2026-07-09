import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
// Stripe Import
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import moment from 'moment';
import ReserveHeader from '../components/ReserveHeader';
import axios from 'axios';
import baseURL from '../services/network/base_url';
import { showToast } from '../services/Toast';
import ActivityIndicator from '../components/ActivityIndicator';
import PremiumTheme from '../res/PremiumTheme';
import { useSelector } from 'react-redux';
import SettingHeader from '../components/SettingHeader';

const { width } = Dimensions.get('window');

// --- 1. Colors Configuration ---
const Colors = {
  Muted_Gold: PremiumTheme.gold,
  Primary_Red: PremiumTheme.danger,
  Light_Gray: PremiumTheme.paper,
  Text_Dark: PremiumTheme.ink,
  Text_Muted: PremiumTheme.muted,
  Success_Green: PremiumTheme.success,
};

// --- 2. ReservationCard Sub-Component ---
const ReservationCard = ({ reservation, onCancelAction }) => {
  // 1. Combine Date and Time strings (e.g., "2025-12-28" and "20:18")
  // Format depends on your API, usually 'YYYY-MM-DD HH:mm'
  const reservationDateTime = moment(
    `${reservation.date} ${reservation.time}`,
    'YYYY-MM-DD HH:mm',
  );
  const currentTime = moment();

  // 2. Calculate the difference in hours
  const hoursUntil = reservationDateTime.diff(currentTime, 'hours');

  // 3. Logic:
  // - If hoursUntil is between 0 and 24, it's a "Late Cancellation" (Apply Fee)
  // - If hoursUntil is > 24, it's a "Free Cancellation"
  // - If hoursUntil < 0, it's a "Past Reservation" (Cannot Cancel)

  const isPast = hoursUntil < 0;
  const isWithin24Hours = hoursUntil >= 0 && hoursUntil < 24;

  return (
    <View style={cardStyles.card}>
      <View
        style={[
          cardStyles.header,
          isPast ? cardStyles.headerPast : cardStyles.headerUpcoming,
        ]}
      >
        <Text style={cardStyles.headerText}>ID: {reservation.id}</Text>
        {isPast && <Text style={cardStyles.completedTag}>Completed</Text>}
      </View>

      <View style={cardStyles.body}>
        <View style={cardStyles.dateTimeContainer}>
          <Text style={cardStyles.sectionTitle}>Reservation For</Text>
          <Text style={cardStyles.dateTimeText}>
            {reservationDateTime.format('ddd, MMM Do YYYY')}
          </Text>
          <Text style={cardStyles.dateTimeText}>
            {reservationDateTime.format('hh:mm A')}
          </Text>
        </View>

        <View style={cardStyles.divider} />

        <View style={cardStyles.paymentRow}>
          <Text style={cardStyles.paymentLabel}>Current Status:</Text>
          <Text
            style={[
              cardStyles.paymentStatus,
              {
                color: reservation.isPaid
                  ? Colors.Success_Green
                  : Colors.Primary_Red,
              },
            ]}
          >
            {reservation.isPaid ? 'Paid & Confirmed' : 'Pending'}
          </Text>
        </View>
      </View>

      {!isPast && (
        <View style={cardStyles.footer}>
          {isWithin24Hours && (
            <Text style={cardStyles.warningText}>
              * Late cancellation fee applies
            </Text>
          )}
          <TouchableOpacity
            style={[
              cardStyles.cancelButton,
              isWithin24Hours && { backgroundColor: Colors.Primary_Red },
            ]}
            onPress={() => onCancelAction(reservation.id, isWithin24Hours)}
          >
            <Text style={cardStyles.cancelButtonText}>
              {isWithin24Hours ? 'Cancel & Pay Fee' : 'Cancel Reservation'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- 3. Main Screen Component ---
const ReservationsHistory = ({ navigation }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tokenR = useSelector(state => state.auth?.token);

  const fetchReservations = useCallback(async () => {
    if (!tokenR) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL.base_url1}reservations/get_reservations`,
        {
          headers: { Authorization: `Bearer ${tokenR}` },
        },
      );
      setReservations(response.data?.data || []);
    } catch (error) {
      showToast('error', 'Failed to fetch reservations.');
    } finally {
      setLoading(false);
    }
  }, [tokenR]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCancellationAction = async (reservationId, isWithin24Hours) => {
    setLoading(true); // Starts "Processing..."
    try {
      const response = await axios.put(
        `${baseURL.base_url1}reservations/cancellation_reservation`,
        { reservationId, cancel: true },
        { headers: { Authorization: `Bearer ${tokenR}` } },
      );

      if (response.data?.requiresPayment) {
        const { paymentIntent, customer, ephemeralKey } = response.data;

        // 1. Initialize the sheet
        const { error: initError } = await initPaymentSheet({
          merchantDisplayName: 'Colony Restaurant',
          customerId: customer,
          customerEphemeralKeySecret: ephemeralKey,
          paymentIntentClientSecret: paymentIntent,
          allowsDelayedPaymentMethods: false,
          appearance: { colors: { primary: Colors.Muted_Gold } },
        });

        if (initError) {
          setLoading(false); // STOP processing if init fails
          showToast('error', `Init Error: ${initError.message}`);
          return;
        }

        // 2. Present the sheet
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          setLoading(false); // STOP processing if user cancels or card fails
          if (paymentError.code !== 'Canceled') {
            showToast('error', paymentError.message);
          }
          return;
        }
      }

      // 3. Success
      showToast('success', 'Reservation Cancelled');
      fetchReservations();
    } catch (error) {
      setLoading(false); // STOP processing on API error
      showToast('error', error?.response?.data?.message || 'Server Error');
    } finally {
      setLoading(false); // Ensures "Processing" disappears no matter what
    }
  };

  return (
    <StripeProvider
      publishableKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
    >
      <SafeAreaView style={screenStyles.container}>
        {/* <ReserveHeader title={'My Bookings'} onBack={() => navigation.goBack()} /> */}
        <SettingHeader title="My Bookings" onBack={() => navigation.goBack()} />
        {loading && (
          <View style={screenStyles.loaderOverlay}>
            <ActivityIndicator size="large" color={Colors.Muted_Gold} />
            <Text style={screenStyles.loaderText}>Processing...</Text>
          </View>
        )}

        <ScrollView
          contentContainerStyle={screenStyles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchReservations}
              tintColor={Colors.Muted_Gold}
            />
          }
        >
          {reservations.length > 0
            ? reservations.map(res => (
                <ReservationCard
                  key={res.id}
                  reservation={res}
                  onCancelAction={handleCancellationAction}
                />
              ))
            : !loading && (
                <Text style={screenStyles.noDataText}>
                  No active reservations found.
                </Text>
              )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </StripeProvider>
  );
};

// --- 4. All Stylesheet Sections ---
const screenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumTheme.paper },
  scrollContent: { padding: 18, paddingBottom: 80 },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(247,241,232,0.78)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: Colors.Muted_Gold,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 50,
    color: Colors.Text_Muted,
    fontSize: 16,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: PremiumTheme.glass,
    borderRadius: 30,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: PremiumTheme.border,
    elevation: 4,
    shadowColor: PremiumTheme.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    overflow: 'hidden',
  },
  warningText: {
    color: Colors.Primary_Red,
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 5,
    marginRight: 10,
  },
  paymentStatus: { fontWeight: 'bold', fontSize: 14 },
  footer: {
    padding: 14,
    backgroundColor: PremiumTheme.surfaceSoft,
    borderTopWidth: 1,
    borderTopColor: PremiumTheme.line,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerUpcoming: { backgroundColor: PremiumTheme.primary },
  headerPast: { backgroundColor: PremiumTheme.champagne },
  headerText: { color: PremiumTheme.surface, fontWeight: 'bold', letterSpacing: 0.6 },
  completedTag: {
    color: PremiumTheme.ink,
    fontSize: 10,
    backgroundColor: PremiumTheme.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  body: { padding: 16 },
  sectionTitle: {
    fontSize: 11,
    color: PremiumTheme.primary,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dateTimeText: { fontSize: 16, color: PremiumTheme.ink, fontWeight: 'bold' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  detailLabel: { color: Colors.Text_Dark },
  detailValue: { fontWeight: 'bold', color: PremiumTheme.ink },
  notesText: {
    fontStyle: 'italic',
    color: PremiumTheme.muted,
    marginTop: 10,
    fontSize: 13,
  },
  divider: { height: 1, backgroundColor: PremiumTheme.line, marginVertical: 15 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentLabel: { fontWeight: '600', color: PremiumTheme.muted },
  cancelButton: {
    backgroundColor: Colors.Primary_Red,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  cancelButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 },
});

export default ReservationsHistory;
