import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import rightic from '../res/images/icons/Right.png'
import leftic from '../res/images/icons/Left.png';
import bell from '../res/images/icons/Bell.png';
import { AppImages, Colors, Fonts } from '../res';


const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    { title: 'Edit Profile',
      screen: 'ChangePassword'

    },
    { title: 'My Statement',
      screen:'EditProfile'

     },
    { title: 'My Benefits',
      screen:'HelpSupport'

     },
    { title: 'Registered offers',
      screen:'ManageConsents'
    },
    { title: 'Change Password',
      screen:'MyStatement'
     },
    { title: 'Manage Your Consent',
      screen:'RegisteredOffice'
     },
    { title: 'Settings',
      screen:'Settings'
     },
    { title: 'Terms & Conditions',
      screen:'TermsConditions'
    },
    { title: 'Help & Support' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
           <Image
              source={leftic}
              style={{ width: 20, height: 20, tintColor: '#777' }}
              resizeMode="contain"
            />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
     <Image
              source={bell}
              style={{ width: 20, height: 20, tintColor: '#777' }}
              resizeMode="contain"
            />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Text style={styles.profileName}>Ankit Sharma</Text>
        <Text style={styles.membership}>Membership no. 2007562529</Text>
      </View>

      {/* Menu List */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}  // 👈 Navigate here
          >
            <Text style={styles.menuText}>{item.title}</Text>
            <Image
              source={rightic}
              style={{ width: 20, height: 20, tintColor: '#777' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    marginTop: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  membership: {
    fontSize: 13,
    color: '#9e8e64',
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 1,
  },
  menuText: {
    fontSize: 16,
    color:Colors.BLACK,
  },
  logoutButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 1,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
});
