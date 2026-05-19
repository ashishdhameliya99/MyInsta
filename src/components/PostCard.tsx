import React, { useState } from 'react';
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

interface Props {
  item: any;
}

export default function PostCard({ item }: Props) {
  const { theme } = useAppTheme();
  const currentUser = auth().currentUser;
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState('');

  const comments = item?.comments || [];
  const likes = item?.likes || [];
  console.log('likes', likes);
  const isLiked =
    currentUser && Array.isArray(likes)
      ? likes.includes(currentUser.uid)
      : false;
  console.log('isLiked', isLiked);

  const handleLike = async () => {
    const postRef = firestore()
      .collection('usersData')
      .doc(currentUser?.uid)
      .collection('posts')
      .doc(item.id);

    try {
      await postRef.update({
        likes: isLiked
          ? firestore.FieldValue.arrayRemove(currentUser?.uid)
          : firestore.FieldValue.arrayUnion(currentUser?.uid),
      });

      console.log('Like status updated successfully');
    } catch (error) {
      console.log('Like Error: ', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !currentUser || !item?.id) {
      return;
    }

    try {
      const newComment = {
        comment: commentText.trim(),
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };
      console.log('newComment', newComment);
      const data = await firestore()
        .collection('usersData')
        .doc(currentUser.uid)
        .collection('posts')
        .doc(item.id)
        .set(
          {
            comments: firestore.FieldValue.arrayUnion({
              commenterId: currentUser.uid,
              text: commentText,
              createdAt: new Date().toISOString(),
            }),
          },
          { merge: true },
        );
      console.log('data=================', data);
      setCommentText('');
    } catch (error) {
      console.log('Comment Error : ', error);
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
            await firestore().collection('posts').doc(item.id).delete();

            successToast('Success', 'Post delete');
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
            {item?.userName || 'Unknown User'}
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
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Image
            source={isLiked ? icon.activeLike : icon.inActiveLike}
            style={[
              styles.actionIcon,
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
            {likes.length}
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
            {comments.length}
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

      {Array.isArray(comments) &&
        comments.map((commentItem: any, index: number) => (
          <Text key={index} style={[styles.commentText, { color: theme.text }]}>
            <Text>{commentItem?.text}</Text>
          </Text>
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

        <TouchableOpacity onPress={handleComment}>
          <Text style={styles.postBtn}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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

  commentText: {
    paddingHorizontal: 15,
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
    color: '#0095f6',
  },
});
