import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from '../screens/register/Register';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../screens/Login/Login';
import home from '../screens/Home/home';
import Home from '../screens/Stack/Home';
import Notification from '../screens/Stack/Notification';
import Profile from '../screens/Stack/Profile';
import Search from '../screens/Stack/Search';

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
        <Stack.Screen name="home" component={home} />
        <Stack.Screen name="homes" component={Home} />
        <Stack.Screen name="notification" component={Notification} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="search" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
// import React from 'react';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import { NavigationContainer } from '@react-navigation/native';

// import Register from '../screens/register/Register';
// import Login from '../screens/Login/Login';

// import DrawerNavigator from './DrawerNavigation';

// const Stack = createNativeStackNavigator();

// export default function AuthStack() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="login"
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="login" component={Login} />

//         <Stack.Screen name="register" component={Register} />

//         <Stack.Screen name="drawer" component={DrawerNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
