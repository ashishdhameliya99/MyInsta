import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { errorToast, successToast } from '../../components/Toast';

export const useAcceptRequest = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const acceptRequest = async (
    requestUser: any,
    onRequestProcessed: (uid: string) => void,
  ) => {
    const currentUser = auth().currentUser;

    if (!currentUser) return;

    setLoading(true);
    setLoadingUserId(requestUser.uid);

    try {
      const currentUserDoc = await firestore()
        .collection('usersData')
        .doc(currentUser.uid)
        .get();

      const currentUserData = currentUserDoc.data();
      const batch = firestore().batch();

      // Update current user's data
      batch.update(firestore().collection('usersData').doc(currentUser.uid), {
        followers: firestore.FieldValue.arrayUnion({
          uid: requestUser.uid,
          userName: requestUser.userName,
          profilePicture: requestUser.profilePicture || '',
        }),
        requestCome: firestore.FieldValue.arrayRemove(requestUser),
      });

      // Update request user's data
      batch.update(firestore().collection('usersData').doc(requestUser.uid), {
        following: firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          userName: currentUserData?.fname || '',
          profilePicture: currentUserData?.profilePicture || '',
        }),
        requestSend: firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          userName: currentUserData?.fname || '',
          profilePicture: currentUserData?.profilePicture || '',
        }),
      });

      await batch.commit();
      onRequestProcessed(requestUser.uid);

      successToast('Success', 'Request accepted');
    } catch (error) {
      console.error('Accept Error : ', error);
      errorToast('Error', 'Something went wrong');
    } finally {
      setLoadingUserId(null);
      setLoading(false);
    }
  };

  return { acceptRequest, loading, loadingUserId };
};
