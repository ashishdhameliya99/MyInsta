import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { styles } from '../styles/ProfleStyle';
import FollowerCount from '../../../components/FollowerCount';
import Button from '../../../components/Button';
import { icon } from '../../../assets/icons/icon';
import { errorToast, successToast } from '../../../components/Toast';
import useAppNavigation from '../../../hooks/navigation/useNavigation';
import { RouteProps } from '../../../interface/type';
import { profileImages } from '../../../helper/global';

export default function UserProfile({ route }: RouteProps) {
  const { theme } = useAppTheme();
  const currentUser = auth().currentUser;
  const navigation = useAppNavigation();
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingFollow, setCheckingFollow] = useState(true);
  const [followStatus, setFollowStatus] = useState('Follow');
  const post = route?.params?.post;

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        if (!currentUser || !post?.uid) {
          return;
        }
        setCheckingFollow(true);
        const currentUserDoc = await firestore()
          .collection('usersData')
          .doc(currentUser?.uid)
          .get();
        const currentUserData = currentUserDoc?.data();
        // following list
        const followingList = currentUserData?.following || [];
        const isFollowing = followingList.some(
          (item: any) => item?.uid === post?.uid,
        );
        if (isFollowing) {
          setFollowStatus('Following');
          return;
        }
        // request send list
        const requestSendList = currentUserData?.requestSend || [];
        const isRequestSent = requestSendList.some(
          (item: any) => item?.uid === post?.uid,
        );

        if (isRequestSent) {
          setFollowStatus('Requested');
        } else {
          setFollowStatus('Follow');
        }
      } catch (error) {
        console.error('Check Status Error : ', error);
      } finally {
        setCheckingFollow(false);
      }
    };
    if (post?.uid && currentUser?.uid) {
      checkFollowStatus();
    }
  }, [currentUser?.uid, post?.uid]);

  const handleFollow = async () => {
    try {
      if (!currentUser || checkingFollow || loading) {
        return;
      }
      if (followStatus === 'Requested') {
        errorToast('Already Sent', 'Already request sent');

        return;
      }
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

      const currentUserRef = firestore()
        .collection('usersData')
        .doc(currentUser?.uid);

      batch.update(currentUserRef, {
        requestSend: firestore.FieldValue.arrayUnion(requestSentData),
      });

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
    if (!post?.uid) {
      setLoading(false);

      return;
    }
    const unsubscribeProfile = firestore()
      .collection('usersData')
      .doc(post.uid)
      .onSnapshot(
        snapshot => {
          if (snapshot.exists()) {
            setProfileData({
              id: snapshot.id,
              ...snapshot.data(),
            });
          }
        },

        error => console.error('Profile Fetch Error : ', error),
      );

    const unsubscribePosts = firestore()
      .collection('usersData')
      .doc(post.uid)
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
      unsubscribeProfile();
      unsubscribePosts();
    };
  }, [post?.uid]);

  if (loading && !profileData) {
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
              uri: profileData?.profilePicture || profileImages[0],
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
        title={
          checkingFollow ? 'Checking...' : loading ? 'Loading...' : followStatus
        }
        onPress={handleFollow}
        disabled={checkingFollow || loading}
      />
    </SafeAreaView>
  );
}
