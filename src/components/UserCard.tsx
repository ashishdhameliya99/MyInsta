import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { icon } from '../assets/icons/icon';
import { wp } from '../constants/responsiveUI';
import Button from '.././components/Button';

export default function UserCard({ user }: any) {
  console.log('user.profileImage', user.profileImage);
  return (
    <View style={styles.cardContainer}>
      <View style={styles.image}>
        <Image
          source={user?.profileImage || icon.activeUser}
          style={styles.icon}
        />
      </View>
      <Text style={styles.name}>{user?.fname}</Text>
      <Button title="Follow" />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#e1e1e1ff',
    gap: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  icon: {
    height: wp(40),
    width: wp(40),
  },
  image: {
    borderRadius: 90,
    borderWidth: 2,
    padding: 5,
    alignSelf: 'center',
  },
});
