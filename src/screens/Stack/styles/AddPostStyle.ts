import { StyleSheet } from 'react-native';
import { hp } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: hp(5),
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    resizeMode: 'contain',
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
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  loader: {
    marginTop: 20,
  },
});
