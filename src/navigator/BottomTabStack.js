import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { AppImages, Fonts } from '../res';
import Home from '../Dashboard/Home';
import Settings from '../Dashboard/settings';
import BookScreen from '../screens/BookScreen';
import Loyalty from '../Dashboard/Loyalty';
import MemberScreen from '../screens/MemberScreen';
import Login from '../OnBoarding/Login';
import PremiumTheme from '../res/PremiumTheme';

const Tab = createBottomTabNavigator();
const T = PremiumTheme;

const TabItem = ({ focused, icon, label }) => (
  <View style={styles.tabItem}>
    <Image
      source={icon}
      style={[styles.icon, { tintColor: focused ? T.ink : T.softMuted }]}
      resizeMode="contain"
    />
    <Text style={[styles.label, focused && styles.activeLabel]}>{label}</Text>
    <View style={[styles.underline, focused && styles.activeUnderline]} />
  </View>
);

const BottomTabs = () => {
  const user = useSelector(state => state.auth.user);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const loyaltyScreen = user?.name ? 'MemberScreen' : 'Loyalty';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={Home}
        options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.explore} label="Explore" /> }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.calender} label="Book" /> }}
      />
      <Tab.Screen
        name={loyaltyScreen}
        component={loyaltyScreen === 'Loyalty' ? Loyalty : MemberScreen}
        options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.loyalty} label="My Colony" /> }}
      />
      <Tab.Screen
        name="Account"
        component={isLoggedIn ? Settings : Login}
        options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.Account} label="Menu" /> }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 94 : 78,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    backgroundColor: T.surfaceSoft,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarItem: { height: 64 },
  tabItem: {
    width: 80,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  icon: { width: 25, height: 25 },
  label: {
    marginTop: 7,
    color: T.softMuted,
    fontFamily: Fonts.luxurySansLight,
    fontSize: 11,
    letterSpacing: 0.1,
  },
  activeLabel: { color: T.ink, fontFamily: Fonts.luxurySans },
  underline: {
    width: 0,
    height: 1,
    marginTop: 2,
    backgroundColor: T.ink,
  },
  activeUnderline: { width: 40 },
});
