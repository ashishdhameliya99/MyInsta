import { useState, useEffect, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import firestore, { DocumentData } from '@react-native-firebase/firestore';

export const useUserData = () => {
  const [userData, setUserData] = useState<DocumentData | undefined | null>();

  const getUserData = useCallback(() => {
    const user = auth().currentUser;
    if (!user) return;

    const unsubscribe = firestore()
      .collection('usersData')
      .doc(user.uid)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot && documentSnapshot.exists()) {
            setUserData(documentSnapshot.data());
          } else {
            setUserData(null);
          }
        },
        error => {
          console.error('User Snapshot Error: ', error);
        },
      );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribeUser = getUserData();
    return () => {
      if (unsubscribeUser) unsubscribeUser();
    };
  }, [getUserData]);

  return userData;
};
