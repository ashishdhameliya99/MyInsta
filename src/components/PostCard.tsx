import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  Image,
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

import { CommonActions } from '@react-navigation/native';
import { useAppTheme } from '../hooks/theme/themeContext';
import { icon } from '../assets/icons/icon';
import { useTranslation } from 'react-i18next';
import { errorToast, successToast } from './Toast';
import { useUserData } from '../hooks/userData/useUserData';
import useAppNavigation from '../hooks/navigation/useNavigation';
import { styles } from './styles/PostCard';

interface Props {
  item: any;
}

function PostCard({ item }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const userData = useUserData();
  const currentUser = auth().currentUser;
  const navigation = useAppNavigation();
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const [likesCount, setLikesCount] = useState(
    Array.isArray(item?.likes) ? item.likes.length : 0,
  );

  const [commentsState, setCommentsState] = useState<any[]>(
    Array.isArray(item?.comments) ? item.comments : [],
  );

  const handleOpenProfile = () => {
    navigation.dispatch(
      CommonActions.navigate('userProfile', {
        post: item,
      }),
    );
  };

  useEffect(() => {
    if (!item?.uid || !item?.id || !currentUser) {
      return;
    }

    const unsubscribe = firestore()
      .collection('usersData')
      .doc(item.uid)
      .collection('posts')
      .doc(item.id)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data();

          const likes = Array.isArray(data?.likes) ? data.likes : [];

          const comments = Array.isArray(data?.comments) ? data.comments : [];

          setIsLiked(likes.includes(currentUser.uid));

          setLikesCount(likes.length);

          setCommentsState(comments);
        }
      });

    return () => unsubscribe();
  }, [currentUser, item?.id, item?.uid]);

  const handleLike = async () => {
    try {
      if (!currentUser || !item?.uid || !item?.id) {
        return;
      }

      if (loadingLike) {
        return;
      }

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

      errorToast('Error', 'Failed to like post');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async () => {
    try {
      if (!commentText.trim() || !currentUser) {
        return;
      }

      if (loadingComment) {
        return;
      }

      setLoadingComment(true);

      const newComment = {
        id: Date.now().toString(),
        commenterId: currentUser.uid,
        commenterName: userData?.fname || 'User',
        commenterProfile: userData?.profilePicture || '',
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      };

      await firestore()
        .collection('usersData')
        .doc(item.uid)
        .collection('posts')
        .doc(item.id)
        .update({
          comments: firestore.FieldValue.arrayUnion(newComment),
        });

      setCommentText('');
    } catch (error) {
      console.error('Comment Error : ', error);

      errorToast('Error', 'Failed to comment');
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
            console.error('Delete Error : ', error);

            errorToast('Error', 'Failed to delete post');
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
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.leftContainer}
          onPress={handleOpenProfile}
        >
          <Image
            source={
              item?.postCreated?.profilePicture
                ? {
                    uri: item?.postCreated?.profilePicture,
                  }
                : icon.activeUser
            }
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
            {item?.postCreated?.fname || item?.userName || 'Unknown User'}
          </Text>
        </TouchableOpacity>

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
                  borderRadius: 12,
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
          activeOpacity={0.8}
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

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => setShowComments(prev => !prev)}
        >
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
        </TouchableOpacity>
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

      {/* Comments */}
      {showComments && (
        <>
          {commentsState.length > 0 ? (
            commentsState.map((commentItem: any) => (
              <View key={commentItem?.id} style={styles.commentWrapper}>
                <View style={styles.commentRow}>
                  <Image
                    source={
                      commentItem?.commenterProfile
                        ? {
                            uri: commentItem?.commenterProfile,
                          }
                        : icon.activeUser
                    }
                    style={styles.commentProfile}
                  />

                  <View style={styles.commentContent}>
                    <Text
                      style={[
                        styles.commentUser,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {commentItem?.commenterName}
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
                </View>
              </View>
            ))
          ) : (
            <Text
              style={[
                styles.noCommentText,
                {
                  color: theme.text,
                },
              ]}
            >
              No comments yet
            </Text>
          )}

          {/* Comment Input */}
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

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleComment}
              disabled={loadingComment}
            >
              <Text style={styles.postBtn}>
                {loadingComment ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

export default memo(PostCard);
