import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import InputText from '../../../components/InputText';
import { icon } from '../../../assets/icons/icon';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { useTranslation } from 'react-i18next';
import UserCard from '../../../components/UserCard';
import { styles } from '../styles/SearchStyle';
import { UserType } from '../../../interface/type';
import UserCardSkeleton from '../../../components/UserCardSkeleton';

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

          setTimeout(() => {
            setUsers(usersList);
            setLoading(false);
          }, 3000);
        },
        error => {
          console.error('Fetch Users Error : ', error);
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

      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={EmptyListMessage}
          contentContainerStyle={styles.listCard}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
        />
      )}
    </View>
  );
}
