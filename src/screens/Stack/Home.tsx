import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useAppTheme } from '../../hooks/theme/themeContext';
import { hp } from '../../constants/responsiveUI';
import PostCard from '../../components/PostCard';

export default function Home() {
  const { theme } = useAppTheme();
  const [posts, setPosts] = useState<any[]>([]);

  const getPosts = useCallback(() => {
    const unsubscribe = firestore()
      .collectionGroup('posts')
      .onSnapshot(
        async snapshot => {
          try {
            const tempPosts = [];

            for (const document of snapshot.docs) {
              const postData = document.data();
              if (!postData) continue;
              const userId =
                postData.uid ||
                (document.ref.parent && document.ref.parent.parent
                  ? document.ref.parent.parent.id
                  : null);

              console.log('userId', userId);
              if (!userId) {
                console.warn(
                  'Skipping post due to missing userId:',
                  document.id,
                );
                continue;
              }

              const userSnapshot = await firestore()
                .collection('usersData')
                .doc(userId)
                .get();

              const userData = userSnapshot.data();

              tempPosts.push({
                id: document.id,
                ...postData,
                userName: userData?.fname || '',
                profilePicture: userData?.profilePicture || '',
              });
            }
            setPosts(tempPosts);
          } catch (error) {
            console.error('Error processing posts: ', error);
          }
        },
        error => {
          console.error('Error fetching posts: ', error);
        },
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = getPosts();
    return () => unsubscribe();
  }, [getPosts]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(2),
  },
});
