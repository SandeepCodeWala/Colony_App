import React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import MainStack from './src/navigator/MainStack';

const App = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
