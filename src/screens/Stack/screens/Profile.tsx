import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { useTranslation } from 'react-i18next';
import FollowerCount from '../../../components/FollowerCount';
import { styles } from '../styles/ProfleStyle';
import { routes } from '../../../constants/routes';
import { errorToast, successToast } from '../../../components/Toast';
import { profileImages } from '../../../helper/global';
import { wp } from '../../../constants/responsiveUI';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Follower from './Follower';
import Button from '../../../components/Button';

const EmptyListMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No user post</Text>
  </View>
);

export default function Profile() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const route = useRoute<RouteProp<any>>();
  const selectedUserId = route?.params?.userId;
  const currentUser = auth().currentUser;
  const [followType, setFollowType] = useState<'followers' | 'following'>(
    'followers',
  );
  const isOwnProfile = !selectedUserId || selectedUserId === currentUser?.uid;
  console.log('isOwnProfile', isOwnProfile);
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  const handleOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    let unsubscribeUser: any;
    let unsubscribePosts: any;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = isOwnProfile ? currentUser?.uid : selectedUserId;
        if (!userId) {
          return;
        }

        unsubscribeUser = firestore()
          .collection('usersData')
          .doc(userId)
          .onSnapshot(snapshot => {
            if (snapshot.exists()) {
              setProfileData({
                id: snapshot.id,
                ...snapshot.data(),
              });
            }
          });

        unsubscribePosts = firestore()
          .collection('usersData')
          .doc(userId)
          .collection('posts')
          .onSnapshot(snapshot => {
            const tempPosts = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setPosts(tempPosts);
            setLoading(false);
          });
      } catch (error) {
        console.log('Profile Fetch Error : ', error);
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }

      if (unsubscribePosts) {
        unsubscribePosts();
      }
    };
  }, [currentUser?.uid, isOwnProfile, selectedUserId]);

  //change profile image
  const handleSelectProfile = async (imageURL: string) => {
    try {
      if (!currentUser) {
        return;
      }

      setProfileLoading(true);
      await firestore().collection('usersData').doc(currentUser.uid).update({
        profilePicture: imageURL,
      });

      setModalVisible(false);
      successToast('Success', 'Profile picture updated');
    } catch (error) {
      console.log('Profile Picture Error : ', error);

      errorToast('Error', 'Failed to update profile picture');
    } finally {
      setProfileLoading(false);
    }
  };

  const renderPostItem = ({ item }: any) => {
    return (
      <View
        style={[
          styles.postCard,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <Image
          source={{
            uri: item?.imageURL,
          }}
          style={styles.postImage}
        />
      </View>
    );
  };

  const renderProfileImage = ({ item }: { item: string }) => {
    const isSelected = profileData?.profilePicture === item;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleSelectProfile(item)}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginBottom: wp(15),
          borderWidth: isSelected ? 3 : 0,
          borderColor: '#0095F6',
          borderRadius: 100,
        }}
      >
        <Image
          source={{
            uri: item,
          }}
          style={styles.profileBorder}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0095F6" />;
  }

  return (
    <GestureHandlerRootView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <BottomSheetModalProvider>
        <View style={styles.profileContainer}>
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (isOwnProfile) {
                  setModalVisible(true);
                }
              }}
            >
              <Image
                source={{
                  uri:
                    profileData?.profilePicture ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
                }}
                style={styles.image}
              />

              {profileLoading && (
                <ActivityIndicator
                  size="small"
                  color="#0095F6"
                  style={styles.profileLoader}
                />
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.userName,
                {
                  color: theme.text,
                },
              ]}
            >
              {profileData?.fname || 'User'}
            </Text>
          </View>

          <View style={styles.listContainer}>
            <FollowerCount text="Post" number={posts.length} />

            <FollowerCount
              onPress={() => {
                setFollowType('followers');
                handleOpen();
              }}
              text="Follower"
              number={profileData?.followers?.length || 0}
            />

            <FollowerCount
              onPress={() => {
                setFollowType('following');
                handleOpen();
              }}
              text="Following"
              number={profileData?.following?.length || 0}
            />

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={{
                backgroundColor: theme.modal,
              }}
              handleIndicatorStyle={{
                backgroundColor: theme.text,
              }}
            >
              <BottomSheetView>
                <Follower onClose={handleClose} type={followType} />
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </View>
        {!isOwnProfile && (
          <Button
            title="Follow"
            // onPress={handleFollow}
          />
        )}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editProfile}
            onPress={() =>
              navigation.navigate(routes.register, {
                isEdit: true,
                userData: profileData,
              })
            }
          >
            <Text
              style={[
                styles.editText,
                {
                  color: theme.text,
                },
              ]}
            >
              {t('editProfile')}
            </Text>
          </TouchableOpacity>
        )}

        {isOwnProfile && (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={renderPostItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            columnWrapperStyle={styles.flatListGap}
            ListEmptyComponent={EmptyListMessage}
          />
        )}

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.selectProfile, { color: theme.text }]}>
                Select Profile Picture
              </Text>

              <FlatList
                data={profileImages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProfileImage}
                numColumns={2}
                columnWrapperStyle={styles.profileImageSet}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
