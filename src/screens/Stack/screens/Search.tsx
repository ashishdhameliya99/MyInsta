import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import InputText from '../../../components/InputText';
import { icon } from '../../../assets/icons/icon';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { useTranslation } from 'react-i18next';
import UserCard from '../../../components/UserCard';
import { styles } from '../styles/SearchStyle';
import { UserType } from '../../../interface/type';

const EmptyListMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No Users Found</Text>
  </View>
);

export default function Search() {
  const currentUser = auth().currentUser;
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('usersData')
      .onSnapshot(
        snapshot => {
          const usersList = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter(item => item.id !== currentUser?.uid);

          setUsers(usersList);
          setLoading(false);
        },
        error => {
          console.log('Fetch Users Error : ', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }

    return users.filter(user => {
      const fullName = `${user?.fname || ''} ${
        user?.lname || ''
      }`.toLowerCase();

      return fullName.includes(search.toLowerCase());
    });
  }, [search, users]);

  const renderItem = ({ item }: { item: UserType }) => {
    return <UserCard user={item} />;
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
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
      <InputText
        placeholder={t('search')}
        value={search}
        onChange={setSearch}
        rightIconSource={icon.inActiveSearch}
      />

      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        ListEmptyComponent={EmptyListMessage}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
      />
    </View>
  );
}
