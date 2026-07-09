import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slices/authSlice';
import { postApi } from '../services/network/api';
import { AppImages, Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';
import { CravPage, PremiumCard, Hero, LuxeTabs, LuxeSectionHeader } from '../components/CravPremium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const T = PremiumTheme;
const fontMed = Fonts.instrumentSansMedium;
const fontReg = Fonts.instrumentSansRegular;
const fontBold = Fonts.instrumentSansBold || Fonts.instrumentSansMedium;

export default function Settings() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const membershipNumber = useSelector(state => state.auth.membershipNumber || state.auth.user?.membership_number);
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  const name = user?.name || 'Member';
  const points = user?.loyalty_points ?? 0;
  const spent = user?.total_spent || '0.00';

  const [isLogout, setIsLogout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { title: 'Edit Profile', sub: 'Personal details and address', icon: 'person-outline', onPress: () => navigation.navigate('EditProfile') },
    { title: 'My Reservations', sub: 'Upcoming and past bookings', icon: 'calendar-outline', onPress: () => navigation.navigate('ReservationHistory') },
    { title: 'Change Password', sub: 'Update account security', icon: 'lock-closed-outline', onPress: () => navigation.navigate('ChangePassword') },
    { title: 'Terms & Conditions', sub: 'Membership terms', icon: 'document-text-outline', onPress: () => navigation.navigate('TermsConditions') },
    { title: 'Help & Support', sub: 'Contact support team', icon: 'headset-outline', onPress: () => navigation.navigate('HelpSupport') },
  ];

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
            try {
              await AsyncStorage.multiRemove(['token', 'user', 'name', 'membershipNumber']);
              dispatch(logout());
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
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
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [
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
              Alert.alert('Error', response?.message || 'Could not delete account. Please try again.');
            }
          } catch (error) {
            Alert.alert('Connection Error', 'Failed to delete your account from the server. Please check your internet connection.');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const renderOverview = () => (
    <>
      <PremiumCard style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrap}>
            <Image source={AppImages.logo} style={styles.avatar} resizeMode="contain" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text numberOfLines={1} style={styles.profileName}>{name}</Text>
            <Text style={styles.profileId}>Membership no. {membershipNumber || 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}><Text style={styles.statValue}>{points}</Text><Text style={styles.statLabel}>Points</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}><Text style={styles.statValue}>£{spent}</Text><Text style={styles.statLabel}>Spent</Text></View>
        </View>
      </PremiumCard>

      <LuxeSectionHeader eyebrow="Shortcut" title="Quick Actions" />
      <View style={styles.quickGrid}>
        {menuItems.slice(0, 2).map(item => <MenuTile key={item.title} item={item} />)}
      </View>
    </>
  );

  const MenuTile = ({ item, featured }) => (
    <TouchableOpacity activeOpacity={0.86} onPress={item.onPress} style={[styles.menuRow, featured && styles.featuredMenuRow]}>
      <View style={styles.iconContainer}><Ionicons name={item.icon} size={22} color={T.primary} /></View>
      <View style={styles.menuContent}>
        <Text style={styles.menuText}>{item.title}</Text>
        <Text style={styles.menuSub}>{item.sub}</Text>
      </View>
      <View style={styles.arrowCircle}><Text style={styles.arrow}>›</Text></View>
    </TouchableOpacity>
  );

  const renderMenu = () => (
    <>
      <LuxeSectionHeader eyebrow="Account" title="Menu" />
      <View style={styles.menuWrap}>
        {menuItems.map((item, index) => <MenuTile key={item.title} item={item} featured={index === 0} />)}
      </View>
    </>
  );

  const renderSecurity = () => (
    <>
      <LuxeSectionHeader eyebrow="Security" title="Account Actions" />
      <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>Security controls</Text>
        <Text style={styles.securitySub}>Logout or remove your account from this device.</Text>

        <TouchableOpacity style={styles.actionRow} onPress={handleLogout} disabled={isLogout} activeOpacity={0.84}>
          {isLogout ? <ActivityIndicator size="small" color={T.ketchup} /> : <><Text style={styles.actionText}>Logout</Text><Text style={styles.actionArrow}>›</Text></>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, styles.deleteRow]} onPress={handleDeleteAccount} disabled={isLoading} activeOpacity={0.84}>
          {isLoading ? <ActivityIndicator size="small" color={T.ketchup} /> : <><Text style={[styles.actionText, styles.deleteText]}>Delete Account</Text><Text style={styles.actionArrow}>›</Text></>}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <CravPage title="" header="reserve">
      <Hero
        kicker="Account"
        title="Your Profile"
        subtitle="Manage your profile, reservations, support and account preferences in one premium dashboard."
      />

      <LuxeTabs
        tabs={[{ key: 'overview', label: 'Overview' }, { key: 'menu', label: 'Menu' }, { key: 'security', label: 'Security' }]}
        activeKey={activeTab}
        onChange={setActiveTab}
        style={styles.tabs}
      />

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'menu' && renderMenu()}
      {activeTab === 'security' && renderSecurity()}
    </CravPage>
  );
}

