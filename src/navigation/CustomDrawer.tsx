import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LanguagePicker from '../components/LanguagePicker';
import { rf } from '../constants/responsiveUI';
import fontFamilies from '../assets/fonts/font';
import { errorToast, successToast } from '../components/Toast';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { routes } from '../constants/routes';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const [userData, setUserData] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
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
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'OK',
          style: 'destructive',

          onPress: async () => {
            setLoading(true);

            try {
              await auth().signOut();

              successToast('success', 'User logout successfully');

              // navigation.navigate(routes.login);
            } catch (error) {
              console.log('LOGOUT ERROR', error);

              errorToast('error', 'User logout failed');
            } finally {
              setLoading(false);
            }
          },
        },
      ],

      {
        cancelable: true,
      },
    );
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
        <View>
          <LanguagePicker />
        </View>
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

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            // Conditionally change background color if the item is active
            style={[
              styles.menuItem,
              activeMenuIndex === index && styles.activeMenuItem,
            ]}
            onPress={() => {
              setActiveMenuIndex(index);

              props.navigation.navigate('mainTabs', {
                screen: item.screen,
              });
              props.navigation.closeDrawer();
            }}
          >
            {/* You can also conditionally change text color here */}
            <Text
              style={[
                styles.menuText,
                activeMenuIndex === index && styles.activeMenuText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton]}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
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
    marginTop: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  menuText: {
    marginLeft: 15,
    fontSize: rf(18),
    fontFamily: fontFamilies.poppins.Regular,
  },

  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginBottom: 30,
    elevation: 10,
  },

  logoutText: {
    fontSize: rf(18),
    fontFamily: fontFamilies.poppins.semiBold,
    color: '#ffffff',
  },
  activeMenuItem: {
    backgroundColor: '#E2E8F0',
  },
  activeMenuText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
