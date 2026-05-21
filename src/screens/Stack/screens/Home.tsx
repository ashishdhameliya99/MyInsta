import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import PostCard from '../../../components/PostCard';
import { styles } from '../styles/HomeStyle';

export default function Home() {
  const { theme } = useAppTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getPosts = useCallback(() => {
    try {
      const unsubscribe = firestore()
        .collectionGroup('posts')
        .onSnapshot(
          snapshot => {
            const tempPosts = snapshot.docs.map(document => {
              const postData = document.data();

              return {
                id: document.id,
                ...postData,
                likes: Array.isArray(postData?.likes) ? postData.likes : [],
                comments: Array.isArray(postData?.comments)
                  ? postData.comments
                  : [],
              };
            });

            setPosts(tempPosts);
            setLoading(false);
            setRefreshing(false);
          },
          error => {
            console.log('Fetch Error : ', error);
            setLoading(false);
            setRefreshing(false);
          },
        );

      return unsubscribe;
    } catch (error) {
      console.log('Home Error : ', error);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = getPosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [getPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    getPosts();
  };

  const renderItem = ({ item }: { item: any }) => {
    return <PostCard item={item} />;
  };
  const renderEmptyComponent = () => {
    if (loading) {
      return null;
    }

    return (
      <View style={styles.emptyContainer}>
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
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#0095F6" />
      </View>
    );
  }

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
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
