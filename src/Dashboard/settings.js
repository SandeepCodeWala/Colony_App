import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slices/authSlice';
import { postApi } from '../services/network/api';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { CravPage, PremiumCard } from '../components/CravPremium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function Settings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const membershipNumber = useSelector(
    state => state.auth.membershipNumber || state.auth.user?.membership_number,
  );
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  const name = user?.name || 'Member';
  const points = user?.loyalty_points ?? 0;
  const spent = user?.total_spent || '0.00';

  const [isLogout, setIsLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    {
      title: 'Edit Profile',
      sub: 'Personal details and address',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: 'My Reservations',
      sub: 'Upcoming and past bookings',
      icon: 'calendar-outline',
      onPress: () => navigation.navigate('ReservationHistory'),
    },
    // {
    //   id: 2,
    //   title: 'My Statement',
    //   sub: 'Points and transaction history',
    //   onPress: () => navigation.navigate('MyStatement'),
    // },
    // {
    //   id: 3,
    //   title: 'My Benefits',
    //   sub: 'Tier benefits and privileges',
    //   onPress: () => navigation.navigate('MyBenefits'),
    // },
    // {
    //   id: 4,
    //   title: 'Registered Offers',
    //   sub: 'Offers linked to your account',
    //   onPress: () => navigation.navigate('RegisteredOffers'),
    // },
    {
      title: 'Change Password',
      sub: 'Update account security',
      icon: 'lock-closed-outline',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    // {
    //   id: 6,
    //   title: 'Manage Your Consent',
    //   sub: 'Communication preferences',
    //   onPress: () => navigation.navigate('ManageConsents'),
    // },
    // {
    //   id: 7,
    //   title: 'Settings',
    //   sub: 'App and account settings',
    //   onPress: () => navigation.navigate('Settings'),
    // },
    {
      title: 'Terms & Conditions',
      sub: 'Membership terms',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('TermsConditions'),
    },
    {
      title: 'Help & Support',
      sub: 'Contact support team',
      icon: 'headset-outline',
      onPress: () => navigation.navigate('HelpSupport'),
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of Colony?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setIsLogout(true);

          try {
            // Logout API
            await postApi('logout', {}, token);
          } catch (error) {
            console.log('Logout API Error:', error);
          } finally {
            try {
              // Clear AsyncStorage
              await AsyncStorage.multiRemove([
                'token',
                'user',
                'name',
                'membershipNumber',
              ]);

              // Agar aur keys save ki hain to yaha add kar dena
              // 'phone',
              // 'rememberMe',
              // 'loginField',

              // Clear Redux
              dispatch(logout());

              // Reset Navigation
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.log('Storage clear error:', e);
            } finally {
              setIsLogout(false);
            }
          }
        },
      },
    ]);
  };
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
              const response = await postApi('wipe-profile', {}, token);
              if (response?.success) {
                dispatch(logout());
                navigation.navigate('Signup');
              } else {
                Alert.alert(
                  'Error',
                  response?.message ||
                    'Could not delete account. Please try again.',
                );
              }
            } catch (error) {
              Alert.alert(
                'Connection Error',
                'Failed to delete your account from the server. Please check your internet connection.',
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <CravPage title="" header="reserve">
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Account</Text>
        <Text style={styles.heroSub}>
          Manage your profile, reservations, benefits and account preferences.
        </Text>
      </View>

      <PremiumCard style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <Image
              source={AppImages.logo}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text numberOfLines={1} style={styles.profileName}>
              {name}
            </Text>
            <Text style={styles.profileId}>
              Membership no. {membershipNumber || 'N/A'}
            </Text>
          </View>
        </View>

        {/* <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>£{spent}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
        </View> */}
      </PremiumCard>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Account Menu</Text>
        <Text style={styles.sectionHint}>Tap to manage</Text>
      </View>

      <View style={styles.menuWrap}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={item.onPress}
            style={[styles.menuRow, index === 0 && styles.featuredMenuRow]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={22} color="#B7782E" />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuText}>{item.title}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>

            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>Account Actions</Text>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleLogout}
          disabled={isLogout}
          activeOpacity={0.8}
        >
          {isLogout ? (
            <ActivityIndicator size="small" color={T.ketchup} />
          ) : (
            <>
              <Text style={styles.actionText}>Logout</Text>
              <Text style={styles.actionArrow}>›</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionRow, styles.deleteRow]}
          onPress={handleDeleteAccount}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={T.ketchup} />
          ) : (
            <>
              <Text style={[styles.actionText, styles.deleteText]}>
                Delete Account
              </Text>
              <Text style={styles.actionArrow}>›</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </CravPage>
  );
}

