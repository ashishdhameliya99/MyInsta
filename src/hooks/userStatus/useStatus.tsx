import { useEffect } from 'react';
import { AppState } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function useUserStatus() {
  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      return;
    }

    // Set Online
    const setOnline = async () => {
      try {
        await firestore().collection('usersData').doc(currentUser.uid).set(
          {
            isOnline: true,
          },
          { merge: true },
        );
      } catch (error) {
        console.log('Online Error : ', error);
      }
    };

    // Set Offline
    const setOffline = async () => {
      try {
        await firestore().collection('usersData').doc(currentUser.uid).set(
          {
            isOnline: false,
          },
          { merge: true },
        );
      } catch (error) {
        console.log('Offline Error : ', error);
      }
    };

    setOnline();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setOnline();
      } else {
        setOffline();
      }
    });
    return () => {
      setOffline();
      subscription.remove();
    };
  }, []);
}
