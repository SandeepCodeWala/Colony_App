// import React, { useCallback, useState } from 'react';
// import { StyleSheet, View, Text, ImageBackground } from 'react-native';
// import { AppImages, Fonts, Colors } from '../res';
// import AppButton from '../components/AppButton';
// import {
//   createStaticNavigation,
//   useFocusEffect,
//   useNavigation,
// } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import MemberScreen from '../screens/MemberScreen';
// export default function Loyalty(props) {
//   const navigation = useNavigation();
//   const [userName, setUserName] = useState('');

//   const fetchUser = async () => {
//     try {
//       const userName = await AsyncStorage.getItem('name');
//       const membershipNum = await AsyncStorage.getItem('membershipNumber');

//       console.log('🟢 Fetched user:', { userName, membershipNum });

//       // ✅ Check if userName is missing or empty
//       if (!userName || userName === 'null' || userName === 'undefined') {
//         console.log('🔴 No user found, navigating to Loyalty screen...');
//       } else {
//         setUserName(userName);
//         console.log('✅ User is logged in');
//       }
//     } catch (error) {
//       console.log('❌ Error fetching user:', error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchUser();
//     }, [userName]),
//   );

//   return (
//     <>
//       {!userName || userName === 'null' || userName === 'undefined' ? (
//          <>
//           <ImageBackground source={AppImages.loginBg} style={styles.container}>
//             <View style={styles.header}>
//               <Text style={styles.colony}>COLONY</Text>
//               <AppButton
//                 text={'LOGIN'}
//                 onPress={() => navigation.navigate('Login')}
//                 style={{
//                   backgroundColor: Colors.WHITE,
//                   width: 250,
//                   marginTop: 40,
//                 }}
//                 textStyle={{
//                   color: Colors.BLACK,
//                   fontFamily: Fonts.regular,
//                   letterSpacing: 2,
//                 }}
//               />
//               <Text style={styles.colony1}>OR</Text>
//               <AppButton
//                 text={'JOIN NOW'}
//                 onPress={() => navigation.navigate('Signup')}
//                 style={{
//                   backgroundColor: Colors.WHITE,
//                   width: 250,
//                   marginTop: 20,
//                 }}
//                 textStyle={{
//                   color: Colors.BLACK,
//                   fontFamily: Fonts.regular,
//                   letterSpacing: 2,
//                 }}
//               />
//               <Text style={styles.colony1}>ABOUT COLONY</Text>
//             </View>
//           </ImageBackground>
//         </>
       
//       ) : (
//         <MemberScreen />
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     // You don’t really need extra alignment here now
//   },
//   colony: {
//     fontSize: 50,
//     fontFamily: Fonts.SemiBold,
//     color: Colors.WHITE,
//     textAlign: 'center',
//   },
//   colony1: {
//     fontSize: 15,
//     fontFamily: Fonts.SemiBold,
//     color: Colors.WHITE,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });
/////////////////////QR CODE CORRECT 

// import React from 'react';
// import { StyleSheet, View, Text, ImageBackground } from 'react-native';
// import { AppImages, Fonts, Colors } from '../res';
// import AppButton from '../components/AppButton';
// import { useNavigation } from '@react-navigation/native';
// import { useSelector, useDispatch } from 'react-redux'; // Redux Hooks
// import QRCode from 'react-native-qrcode-svg';

// export default function Loyalty(props) {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   // --- REDUX STATE ---
//   // Taking reference from your authSlice structure
//   const token = useSelector(state => state.auth.token);
//   // const membershipNumber = useSelector(state => state.auth.membershipNumber);
  
//   // // Assuming your user object (name/phone) is also in auth state
//   // // If they are nested, adjust the path: state.auth.user.name
//   // const name = useSelector(state => state.auth.name || 'Member');
//   // const phone = useSelector(state => state.auth.phone || '');







//   const name = useSelector(state => state.auth.user?.name || 'Member'); 
// const phone = useSelector(state => state.auth.user?.phone || '');
// const membershipNumber = useSelector(state => state.auth.membershipNumber);

// console.log(name,"qr name")

//   return (
//     <View style={{ flex: 1 }}>

