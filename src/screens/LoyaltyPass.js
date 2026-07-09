import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Fonts } from '../res';
import PremiumTheme from '../res/PremiumTheme';

export default function LoyaltyPass() {
  const navigation = useNavigation();
  const name = useSelector(state => state.auth.user?.name || 'Member');
  const phone = useSelector(state => state.auth.user?.phone || '');
  const membershipNumber = useSelector(state => state.auth.membershipNumber);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closePill} activeOpacity={0.84}>
          <Text style={styles.closeBtn}>✕ Close</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.kicker}>COLONY PRIVILEGE</Text>
        <Text style={styles.title}>LOYALTY PASS</Text>
        <View style={styles.qrWrapper}>
          <QRCode value={JSON.stringify({ name, phone, membership: membershipNumber })} size={240} color={PremiumTheme.ink} backgroundColor={PremiumTheme.pearl} />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.memberId}>ID: {membershipNumber}</Text>
        <Text style={styles.hint}>Scan this code at the counter to collect points</Text>
      </View>
    </View>
  );
}

const T = PremiumTheme;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.paper },
  header: { paddingTop: 52, paddingHorizontal: 18, alignItems: 'flex-end' },
  closePill: { backgroundColor: T.surface, borderWidth: 1, borderColor: T.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 },
  closeBtn: { fontSize: 13, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, color: T.ink, letterSpacing: 0.5 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100, paddingHorizontal: 20 },
  kicker: { fontSize: 10, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, color: T.primary, letterSpacing: 2.2, marginBottom: 8 },
  title: { fontSize: 24, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, color: T.ink, marginBottom: 30, letterSpacing: 1.2 },
  qrWrapper: { padding: 20, backgroundColor: T.pearl, borderRadius: 30, borderWidth: 1, borderColor: T.border, elevation: 12, shadowColor: T.shadow, shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 12 } },
  name: { fontSize: 24, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, marginTop: 30, color: T.ink },
  memberId: { fontSize: 14, color: T.muted, marginTop: 5, fontFamily: Fonts.instrumentSansRegular },
  hint: { fontSize: 14, color: T.softMuted, marginTop: 36, textAlign: 'center', paddingHorizontal: 50, lineHeight: 22, fontFamily: Fonts.instrumentSansRegular },
});
