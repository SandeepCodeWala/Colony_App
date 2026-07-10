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
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: false,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [focused, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [4, -3] });
  const indicatorWidth = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 24] });
  const indicatorOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.tabItem, { transform: [{ translateY }] }]}>
      <Animated.View
        style={[
          styles.activeIndicator,
          { width: indicatorWidth, opacity: indicatorOpacity },
        ]}
      />
      <View style={[styles.iconBox, focused && styles.activeIconBox]}>
        <Image source={icon} style={[styles.icon, { tintColor: focused ? T.primaryDark : T.softMuted }]} />
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
    left: 16,
    right: 16,
    bottom: 12,
    height: 76,
    borderRadius: 28,
    backgroundColor: 'rgba(255,253,248,0.96)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: T.champagne,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: T.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  tabBarItem: { height: 60, justifyContent: 'center', alignItems: 'center' },
  tabItem: {
    width: '100%',
    height: 60,
    paddingHorizontal: 2,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: 3,
    backgroundColor: T.primary,
    alignSelf: 'center',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeIconBox: {
    backgroundColor: T.primarySoft,
    borderColor: T.champagne,
    shadowColor: T.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  icon: { width: 18, height: 18, resizeMode: 'contain' },
  label: {
    marginTop: 4,
    fontFamily: Fonts.instrumentSansMedium,
    fontSize: 10.2,
    color: T.softMuted,
    letterSpacing: 0.15,
  },
  activeLabel: {
    color: T.primaryDark,
    fontFamily: Fonts.instrumentSansBold || Fonts.instrumentSansMedium,
    fontSize: 10.8,
  },
});
