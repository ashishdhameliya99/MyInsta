import { StyleSheet } from 'react-native';
import { hp, rf, wp } from '../../constants/responsiveUI';
import fontFamilies from '../../assets/fonts/font';

export const styles = StyleSheet.create({
  card: {
    marginBottom: hp(18),
    borderRadius: wp(14),
    overflow: 'hidden',
    paddingBottom: hp(12),
  },

  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    paddingVertical: hp(10),
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: wp(42),
    height: wp(42),
    borderRadius: 100,
  },

  userName: {
    marginLeft: wp(10),
    fontSize: rf(15),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  menuText: {
    fontSize: rf(22),
  },

  deleteText: {
    padding: wp(12),
    color: 'red',
    fontSize: rf(14),
  },

  postImage: {
    width: '100%',
    height: hp(300),
    resizeMode: 'cover',
  },

  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(12),
    marginTop: hp(10),
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(18),
  },

  actionIcon: {
    width: wp(24),
    height: wp(24),
    resizeMode: 'contain',
  },

  countText: {
    marginLeft: wp(5),
    fontSize: rf(14),
    fontFamily: fontFamilies.poppins.medium,
  },

  title: {
    marginTop: hp(10),
    paddingHorizontal: wp(12),
    fontSize: rf(15),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  description: {
    marginTop: hp(5),
    paddingHorizontal: wp(12),
    fontSize: rf(14),
    lineHeight: hp(22),
    fontFamily: fontFamilies.poppins.Regular,
  },

  commentWrapper: {
    marginTop: hp(12),
    paddingHorizontal: wp(12),
  },

  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  commentProfile: {
    width: wp(32),
    height: wp(32),
    borderRadius: 100,
  },

  commentContent: {
    flex: 1,
    marginLeft: wp(10),
  },

  commentUser: {
    fontSize: rf(13),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  commentText: {
    marginTop: hp(2),
    fontSize: rf(13),
    fontFamily: fontFamilies.poppins.Regular,
  },

  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(12),
    marginHorizontal: wp(12),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(12),
    paddingHorizontal: wp(10),
  },

  input: {
    flex: 1,
    height: hp(45),
    fontSize: rf(14),
  },

  postBtn: {
    color: '#0095F6',
    fontSize: rf(14),
    fontFamily: fontFamilies.poppins.semiBold,
  },

  noCommentText: {
    marginTop: hp(10),
    textAlign: 'center',
    fontSize: rf(13),
  },
});
