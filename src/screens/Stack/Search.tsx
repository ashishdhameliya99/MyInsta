import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import InputText from '../../components/InputText';
import { icon } from '../../assets/icons/icon';
import { useAppTheme } from '../../hooks/theme/themeContext';
import { useTranslation } from 'react-i18next';
import { wp } from '../../constants/responsiveUI';
import firestore from '@react-native-firebase/firestore';
import UserCard from '../../components/UserCard';
import fontFamilies from '../../assets/fonts/font';

const EmptyListMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No data</Text>
  </View>
);
export default function Search() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const querySnapshot = await firestore().collection('usersData').get();
        console.log('querySnapshot', querySnapshot);
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user?.fname?.toLowerCase().includes(search.toLowerCase()),
  );

  console.log('filteredUsers', filteredUsers);
  console.log('users', users);

  const renderItem = ({ item }: any) => <UserCard user={item} />;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <InputText
        placeholder={t('search')}
        value={search}
        onChange={setSearch}
        rightIconSource={icon.inActiveSearch}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item: any) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyListMessage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  listContainer: {
    gap: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.poppins.bold,
    marginBottom: 8,
  },
});
