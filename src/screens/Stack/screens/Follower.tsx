// import { FlatList, StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { FollowerProps, UserType } from '../../../interface/type';
// import { useUserData } from '../../../hooks/userData/useUserData';
// import UserCard from '../../../components/UserCard';
// import fontFamilies from '../../../assets/fonts/font';
// import { rf, wp } from '../../../constants/responsiveUI';
// import { useAppTheme } from '../../../hooks/theme/themeContext';

// const EmptyListMessage = () => (
//   <View style={styles.emptyContainer}>
//     <Text style={[styles.emptyText]}>No Users Found</Text>
//   </View>
// );

// export default function Follower({ onClose }: FollowerProps) {
//   const userData = useUserData();
//   const follower = userData?.followers;
//   const following = userData?.following;
//   console.log('following', following);
//   const { theme } = useAppTheme();

//   const renderItem = ({ item }: { item: UserType }) => {
//     return <UserCard user={item} />;
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.modalHeader}>
//         <Text style={[styles.title, { color: theme.text }]}>Follower List</Text>
//         <Text
//           onPress={onClose}
//           style={[styles.closeText, { color: theme.text }]}
//         >
//           Close
//         </Text>
//       </View>
//       <FlatList
//         data={follower}
//         keyExtractor={item => item.id}
//         renderItem={renderItem}
//         ListEmptyComponent={EmptyListMessage}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         initialNumToRender={5}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: wp(20),
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 100,
//     paddingHorizontal: 40,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontFamily: fontFamilies.poppins.bold,
//     marginBottom: 8,
//   },
//   listContainer: {
//     gap: 20,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 20,
//     fontSize: 16,
//     color: '#999',
//   },
//   title: {
//     fontSize: rf(20),
//     fontFamily: fontFamilies.poppins.semiBold,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   closeText: {
//     fontFamily: fontFamilies.poppins.semiBold,
//     fontSize: rf(20),
//   },
// });
import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { FollowerProps, UserType } from '../../../interface/type';
import { useUserData } from '../../../hooks/userData/useUserData';
import UserCard from '../../../components/UserCard';
import fontFamilies from '../../../assets/fonts/font';
import { rf, wp } from '../../../constants/responsiveUI';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import { useTranslation } from 'react-i18next';

const EmptyListMessage = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No Users Found</Text>
  </View>
);

export default function Follower({ onClose, type }: FollowerProps) {
  const userData = useUserData();
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const listData = useMemo(() => {
    return type === 'followers'
      ? userData?.followers || []
      : userData?.following || [];
  }, [type, userData]);
  console.log('listData=============', listData);
  const renderItem = ({ item }: { item: UserType }) => {
    return <UserCard user={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <Text style={[styles.title, { color: theme.text }]}>
          {type === 'followers' ? t('followerList') : t('followingList')}
        </Text>

        <Text
          onPress={onClose}
          style={[styles.closeText, { color: theme.text }]}
        >
          {t('close')}
        </Text>
      </View>

      <FlatList
        data={listData}
        keyExtractor={item => item?.id}
        renderItem={renderItem}
        ListEmptyComponent={EmptyListMessage}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(20),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
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

  title: {
    fontSize: rf(20),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  closeText: {
    fontFamily: fontFamilies.poppins.semiBold,
    fontSize: rf(20),
  },
});
