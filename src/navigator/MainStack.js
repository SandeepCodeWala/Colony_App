import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../OnBoarding/Login';
import Signup from '../OnBoarding/Signup';
import RestaurantList from '../OnBoarding/RestorentList';
import BottomTabs from './BottomTabStack';
import RightArrow from '../components/RightArrow';
import ChangePassword from '../screens/ChangePassword';
import EditProfile from '../screens/EditProfile';
import ManageConsents from '../screens/ManageConsents';
import TermsConditions from '../screens/TermsConditions';
import ReserveTable from '../screens/ReserveTable1';
import ReserveTable2 from '../screens/ReserveTable2';
import OTPValidate from '../OnBoarding/OTPValidate';
import SignupOTPValidate from '../OnBoarding/SignupOTPValidate';
import ReserveTableScreen from '../screens/ReserveTableScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReserveLoungeScreen from '../screens/ReserveTable1';
import ForgotPassword from '../OnBoarding/ForgotPassword';
import MemberScreen from '../screens/MemberScreen';
import BookEventScreen from '../screens/BookEventScreen';
import ReservationHistory from '../screens/ReservationHistory';
import MyStatement from '../screens/MyStatement';
import LoyaltyPass from '../screens/LoyaltyPass';
import { useSelector } from 'react-redux';
import MyBenefits from '../screens/MyBenefits';
import RegisteredOffers from '../screens/RegisteredOffers';
import HelpSupport from '../screens/HelpSupportScreen';
import { ScreenSkeleton, useFirstRenderSkeleton } from '../components/LuxurySkeleton';

const Stack = createNativeStackNavigator();

const withPageSkeleton = (Component, duration = 620) => {
  const WrappedScreen = props => {
    const loading = useFirstRenderSkeleton(duration);
    if (loading) return <ScreenSkeleton variant="page" />;
    return <Component {...props} />;
  };
  WrappedScreen.displayName = `WithPageSkeleton(${Component.displayName || Component.name || 'Screen'})`;
  return WrappedScreen;
};

const SignupScreen = withPageSkeleton(Signup);
const RestaurantListScreen = withPageSkeleton(RestaurantList);
const ChangePasswordScreen = withPageSkeleton(ChangePassword);
const EditProfileScreen = withPageSkeleton(EditProfile);
const ReserveTableScreenOne = withPageSkeleton(ReserveTable);
const ReserveTableScreenTwo = withPageSkeleton(ReserveTable2);
const ReserveLoungeWrapped = withPageSkeleton(ReserveLoungeScreen);
const ReserveTableFlowScreen = withPageSkeleton(ReserveTableScreen);
const PaymentWrapped = withPageSkeleton(PaymentScreen);
const BookEventWrapped = withPageSkeleton(BookEventScreen);
const ReservationHistoryWrapped = withPageSkeleton(ReservationHistory);
const LoyaltyPassWrapped = withPageSkeleton(LoyaltyPass);

function MainStack() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const isBooting = useFirstRenderSkeleton(1150);

  if (isBooting) return <ScreenSkeleton variant="page" />;

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? 'BottomTabs' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#F7F1E8' },
      }}
    >
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupport} />
      <Stack.Screen name="ManageConsents" component={ManageConsents} />
      <Stack.Screen name="MyStatement" component={MyStatement} />
      <Stack.Screen name="LoyaltyPass" component={LoyaltyPassWrapped} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTPValidate" component={OTPValidate} />
      <Stack.Screen name="SignupOTPValidate" component={SignupOTPValidate} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
      <Stack.Screen name="RightArrow" component={RightArrow} />
      <Stack.Screen name="ReserveTable" component={ReserveTableScreenOne} />
      <Stack.Screen name="ReserveTable2" component={ReserveTableScreenTwo} />
      <Stack.Screen name="ReserveLounge" component={ReserveLoungeWrapped} />
      <Stack.Screen name="MemberScreen" component={MemberScreen} />
      <Stack.Screen name="ReserveTableScreen" component={ReserveTableFlowScreen} />
      <Stack.Screen name="Payment" component={PaymentWrapped} />
      <Stack.Screen name="BookEvent" component={BookEventWrapped} />
      <Stack.Screen name="ReservationHistory" component={ReservationHistoryWrapped} />
      <Stack.Screen name="MyBenefits" component={MyBenefits} />
      <Stack.Screen name="RegisteredOffers" component={RegisteredOffers} />
    </Stack.Navigator>
  );
}

export default MainStack;
