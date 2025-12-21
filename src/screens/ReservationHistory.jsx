import React, { useEffect, useState } from 'react';
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
  Alert, // Use Alert for real cancellation attempts
} from 'react-native';
import moment from 'moment';
import ReserveHeader from '../components/ReserveHeader';
import axios from 'axios';
import baseURL from '../services/network/base_url';
import { showToast } from '../services/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicator from '../components/ActivityIndicator';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// --- 1. Constants and Colors ---
const Colors = {
  Muted_Gold: '#b8860b',
  Primary_Red: '#e63946',
  Light_Green: '#e0f7fa',
  Light_Gray: '#f5f5f5',
  Text_Dark: '#333',
  Text_Muted: '#666',
};

// --- 3. Dummy Array Data ---
const initialReservations = [
  {
    id: 'RES001',
    canCancel: true,
    numOfGuests: 4,
    dateTime: moment().add(3, 'hours').toISOString(), // **Within 24 hours** (Fee applies)
    occasion: ['Birthday', 'Casual Dinner'],
    userRestrictedDietary: ['Gluten-Free'],
    partyRestrictedDietary: ['Nut Allergy'],
    notes: 'Need a quiet table near the window.',
    amount: 2500.0,
    isPaid: true,
    cancellationFee: 500,
  },
  {
    id: 'RES002',
    canCancel: true,
    numOfGuests: 2,
    dateTime: moment().add(30, 'hours').toISOString(), // **After 24 hours** (No fee)
    occasion: ['Date Night'],
    userRestrictedDietary: [],
    partyRestrictedDietary: ['Vegetarian'],
    notes: 'Please ensure a cozy corner seat.',
    amount: 1200.0,
    isPaid: false,
    cancellationFee: 200,
  },
  {
    id: 'RES003',
    canCancel: true,
    numOfGuests: 5,
    dateTime: moment().subtract(2, 'days').toISOString(), // **Past Reservation** (Cannot cancel)
    occasion: ['Family Dinner'],
    userRestrictedDietary: [],
    partyRestrictedDietary: [],
    notes: '',
    amount: 3500.0,
    isPaid: true,
    cancellationFee: 700,
  },
  {
    id: 'RES004',
    canCancel: false, // **Cannot cancel flag** (Button hidden)
    numOfGuests: 3,
    dateTime: moment().add(10, 'days').toISOString(),
    occasion: ['Anniversary'],
    userRestrictedDietary: ['Dairy-Free'],
    partyRestrictedDietary: [],
    notes: 'Surprise celebration.',
    amount: 4000.0,
    isPaid: true,
    cancellationFee: 800,
  },
];

