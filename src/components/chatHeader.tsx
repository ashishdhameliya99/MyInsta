import React, { memo, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '.././hooks/theme/themeContext';
import { hp, rf, wp } from '.././constants/responsiveUI';
import { icon } from '.././assets/icons/icon';
import { profileImages } from '../helper/global';
import { db } from '../services/firestore';

interface Props {
  user: any;
  onBack: () => void;
}

function ChatHeader({ user, onBack }: Props) {
  const { theme } = useAppTheme();
  const [isOnline, setIsOnline] = useState(true);
  console.log('user', user);
  useEffect(() => {
    const unsubscribe = db
      .collection('usersData')
      .doc(user?.uid)
      .onSnapshot(doc => {
        const data = doc.data();
        console.log('data', data);
        setIsOnline(data?.isOnline || false);
      });
    return unsubscribe;
  }, [user]);
  return (
    <View
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor: theme.background,

          borderBottomColor: '#ddd',
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} onPress={onBack}>
        <Image
          source={icon.back}
          style={[
            styles.icon,
            {
              tintColor: theme.text,
            },
          ]}
        />
      </TouchableOpacity>

      <Image
        source={{
          uri: user?.profilePicture || profileImages[0],
        }}
        style={styles.profileImage}
      />

      <View style={styles.headerName}>
        <Text
          style={[
            styles.userName,
            {
              color: theme.text,
            },
          ]}
        >
          {user?.userName || 'User'}
        </Text>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            fontSize: 12,
            color: isOnline ? 'green' : '#999',
            marginTop: 2,
          }}
        >
          {isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </View>
  );
}

export default memo(ChatHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
    borderBottomWidth: 1,
  },

  icon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },

  profileImage: {
    width: wp(42),
    height: wp(42),
    borderRadius: 100,
    marginLeft: wp(15),
  },

  userName: {
    fontSize: rf(16),
    fontWeight: '600',
  },
  headerName: {
    paddingLeft: wp(10),
  },
});
