import React, { useEffect, useRef } from 'react';
import { Image, View, Text, StyleSheet, Animated } from 'react-native';
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

const TabItem = ({ focused, icon, label }) => {
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
      speed: 16,
      bounciness: 7,
    }).start();
  }, [focused, scale]);

  const translateY = scale.interpolate({ inputRange: [0, 1], outputRange: [2, -5] });
  const pillOpacity = scale.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.tabItem, { transform: [{ translateY }] }]}>
      <Animated.View style={[styles.activePill, { opacity: pillOpacity }]} />
      <View style={[styles.iconBox, focused && styles.activeIconBox]}>
        <Image source={icon} style={[styles.icon, { tintColor: focused ? T.surface : T.softMuted }]} />
      </View>
      <Text numberOfLines={1} style={[styles.label, focused && styles.activeLabel]}>
        {label}
      </Text>
    </Animated.View>
  );
};

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
      <Tab.Screen name="Explore" component={Home} options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.explore} label="Explore" /> }} />
      <Tab.Screen name="Book" component={BookScreen} options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.calender} label="Reserve" /> }} />
      <Tab.Screen name={loyaltyScreen} component={loyaltyScreen === 'Loyalty' ? Loyalty : MemberScreen} options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.loyalty} label="Loyalty" /> }} />
      <Tab.Screen name="Account" component={isLoggedIn ? Settings : Login} options={{ tabBarIcon: ({ focused }) => <TabItem focused={focused} icon={AppImages.Account} label="Account" /> }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 10,
    height: 84,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: T.border,
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 10,
    shadowColor: T.shadow,
    shadowOpacity: 0.20,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 13 },
    elevation: 18,
  },
  tabBarItem: { height: 64, justifyContent: 'center', alignItems: 'center' },
  tabItem: { width: 76, height: 64, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  activePill: {
    position: 'absolute',
    top: 3,
    bottom: 0,
    left: 6,
    right: 6,
    borderRadius: 26,
    backgroundColor: T.primarySoft,
    borderWidth: 1,
    borderColor: T.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: T.surfaceSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: T.line,
  },
  activeIconBox: {
    backgroundColor: T.primary,
    borderColor: T.primary,
    shadowColor: T.primary,
    shadowOpacity: 0.30,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  icon: { width: 18, height: 18, resizeMode: 'contain' },
  label: {
    marginTop: 4,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 10.5,
    color: T.softMuted,
    letterSpacing: 0.2,
  },
  activeLabel: { color: T.primaryDark, fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium, fontSize: 11 },
});
