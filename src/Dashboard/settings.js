import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import ReserveHeader from '../components/ReserveHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
 
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const membershipNumber = useSelector(state => state.auth.membershipNumber);
  const [UserName, setUserName] = React.useState('');
  const [membership, setMembershipNumber] = React.useState('');
  console.log('Membership Number from Redux:', membershipNumber);

  const menuItems = [
  { id: 1, title: 'Edit Profile',onPress:()=>navigation.navigate("EditProfile") },
   { id: 10, title: 'My Reservations',onPress:()=>navigation.navigate("ReservationHistory") },
  { id: 2, title: 'My Statement',onPress:()=>navigation.navigate("MyStatement")  },
  { id: 3, title: 'My Benefits',onPress:()=>navigation.navigate("MyBenefits")  },
  { id: 4, title: 'Registered Offers',onPress:()=>navigation.navigate("RegisteredOffers") },
  { id: 5, title: 'Change Password',onPress:()=>navigation.navigate("ChangePassword") },
  { id: 6, title: 'Manage Your Consent',onPress:()=>navigation.navigate("ReservationHistory") },
  { id: 7, title: 'Settings',onPress:()=>navigation.navigate("ReservationHistory") },
  { id: 8, title: 'Terms & Conditions',onPress:()=>navigation.navigate("ReservationHistory") },
  { id: 9, title: 'Help & Support',onPress:()=>navigation.navigate("ReservationHistory") },
];

  useEffect(() => {
    fetchUser();
    // Any side effects if needed
  }, []);

  const fetchUser = async () => {
    const UserName = await AsyncStorage.getItem('name');
    console.log('Fetched User Name:', UserName);
    const membershipNum = await AsyncStorage.getItem('membershipNumber');
    setUserName(UserName);
    setMembershipNumber(membershipNum);
    // Fetch user data logic here
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('BottomTabs', { screen: 'Explore' });
    // Navigate to login or onboarding screen if needed
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ReserveHeader title={'Profile'} onBack={() => navigation.goBack()} />

      {/* Background top image */}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Box */}
        <View style={{ height: 220 }}>
          <View style={styles.topBanner}>
            <View style={styles.profileBox}>
              <Image
                source={{
                  uri: 'https://i.pravatar.cc/150?img=45',
                }}
                style={styles.profileImage}
              />

              <Text style={styles.profileName}>{UserName || 'NA'}</Text>
              <Text style={styles.profileId}>
                Membership no. {membershipNumber || membership}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {/* Menu Options */}
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} onPress={item?.onPress} style={styles.menuRow}>
              <Text style={styles.menuText}>{item.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Logout */}
          <TouchableOpacity onPress={()=>logout()} style={[styles.menuRow, styles.logoutRow]}>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  // HEADER
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 22,
    color: '#000',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },

  // TOP BACKGROUND BANNER
  topBanner: {
    width: width,
    height: 110,
    backgroundColor: '#E8E2D3',
  },

  // PROFILE BOX
  profileBox: {
    marginTop: 50,
    alignItems: 'center',
  },

  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 100,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    color: '#000',
  },
  profileId: {
    marginTop: 4,
    fontSize: 13,
    color: '#7A7A7A',
  },

  // MENU ROWS
  menuRow: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 12,
    paddingVertical: 17,
    paddingHorizontal: 18,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },

  menuText: {
    fontSize: 15,
    color: '#000',
  },

  arrow: {
    fontSize: 22,
    color: '#B1B1B1',
  },

  // LOGOUT
  logoutRow: {
    backgroundColor: '#FFF3F3',
  },
  logoutText: {
    color: '#D30000',
    fontWeight: '500',
  },
});
