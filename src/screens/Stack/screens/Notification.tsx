import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { icon } from '../../../assets/icons/icon';
import Button from '../../../components/Button';
import { hp, rf, wp } from '../../../constants/responsiveUI';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import fontFamilies from '../../../assets/fonts/font';
import UserCardSkeleton from '../../../components/UserCardSkeleton';
import { RequestUser } from '../../../interface/type';
import { useAcceptRequest } from '../../../hooks/userRequest/useUserRequest';
import { db, getCurrentUser } from '../../../services/firestore';

const ItemSeparator = () => <View style={styles.cardHeight} />;

export default function Notification() {
  const [requestCome, setRequestCome] = useState<RequestUser[]>([]);
  const [requestSend, setRequestSend] = useState<RequestUser[]>([]);
  const { acceptRequest, loading, loadingUserId } = useAcceptRequest();

  const { t } = useTranslation();
  const { theme } = useAppTheme();

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return;
    }

    const unsubscribe = db
      .collection('usersData')
      .doc(currentUser.uid)
      .onSnapshot(snapshot => {
        const data = snapshot.data();

        setRequestCome(data?.requestCome || []);
        setRequestSend(data?.requestSend || []);
      });

    return () => unsubscribe();
  }, []);

  const handleAccept = (requestUser: any) => {
    acceptRequest(requestUser, processedUid => {
      setRequestCome(prev => prev.filter(item => item.uid !== processedUid));
    });
  };

  const renderReceivedItem = ({ item }: { item: RequestUser }) => {
    const isLoading = loadingUserId === item.uid;
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

        <Text style={[styles.name]}>{item?.userName}</Text>

        <Button
          title={isLoading ? 'Loading...' : 'Accept'}
          onPress={() => handleAccept(item)}
          disabled={isLoading}
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
        <Text style={[styles.name]}>{item?.userName}</Text>
        <Button
          title="Requested"
          onPress={() => {
            handleAccept;
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.notification,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text
                style={[
                  styles.heading,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {t('receiveRequest')}
              </Text>

              {requestCome.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {t('noReceiveRequest')}
                </Text>
              ) : (
                <FlatList
                  data={requestCome}
                  keyExtractor={item => item.uid}
                  renderItem={renderReceivedItem}
                  scrollEnabled={false}
                  ItemSeparatorComponent={ItemSeparator}
                />
              )}

              <Text
                style={[
                  styles.heading,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {t('sendRequest')}
              </Text>

              {requestSend.length === 0 ? (
                <Text
                  style={[
                    styles.emptyText,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {t('noSendRequest')}
                </Text>
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
        />
      )}
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
    fontSize: 16,
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
    fontSize: rf(18),
    fontFamily: fontFamilies.poppins.bold,
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