const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;
const T = PremiumTheme;

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: '#FFF4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,

    borderWidth: 1,
    borderColor: '#F1DFC9',

    shadowColor: '#B7782E',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },
  hero: {
    paddingTop: 30,
    paddingBottom: 24,
  },

  kicker: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  heroTitle: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 38,
    lineHeight: 44,
    marginTop: 6,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: -0.6,
  },

  heroSub: {
    marginTop: 10,
    color: T.muted,
    fontFamily: fontReg,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 14,
  },

  profileCard: {
    marginBottom: 18,
    padding: 18,
    borderRadius: 30,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarWrap: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#FFF4E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#F0D7C1',
  },

  avatar: {
    width: 56,
    height: 56,
  },

  profileInfo: {
    flex: 1,
  },

  welcome: {
    color: T.tomato,
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  profileName: {
    fontFamily: fontMed,
    fontSize: 26,
    color: T.ink,
    letterSpacing: -0.4,
  },

  profileId: {
    fontFamily: fontReg,
    fontSize: 13,
    color: T.muted,
    marginTop: 5,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    backgroundColor: '#FFF8F1',
    borderRadius: 22,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#F1DFCD',
  },

  statBox: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontFamily: fontMed,
    fontSize: 20,
    color: T.ink,
  },

  statLabel: {
    marginTop: 3,
    fontFamily: fontReg,
    fontSize: 12,
    color: T.muted,
  },

  statDivider: {
    width: 1,
    backgroundColor: '#EAD7C6',
  },

  sectionHeader: {
    marginTop: 4,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  sectionTitle: {
    fontFamily: fontMed,
    color: T.ink,
    fontSize: 18,
  },

  sectionHint: {
    fontFamily: fontReg,
    color: T.muted,
    fontSize: 12,
  },

  menuWrap: {
    marginTop: 2,
  },

  menuRow: {
    backgroundColor: T.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 11,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#7E3F18',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  featuredMenuRow: {
    backgroundColor: '#FFF6EC',
    borderColor: '#EAC8A7',
  },

  menuNumber: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF1DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  menuNumberText: {
    color: T.goldDark,
    fontFamily: fontMed,
    fontSize: 11,
    letterSpacing: 0.5,
  },

  menuContent: {
    flex: 1,
  },

  menuText: {
    fontFamily: fontMed,
    fontSize: 15.5,
    color: T.ink,
  },

  menuSub: {
    fontFamily: fontReg,
    fontSize: 12.5,
    color: T.muted,
    marginTop: 4,
    lineHeight: 17,
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF2E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  arrow: {
    fontSize: 26,
    color: T.goldDark,
    marginTop: -2,
  },

  securityBox: {
    marginTop: 10,
    marginBottom: 24,
    padding: 14,
    borderRadius: 26,
    backgroundColor: '#FFF8F4',
    borderWidth: 1,
    borderColor: '#F0D7C9',
  },

  securityTitle: {
    fontFamily: fontMed,
    color: T.ink,
    fontSize: 16,
    marginBottom: 10,
  },

  actionRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0D7C9',
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  deleteRow: {
    backgroundColor: '#FFF0EA',
    borderColor: '#F2C5B6',
  },

  actionText: {
    color: T.ink,
    fontFamily: fontMed,
    fontSize: 15,
  },

  deleteText: {
    color: T.ketchup,
  },

  actionArrow: {
    color: T.ketchup,
    fontSize: 25,
  },
});
