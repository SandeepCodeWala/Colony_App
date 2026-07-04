import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
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

const ACTIVE = '#B7782E';
const T = PremiumTheme;

const TabItem = ({ focused, icon, label }) => {
  return (
    <View style={[styles.tabItem]}>
      <View style={[styles.iconBox, focused && styles.activeIconBox]}>
        <Image
          source={icon}
          style={[styles.icon, { tintColor: focused ? '#FFFFFF' : '#9B8B7C' }]}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[styles.label, focused && styles.activeLabel]}
      >
        {label}
      </Text>
    </View>
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
      <Tab.Screen
        name="Explore"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              icon={AppImages.explore}
              label="Explore"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={AppImages.calender} label="Book" />
          ),
        }}
      />

      <Tab.Screen
        name={loyaltyScreen}
        component={loyaltyScreen === 'Loyalty' ? Loyalty : MemberScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              icon={AppImages.loyalty}
              label="Loyalty"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={isLoggedIn ? Settings : Login}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              focused={focused}
              icon={AppImages.Account}
              label="Account"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: 82,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 12,

    shadowColor: '#7E3F18',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
    // marginHorizontal: 8,
  },

  tabBarItem: {
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabItem: {
    width: 72,
    height: 62,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTabItem: {
    backgroundColor: '#FFF4E8',
    borderWidth: 1,
    borderColor: '#E7C39E',
  },

  activeDot: {
    position: 'absolute',
    top: 5,
    width: 22,
    height: 3,
    borderRadius: 3,
    backgroundColor: ACTIVE,
  },

  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8EFE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  activeIconBox: {
    backgroundColor: ACTIVE,
    shadowColor: ACTIVE,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  label: {
    marginTop: 4,
    fontFamily:
      Fonts.instrumentSansMedium || Fonts.instrumentSansRegular || 'System',
    fontSize: 11,
    color: '#9B8B7C',
    letterSpacing: 0.2,
  },

  activeLabel: {
    color: ACTIVE,
    fontSize: 11.5,
    fontWeight: '700',
  },
});
