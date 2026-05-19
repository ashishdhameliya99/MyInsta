import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppTheme } from '../../hooks/theme/themeContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { hp, wp } from '../../constants/responsiveUI';
import FollowerCount from '../../components/FollowerCount';
import fontFamilies from '../../assets/fonts/font';
import { useTranslation } from 'react-i18next';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { routes } from '../../constants/routes';

export default function Profile() {
  const { theme } = useAppTheme();
  const [userData, setUserData] = useState<any>({});
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const getUserPosts = useCallback(async () => {
    const user = auth().currentUser;
    if (!user) {
      return;
    }

    try {
      const querySnapshot = await firestore()
        .collection('usersData')
        .doc(user.uid)
        .collection('posts')
        .get();

      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserPosts(posts);
    } catch (error) {
      console.log('Error fetching user posts:', error);
    }
  }, []);

  const getUserData = useCallback(async () => {
    const user = auth().currentUser;

    if (!user) {
      return;
    }

    try {
      const documentSnapshot = await firestore()
        .collection('usersData')
        .doc(user.uid)
        .get();

      if (documentSnapshot.exists()) {
        setUserData(documentSnapshot.data());
      }
    } catch (error) {
      console.log('User Error : ', error);
    }
  }, []);

  useEffect(() => {
    getUserData();
    getUserPosts();
  }, [getUserData, getUserPosts]);

  const handlePost = () => {};
  const handleFollower = () => {};
  const handleFollowing = () => {};
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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.profileContainer}>
        <View>
          <Image
            source={{
              uri:
                userData?.profilePicture ||
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
            {userData?.fname || 'User'}
          </Text>
        </View>

        <View style={styles.listContainer}>
          <FollowerCount
            onPress={handlePost}
            text="Post"
            number={userPosts.length}
          />

          <FollowerCount onPress={handleFollower} text="Follower" number={0} />

          <FollowerCount
            onPress={handleFollowing}
            text="Following"
            number={0}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.editProfile}
        onPress={() =>
          navigation.navigate(routes.register, {
            isEdit: true,
            userData: userData,
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

      <FlatList
        data={userPosts}
        keyExtractor={item => item.id}
        renderItem={renderPostItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
        columnWrapperStyle={styles.flatListGap}
        numColumns={2}
        ListEmptyComponent={
          <Text
            style={[
              styles.emptyText,
              {
                color: theme.text,
              },
            ]}
          >
            No Posts Found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: hp(10),
  },

  profileContainer: {
    flexDirection: 'row',
    gap: wp(30),
    marginBottom: hp(20),
  },

  image: {
    height: 100,
    width: 100,
    borderWidth: 3,
    borderColor: '#e0dddd',
    borderRadius: 90,
    resizeMode: 'cover',
  },

  listContainer: {
    flexDirection: 'row',
    gap: wp(30),
    alignItems: 'center',
  },

  userName: {
    fontFamily: fontFamilies.poppins.semiBold,
    alignSelf: 'center',
    marginTop: 5,
  },

  editProfile: {
    borderWidth: 1,
    borderColor: '#e0dddd',
    borderRadius: 8,
    marginBottom: 20,
  },

  editText: {
    textAlign: 'center',
    paddingVertical: 8,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  flatListContainer: {
    paddingBottom: 10,
  },

  postCard: {
    flex: 1,
    height: wp(150),
    width: wp(160),
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0dddd',
  },

  postImage: {
    width: '100%',
    height: 220,
    resizeMode: 'stretch',
  },

  postContent: {
    padding: 12,
  },
  flatListGap: {
    gap: 20,
  },

  postTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  postDescription: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fontFamilies.poppins.Regular,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
