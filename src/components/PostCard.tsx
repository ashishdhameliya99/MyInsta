import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useAppTheme } from '../hooks/theme/themeContext';
import fontFamilies from '../assets/fonts/font';
import { icon } from '../assets/icons/icon';
import { wp } from '../constants/responsiveUI';
import { useTranslation } from 'react-i18next';
import { successToast } from './Toast';
import { useUserData } from '../hooks/userData/useUserData';
interface Props {
  item: any;
  fname: string;
}

function PostCard({ item, fname }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const currentUser = auth().currentUser;
  const [commentText, setCommentText] = useState('');
  const userData = useUserData();
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [commentsState, setCommentsState] = useState<any[]>(
    Array.isArray(item?.comments) ? item.comments : [],
  );

  const handleLike = async () => {
    if (!currentUser || !item?.uid || !item?.id || loadingLike) {
      return;
    }

    try {
      setLoadingLike(true);
      await firestore()
        .collection('usersData')
        .doc(item.uid)
        .collection('posts')
        .doc(item.id)
        .update({
          likes: isLiked
            ? firestore.FieldValue.arrayRemove(currentUser.uid)
            : firestore.FieldValue.arrayUnion(currentUser.uid),
        });
    } catch (error) {
      console.error('Like Error : ', error);
    } finally {
      setLoadingLike(false);
    }
  };
  useEffect(() => {
    if (!item?.uid || !item?.id || !currentUser) return;
    const unsubscribe = firestore()
      .collection('usersData')
      .doc(item.uid)
      .collection('posts')
      .doc(item.id)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();
          const likes = data?.likes || [];

          setIsLiked(likes.includes(currentUser.uid));
          setLikesCount(likes.length);
        }
      });

    return () => unsubscribe();
  }, [item?.uid, item?.id, currentUser]);

  const handleComment = async () => {
    if (
      !commentText.trim() ||
      !currentUser ||
      !item?.uid ||
      !item?.id ||
      loadingComment
    ) {
      return;
    }

    try {
      setLoadingComment(true);

      const newComment = {
        id: Date.now().toString(),
        commenterId: currentUser.uid,
        commenterName: userData?.fname || 'User',
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };
      console.log('newComment', newComment);
      setCommentsState(prev => [
        ...prev,
        {
          ...newComment,
          createdAt: new Date().toISOString(),
        },
      ]);

      setCommentText('');

      await firestore()
        .collection('usersData')
        .doc(item.uid)
        .collection('posts')
        .doc(item.id)
        .update({
          comments: firestore.FieldValue.arrayUnion(newComment),
        });
    } catch (error) {
      console.error('Comment Error : ', error);

      setCommentsState(Array.isArray(item?.comments) ? item.comments : []);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await firestore()
              .collection('usersData')
              .doc(item.uid)
              .collection('posts')
              .doc(item.id)
              .delete();

            successToast('Success', 'Post deleted successfully');
          } catch (error) {
            console.log('Delete Error : ', error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View style={styles.userContainer}>
        <View style={styles.leftContainer}>
          <Image
            source={{
              uri:
                item?.profilePicture ||
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
            }}
            style={styles.profileImage}
          />

          <Text
            style={[
              styles.userName,
              {
                color: theme.text,
              },
            ]}
          >
            {fname || 'Unknown User'}
          </Text>
        </View>

        {currentUser?.uid === item?.uid && (
          <Menu>
            <MenuTrigger>
              <Text
                style={[
                  styles.menuText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                ⋮
              </Text>
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 120,
                  borderRadius: 10,
                },
              }}
            >
              <MenuOption onSelect={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <Image
        source={{
          uri: item?.imageURL,
        }}
        style={styles.postImage}
      />

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleLike}
          disabled={loadingLike}
        >
          <Image
            source={isLiked ? icon.activeLike : icon.inActiveLike}
            style={[
              styles.actionIcon,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                tintColor: isLiked ? 'red' : theme.text,
              },
            ]}
          />

          <Text
            style={[
              styles.countText,
              {
                color: theme.text,
              },
            ]}
          >
            {likesCount}
          </Text>
        </TouchableOpacity>

        <View style={styles.actionBtn}>
          <Image
            source={icon.comment}
            style={[
              styles.actionIcon,
              {
                tintColor: theme.text,
              },
            ]}
          />

          <Text
            style={[
              styles.countText,
              {
                color: theme.text,
              },
            ]}
          >
            {commentsState.length}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.title,
          {
            color: theme.text,
          },
        ]}
      >
        {item?.title}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: theme.text,
          },
        ]}
      >
        {item?.description}
      </Text>

      {Array.isArray(commentsState) &&
        commentsState.map((commentItem: any, index: number) => (
          <View
            key={commentItem?.id || index.toString()}
            style={styles.commentWrapper}
          >
            <Text
              style={[
                styles.commentUser,
                {
                  color: theme.text,
                },
              ]}
            >
              {commentItem?.commenterName || 'User'}
            </Text>

            <Text
              style={[
                styles.commentText,
                {
                  color: theme.text,
                },
              ]}
            >
              {commentItem?.text}
            </Text>
          </View>
        ))}
      <View style={styles.commentContainer}>
        <TextInput
          placeholder={t('comment')}
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          style={[
            styles.input,
            {
              color: theme.text,
            },
          ]}
        />

        <TouchableOpacity onPress={handleComment} disabled={loadingComment}>
          <Text style={styles.postBtn}>
            {loadingComment ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(PostCard);

const styles = StyleSheet.create({
  card: {
    marginBottom: 25,
    paddingBottom: 20,
  },

  icon: {
    height: wp(20),
    width: wp(20),
  },

  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  menuText: {
    fontSize: 28,
    fontWeight: '700',
  },

  deleteText: {
    color: 'red',
    fontSize: 16,
    padding: 10,
  },

  postImage: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 12,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  actionIcon: {
    width: 28,
    height: 28,
  },

  countText: {
    marginLeft: 5,
    fontSize: 16,
  },

  title: {
    paddingHorizontal: 15,
    marginTop: 10,
    fontSize: 17,
    fontFamily: fontFamilies.poppins.bold,
  },

  description: {
    paddingHorizontal: 15,
    marginTop: 5,
    fontSize: 15,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  commentWrapper: {
    paddingHorizontal: 15,
    marginTop: 8,
  },

  commentUser: {
    fontSize: 13,
    fontFamily: fontFamilies.poppins.bold,
  },

  commentText: {
    fontSize: 14,
    fontFamily: fontFamilies.poppins.Regular,
  },

  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
  },

  postBtn: {
    marginLeft: 15,
    color: '#0095F6',
    fontFamily: fontFamilies.poppins.semiBold,
  },
});
