import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { styles } from '../styles/ProfleStyle';
import FollowerCount from '../../../components/FollowerCount';
import { icon } from '../../../assets/icons/icon';
import Button from '../../../components/Button';
import auth from '@react-native-firebase/auth';
import { errorToast, successToast } from '../../../components/Toast';
import useAppNavigation from '../../../hooks/navigation/useNavigation';
import { RouteProps } from '../../../interface/type';

export default function UserProfile({ route }: RouteProps) {
  const { theme } = useAppTheme();
  const currentUser = auth().currentUser;
  const navigation = useAppNavigation();
  const selectedUserId = route?.params?.userId;
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followStatus, setFollowStatus] = useState('Follow');
  const post = route?.params?.post;

  const getUserData = useCallback(() => {
    if (!post) return;

    const unsubscribe = firestore()
      .collection('usersData')
      .doc(post.uid)
      .onSnapshot(
        documentSnapshot => {
          if (documentSnapshot && documentSnapshot.exists()) {
            setProfileData(documentSnapshot.data());
          } else {
            setProfileData(null);
          }
        },
        error => {
          console.error('User Snapshot Error: ', error);
        },
      );
    return unsubscribe;
  }, [post]);
  useEffect(() => {
    checkFollowStatus();
    getUserData();
  });

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
        (item: any) => item.uid === post?.id,
      );
      if (isFollowing) {
        setFollowStatus('Following');
        return;
      }

      // request already sent
      const requestSendList = currentUserData?.requestSend || [];

      const isRequestSent = requestSendList.some(
        (item: any) => item.uid === post?.id,
      );
      if (isRequestSent) {
        setFollowStatus('Requested');
      }
    } catch (error) {
      console.error('Check Status Error : ', error);
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
        uid: profileData?.uid,
        userName: profileData?.fname,
        profilePicture: profileData?.profilePicture || '',
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
      const targetUserRef = firestore().collection('usersData').doc(post?.uid);

      batch.update(targetUserRef, {
        requestCome: firestore.FieldValue.arrayUnion(requestComeData),
      });
      await batch.commit();

      setFollowStatus('Requested');
      successToast('Success', 'Follow request sent');
    } catch (error) {
      console.error('Follow Error : ', error);
      errorToast('Error', 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUserId) {
      setLoading(false);
      return;
    }

    let unsubscribeUser: any;
    let unsubscribePosts: any;

    unsubscribeUser = firestore()
      .collection('usersData')
      .doc(selectedUserId)
      .onSnapshot(
        snapshot => {
          if (snapshot.exists()) {
            setProfileData({
              id: snapshot.id,
              ...snapshot.data(),
            });
          }
        },
        error => {
          console.error('Profile Fetch Error : ', error);
        },
      );

    unsubscribePosts = firestore()
      .collection('usersData')
      .doc(selectedUserId)
      .collection('posts')
      .onSnapshot(
        snapshot => {
          const tempPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(tempPosts);
          setLoading(false);
        },
        error => {
          console.error('Posts Fetch Error : ', error);
          setLoading(false);
        },
      );

    return () => {
      if (unsubscribeUser) {
        unsubscribeUser();
      }

      if (unsubscribePosts) {
        unsubscribePosts();
      }
    };
  }, [selectedUserId]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#0095F6" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
        <Image source={icon.back} style={styles.icon} />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{
              uri:
                profileData?.profilePicture ||
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
            }}
            style={styles.image}
          />

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
          <FollowerCount text="Post" number={posts?.length || 0} />

          <FollowerCount
            text="Follower"
            number={profileData?.followers?.length || 0}
          />

          <FollowerCount
            text="Following"
            number={profileData?.following?.length || 0}
          />
        </View>
      </View>
      <Button
        title={loading ? 'Loading...' : followStatus}
        onPress={handleFollow}
      />
    </SafeAreaView>
  );
}
