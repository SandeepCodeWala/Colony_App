import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AppImages, Colors } from '../res';
import SettingHeader from '../components/SettingHeader';
import CommonDropdown from '../components/CommonDropdown';

const titleData = [
  { label: 'MEMBER', value: 'member' },
  { label: 'SILVER', value: 'silver' },
   { label: 'GOLD', value: 'gold' },
];


const MyBenefits = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('member');
  return (
    <View style={styles.container}>
      <SettingHeader
        title={'TIER BENEFITS '}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 25 }}
      >
        <View style={styles.dropdownWrap}>
         <View style={{ width: 150 }}>
              <CommonDropdown
                // label="CODE"
                data={titleData}
                value={title}
                onChange={setTitle}
              />
            </View>
        </View>

        <View style={styles.imageWrap}>
          <Image
            source={AppImages.lounge} // replace image
            style={styles.image}
          />
        </View>

        {/* ===== Bottom Content Section ===== */}
        <View style={styles.contentBox}>
          <Text style={styles.title}>Member Benefits</Text>

          <Text style={styles.description}>
            Discover enticing privileges to make your moments with Jumeirah even
            more special.
          </Text>

          {/* ===== Stay Benefits ===== */}
          <Text style={styles.sectionTitle}>Stay benefits</Text>

          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>–</Text>
            <Text style={styles.bulletText}>Member-Only Rates</Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>–</Text>
            <Text style={styles.bulletText}>Complimentary Wi-Fi</Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>–</Text>
            <Text style={styles.bulletText}>
              Welcome Back Reward{'\n'}on Longer Stays
            </Text>
          </View>

          {/* ===== Lifestyle Benefits ===== */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>
            Lifestyle & Entertainment{'\n'}benefits
          </Text>

          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>–</Text>
            <Text style={styles.bulletText}>
              10% Savings on Entrance to Wild Wadi Waterpark™ (member plus four
              guests)
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <Text style={styles.bullet}>–</Text>
            <Text style={styles.bulletText}>10% Savings on Spa Treatments</Text>
          </View>

          {/* ===== Paragraphs ===== */}
          <Text style={styles.paragraph}>
            All tier accounts are eligible for easy points transfer to other
            Jumeirah One Members via Jumeirah One Engagement Centre.
          </Text>

          <Text style={styles.paragraph}>
            Jumeirah One tier benefits and privileges are subject to additional
            terms and conditions, including but not limited to, availability
            and/or a minimum length of stay, whilst some may be availed only at
            selected Jumeirah hotels and resorts.
          </Text>

          <TouchableOpacity>
            <Text style={styles.link}>
              Click here to view complete terms and conditions.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyBenefits;

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

  dropdownWrap: {
    alignItems: 'center',
    marginTop: 20,
  },

  dropdownText: {
    fontSize: 14,
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 6,
  },

  dropdownArrow: {
    fontSize: 16,
    marginTop: 4,
  },

  imageWrap: {
    alignItems: 'center',
    marginTop: 30,
    position:"absolute",
    zIndex:999,
    top:60,
    flexDirection:"row",
    alignSelf:"center"
  },

  image: {
    width: 160,
    height: 220,
    borderRadius: 6,
  },

  contentBox: {
    backgroundColor: '#eee6da',
    marginTop: 150,
    padding: 24,
    paddingTop: 150,
  },

  title: {
    fontSize: 24,
    fontFamily: 'serif',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2b2b2b',
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#444',
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    marginBottom: 14,
    color: '#2b2b2b',
  },

  bulletRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  bullet: {
    width: 16,
    fontSize: 16,
    color: '#b89b5e',
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#2b2b2b',
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#444',
    marginTop: 20,
  },

  link: {
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: 18,
    color: '#2b2b2b',
  },
});
