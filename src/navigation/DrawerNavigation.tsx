import React from 'react';
import CustomDrawer from './CustomDrawer';
import { DrawerParamList } from '../interface/type';
import BottomTabNavigator from './BottomTagNavigation';
import { createDrawerNavigator } from '@react-navigation/drawer';

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
      <Drawer.Screen name="mainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
