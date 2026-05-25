import { StyleSheet } from 'react-native';
import { hp } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    flex: 5,
    paddingHorizontal: 20,
    paddingTop: hp(5),
  },
  labelText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
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
    height: hp(120),
    borderRadius: 12,
  },
  loader: {
    marginTop: 20,
  },
  postImages: {
    height: hp(135),
  },
});
