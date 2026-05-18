import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Login/Login';
import DrawerNavigator from './DrawerNavigation';
import Register from '../screens/register/Register';
// import Home from '../screens/Home/home';
import auth from '@react-native-firebase/auth';
export type RootStackParamList = {
  login: undefined;
  register: undefined;
  mainApp: undefined;
  home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AuthStack() {
  const user = auth().currentUser;
  console.log('user exist==========', user?._user?.email);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Screen name="mainApp" component={DrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
