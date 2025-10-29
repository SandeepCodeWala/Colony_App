import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native'; // ✅ ADD THIS LINE
import { STRIPE_PUBLISHABLE_KEY } from '@env'; // ✅ import from .env
import MainStack from './src/navigator/MainStack';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={STRIPE_PUBLISHABLE_KEY}
        merchantIdentifier="merchant.com.colony.app" // for Apple Pay (optional)
        urlScheme="colony" // for 3D Secure (optional)
      >
        <NavigationContainer ref={navigationRef}>
          <MainStack />
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
};

export default App;