//       {token ? (
//         // --- CASE 1: USER IS LOGGED IN (TOKEN EXISTS) ---
//         <View style={styles.qrContainer}>
//           <Text style={styles.headerText}>COLONY LOYALTY PASS</Text>
//         <Text style={styles.headerText}>Loyalty Points</Text>
//  <Text style={styles.headerText}>200</Text>
           
            
          
//           <View style={styles.qrBox}>
            
//             <QRCode
//               // Referencing name and phone as requested
//               value={JSON.stringify({
//                 name: name,
//                 phone: phone,
//                 membership: membershipNumber
//               })}
//               size={220}
//               color={Colors.BLACK}
//               backgroundColor={Colors.WHITE}
//             />
//           </View>

//         <View style={styles.infoBox}>
//   {/* <Text style={styles.nameText}>{name}</Text>
//   {/* Show phone only if it exists in Redux */}
//   {/* {phone ? <Text style={styles.phoneText}>{phone}</Text> : null}
//   // <Text style={styles.idText}>Member ID: {membershipNumber}</Text> */} 
// </View>
//         </View>
//       ) : (
//         // --- CASE 2: USER IS GUEST (NO TOKEN) ---
//         <ImageBackground source={AppImages.loginBg} style={styles.container}>
//           <View style={styles.header}>
//             <Text style={styles.colony}>COLONY</Text>
//             <AppButton
//               text={'LOGIN'}
//               onPress={() => navigation.navigate('Login')}
//               style={styles.authBtn}
//               textStyle={styles.authBtnText}
//             />
//             <Text style={styles.colony1}>OR</Text>
//             <AppButton
//               text={'JOIN NOW'}
//               onPress={() => navigation.navigate('Signup')}
//               style={styles.authBtn}
//               textStyle={styles.authBtnText}
//             />
//             <Text style={styles.colony1}>ABOUT COLONY</Text>
//           </View>
//         </ImageBackground>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   colony: { fontSize: 50, fontFamily: Fonts.SemiBold, color: Colors.WHITE, textAlign: 'center' },
//   colony1: { fontSize: 15, fontFamily: Fonts.SemiBold, color: Colors.WHITE, textAlign: 'center', marginTop: 20 },
//   authBtn: { backgroundColor: Colors.WHITE, width: 250, marginTop: 20 },
//   authBtnText: { color: Colors.BLACK, fontFamily: Fonts.regular, letterSpacing: 2 },
  
//   // QR View Styles
//   qrContainer: { flex: 1, backgroundColor: Colors.WHITE, alignItems: 'center', justifyContent: 'center' },
//   headerText: { fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.BLACK, marginBottom: 40, letterSpacing: 1 },
//   qrBox: { 
//     padding: 20, 
//     backgroundColor: Colors.WHITE, 
//     borderRadius: 20, 
//     elevation: 8, 
//     shadowColor: '#000', 
//     shadowOffset: { width: 0, height: 4 }, 
//     shadowOpacity: 0.3,
//     shadowRadius: 4.65,
//   },
//   infoBox: { marginTop: 30, alignItems: 'center' },
//   nameText: { fontFamily: Fonts.SemiBold, fontSize: 24, color: Colors.BLACK },
//   phoneText: { fontFamily: Fonts.regular, fontSize: 16, color: Colors.DARK_GREY, marginTop: 5 },
//   idText: { fontFamily: Fonts.SemiBold, fontSize: 14, color: Colors.BLACK, marginTop: 10, opacity: 0.6 }
// });

////////////////////////////safeside code

// import React from 'react';
// import { 
//   StyleSheet, 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   ScrollView, 
//   ImageBackground,
//   Image 
// } from 'react-native'; 
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';
// import { Fonts, Colors, AppImages } from '../res';
// import AppButton from '../components/AppButton';

// export default function Loyalty() {
//   const navigation = useNavigation(); 
//   const token = useSelector(state => state.auth.token);
//   const loyaltyPoints = 200; 

