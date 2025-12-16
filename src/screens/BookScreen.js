import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, AppImages } from '../res';
import Button from '../components/Button'; // 👈 Reusable button
import ReserveHeader from '../components/ReserveHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../services/Toast';
import { useSelector } from 'react-redux';

const BookScreen = () => {
  const navigation = useNavigation();

  // ✅ Get stored user and membership number from Redux correctly
const user = useSelector(state => state.auth?.user);
const membershipNumber = useSelector(state => state.auth?.membershipNumber);
const fullState = useSelector(state => state);
console.log("FULL REDUX STATE:", fullState);

  // Local UI states
  const [UserName, setUserName] = React.useState('');
  const [membership, setMembership] = React.useState('');

  // When Redux updates → update UI
useEffect(() => {
  if (user?.name) {
    setUserName(user.name);
  }
  
  if (membershipNumber) {
    setMembership(membershipNumber);
  }
}, [user, membershipNumber]);

 

 const handleReserveTable = () => {
  if (user?.membership_number || membershipNumber) {
    navigation.navigate('ReserveLounge', { screen: 'table' });
  } else {
    navigation.navigate('Login');
    showToast('error', 'User details not found. Please log in again.');
  }
};
  return (
    <View style={styles.container}>
      {/* ---------- Header ---------- */}
      <ReserveHeader title={'Book'} onBack={() => navigation.goBack()} />

      {/* ---------- Content ---------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={{ marginTop: 10 }}>
          {/* ---------- Lounge Section ---------- */}
          <View style={styles.card}>
            <ImageBackground
              source={AppImages.lounge}
              imageStyle={{ borderRadius: 16 }}
              style={styles.imageCard}
            >
              <View style={styles.overlay} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>LOUNGE</Text>
                <Text style={styles.description}>
                  Relax, unwind, and enjoy every moment as we serve comfort,
                  luxury, and happiness—one refreshing sip and soothing vibe at
                  a time.
                </Text>

                {/* Only the button is touchable */}
                <Button
                  title="Reserve a Lounge"
                  style={styles.reserveButton}
                  textStyle={styles.reserveText}
                  onPress={() => handleReserveLounge()}
                />
              </View>
            </ImageBackground>
          </View>

          {/* ---------- Restaurant Section ---------- */}
          <View style={[styles.card, { marginTop: 24 }]}>
            <ImageBackground
              source={AppImages.restaurant}
              imageStyle={{ borderRadius: 16 }}
              style={styles.imageCard}
            >
              <View style={styles.overlay} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>RESTAURANT</Text>
                <Text style={styles.description}>
                  We bring joy to your table every day, crafting memorable
                  dining experiences with love, flavor, and one delicious plate
                  at a time.
                </Text>

                {/* Only the button is touchable */}
                <Button
                  title="Reserve a Table"
                  style={styles.reserveButton}
                  textStyle={styles.reserveText}
                  onPress={() => handleReserveTable()}
                />
              </View>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 45,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  bellIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.BLACK,
  },
  headerTitle: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 20,
    color: Colors.BLACK,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageCard: {
    width: '100%',
    height: 270,
    justifyContent: 'flex-end', // Content at bottom
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  textContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.instrumentSansBold,
    fontSize: 24,
    color: Colors.WHITE,
    letterSpacing: 1,
  },
  description: {
    fontFamily: Fonts.instrumentSansRegular,
    fontSize: 14,
    color: Colors.WHITE,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  reserveButton: {
    backgroundColor: Colors.Muted_Gold,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 15,
  },
  reserveText: {
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 14,
    color: Colors.WHITE,
  },
});