const styles = StyleSheet.create({
  tabs: { marginBottom: 18 },
  profileCard: { marginBottom: 18, padding: 18, borderRadius: 32, backgroundColor: T.pearl },
  profileTop: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: T.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: T.border,
  },
  avatar: { width: 58, height: 58 },
  profileInfo: { flex: 1 },
  welcome: { color: T.primary, fontFamily: fontBold, fontSize: 10, letterSpacing: 1.9, textTransform: 'uppercase', marginBottom: 4 },
  profileName: { fontFamily: fontBold, fontSize: 25, color: T.ink, letterSpacing: -0.4 },
  profileId: { fontFamily: fontReg, fontSize: 13, color: T.muted, marginTop: 5 },
  statsRow: { flexDirection: 'row', marginTop: 18, backgroundColor: T.surfaceSoft, borderRadius: 24, paddingVertical: 14, borderWidth: 1, borderColor: T.line },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: fontBold, fontSize: 21, color: T.ink },
  statLabel: { marginTop: 3, fontFamily: fontReg, fontSize: 12, color: T.muted },
  statDivider: { width: 1, backgroundColor: T.border },
  quickGrid: { marginBottom: 6 },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: T.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  menuWrap: { marginTop: 2 },
  menuRow: {
    backgroundColor: T.glass,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: T.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 3,
  },
  featuredMenuRow: { backgroundColor: T.primarySoft, borderColor: T.champagne },
  menuContent: { flex: 1 },
  menuText: { fontFamily: fontBold, fontSize: 15.5, color: T.ink },
  menuSub: { fontFamily: fontReg, fontSize: 12.5, color: T.muted, marginTop: 4, lineHeight: 18 },
  arrowCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: T.surface, alignItems: 'center', justifyContent: 'center', marginLeft: 10, borderWidth: 1, borderColor: T.line },
  arrow: { fontSize: 26, color: T.primaryDark, marginTop: -2 },
  securityBox: { marginTop: 2, marginBottom: 24, padding: 16, borderRadius: 28, backgroundColor: T.glass, borderWidth: 1, borderColor: T.border, shadowColor: T.shadow, shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 9 }, elevation: 3 },
  securityTitle: { fontFamily: fontBold, color: T.ink, fontSize: 18 },
  securitySub: { fontFamily: fontReg, color: T.muted, fontSize: 13, lineHeight: 20, marginTop: 5, marginBottom: 8 },
  actionRow: { marginTop: 12, minHeight: 54, borderRadius: 22, backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deleteRow: { backgroundColor: '#FFF4F1', borderColor: '#EBC7BE' },
  actionText: { fontFamily: fontBold, fontSize: 15, color: T.ink },
  deleteText: { color: T.danger },
  actionArrow: { fontSize: 26, color: T.primaryDark, marginTop: -2 },
});