//   if (!token) {
//     return (
//       <ImageBackground source={AppImages.loginBg} style={styles.guestContainer}>
//         <Text style={styles.colonyTitle}>COLONY22</Text>
//         <AppButton text={'LOGIN'} onPress={() => navigation.navigate('Login')} style={styles.authBtn} />
//         <AppButton text={'JOIN NOW'} onPress={() => navigation.navigate('Signup')} style={styles.authBtn} />
//       </ImageBackground>
//     );
//   }

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       {/* --- PROFESSIONAL COLONY CARD --- */}
//       <TouchableOpacity 
//         activeOpacity={0.9} 
//         style={styles.clubCard}
//         onPress={() => navigation.navigate('LoyaltyPass')}
//       >
//         {/* Subtle Logo Watermark in background */}
//         <Image source={AppImages.logo} style={styles.cardWatermark} resizeMode="contain" />

//         <View style={styles.cardTopRow}>
//           <View>
//              {/* <Image source={AppImages.logo} style={styles.miniLogo} resizeMode="contain" /> */}
//              <Text style={styles.cardType}>CLUBCARD</Text>
//           </View>
//           {/* <View style={styles.tierBadge}>
//              <Text style={styles.tierText}>GOLD</Text>
//           </View> */}
//         </View>

//         <View style={styles.tapActionRow}>
//           <View>
//             <Text style={styles.tapText}>Tap to scan</Text>
          
//           </View>
       
//         </View>
//       </TouchableOpacity>

//       {/* --- STATS SECTION --- */}
//       <View style={styles.statsContainer}>
//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Vouchers</Text>
//           <Text style={styles.statValue}>£{(loyaltyPoints / 10).toFixed(2)}</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statBox}>
//           <Text style={styles.statLabel}>Coupons</Text>
//           <Text style={styles.statValue}>6</Text>
//         </View>
//       </View>

//       {/* --- POINTS PROGRESS --- */}
//       <View style={styles.pointsWrapper}>
//         <View style={styles.pointsHeader}>
//             <Text style={styles.pointsNumber}>{loyaltyPoints}</Text>
//             <Text style={styles.pointsLabelText}>Total Points</Text>
//         </View>
//         <TouchableOpacity style={styles.activityBtn}>
//             <Text style={styles.activityText}>View Activity ❯</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8F9FA' },
//   // Card Design
//   clubCard: {
//     backgroundColor: '#B2975E',
//     height: 230,
//     margin: 20,
//     borderRadius: 24,
//     padding: 24,
//     justifyContent: 'space-between',
//     overflow: 'hidden', // Clips the watermark logo
//     elevation: 12,
//     shadowColor: '#B2975E',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 15,
//     marginTop: 30,
//   },
//   cardWatermark: {
//     position: 'absolute',
//     right: 100,
//     bottom: 40,
//     width: 150,
//     height: 150,
//     opacity: 0.30, // Very faint logo
//     tintColor: '#FFF',
//     // paddingTop:100
//   },
//   cardTopRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop:20 },
//   miniLogo: { width: 90, height: 40, tintColor: '#FFF' },
//   cardType: { color: '#FFF', fontSize: 18, fontWeight: '350', letterSpacing: 1, marginTop: 5 },
//   tierBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
//   tierText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  
//   // Tap Area
//   tapActionRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     // backgroundColor: 'rgba(255,255,255,0.15)', 
//     padding: 15, 
//     // borderRadius: 18,
//     // borderWidth: 1,
//     // borderColor: 'rgba(255,255,255,0.2)'
//   },
//   tapText: { color: '#FFF', fontSize: 18, fontWeight: '300' },
//   couponText: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
//   circleArrow: { backgroundColor: '#FFF', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
//   arrow: { color: '#B2975E', fontWeight: '900', fontSize: 18 },

//   // Stats Section
//   statsContainer: { 
//     flexDirection: 'row', 
//     marginHorizontal: 20, 
//     backgroundColor: '#FFF', 
//     borderRadius: 20, 
//     padding: 20,
//     alignItems: 'center',
//     elevation: 3
//   },
//   statBox: { flex: 1, alignItems: 'center' },
//   statDivider: { width: 1, height: 40, backgroundColor: '#EEE' },
//   statLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
//   statValue: { fontSize: 22, fontWeight: '800', color: '#222' },

//   // Points Section
//   pointsWrapper: { padding: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   pointsHeader: { alignItems: 'flex-start' },
//   pointsNumber: { fontSize: 56, fontWeight: '900', color: '#222' },
//   pointsLabelText: { fontSize: 16, color: '#666', marginTop: -8 },
//   activityBtn: { paddingVertical: 8 },
//   activityText: { color: '#B2975E', fontWeight: 'bold', fontSize: 16 },

