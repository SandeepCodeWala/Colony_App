import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '@env';
import MainStack from './src/navigator/MainStack';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/services/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserData } from './src/redux/slices/authSlice';

const AppContent = () => {
  const navigationRef = useNavigationContainerRef();
  const dispatch = useDispatch();

  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');

      if (token && user) {
        dispatch(
          setUserData({
            token,
            user: JSON.parse(user),
          }),
        );
        setInitialRoute('BottomTabs');
      } else {
        setInitialRoute('Login');
      }
    };

    checkLogin();
  }, [dispatch]);

  if (!initialRoute) return null;

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.colony.app"
      urlScheme="colony"
    >
      <NavigationContainer ref={navigationRef}>
        <MainStack initialRoute={initialRoute} />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </StripeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
