import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/register/Register';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login/Login';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="login"
      >
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
