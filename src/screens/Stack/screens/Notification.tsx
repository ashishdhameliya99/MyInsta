import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { successToast, errorToast } from '../../../components/Toast';
import { icon } from '../../../assets/icons/icon';
import Button from '../../../components/Button';
import { hp, wp } from '../../../constants/responsiveUI';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../hooks/theme/themeContext';

interface RequestUser {
  uid: string;
  userName: string;
  profilePicture?: string;
}
const ItemSeparator = () => <View style={styles.cardHeight} />;

export default function Notification() {
  const [requestCome, setRequestCome] = useState<RequestUser[]>([]);
  const [requestSend, setRequestSend] = useState<RequestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { theme } = useAppTheme();

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
        setRequestCome(data?.requestCome || []);
        setRequestSend(data?.requestSend || []);
      });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (requestUser: RequestUser) => {
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

      batch.update(firestore().collection('usersData').doc(currentUser.uid), {
        followers: firestore.FieldValue.arrayUnion({
          uid: requestUser.uid,
          userName: requestUser.userName,
          profilePicture: requestUser.profilePicture || '',
        }),

        requestCome: firestore.FieldValue.arrayRemove(requestUser),
      });

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
      setRequestCome(prev => prev.filter(item => item.uid !== requestUser.uid));
      successToast('Success', 'Request accepted');
    } catch (error) {
      console.log('Accept Error : ', error);
      errorToast('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderReceivedItem = ({ item }: { item: RequestUser }) => {
    console.log('item.id', item?.uid);
    return (
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
    );
  };

  const renderSentItem = ({ item }: { item: RequestUser }) => {
    return (
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

        <Button title="Requested" onPress={() => {}} />
      </View>
    );
  };

  return (
    <View style={[styles.notification, { backgroundColor: theme.background }]}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.heading}>{t('receiveRequest')}</Text>

            {requestCome.length === 0 ? (
              <Text style={styles.emptyText}>{t('noReceiveRequest')}</Text>
            ) : (
              <FlatList
                data={requestCome}
                keyExtractor={item => item.uid}
                renderItem={renderReceivedItem}
                scrollEnabled={false}
                ItemSeparatorComponent={ItemSeparator}
              />
            )}

            <Text style={styles.heading}>{t('sendRequest')}</Text>

            {requestSend.length === 0 ? (
              <Text style={styles.emptyText}>{t('noSendRequest')}</Text>
            ) : (
              <FlatList
                data={requestSend}
                keyExtractor={item => item.uid}
                renderItem={renderSentItem}
                scrollEnabled={false}
                ItemSeparatorComponent={ItemSeparator}
              />
            )}
          </>
        }
        data={[]}
        renderItem={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notification: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 10,
  },

  emptyText: {
    marginLeft: 10,
    marginBottom: 10,
    textAlign: 'center',
  },

  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#E1E1E1',
    gap: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
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
  cardHeight: {
    height: hp(10),
  },
});
