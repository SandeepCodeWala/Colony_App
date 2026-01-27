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


import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import { AppImages, Fonts, Colors } from '../res';
import AppButton from '../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'; // Redux Hooks
import QRCode from 'react-native-qrcode-svg';

export default function Loyalty(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  // Taking reference from your authSlice structure
  const token = useSelector(state => state.auth.token);
  // const membershipNumber = useSelector(state => state.auth.membershipNumber);
  
  // // Assuming your user object (name/phone) is also in auth state
  // // If they are nested, adjust the path: state.auth.user.name
  // const name = useSelector(state => state.auth.name || 'Member');
  // const phone = useSelector(state => state.auth.phone || '');







  const name = useSelector(state => state.auth.user?.name || 'Member'); 
const phone = useSelector(state => state.auth.user?.phone || '');
const membershipNumber = useSelector(state => state.auth.membershipNumber);

console.log(name,"qr name")

  return (
    <View style={{ flex: 1 }}>

      {token ? (
        // --- CASE 1: USER IS LOGGED IN (TOKEN EXISTS) ---
        <View style={styles.qrContainer}>
          <Text style={styles.headerText}>COLONY LOYALTY PASS</Text>
        <Text style={styles.headerText}>Loyalty Points</Text>
 <Text style={styles.headerText}>200</Text>
           
            
          
          <View style={styles.qrBox}>
            
            <QRCode
              // Referencing name and phone as requested
              value={JSON.stringify({
                name: name,
                phone: phone,
                membership: membershipNumber
              })}
              size={220}
              color={Colors.BLACK}
              backgroundColor={Colors.WHITE}
            />
          </View>

        <View style={styles.infoBox}>
  {/* <Text style={styles.nameText}>{name}</Text>
  {/* Show phone only if it exists in Redux */}
  {/* {phone ? <Text style={styles.phoneText}>{phone}</Text> : null}
  // <Text style={styles.idText}>Member ID: {membershipNumber}</Text> */} 
</View>
        </View>
      ) : (
        // --- CASE 2: USER IS GUEST (NO TOKEN) ---
        <ImageBackground source={AppImages.loginBg} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.colony}>COLONY</Text>
            <AppButton
              text={'LOGIN'}
              onPress={() => navigation.navigate('Login')}
              style={styles.authBtn}
              textStyle={styles.authBtnText}
            />
            <Text style={styles.colony1}>OR</Text>
            <AppButton
              text={'JOIN NOW'}
              onPress={() => navigation.navigate('Signup')}
              style={styles.authBtn}
              textStyle={styles.authBtnText}
            />
            <Text style={styles.colony1}>ABOUT COLONY</Text>
          </View>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  colony: { fontSize: 50, fontFamily: Fonts.SemiBold, color: Colors.WHITE, textAlign: 'center' },
  colony1: { fontSize: 15, fontFamily: Fonts.SemiBold, color: Colors.WHITE, textAlign: 'center', marginTop: 20 },
  authBtn: { backgroundColor: Colors.WHITE, width: 250, marginTop: 20 },
  authBtnText: { color: Colors.BLACK, fontFamily: Fonts.regular, letterSpacing: 2 },
  
  // QR View Styles
  qrContainer: { flex: 1, backgroundColor: Colors.WHITE, alignItems: 'center', justifyContent: 'center' },
  headerText: { fontFamily: Fonts.SemiBold, fontSize: 18, color: Colors.BLACK, marginBottom: 40, letterSpacing: 1 },
  qrBox: { 
    padding: 20, 
    backgroundColor: Colors.WHITE, 
    borderRadius: 20, 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  infoBox: { marginTop: 30, alignItems: 'center' },
  nameText: { fontFamily: Fonts.SemiBold, fontSize: 24, color: Colors.BLACK },
  phoneText: { fontFamily: Fonts.regular, fontSize: 16, color: Colors.DARK_GREY, marginTop: 5 },
  idText: { fontFamily: Fonts.SemiBold, fontSize: 14, color: Colors.BLACK, marginTop: 10, opacity: 0.6 }
});