import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login/Login';
import DrawerNavigator from './DrawerNavigation';
import Register from '../screens/register/Register';
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
import auth from '@react-native-firebase/auth';
import UserProfile from '../screens/Stack/screens/UserProfile';
import Chat from '../screens/Stack/screens/Chat';
import UserChat from '../screens/Stack/screens/UserChat';
import useUserStatus from '../hooks/userStatus/useStatus';
export type RootStackParamList = {
  login: undefined;
  register: undefined;
  mainApp: undefined;
  home: undefined;
  userProfile: undefined;
  chat: undefined;
  userChat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthStack() {
  const user = auth().currentUser;
  useUserStatus();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={user ? 'mainApp' : 'login'}
      >
        <Stack.Screen name="mainApp" component={DrawerNavigator} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="userProfile" component={UserProfile} />
        <Stack.Screen name="chat" component={Chat} />
        <Stack.Screen name="userChat" component={UserChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
