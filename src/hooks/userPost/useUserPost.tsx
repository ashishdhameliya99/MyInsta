import { useState, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Post } from '../../interface/type';

export const useUserPosts = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserPosts = useCallback(async () => {
    const user = auth().currentUser;
    if (!user) return;

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  return { userPosts, fetchUserPosts, loading };
};