//   // Guest View
//   guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   colonyTitle: { fontSize: 45, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
//   authBtn: { backgroundColor: '#B2975E', width: 280, marginTop: 15, borderRadius: 12 }
// });




import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground,
  Image,
  Dimensions
} from 'react-native'; 
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Fonts, Colors, AppImages } from '../res';
import AppButton from '../components/AppButton';

const { height } = Dimensions.get('window');

export default function Loyalty() {
  const navigation = useNavigation(); 
  const token = useSelector(state => state.auth.token);
  const loyaltyPoints = 200; 

  if (!token) {
    return (
      <ImageBackground source={AppImages.loginBg} style={styles.guestContainer}>
        <Text style={styles.colonyTitle}>COLONY22</Text>
        <AppButton text={'LOGIN'} onPress={() => navigation.navigate('Login')} style={styles.authBtn} />
        <AppButton text={'JOIN NOW'} onPress={() => navigation.navigate('Signup')} style={styles.authBtn} />
      </ImageBackground>
    );
  }

  return (
    // Changed ScrollView to a static full-height View container
    <View style={styles.container}>
      {/* --- PROFESSIONAL COLONY CARD --- */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={styles.clubCard}
        onPress={() => navigation.navigate('LoyaltyPass')}
      >
        <Image source={AppImages.logo} style={styles.cardWatermark} resizeMode="contain" />

        <View style={styles.cardTopRow}>
          <View>
             <Text style={styles.cardType}>CLUBCARD</Text>
          </View>
        </View>

        <View style={styles.tapActionRow}>
          <View>
            <Text style={styles.tapText}>Tap to scan</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* --- STATS SECTION --- */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Vouchers</Text>
          <Text style={styles.statValue}>£{(loyaltyPoints / 10).toFixed(2)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Coupons</Text>
          <Text style={styles.statValue}>6</Text>
        </View>
      </View>

      {/* --- POINTS PROGRESS --- */}
      <View style={styles.pointsWrapper}>
        <View style={styles.pointsHeader}>
            <Text style={styles.pointsNumber}>{loyaltyPoints}</Text>
            <Text style={styles.pointsLabelText}>Total Points</Text>
        </View>
        <TouchableOpacity style={styles.activityBtn}>
            <Text style={styles.activityText}>View Activity ❯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA',
    justifyContent: 'space-between', // Distributes content neatly within fixed view
    paddingBottom: height * 0.04, // Generates consistent spacing from home indicator across devices
  },
  // Card Design
  clubCard: {
    backgroundColor: '#B2975E',
    height: height * 0.26, // Scaled responsive height so it never vertically pushes other elements
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden', 
    elevation: 12,
    shadowColor: '#B2975E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    marginTop: height * 0.04, // Responsive margin alignment from the top bar
  },
  cardWatermark: {
    position: 'absolute',
    right: 100,
    bottom: 40,
    width: 150,
    height: 150,
    opacity: 0.30, 
    tintColor: '#FFF',
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10 },
  cardType: { color: '#FFF', fontSize: 18, fontWeight: '350', letterSpacing: 1, marginTop: 5 },
  
  // Tap Area
  tapActionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
  },
  tapText: { color: '#FFF', fontSize: 18, fontWeight: '300' },

  // Stats Section
  statsContainer: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    marginVertical: 15
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 40, backgroundColor: '#EEE' },
  statLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#222' },

  // Points Section
  pointsWrapper: { 
    paddingHorizontal: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 'auto' // Pulls bottom points interface anchored right above secure margins
  },
  pointsHeader: { alignItems: 'flex-start' },
  pointsNumber: { fontSize: 56, fontWeight: '900', color: '#222', lineHeight: 60 },
  pointsLabelText: { fontSize: 16, color: '#666', marginTop: 0 },
  activityBtn: { paddingVertical: 8 },
  activityText: { color: '#B2975E', fontWeight: 'bold', fontSize: 16 },

  // Guest View
  guestContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  colonyTitle: { fontSize: 45, color: '#FFF', fontWeight: 'bold', marginBottom: 20 },
  authBtn: { backgroundColor: '#B2975E', width: 280, marginTop: 15, borderRadius: 12 }
});