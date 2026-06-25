import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert, // Added missing import
  ActivityIndicator, // Added missing import
} from 'react-native';

import ReserveHeader from '../components/ReserveHeader';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slices/authSlice'; 
import { postApi } from '../services/network/api';
import { Fonts, Colors } from '../res'; // Assuming these exist in your project

const { width } = Dimensions.get('window');

export default function Settings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Selectors from Redux
  const membershipNumber = useSelector(state => state.auth.membershipNumber);
  const name = useSelector(state => state.auth.user?.name || 'Member');
  const token = useSelector((state) => state.auth.token);

  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    { id: 1, title: 'Edit Profile', onPress: () => navigation.navigate("EditProfile") },
    { id: 10, title: 'My Reservations', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 2, title: 'My Statement', onPress: () => navigation.navigate("MyStatement") },
    { id: 3, title: 'My Benefits', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 4, title: 'Registered Offers', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 5, title: 'Change Password', onPress: () => navigation.navigate("ChangePassword") },
    { id: 6, title: 'Manage Your Consent', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 7, title: 'Settings', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 8, title: 'Terms & Conditions', onPress: () => navigation.navigate("ReservationHistory") },
    { id: 9, title: 'Help & Support', onPress: () => navigation.navigate("ReservationHistory") },
  ];

  const handleLogout = () => {
    // This now works because Alert is imported
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of Colony?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Passing token for backend middleware identification
              const response = await postApi('logout', {}, token); 

              // Clear Redux state
              dispatch(logout());

              if (response?.success) {
                console.log("Logged out from server successfully");
              }
            } catch (error) {
              console.error("Logout API failed:", error);
              // Force local logout if network fails
              dispatch(logout()); 
            } finally {
              setIsLoading(false);
              // Navigate to Login screen
              navigation.navigate('Login');
            }
          } 
        },
      ]
    );
  };

  //   const handleDeleteAccount = () => {
  //   // This now works because Alert is imported
  //   Alert.alert(
  //     'Delete Account',
  //     'Are you sure you want to delete your account?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { 
  //         text: 'Delete', 
  //         style: 'destructive',
  //         onPress: async () => {
  //           setIsLoading(true);
  //           try {
  //             // Passing token for backend middleware identification
  //             const response = await postApi('logout', {}, token); 

  //             // Clear Redux state
  //             dispatch(logout());

  //             if (response?.success) {
  //               console.log("Logged out from server successfully");
  //             }
  //           } catch (error) {
  //             console.error("Logout API failed:", error);
  //             // Force local logout if network fails
  //             dispatch(logout()); 
  //           } finally {
  //             setIsLoading(false);
  //             // Navigate to Login screen
  //             navigation.navigate('Login');
  //           }
  //         } 
  //       },
  //     ]
  //   );
  // };



  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // 1. Hit the dedicated delete profile endpoint using the bearer token
              const response = await postApi('wipe-profile', {}, token); 

              if (response?.success) {
                console.log("Account wiped from server successfully");
                // 2. Clear Redux state only after a successful server deletion
                dispatch(logout());
                navigation.navigate('Signup');
              } else {
                // Handle case where server sent a 400/500 validation failure
                Alert.alert("Error", response?.message || "Could not delete account. Please try again.");
              }
            } catch (error) {
              console.error("Delete Account API failed:", error);
              Alert.alert(
                "Connection Error", 
                "Failed to delete your account from the server. Please check your internet connection."
              );
            } finally {
              setIsLoading(false);
            }
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <ReserveHeader title={'Settings'} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Profile Box */}
        <View style={{ height: 220 }}>
          <View style={styles.topBanner}>
            <View style={styles.profileBox}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=45' }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileId}>
                Membership no. {membershipNumber || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 10 }}>
          {/* Menu Options */}
          {menuItems.map(item => (
            <TouchableOpacity key={item.id} onPress={item?.onPress} style={styles.menuRow}>
              <Text style={styles.menuText}>{item.title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.menuRow, styles.logoutRow]} 
            onPress={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#D30000" />
            ) : (
              <View style={styles.logoutContent}>
                <Text style={styles.logoutText}>Logout</Text>
                <Text style={[styles.arrow, { color: '#D30000' }]}>›</Text>
              </View>
            )}
          </TouchableOpacity>
             <TouchableOpacity 
            style={[styles.menuRow, styles.logoutRow]} 
            onPress={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#D30000" />
            ) : (
              <View style={styles.logoutContent}>
                <Text style={styles.logoutText}>Delete Account</Text>
                <Text style={[styles.arrow, { color: '#D30000' }]}>›</Text>
              </View>
            )}
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
  topBanner: {
    width: width,
    height: 110,
    backgroundColor: '#E8E2D3',
  },
  profileBox: {
    marginTop: 50,
    alignItems: 'center',
  },
  profileImage: {
    width: 95,
    height: 95,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#FFF',
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
  logoutRow: {
    backgroundColor: '#FFF3F3', // Light red tint for logout
    marginBottom: 20,
  },
  logoutContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    flex: 1, 
    alignItems: 'center'
  },
  logoutText: {
    color: '#D30000',
    fontWeight: '600',
    fontSize: 15,
  },
});