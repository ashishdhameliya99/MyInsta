import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import BottomTabNavigator from './BottomTagNavigation';
import CustomDrawer from './CustomDrawer';

import { DrawerParamList } from '../interface/type';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
// import React from 'react';

// import { createDrawerNavigator } from '@react-navigation/drawer';

// import BottomTabNavigator from './BottomTagNavigation';

// import CustomDrawer from './CustomDrawer';

// const Drawer = createDrawerNavigator();

// export default function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawer {...props} />}
//       screenOptions={{
//         headerShown: false,
//         drawerType: 'slide',
//       }}
//     >
//       <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
//     </Drawer.Navigator>
//   );
// }
