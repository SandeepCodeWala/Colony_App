import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppImages } from '../res';
import Home from '../Dashboard/Home';
import Settings from '../Dashboard/settings';
import BookScreen from '../screens/BookScreen';
import Loyalty from '../Dashboard/Loyalty';
import MemberScreen from '../screens/MemberScreen';
import { useSelector } from 'react-redux';
import PremiumTheme from '../res/PremiumTheme';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const user = useSelector(state => state.auth.user);
  const screen = user?.name ? 'MemberScreen' : 'Loyalty';

  const iconStyle = focused => ({
    width: 21,
    height: 21,
    tintColor: focused ? PremiumTheme.goldDark : PremiumTheme.muted,
  });

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 11, marginBottom: 4, fontWeight: '600' },
        tabBarActiveTintColor: PremiumTheme.goldDark,
        tabBarInactiveTintColor: PremiumTheme.muted,
        tabBarStyle: {
          backgroundColor: PremiumTheme.surface,
          borderTopColor: PremiumTheme.border,
          height: 66,
          paddingTop: 7,
          shadowColor: PremiumTheme.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          elevation: 8,
        },
      })}
    >
      <Tab.Screen name="Explore" component={Home} options={{ tabBarLabel: 'Explore', tabBarIcon: ({ focused }) => <Image source={AppImages.explore} style={iconStyle(focused)} /> }} />
      <Tab.Screen name="Book" component={BookScreen} options={{ tabBarLabel: 'Book', tabBarIcon: ({ focused }) => <Image source={AppImages.calender} style={iconStyle(focused)} /> }} />
      <Tab.Screen name={screen} component={screen === 'Loyalty' ? Loyalty : MemberScreen} options={{ tabBarLabel: 'Loyalty', tabBarIcon: ({ focused }) => <Image source={AppImages.loyalty} style={iconStyle(focused)} /> }} />
      <Tab.Screen name="Account" component={Settings} options={{ tabBarLabel: 'Account', tabBarIcon: ({ focused }) => <Image source={AppImages.Account} style={iconStyle(focused)} /> }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
