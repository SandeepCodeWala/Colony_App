import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { AppImages, Colors } from '../res';
import SettingHeader from '../components/SettingHeader';
import CommonDropdown from '../components/CommonDropdown';
import { useNavigation } from '@react-navigation/native';

const titleData = [
  { label: 'PAST 30 DAYS', value: '30 days' },
  { label: 'All DAYS', value: 'all' },
];
const EditProfileScreen = () => {
  const [title, setTitle] = useState('30 days');
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <SettingHeader
        title={'ACCOUNT STATEMENT'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 25 }}
      >
        <Text style={styles.mainTitle}>Colony One ACCOUNT Statement</Text>

        <View style={styles.wrapper}>
          {/* Top Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.box}>
                <Text style={styles.boxTitle}>COLONY ONE{'\n'}BALANCE</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.value}>0</Text>
                </View>
              </View>

              <View style={styles.box}>
                <Text style={styles.boxTitle}>TIER POINTS</Text>
                <View style={styles.valueBox}>
                  <Text style={styles.value}>0</Text>
                </View>
              </View>
            </View>

            <Text style={styles.infoText}>
              All Colony One Members will earn two (2) Colony One Points and two
              (2) Tier Points for every eligible 1 USD spent. For further
              information, please visit our{' '}
              <Text style={styles.link}>FAQs</Text>.
            </Text>
          </View>

          {/* Bottom Cards */}
          <View style={styles.row}>
            <View style={styles.smallCard}>
              <Text style={styles.smallTitle}>
                POINTS DUE TO{'\n'}EXPIRE BY INVALID DATE
              </Text>
              <Text style={styles.smallValue}>0</Text>
            </View>

            <View style={styles.smallCard}>
              <Text style={styles.smallTitle}>TOTAL POINTS{'\n'}EXPIRED</Text>
              <Text style={styles.smallValue}>0</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {/* Download section */}
          <View style={styles.downloadView}>
            <View style={{ width: 150 }}>
              <CommonDropdown
                // label="CODE"
                data={titleData}
                value={title}
                onChange={setTitle}
              />
            </View>
            <TouchableOpacity style={styles.backButton}>
              <Image source={AppImages.download} style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Transaction{'\n'}Date</Text>
            <Text style={styles.headerText}>Description</Text>
            <Text style={styles.headerText}>Points</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Claim */}
          <TouchableOpacity style={styles.claimRow}>
            <Text style={styles.claimText}>
              CLAIM MISSING POINTS <Text style={styles.arrow}>›</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },

  mainTitle: {
    fontSize: 30,
    fontFamily: 'serif',
    color: '#444444',
    // marginBottom: 15,
    marginTop: 29,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  wrapper: {
    paddingTop: 20,
    // backgroundColor: 'red',
  },

  card: {
    backgroundColor: '#f3efe8',
    padding: 20,
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  box: {
    width: '48%',
    alignItems: 'center',
  },

  boxTitle: {
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#444',
    marginBottom: 8,
    height: 35,
  },

  valueBox: {
    borderWidth: 1,
    borderColor: '#999',
    width: '100%',
    paddingVertical: 18,
    alignItems: 'center',
  },

  value: {
    fontSize: 20,
    color: '#000',
  },

  infoText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    color: '#444',
    marginTop: 18,
  },

  link: {
    textDecorationLine: 'underline',
  },

  smallCard: {
    backgroundColor: '#f3efe8',
    width: '48%',
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  smallTitle: {
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#444',
    marginBottom: 8,
  },

  smallValue: {
    fontSize: 20,
    color: '#000',
  },

  sectionTitle: {
    fontSize: 22,
    fontFamily: 'serif',
    textAlign: 'center',
    marginTop: 30,
    color: '#000',
  },
  downloadView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginVertical: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { height: 20, width: 20, tintColor: Colors.BLACK },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  headerText: {
    fontSize: 12,
    letterSpacing: 1,
    color: '#555',
    width: '33%',
  },

  divider: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 16,
  },

  claimRow: {
    alignItems: 'center',
    paddingVertical: 14,
  },

  claimText: {
    fontSize: 13,
    letterSpacing: 1,
    color: '#000',
  },

  arrow: {
    fontSize: 16,
  },
});
