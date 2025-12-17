import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import MainStack from './src/navigator/MainStack';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/services/Toast';
import CardDetailsScreen from './src/screens/PaymentScreen';
import ReservationsHistory from './src/screens/ReservationHistory';
import ReserveLoungeScreen from './src/screens/ReserveTable1';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  console.log('🟢 Stripe Key:', STRIPE_PUBLISHABLE_KEY);

  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.colony.app"
        urlScheme="colony"
      >
        <NavigationContainer ref={navigationRef}>
          <MainStack />
          {/* <ReserveLoungeScreen /> */}
          {/* <   CardDetailsScreen /> */}
          {/* <ReservationsHistory/> */}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

export default App;