// --- 4. CustomModal Component ---
const CustomModal = ({
  visible,
  onClose,
  title,
  description,
  buttonText,
  onButtonPress,
  titleAlign = 'center',
  modalStyle,
  titleStyle,
  buttonStyle,
  showCloseIcon = true,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={[modalStyles.modalView, modalStyle]}>
          {showCloseIcon && (
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <Text style={{ fontSize: 18, color: Colors.Text_Dark }}>X</Text>
            </TouchableOpacity>
          )}

          <Text
            style={[
              modalStyles.modalTitle,
              { textAlign: titleAlign },
              titleStyle,
            ]}
          >
            {title}
          </Text>

          <Text style={modalStyles.modalDescription}>{description}</Text>

          <TouchableOpacity
            style={[modalStyles.button, buttonStyle]}
            onPress={onButtonPress}
          >
            <Text style={modalStyles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// --- 5. ReservationCard Component ---
const ReservationCard = ({
  reservation,
  handleCancellation,
  reservationId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reservationID, setReservationID] = useState('');

  // --- Date & Time Calculations ---
  const reservationTime = moment(reservation.date);
  const currentTime = moment();
  const isPastReservation = reservationTime.isBefore(currentTime);
  const hoursUntilReservation = reservationTime.diff(currentTime, 'hours');
  const isWithin24Hours =
    hoursUntilReservation < 24 && hoursUntilReservation > 0;

  // --- Modal Logic Setup ---
  let modalDescription = '';
  let cancellationPolicyApplies = false;

  if (isWithin24Hours) {
    cancellationPolicyApplies = true;
    modalDescription = `Are you sure you want to cancel this reservation? Per our policy, a cancellation fee of ₹${reservation.cancellationFee.toFixed(
      2,
    )} will be charged.`;
  } else {
    modalDescription =
      'Are you sure you want to cancel this reservation? No payment will be charged.';
  }

  const confirmCancel = () => {
    handleCancellation(reservation.id, cancellationPolicyApplies);
    setModalVisible(false);
  };

  // --- Conditional Rendering for Cancel Button ---
  const showCancelButton = reservation.canCancel && !isPastReservation;

  // Helper to render details
  const DetailRow = ({ label, value, valueStyle }) => (
    <View style={cardStyles.detailRow}>
      <Text style={cardStyles.detailLabel}>{label}</Text>
      <Text style={[cardStyles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );

  // Helper for Array details
  const renderArrayDetails = (title, items) =>
    items?.length > 0 && (
      <View style={cardStyles.arrayContainer}>
        <Text style={cardStyles.arrayTitle}>{title}:</Text>
        <Text style={cardStyles.arrayValue}>{items.join(', ')}</Text>
      </View>
    );

  const buttonBackgroundColor = cancellationPolicyApplies
    ? Colors.Primary_Red
    : Colors.Muted_Gold;

  return (
    <View style={cardStyles.card}>
      {/* Header */}
      <View
        style={[
          cardStyles.header,
          isPastReservation ? cardStyles.headerPast : cardStyles.headerUpcoming,
        ]}
      >
        <Text style={cardStyles.headerText}>
          Reservation ID: {reservation.id}
        </Text>
        {isPastReservation && (
          <Text style={cardStyles.completedTag}>Completed</Text>
        )}
      </View>

      <View style={cardStyles.body}>
        {/* Date and Time */}
        <View style={cardStyles.dateTimeContainer}>
          <Text style={cardStyles.sectionTitle}>Date & Time</Text>
          <Text style={cardStyles.dateTimeText}>
            {reservationTime.format('dddd, MMM Do YYYY')}
          </Text>
          <Text style={cardStyles.dateTimeText}>
            {reservation.time}
          </Text>
        </View>

        {/* Guests and Occasion */}
        <View style={cardStyles.guestOccasionContainer}>
          <DetailRow
            label="No. of Guests"
            value={reservation.partySize}
            valueStyle={{ fontSize: 20, fontWeight: 'bold' }}
          />
          {renderArrayDetails('Occasion(s)', reservation.occasion)}
        </View>

        <View style={cardStyles.divider} />

        {/* Dietary Restrictions */}
        <View>
          <Text style={cardStyles.sectionTitle}>Dietary Information</Text>
          {renderArrayDetails(
            'Your Restrictions',
            reservation.userRestrictedDietary,
          )}
          {renderArrayDetails(
            'Party Restrictions',
            reservation.partyRestrictedDietary,
          )}
        </View>

        <View style={cardStyles.divider} />

        {/* Notes and Payment */}
        <View style={cardStyles.notesPaymentContainer}>
          <Text style={cardStyles.sectionTitle}>Notes</Text>
          <Text style={cardStyles.notesText}>
            "{reservation.notes || 'No notes provided.'}"
          </Text>

          <View style={cardStyles.paymentRow}>
            <Text style={cardStyles.paymentLabel}>Total Amount:</Text>
            <Text style={cardStyles.paymentValue}>£{reservation.amount}</Text>
          </View>
          <View style={cardStyles.paymentRow}>
            <Text style={cardStyles.paymentLabel}>Payment Status:</Text>
            <Text
              style={[
                cardStyles.paymentStatus,
                { color: reservation.isPaid ? 'green' : Colors.Primary_Red },
              ]}
            >
              {reservation.isPaid ? 'Paid' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer and Action Button */}
      <View style={cardStyles.footer}>
        {showCancelButton ? (
          <TouchableOpacity
            style={cardStyles.cancelButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={cardStyles.cancelButtonText}>Cancel Reservation</Text>
          </TouchableOpacity>
        ) : (
          <Text style={cardStyles.noCancelText}>
            Cancellation is not available for this reservation.
          </Text>
        )}
      </View>

      {/* Cancellation Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Confirm Cancellation"
        description={modalDescription}
        buttonText={
          cancellationPolicyApplies
            ? `Confirm & Pay ₹${reservation.cancellationFee.toFixed(2)}`
            : 'Confirm Cancellation'
        }
        onButtonPress={confirmCancel}
        modalStyle={{ backgroundColor: '#ffffff' }}
        titleStyle={{ color: Colors.Primary_Red }}
        buttonStyle={{ backgroundColor: buttonBackgroundColor }}
        showCloseIcon={true}
      />
    </View>
  );
};

// --- 6. Main Screen Component ---
const ReservationsHistory = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const membershipNum = useSelector(state => state.auth.membershipNumber);
  const tokenR  = useSelector(state => state.auth?.token)

 useEffect(() => {
  if (tokenR) {
    fetchReservations(tokenR);
  }
}, [tokenR]);

  // ✅ GET all reservations
 const fetchReservations = async (authToken) => {
  setLoading(true);

  try {
    const response = await axios.get(
      `${baseURL.base_url1}reservations/get_reservations`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    setReservations(response.data?.data || []);
  } catch (error) {
    console.log('Error fetching reservations:', error);
    showToast('error', 'Failed to fetch reservations.');
  } finally {
    setLoading(false);
  }
};

  // ✅ Refresh control logic
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReservations(token);
    setRefreshing(false);
  };

  // ✅ Cancel reservation API
  const handleCancellation = async (reservationId, feeApplied) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${baseURL.base_url1}reservations/cancellation_reservation`,
        {
          reservationId: reservationId,
          cancel: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Reservation cancelled successfully:', response.data);

      const message = feeApplied
        ? 'Cancellation successful! A small fee was deducted.'
        : 'Reservation cancelled successfully.';

      showToast('success', message);

      // Update list to remove cancelled reservation
      setReservations(prev => prev.filter(res => res.id !== reservationId));
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      showToast('error', 'Error cancelling reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ReserveHeader
        containerStyle={{ top: 0, paddingHorizontal: 0 }}
        title={'My Bookings'}
        onBack={() => navigation.goBack()}
      />

      {/* Loader Overlay */}
      {loading && (
        <View style={screenStyles.loaderOverlay}>
          <ActivityIndicator size="large" color={Colors.Muted_Gold} />
          <Text style={screenStyles.loaderText}>Processing...</Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={screenStyles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.Muted_Gold}
          />
        }
      >
        {reservations.length > 0
          ? reservations.map(res => (
              <ReservationCard
                key={res.id}
                reservation={res}
                handleCancellation={handleCancellation}
              />
            ))
          : !loading && (
              <Text style={screenStyles.noReservationsText}>
                You have no active reservations.
              </Text>
            )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// --- 7. Stylesheets ---

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.Light_Gray,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.Text_Dark,
    padding: 15,
  },
  noReservationsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.Text_Muted,
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 5,
  },
  modalTitle: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.Primary_Red,
  },
  modalDescription: {
    marginBottom: 25,
    textAlign: 'center',
    color: Colors.Text_Muted,
    fontSize: 15,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.Muted_Gold,
    // marginHorizontal: width * 0.05,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerUpcoming: {
    backgroundColor: Colors.Muted_Gold,
  },
  headerPast: {
    backgroundColor: Colors.Light_Gray,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  completedTag: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#fbe9e7',
    color: Colors.Primary_Red,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
  body: {
    padding: 15,
  },
  dateTimeContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  guestOccasionContainer: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.Text_Dark,
    marginBottom: 5,
  },
  dateTimeText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.Muted_Gold,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.Text_Dark,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#000',
  },
  arrayContainer: {
    marginTop: 5,
  },
  arrayTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.Text_Muted,
  },
  arrayValue: {
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  notesPaymentContainer: {
    paddingTop: 5,
  },
  notesText: {
    color: Colors.Text_Muted,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  paymentLabel: {
    fontWeight: '600',
    color: Colors.Text_Dark,
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  paymentStatus: {
    fontWeight: 'bold',
  },
  footer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    alignItems: 'flex-end',
  },
  cancelButton: {
    backgroundColor: Colors.Primary_Red,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noCancelText: {
    fontSize: 14,
    color: '#888',
  },
});

export default ReservationsHistory;
