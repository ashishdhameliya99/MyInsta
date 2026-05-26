import { StyleSheet } from 'react-native';
import { hp, wp } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: wp(20),
  },
  labelText: {
    fontSize: 16,
    marginTop: hp(10),
    fontFamily: fontFamilies.poppins.medium,
  },
  imageWrapper: {
    borderWidth: 3,
    borderRadius: 15,
    marginRight: 15,
    padding: 3,
  },
  postImage: {
    width: hp(120),
    height: hp(123),
    borderRadius: 12,
  },
  loader: {
    marginTop: 20,
  },
  postImages: {
    height: hp(135),
  },
});
