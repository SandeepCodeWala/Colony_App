import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { logout, updateUserProfile } from '../redux/slices/authSlice';
import { getApi, postApi } from '../services/network/api';
import { showToast } from '../services/Toast';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import ProfileAvatar from '../components/ProfileAvatar';
import {
  ScreenSkeleton,
  useFirstRenderSkeleton,
} from '../components/LuxurySkeleton';

const T = PremiumTheme;

export default function Settings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const membershipNumber = useSelector(
    state => state.auth.membershipNumber || state.auth.user?.membership_number,
  );

  const [isLogout, setIsLogout] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const loading = useFirstRenderSkeleton(620);

  const menuItems = [
    {
      title: 'My Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile'),
      isLogin: isLoggedIn,
    },
    {
      title: 'My Reservations',
      icon: 'calendar-clear-outline',
      onPress: () => navigation.navigate('ReservationHistory'),
      isLogin: isLoggedIn,
    },
    {
      title: 'Change Password',
      icon: 'lock-closed-outline',
      onPress: () => navigation.navigate('ChangePassword'),
      isLogin: isLoggedIn,
    },
    // {
    //   title: 'Contact Us',
    //   icon: 'chatbox-outline',
    //   onPress: () => navigation.navigate('HelpSupport'),
    //   isLogin: true,
    // },
    {
      title: 'Help & Support',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('HelpSupport'),
      isLogin: true,
    },
    {
      title: 'Privacy & Consents',
      icon: 'shield-checkmark-outline',
      onPress: () => navigation.navigate('ManageConsents'),
      isLogin: true,
    },
    {
      title: 'Terms and Conditions',
      icon: 'list-outline',
      onPress: () => navigation.navigate('TermsConditions'),
      isLogin: true,
    },
  ];

  const clearSession = useCallback(async () => {
    await AsyncStorage.multiRemove([
      'token',
      'user',
      'name',
      'membershipNumber',
      'phone',
    ]);
    dispatch(logout());
  }, [dispatch]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;

    const response = await getApi('get_profile', token);
    if (!response?.success || !response?.data) return;

    const profile = response.data;
    dispatch(updateUserProfile(profile));
    await AsyncStorage.multiSet([
      ['user', JSON.stringify(profile)],
      ['name', String(profile?.name || '')],
      ['phone', String(profile?.phone || '')],
      ['membershipNumber', String(profile?.membership_number || '')],
    ]);
  }, [dispatch, token]);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, [refreshProfile]),
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of Colony?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setIsLogout(true);
          try {
            await postApi('logout', {}, token);
          } catch (error) {
            console.log('Logout API Error:', error);
          } finally {
            await clearSession();
            setIsLogout(false);
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Your account, profile and membership data will be permanently deleted. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = await postApi('wipe-profile', {}, token);

              if (!response?.success) {
                Alert.alert(
                  'Unable to delete account',
                  response?.message || 'Please try again in a moment.',
                );
                return;
              }

              await clearSession();
              showToast(
                'success',
                response?.message || 'Your account has been deleted.',
              );
              navigation.reset({ index: 0, routes: [{ name: 'Signup' }] });
            } catch (error) {
              Alert.alert(
                'Connection Error',
                'We could not delete your account. Please check your connection and try again.',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (loading) return <ScreenSkeleton variant="page" />;

  const profilePicture = user?.profilePicture || user?.profile_picture;

  console.log(isLoggedIn, 'isLoggedIn');
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={T.cream} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => isLoggedIn && navigation.navigate('EditProfile')}
          style={styles.memberBlock}
        >
          <ProfileAvatar
            name={user?.name}
            profilePicture={profilePicture}
            size={76}
          />

          <View style={styles.memberCopy}>
            <Text style={styles.memberEyebrow}>COLONY MEMBER</Text>
            <Text numberOfLines={1} style={styles.memberName}>
              {user?.name || 'Member'}
            </Text>
            <Text style={styles.memberNumber}>
              Membership {membershipNumber || 'N/A'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={24}
            color={isLoggedIn ? T.inkSoft : '#a8a7a7'}
          />
        </TouchableOpacity>

        <View style={styles.divider} />

        {menuItems.map(
          item =>
            item?.isLogin && (
              <TouchableOpacity
                key={item.title}
                activeOpacity={0.68}
                style={styles.row}
                onPress={item.onPress}
              >
                <View style={styles.rowLeft}>
                  <Ionicons name={item.icon} size={27} color={T.ink} />
                  <Text style={styles.rowTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={T.inkSoft} />
              </TouchableOpacity>
            ),
        )}

        {isLoggedIn && (
          <View style={styles.accountActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.actionRow}
              onPress={handleLogout}
              disabled={isLogout || isDeleting}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="log-out-outline" size={26} color={T.danger} />
                <Text style={[styles.rowTitle, styles.logoutText]}>Logout</Text>
              </View>
              {isLogout ? (
                <ActivityIndicator size="small" color={T.primary} />
              ) : (
                <Ionicons name="chevron-forward" size={24} color={T.inkSoft} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.actionRow, styles.deleteRow]}
              onPress={handleDeleteAccount}
              disabled={isDeleting || isLogout}
            >
              <View style={styles.rowLeft}>
                <Ionicons name="trash-outline" size={26} color={T.danger} />
                <View style={styles.deleteCopy}>
                  <Text style={[styles.rowTitle, styles.deleteTitle]}>
                    Delete Account
                  </Text>
                  <Text style={styles.deleteCaption}>
                    Permanently remove your account
                  </Text>
                </View>
              </View>
              {isDeleting ? (
                <ActivityIndicator size="small" color={T.danger} />
              ) : (
                <Ionicons name="chevron-forward" size={24} color={T.danger} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.surfaceSoft },
  header: {
    height: Platform.OS === 'ios' ? 112 : 92,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
    backgroundColor: T.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.border,
  },
  headerTitle: {
    color: T.ink,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 28,
    letterSpacing: 0.4,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 44,
  },
  memberBlock: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  memberCopy: { flex: 1, marginLeft: 16, marginRight: 8 },
  memberEyebrow: {
    color: T.primary,
    fontFamily: Fonts.luxurySansMedium,
    fontSize: 10,
    letterSpacing: 2.1,
  },
  memberName: {
    color: T.ink,
    fontFamily: Fonts.displaySerif,
    fontSize: 29,
    lineHeight: 36,
    marginTop: 4,
  },
  memberNumber: {
    color: T.muted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginBottom: 6,
  },
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowTitle: {
    color: T.ink,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 17,
    marginLeft: 18,
    flexShrink: 1,
  },
  accountActions: {
    marginTop: 14,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
  },
  actionRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutText: { color: T.danger },
  deleteRow: {
    minHeight: 82,
    marginTop: 2,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EACFC6',
    backgroundColor: '#FFF8F5',
  },
  deleteCopy: { flex: 1 },
  deleteTitle: { color: T.danger, marginLeft: 18 },
  deleteCaption: {
    color: T.softMuted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 11,
    marginTop: 3,
    marginLeft: 18,
  },
  version: {
    textAlign: 'center',
    color: T.softMuted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 13,
    marginTop: 32,
    marginBottom: 12,
  },
});
