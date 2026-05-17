import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function home() {
  const getUserData = async () => {
    const user = auth().currentUser;

    if (user) {
      try {
        const documentSnapshot = await firestore()
          .collection('usersData')
          .doc(user.uid)
          .get();

        if (documentSnapshot.exists()) {
          console.log('User data: ', documentSnapshot.data());
          return documentSnapshot.data();
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
      }
    } else {
      console.log('No user is currently logged in.');
    }
  };
  getUserData();
  return (
    <SafeAreaView style={styles.container}>
      <Text>home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
