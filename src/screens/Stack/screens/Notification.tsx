import React, { useEffect, useState } from 'react';

import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { successToast, errorToast } from '../../../components/Toast';
import { icon } from '../../../assets/icons/icon';
import Button from '../../../components/Button';
import { wp } from '../../../constants/responsiveUI';

export default function Notification() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  console.log('requests', requests);
  useEffect(() => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      return;
    }

    const unsubscribe = firestore()
      .collection('usersData')
      .doc(currentUser.uid)
      .onSnapshot(snapshot => {
        const data = snapshot.data();

        console.log('Notification Data : ', data?.requestSend);

        // received requests
        setRequests(data?.requestCome || []);
      });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (requestUser: any) => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        return;
      }

      setLoading(true);

      const currentUserDoc = await firestore()
        .collection('usersData')
        .doc(currentUser.uid)
        .get();

      const currentUserData = currentUserDoc.data();

      const batch = firestore().batch();

      // current user update
      batch.update(firestore().collection('usersData').doc(currentUser.uid), {
        followers: firestore.FieldValue.arrayUnion({
          uid: requestUser.uid,
          userName: requestUser.userName,
          profilePicture: requestUser.profilePicture || '',
        }),

        // remove request
        requestCome: firestore.FieldValue.arrayRemove(requestUser),
      });

      // request sender update
      batch.update(firestore().collection('usersData').doc(requestUser.uid), {
        following: firestore.FieldValue.arrayUnion({
          uid: currentUser.uid,
          userName: currentUserData?.fname || '',
          profilePicture: currentUserData?.profilePicture || '',
        }),

        // remove sent request
        requestSend: firestore.FieldValue.arrayRemove({
          uid: currentUser.uid,
          userName: currentUserData?.fname || '',
          profilePicture: currentUserData?.profilePicture || '',
        }),
      });

      await batch.commit();

      successToast('Success', 'Request accepted');
    } catch (error) {
      console.log('Accept Error : ', error);

      errorToast('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={requests}
      keyExtractor={item => item.uid}
      contentContainerStyle={{ padding: 10 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>
          <View style={styles.image}>
            <Image
              source={
                item?.profilePicture
                  ? {
                      uri: item.profilePicture,
                    }
                  : icon.activeUser
              }
              style={styles.icon}
            />
          </View>

          <Text style={styles.name}>{item?.userName}</Text>

          <Button
            title={loading ? 'Loading...' : 'Accept'}
            onPress={() => handleAccept(item)}
          />
        </View>
      )}
    />
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
