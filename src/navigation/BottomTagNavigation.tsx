// import React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Home from '../screens/Stack/screens/Home';
// import Search from '../screens/Stack/screens/Search';
// import AddPost from '../screens/Stack/screens/AddPost';
// import Profile from '../screens/Stack/screens/Profile';
// import Notification from '../screens/Stack/screens/Notification';

// import { BottomTabParamList } from '../interface/type';
// import { icon } from '../assets/icons/icon';
// import { DrawerActions } from '@react-navigation/native';
// import { useTranslation } from 'react-i18next';
// import { useAppTheme } from '../hooks/theme/themeContext';
// import { wp } from '../constants/responsiveUI';
// const Tab = createBottomTabNavigator<BottomTabParamList>();

// export default function BottomTabNavigator() {
//   const { t } = useTranslation();
//   const { theme } = useAppTheme();
//   return (
//     <Tab.Navigator
//       screenOptions={({ route, navigation }) => ({
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: theme.text,
//         tabBarInactiveTintColor: theme.text,
//         headerTitleAlign: 'center',
//         headerTitleStyle: {
//           marginTop: wp(20),
//         },
//         headerStyle: {
//           backgroundColor: theme.background,
//         },
//         headerTintColor: theme.text,
//         tabBarStyle: {
//           backgroundColor: theme.background,
//         },
//         // eslint-disable-next-line react/no-unstable-nested-components
//         headerLeft: () => (
//           <TouchableOpacity
//             style={styles.drawerButton}
//             onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//           >
//             <Text style={[styles.menuText, { color: theme.text }]}>☰</Text>
//           </TouchableOpacity>
//         ),
//         // eslint-disable-next-line react/no-unstable-nested-components
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconSource;

//           if (route.name === 'Home') {
//             iconSource = focused ? icon.activeHome : icon.inActiveHome;
//           } else if (route.name === 'Search') {
//             iconSource = focused ? icon.activeSearch : icon.inActiveSearch;
//           } else if (route.name === 'AddPost') {
//             iconSource = focused ? icon.activePost : icon.inActivePost;
//           } else if (route.name === 'Notification') {
//             iconSource = focused
//               ? icon.activeNotification
//               : icon.inActiveNotification;
//           } else if (route.name === 'Profile') {
//             iconSource = focused ? icon.activeUser : icon.inActiveUser;
//           }

//           return (
//             <View>
//               <Image
//                 source={iconSource}
//                 style={{ width: size, height: size, tintColor: color }}
//               />
//             </View>
//           );
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} options={{ title: t('Home') }} />
//       <Tab.Screen
//         name="Search"
//         component={Search}
//         options={{ title: t('Search') }}
//       />
//       <Tab.Screen
//         name="AddPost"
//         component={AddPost}
//         options={{ title: t('Add Post') }}
//       />
//       <Tab.Screen
//         name="Notification"
//         component={Notification}
//         options={{ title: t('Notification') }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={Profile}
//         options={{ title: t('Profile') }}
//       />
//     </Tab.Navigator>
//   );
// }
// const styles = StyleSheet.create({
//   drawerButton: {
//     marginLeft: 20,
//     marginTop: 20,
//   },

//   menuText: {
//     fontSize: 28,
//     color: '#000',
//   },
// });
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Stack/screens/Home';
import Search from '../screens/Stack/screens/Search';
import AddPost from '../screens/Stack/screens/AddPost';
import Profile from '../screens/Stack/screens/Profile';
import Notification from '../screens/Stack/screens/Notification';

import { BottomTabParamList } from '../interface/type';
import { icon } from '../assets/icons/icon';
import { CommonActions, DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/theme/themeContext';
import { wp } from '../constants/responsiveUI';
import useUserStatus from '../hooks/userStatus/useStatus';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  useUserStatus();
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.text,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          marginTop: wp(20),
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
        },

        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <TouchableOpacity
            style={styles.drawerButton}
            activeOpacity={0.8}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Text
              style={[
                styles.menuText,
                {
                  color: theme.text,
                },
              ]}
            >
              ☰
            </Text>
          </TouchableOpacity>
        ),

        // eslint-disable-next-line react/no-unstable-nested-components
        headerRight: () =>
          route.name === 'Home' ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.chatButton}
              onPress={() =>
                navigation.dispatch(CommonActions.navigate('chat'))
              }
            >
              <Image
                source={icon.chat}
                style={[
                  styles.chatIcon,
                  {
                    tintColor: theme.text,
                  },
                ]}
              />
            </TouchableOpacity>
          ) : null,

        /**
         * TAB ICONS
         */

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
            <View>
              <Image
                source={iconSource}
                style={{
                  width: size,
                  height: size,
                  tintColor: color,
                }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('Home'),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: t('Search'),
        }}
      />

      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={{
          title: t('Add Post'),
        }}
      />

      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: t('Notification'),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t('Profile'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerButton: {
    marginLeft: 20,
    marginTop: 20,
  },

  menuText: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  chatButton: {
    marginRight: 20,
    marginTop: 20,
  },

  chatIcon: {
    width: wp(26),
    height: wp(26),
    resizeMode: 'contain',
  },
});
