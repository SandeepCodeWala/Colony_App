import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../OnBoarding/Splash';
import Login from '../OnBoarding/Login';
import Signup from '../OnBoarding/Signup';
import RestaurantList from '../OnBoarding/RestorentList';
import BottomTabs from './BottomTabStack';

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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {enableSplash && <Stack.Screen name="Splash" component={Splash} />}
      <Stack.Screen name="BottomTabs" component={BottomTabs} />

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="RestaurantList" component={RestaurantList} />

      {/* <Stack.Screen name="BottomTabs" component={BottomTabs} /> */}
    </Stack.Navigator>
  );
}
export default MainStack;
