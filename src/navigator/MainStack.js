import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../OnBoarding/Splash';
import Login from '../OnBoarding/Login';
import Signup from '../OnBoarding/Signup';
import RestaurantList from '../OnBoarding/RestorentList';
import BottomTabs from './BottomTabStack';
import RightArrow from '../components/RightArrow';
import ChangePassword from '../screens/ChangePassword';
import EditProfile from '../screens/EditProfile';
import ManageConsents from '../screens/ManageConsents';
import HelpSupport from '../screens/ChangePassword';
import TermsConditions from '../screens/TermsConditions';
import ReserveTable from '../screens/ReserveTable1';
import ReserveTable2 from '../screens/ReserveTable2';
import ReserveLounge from '../screens/ReserveLounge';
import OTPValidate from '../OnBoarding/OTPValidate';
import ReserveTableScreen from '../screens/ReserveTableScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReserveLoungeScreen from '../screens/ReserveTable1';
import ForgotPassword from '../OnBoarding/ForgotPassword'
import MemberScreen from '../screens/MemberScreen'
import BookEventScreen from '../screens/BookEventScreen'
 
const Stack = createNativeStackNavigator();
function MainStack() {
  const [enableSplash, setEnableSplash] = useState(true);
 
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setEnableSplash(false);
    }, 2000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return (
    <Stack.Navigator initialRouteName='Splash' screenOptions={{ headerShown: false }}>
      {enableSplash && <Stack.Screen  name="Splash" component={Splash} />}
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="ManageConsents" component={ManageConsents} />
      {/* <Stack.Screen name="MyStatement" component={MyStatement} /> */}
    
      {/* <Stack.Screen name="RegisteredOffice" component={RegisteredOffice} /> */}
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
 
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="RestaurantList" component={RestaurantList} />
       <Stack.Screen name="RightArrow" component={RightArrow} />
         <Stack.Screen name="ReserveTable" component={ReserveTable} />
            <Stack.Screen name="ReserveTable2" component={ReserveTable2} />
         <Stack.Screen name="ReserveLounge" component={ReserveLoungeScreen} />
         <Stack.Screen name="MemberScreen" component={MemberScreen} />

         <Stack.Screen name="ReserveTableScreen" component={ReserveTableScreen} />
         <Stack.Screen name="OTPValidate" component={OTPValidate} />
         <Stack.Screen name="Payment" component={PaymentScreen} />
         <Stack.Screen name="BookEvent" component={BookEventScreen} />




 
 
      {/* <Stack.Screen name="BottomTabs" component={BottomTabs} /> */}
    </Stack.Navigator>
  );
}
export default MainStack;
 