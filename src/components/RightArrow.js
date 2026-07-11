import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { CravPage } from './CravPremium';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

const T = PremiumTheme;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const membershipNumber = useSelector(
    state => state.auth.membershipNumber || state.auth.user?.membership_number,
  );

  const menuItems = [
    { title: 'Edit Profile', icon: 'person-outline', screen: 'EditProfile' },
    { title: 'My Statement', icon: 'receipt-outline', screen: 'MyStatement' },
    { title: 'My Benefits', icon: 'gift-outline', screen: 'MyBenefits' },
    { title: 'Registered Offers', icon: 'pricetag-outline', screen: 'RegisteredOffers' },
    { title: 'Change Password', icon: 'lock-closed-outline', screen: 'ChangePassword' },
    { title: 'Manage Your Consent', icon: 'shield-checkmark-outline', screen: 'ManageConsents' },
    { title: 'Terms & Conditions', icon: 'document-text-outline', screen: 'TermsConditions' },
    { title: 'Help & Support', icon: 'headset-outline', screen: 'HelpSupport' },
  ];

  return (
    <CravPage title="Profile" onBack={() => navigation.goBack()}>
      <View style={styles.profile}>
        <Text style={styles.eyebrow}>COLONY MEMBER</Text>
        <Text numberOfLines={1} style={styles.name}>{user?.name || 'Member'}</Text>
        <Text style={styles.membership}>Membership {membershipNumber || 'N/A'}</Text>
      </View>

      <View style={styles.list}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.title}
            style={styles.row}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.left}>
              <Ionicons name={item.icon} size={25} color={T.ink} />
              <Text style={styles.rowText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={23} color={T.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </CravPage>
  );
}

const styles = StyleSheet.create({
  profile: { paddingTop: 26, paddingBottom: 24, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.border },
  eyebrow: { color: T.primary, fontFamily: Fonts.luxurySansMedium, fontSize: 10, letterSpacing: 2.1 },
  name: { color: T.ink, fontFamily: Fonts.displaySerif, fontSize: 34, marginTop: 8 },
  membership: { color: T.muted, fontFamily: Fonts.luxurySansLight, fontSize: 13, marginTop: 5 },
  list: { paddingTop: 8 },
  row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowText: { color: T.ink, fontFamily: Fonts.luxurySansLight, fontSize: 17, marginLeft: 18 },
});
