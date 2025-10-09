import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

import MainStack from './src/navigator/MainStack';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  return (
       <Provider store={store}>
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
    </Provider>
  );
};

export default App;
