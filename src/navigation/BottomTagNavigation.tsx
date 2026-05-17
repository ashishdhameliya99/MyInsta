import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Stack/Home';
import Search from '../screens/Stack/Search';
import AddPost from '../screens/Stack/AddPost';
import Notification from '../screens/Stack/Notification';
import Profile from '../screens/Stack/Profile';

import { BottomTabParamList } from '../interface/type';
import { Image } from 'react-native';

import { icon } from '../assets/icons/icon';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#888',
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = focused ? icon.activeHome : icon.inActiveHome;
          } else if (route.name === 'Search') {
            iconSource = focused ? icon.activeSearch : icon.inActiveSearch;
          } else if (route.name === 'AddPost') {
            iconSource = focused ? icon.activePost : icon.inActivePost;
          } else if (route.name === 'Notification') {
            iconSource = focused
              ? icon.activeNotification
              : icon.inActiveNotification;
          } else if (route.name === 'Profile') {
            iconSource = focused ? icon.activeUser : icon.inActiveUser;
          }

          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="AddPost" component={AddPost} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
