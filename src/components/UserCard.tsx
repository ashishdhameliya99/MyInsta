// import { Image, StyleSheet, Text, View } from 'react-native';
// import React, { useState } from 'react';
// import { icon } from '../assets/icons/icon';
// import { wp } from '../constants/responsiveUI';
// import Button from './Button';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { successToast, errorToast } from './Toast';

// interface Props {
//   user: any;
// }

// export default function UserCard({ user }: Props) {
//   const currentUser = auth().currentUser;
//   const [loading, setLoading] = useState(false);
//   const handleFollow = async () => {
//     try {
//       if (!currentUser) {
//         return;
//       }
//       setLoading(true);
//       const currentUserDoc = await firestore()
//         .collection('usersData')
//         .doc(currentUser.uid)
//         .get();

//       const currentUserData = currentUserDoc.data();

//       const requestSentData = {
//         uid: user?.id,
//         userName: user?.fname,
//         profilePicture: user?.profilePicture,
//       };

//       const requestComeData = {
//         uid: currentUser.uid,
//         userName: currentUserData?.fname || '',
//         profilePicture: currentUserData?.profilePicture || '',
//       };

//       const batch = firestore().batch();

//       const currentUserRef = firestore()
//         .collection('usersData')
//         .doc(currentUser.uid);
//       batch.update(currentUserRef, {
//         requestSend: firestore.FieldValue.arrayUnion(requestSentData),
//       });

//       const targetUserRef = firestore().collection('usersData').doc(user?.id);
//       batch.update(targetUserRef, {
//         requestCome: firestore.FieldValue.arrayUnion(requestComeData),
//       });

//       await batch.commit();

//       successToast('Success', 'Follow request sent');
//     } catch (error) {
//       console.log('Follow Error : ', error);
//       errorToast('Error', 'Request failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.cardContainer}>
//       <View style={styles.image}>
//         <Image
//           source={
//             user?.profilePicture
//               ? {
//                   uri: user.profilePicture,
//                 }
//               : icon.activeUser
//           }
//           style={styles.icon}
//         />
//       </View>

//       <Text style={styles.name}>{user?.fname}</Text>

//       <Button
//         title={loading ? 'Loading...' : 'Follow'}
//         onPress={handleFollow}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   cardContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#E1E1E1',
//     gap: 20,
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 10,
//   },

//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     flex: 1,
//   },

//   icon: {
//     height: wp(40),
//     width: wp(40),
//     borderRadius: 50,
//   },

//   image: {
//     borderRadius: 90,
//     borderWidth: 2,
//     padding: 5,
//     alignSelf: 'center',
//     overflow: 'hidden',
//   },
// });
import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { icon } from '../assets/icons/icon';
import { wp } from '../constants/responsiveUI';
import Button from './Button';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { successToast, errorToast } from './Toast';

interface Props {
  user: any;
}

export default function UserCard({ user }: Props) {
  const currentUser = auth().currentUser;

  const [loading, setLoading] = useState(false);

  // follow button text
  const [followStatus, setFollowStatus] = useState('Follow');

  useEffect(() => {
    checkFollowStatus();
  }, []);

  const checkFollowStatus = async () => {
    try {
      if (!currentUser) {
        return;
      }

      const currentUserDoc = await firestore()
        .collection('usersData')
        .doc(currentUser.uid)
        .get();

      const currentUserData = currentUserDoc.data();

      // already following
      const followingList = currentUserData?.following || [];

      const isFollowing = followingList.some(
        (item: any) => item.uid === user?.id,
      );

      if (isFollowing) {
        setFollowStatus('Following');
        return;
      }

      // request already sent
      const requestSendList = currentUserData?.requestSend || [];

      const isRequestSent = requestSendList.some(
        (item: any) => item.uid === user?.id,
      );

      if (isRequestSent) {
        setFollowStatus('Requested');
      }
    } catch (error) {
      console.log('Check Status Error : ', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (!currentUser) {
        return;
      }

      // already requested
      if (followStatus === 'Requested') {
        errorToast('Already Sent', 'Already request sent, wait to accept');
        return;
      }

      // already following
      if (followStatus === 'Following') {
        errorToast('Following', 'You already follow this user');
        return;
      }

      setLoading(true);

      const currentUserDoc = await firestore()
        .collection('usersData')
        .doc(currentUser.uid)
        .get();

      const currentUserData = currentUserDoc.data();

      const requestSentData = {
        uid: user?.id,
        userName: user?.fname,
        profilePicture: user?.profilePicture || '',
      };

      const requestComeData = {
        uid: currentUser.uid,
        userName: currentUserData?.fname || '',
        profilePicture: currentUserData?.profilePicture || '',
      };

      const batch = firestore().batch();

      // current user
      const currentUserRef = firestore()
        .collection('usersData')
        .doc(currentUser.uid);

      batch.update(currentUserRef, {
        requestSend: firestore.FieldValue.arrayUnion(requestSentData),
      });

      // target user
      const targetUserRef = firestore().collection('usersData').doc(user?.id);

      batch.update(targetUserRef, {
        requestCome: firestore.FieldValue.arrayUnion(requestComeData),
      });

      await batch.commit();

      setFollowStatus('Requested');

      successToast('Success', 'Follow request sent');
    } catch (error) {
      console.log('Follow Error : ', error);

      errorToast('Error', 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.image}>
        <Image
          source={
            user?.profilePicture
              ? {
                  uri: user.profilePicture,
                }
              : icon.activeUser
          }
          style={styles.icon}
        />
      </View>

      <Text style={styles.name}>{user?.fname}</Text>

      <Button
        title={loading ? 'Loading...' : followStatus}
        onPress={handleFollow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1',
    gap: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  icon: {
    height: wp(40),
    width: wp(40),
    borderRadius: 50,
  },

  image: {
    borderRadius: 90,
    borderWidth: 2,
    padding: 5,
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
