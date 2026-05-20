import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import FollowerCount from '../../../components/FollowerCount';
import { useTranslation } from 'react-i18next';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { routes } from '../../../constants/routes';
import { useUserData } from '../../../hooks/userData/useUserData';
import { useUserPosts } from '../../../hooks/userPost/useUserPost';
import { styles } from '../styles/ProfleStyle';

export default function Profile() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const userData = useUserData();
  const { userPosts, fetchUserPosts, loading } = useUserPosts();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

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
            number={userPosts?.length}
          />

          <FollowerCount
            onPress={handleFollower}
            text="Follower"
            number={userData?.followers?.length}
          />

          <FollowerCount
            onPress={handleFollowing}
            text="Following"
            number={userData?.following?.length}
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

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={userPosts}
          keyExtractor={(item: any) => item.id}
          renderItem={renderPostItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContainer}
          columnWrapperStyle={styles.flatListGap}
          numColumns={2}
        />
      )}
    </View>
  );
}
