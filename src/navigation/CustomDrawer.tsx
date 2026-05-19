import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
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
import { hp, rf } from '../constants/responsiveUI';
import fontFamilies from '../assets/fonts/font';
import { errorToast, successToast } from '../components/Toast';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { routes } from '../constants/routes';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/theme/themeContext';
import { icon } from '../assets/icons/icon';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const [userData, setUserData] = useState<any>(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { dark, toggleTheme, theme } = useAppTheme();

  const getUserData = useCallback(async () => {
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
  }, []);
  useEffect(() => {
    getUserData();
  }, [getUserData]);

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

              navigation.navigate(routes.login);
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
  console.log('userData', userData);
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.topContainer}>
        <View>
          <LanguagePicker />
        </View>
        <View style={styles.themeContainer}>
          <TouchableOpacity onPress={toggleTheme}>
            <Image
              source={dark ? icon.lightMode : icon.darkMode}
              style={styles.icon}
            />
          </TouchableOpacity>
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

        <Text style={[styles.emailText, { color: theme.text }]}>
          {userData?.fname}
        </Text>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
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
              { color: theme.text },
            ]}
          >
            {t(item.title)}
          </Text>
        </TouchableOpacity>
      ))}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton]}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      )}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 90,
  },

  emailText: {
    marginTop: 15,
    fontSize: rf(22),
    fontFamily: fontFamilies.poppins.Regular,
    fontWeight: '700',
    color: '#000',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
  },

  menuText: {
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
    marginTop: hp(300),
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
  icon: {
    height: 25,
    width: 25,
  },
});
