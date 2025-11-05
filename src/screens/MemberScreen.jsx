import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ReserveHeader from '../components/ReserveHeader';

const { width } = Dimensions.get('window');

const MemberScreen = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [memberShip, setMemberShip] = useState('');


  const fetchUser = async () => {
    try {
      const userName = await AsyncStorage.getItem('name');
      const membershipNum = await AsyncStorage.getItem('membershipNumber');

      console.log('🟢 Fetched user:', { userName, membershipNum });
      setUserName(userName);
      setMemberShip(membershipNum)

      // ✅ Check if userName is missing or empty
      if (!userName || userName === 'null' || userName === 'undefined') {
        console.log('🔴 No user found, navigating to Loyalty screen...');
      } else {
        console.log('✅ User is logged in');
      }
    } catch (error) {
      console.log('❌ Error fetching user:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, []),
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#f3ebdf" barStyle="dark-content" />
      <ReserveHeader title={'Loyalty'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.memberName}>{userName}</Text>
            <Text style={styles.memberId}>{memberShip}</Text>
            <Text style={styles.memberType}>MEMBER</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.viewECard}>VIEW E-CARD</Text>
          </TouchableOpacity>
        </View>

        {/* Points Section */}
        <View style={styles.pointsCard}>
          <Text style={styles.pointsValue}>0</Text>
          <Text style={styles.pointsLabel}>Jumeirah One Points</Text>
          <TouchableOpacity style={styles.payBtn}>
            <Text style={styles.payBtnText}>PAY WITH POINTS →</Text>
          </TouchableOpacity>
        </View>

        {/* Collect Points */}
        <View style={styles.collectContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
            }}
            style={styles.imageBanner}
          />
          <View style={styles.collectTextContainer}>
            <Text style={styles.collectTitle}>Collect your points</Text>
            <Text style={styles.collectSub}>
              You'll need to collect points before you can exchange them for
              rewards.
            </Text>
            <TouchableOpacity style={styles.collectBtn}>
              <Text style={styles.collectBtnText}>COLLECT POINTS →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tier Points */}
        <View style={styles.tierContainer}>
          <Text style={styles.tierTitle}>Tier Points</Text>
          <Text style={styles.tierValue}>0</Text>
          <Text style={styles.tierDescription}>
            Spend an additional USD 2,500 to collect 5,000 Tier Points to become
            a Silver member
          </Text>

          {/* Tier Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.dot, { backgroundColor: '#7a4b25' }]} />
            <View style={[styles.dot, { backgroundColor: '#b5b5b5' }]} />
            <View style={[styles.dot, { backgroundColor: '#bda875' }]} />
            <View style={[styles.dot, { backgroundColor: '#a9a9a9' }]} />
          </View>

          <View style={styles.tierLabels}>
            <Text style={styles.tierLabel}>Member</Text>
            <Text style={styles.tierLabel}>Silver</Text>
            <Text style={styles.tierLabel}>Gold</Text>
            <Text style={styles.tierLabel}>Platinum</Text>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomBtns}>
          <TouchableOpacity style={styles.offerBtn}>
            <Text style={styles.offerText}>% MY OFFERS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exchangeBtn}>
            <Text style={styles.offerText}>⇄ EXCHANGE POINTS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3ebdf',
  },
  scrollContainer: {
    paddingBottom: responsiveHeight(8),
  },
  headerContainer: {
    backgroundColor: '#f3ebdf',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberName: {
    fontSize: responsiveFontSize(3.2),
    fontWeight: '500',
    color: '#111',
  },
  memberId: {
    fontSize: responsiveFontSize(2.2),
    color: '#555',
    marginTop: responsiveHeight(0.3),
  },
  memberType: {
    fontSize: responsiveFontSize(1.6),
    color: '#7e7e7e',
    marginTop: responsiveHeight(0.3),
    letterSpacing: 1,
  },
  viewECard: {
    fontSize: responsiveFontSize(1.8),
    color: '#4a4036',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  pointsCard: {
    marginTop: responsiveHeight(3),
    backgroundColor: '#f3ebdf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: responsiveFontSize(5),
    fontWeight: '600',
    color: '#111',
  },
  pointsLabel: {
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  payBtn: {
    marginTop: responsiveHeight(1),
    backgroundColor: '#e4e0d9',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1),
    borderRadius: 8,
  },
  payBtnText: {
    fontSize: responsiveFontSize(1.8),
    color: '#4a4036',
    fontWeight: '600',
  },
  collectContainer: {
    marginTop: responsiveHeight(3),
    backgroundColor: '#f3ebdf',
  },
  imageBanner: {
    width: width,
    height: responsiveHeight(25),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  collectTextContainer: {
    padding: responsiveWidth(5),
  },
  collectTitle: {
    fontSize: responsiveFontSize(2.6),
    fontWeight: '600',
    color: '#111',
  },
  collectSub: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
    marginTop: responsiveHeight(1),
  },
  collectBtn: {
    marginTop: responsiveHeight(1.5),
  },
  collectBtnText: {
    fontSize: responsiveFontSize(1.8),
    color: '#4a4036',
    fontWeight: '600',
  },
  tierContainer: {
    marginTop: responsiveHeight(3),
    backgroundColor: '#f3ebdf',
    padding: responsiveWidth(5),
  },
  tierTitle: {
    fontSize: responsiveFontSize(2),
    color: '#555',
  },
  tierValue: {
    fontSize: responsiveFontSize(4),
    color: '#111',
    fontWeight: '600',
    marginVertical: responsiveHeight(0.5),
  },
  tierDescription: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
    textAlign: 'center',
    marginVertical: responsiveHeight(1),
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
  },
  dot: {
    width: responsiveWidth(4),
    height: responsiveWidth(4),
    borderRadius: 50,
  },
  tierLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(3),
  },
  tierLabel: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
  },
  bottomBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(5),
  },
  offerBtn: {
    borderWidth: 1,
    borderColor: '#4a4036',
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(7),
  },
  exchangeBtn: {
    borderWidth: 1,
    borderColor: '#4a4036',
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(7),
  },
  offerText: {
    color: '#4a4036',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f3ec',
    paddingVertical: responsiveHeight(1.2),
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  navText: {
    fontSize: responsiveFontSize(1.8),
    color: '#555',
  },
  activeNav: {
    color: '#b88c4c',
    fontWeight: '600',
  },
});
