import { StyleSheet } from 'react-native';
import { hp, rf } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(20),
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(30),
  },

  emptyText: {
    fontSize: rf(16),
    fontFamily: fontFamilies.poppins.semiBold,
  },
});
