import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { DrawerActions, useNavigation } from '@react-navigation/native';

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const user = auth().currentUser;

      if (!user) {
        return;
      }

      const documentSnapshot = await firestore()
        .collection('usersData')
        .doc(user.uid)
        .get();

      if (documentSnapshot.exists()) {
        console.log('User Data : ', documentSnapshot.data());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.drawerButton}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  drawerButton: {
    marginLeft: 20,
    marginTop: 20,
  },

  menuText: {
    fontSize: 28,
    color: '#000',
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#000',
  },
});

// import { StyleSheet, Text } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// export default function home() {
//   const getUserData = async () => {
//     const user = auth().currentUser;

//     if (user) {
//       try {
//         const documentSnapshot = await firestore()
//           .collection('usersData')
//           .doc(user.uid)
//           .get();

//         if (documentSnapshot.exists()) {
//           console.log('User data: ', documentSnapshot.data());
//           return documentSnapshot.data();
//         }
//       } catch (error) {
//         console.error('Error fetching user document:', error);
//       }
//     } else {
//       console.log('No user is currently logged in.');
//     }
//   };
//   getUserData();
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text>home</Text>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
