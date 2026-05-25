import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { hp, wp } from '../constants/responsiveUI';

const UserCardSkeleton = () => {
  return (
    <SkeletonPlaceholder
      direction="right"
      speed={300}
      backgroundColor="#d9d9d9"
      highlightColor="#f2f2f2"
    >
      <View style={styles.cardContainer}>
        <View style={styles.image} />

        <View style={styles.nameContainer}>
          <View style={styles.name} />
        </View>

        <View style={styles.buttonPlaceholder} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  nameContainer: {
    marginLeft: wp(16),
    flex: 1,
  },
  name: {
    width: wp(120),
    height: hp(16),
    borderRadius: 4,
  },
  buttonPlaceholder: {
    width: 80,
    height: 32,
    borderRadius: 16,
    marginLeft: 16,
  },
});

export default UserCardSkeleton;
