import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Fonts, Colors } from '../res';

export default function LoyaltyPass() {
  const navigation = useNavigation();
  const name = useSelector(state => state.auth.user?.name || 'Member');
  const phone = useSelector(state => state.auth.user?.phone || '');
  const membershipNumber = useSelector(state => state.auth.membershipNumber);

  return (
    <View style={styles.container}>
      {/* Header with Close Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtn}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>COLONY LOYALTY PASS</Text>
        
        <View style={styles.qrWrapper}>
          <QRCode
            value={JSON.stringify({
              name: name,
              phone: phone,
              membership: membershipNumber
            })}
            size={240}
            color={Colors.BLACK}
            backgroundColor={Colors.WHITE}
          />
        </View>

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.memberId}>ID: {membershipNumber}</Text>
        <Text style={styles.hint}>Scan this code at the counter to collect points</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { padding: 50, alignItems: 'flex-end' },
  closeBtn: { fontSize: 18, fontFamily: Fonts.SemiBold, color: '#000' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  title: { fontSize: 18, fontFamily: Fonts.SemiBold, color: '#000', marginBottom: 30, letterSpacing: 1 },
  qrWrapper: { 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10 
  },
  name: { fontSize: 22, fontFamily: Fonts.Bold, marginTop: 30, color: '#000' },
  memberId: { fontSize: 14, color: '#666', marginTop: 5 },
  hint: { fontSize: 14, color: '#999', marginTop: 40, textAlign: 'center', paddingHorizontal: 50 }
});