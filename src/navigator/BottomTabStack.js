import React from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppImages, Colors } from '../res';
import Home from '../Dashboard/Home';
import Settings from '../Dashboard/settings';
import BookScreen from '../screens/BookScreen';
import Loyalty from '../Dashboard/Loyalty';
import MemberScreen from '../screens/MemberScreen';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const user = useSelector(state => state.auth.user);

  const screen = user?.name ? 'MemberScreen' : 'Loyalty';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabelStyle: { fontSize: 10 },
        tabBarActiveTintColor: Colors.APPBLACK,
        tabBarStyle: { backgroundColor: Colors.WHITE },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={Home}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? AppImages.explore : AppImages.explore}
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? Colors.MEDIUMTURQUOISE : '',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Book"
        component={BookScreen}
        options={{
          tabBarLabel: 'Book',
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 24, height: 24 }}>
              <Image
                source={focused ? AppImages.calender : AppImages.calender}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? Colors.MEDIUMTURQUOISE : '',
                }}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={screen}
        component={screen === 'Loyalty' ? Loyalty : MemberScreen}
        options={{
          tabBarLabel: 'Loyalty',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? AppImages.loyalty : AppImages.loyalty}
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? Colors.MEDIUMTURQUOISE : '',
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Settings}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? AppImages.Account : AppImages.Account}
              style={{
                width: 20,
                height: 20,
                tintColor: focused ? Colors.MEDIUMTURQUOISE : '',
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
