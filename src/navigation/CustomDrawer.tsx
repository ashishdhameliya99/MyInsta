import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const [userData, setUserData] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const user = auth().currentUser;

    if (user) {
      try {
        const documentSnapshot = await firestore()
          .collection('usersData')
          .doc(user.uid)
          .get();

        if (documentSnapshot.exists()) {
          setUserData(documentSnapshot.data());
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const menuItems = [
    {
      title: 'Home',
      screen: 'Home',
    },
    {
      title: 'Search',
      screen: 'Search',
    },
    {
      title: 'Add Post',
      screen: 'AddPost',
    },
    {
      title: 'Notification',
      screen: 'Notification',
    },
    {
      title: 'Profile',
      screen: 'Profile',
    },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.languageBox}>
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>

        <View style={styles.themeContainer}>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              userData?.profilePicture ||
              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
          }}
          style={styles.profileImage}
        />

        <Text style={styles.emailText}>{userData?.email}</Text>
      </View>

      {/* <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              props.navigation.navigate('MainTabs');
              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              props.navigation.navigate('MainTabs', {
                screen: item.screen,
              });

              props.navigation.closeDrawer();
            }}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await auth().signOut();
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  languageBox: {
    width: 140,
    height: 55,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },

  languageText: {
    fontSize: 18,
    color: '#000',
  },

  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileSection: {
    alignItems: 'center',
    marginTop: 60,
  },

  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  emailText: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  menuContainer: {
    marginTop: 50,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eceef2',
    paddingVertical: 18,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  menuText: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },

  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginBottom: 30,
    elevation: 10,
  },

  logoutText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});
