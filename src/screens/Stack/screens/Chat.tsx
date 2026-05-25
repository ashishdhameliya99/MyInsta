import React, { useMemo, useState } from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUserData } from '../../../hooks/userData/useUserData';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { routes } from '../../../constants/routes';
import fontFamilies from '../../../assets/fonts/font';
import { hp, rf, wp } from '../../../constants/responsiveUI';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '../../../assets/icons/icon';
import InputText from '../../../components/InputText';
import { useTranslation } from 'react-i18next';
import { profileImages } from '../../../helper/global';
import useAppNavigation from '../../../hooks/navigation/useNavigation';

export default function Chat() {
  const { theme } = useAppTheme();
  const navigation = useAppNavigation();
  const userData = useUserData();
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const filteredFollowing = useMemo(() => {
    const followingList = userData?.following || [];
    if (!search.trim()) {
      return followingList;
    }
    return followingList.filter((user: any) => {
      const fullName = `${user?.userName || ''}
      }`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
  }, [search, userData?.following]);

  const handleUserPress = (item: any) => {
    navigation.navigate(routes?.userChat, {
      receiverData: item,
    });
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.card,
          {
            backgroundColor: theme.CardBackground,
          },
        ]}
        onPress={() => handleUserPress(item)}
      >
        <Image
          source={{
            uri: item?.profilePicture || profileImages[0],
          }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.name,
              {
                color: theme.text,
              },
            ]}
            numberOfLines={1}
          >
            {item?.userName || 'User'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <View
        style={[
          styles.headerContainer,
          {
            borderBottomColor: theme.background || '#ddd',
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={icon.back}
            style={[styles.icon, { tintColor: theme.text }]}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.text,
            },
          ]}
        >
          {t('chat')}
        </Text>

        <View style={styles.emptyView} />
      </View>
      <InputText
        placeholder={t('search')}
        value={search}
        onChange={setSearch}
        rightIconSource={icon.inActiveSearch}
      />
      <FlatList
        data={filteredFollowing}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.uid || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(30),
          paddingTop: hp(15),
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                {
                  color: theme.text,
                },
              ]}
            >
              No Users
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(15),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(12),
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: rf(20),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  emptyView: {
    width: wp(25),
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(12),
    borderRadius: 14,
    marginBottom: hp(12),
    elevation: 3,
  },

  image: {
    width: wp(55),
    height: wp(55),
    borderRadius: 100,
  },

  infoContainer: {
    marginLeft: wp(12),
    flex: 1,
  },

  name: {
    fontSize: rf(16),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  emptyContainer: {
    marginTop: hp(100),
    alignItems: 'center',
  },

  emptyText: {
    fontSize: rf(16),
    fontFamily: fontFamilies.poppins.medium,
  },

  icon: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',
  },
});
