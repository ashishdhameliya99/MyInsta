import { StyleSheet } from 'react-native';
import { color } from '../../utils/color';
import { hp, rf, wp } from '../../constants/responsiveUI';
import fontFamilies from '../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  image: {
    height: hp(100),
    width: 'auto',
    resizeMode: 'contain',
  },
  loginCard: {
    paddingHorizontal: wp(20),
  },
  labelText: {
    fontFamily: fontFamilies.poppins.Regular,
  },
  titleText: {
    fontFamily: fontFamilies.poppins.bold,
    textAlign: 'center',
    paddingVertical: hp(20),
    fontSize: rf(22),
  },
  forgotLink: {
    alignSelf: 'flex-end',
    color: color.blue,
    fontFamily: fontFamilies.poppins.bold,
  },
  linkText: {
    textAlign: 'center',
    fontFamily: fontFamilies.poppins.semiBold,
    color: color.blue,
  },
  acLinkContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  dontHaveText: {
    fontFamily: fontFamilies.poppins.Regular,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },

  or: {
    marginHorizontal: 10,
  },
  socialBtn: {
    flexDirection: 'row',
    padding: 14,
    marginHorizontal: 5,
    borderRadius: 12,
    gap: 10,
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: hp(10),
    borderColor: color.borderColor,
  },
  icon: {
    height: wp(20),
    width: wp(20),
  },
});
