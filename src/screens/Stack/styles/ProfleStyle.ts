import { StyleSheet } from 'react-native';
import { hp, rf, wp } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: hp(20),
  },

  profileContainer: {
    flexDirection: 'row',
    gap: wp(30),
    marginBottom: hp(20),
  },

  image: {
    height: 100,
    width: 100,
    borderWidth: 3,
    borderColor: '#e0dddd',
    borderRadius: 90,
    resizeMode: 'cover',
  },

  listContainer: {
    flexDirection: 'row',
    gap: wp(30),
    alignItems: 'center',
  },

  userName: {
    fontFamily: fontFamilies.poppins.semiBold,
    alignSelf: 'center',
    marginTop: 5,
  },

  editProfile: {
    borderWidth: 1,
    borderColor: '#e0dddd',
    borderRadius: 8,
    marginBottom: 20,
  },

  editText: {
    textAlign: 'center',
    paddingVertical: 8,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  flatListContainer: {
    paddingBottom: 10,
  },

  postCard: {
    flex: 1,
    height: wp(150),
    width: wp(160),
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0dddd',
  },

  postImage: {
    width: '100%',
    height: 220,
    resizeMode: 'stretch',
  },

  postContent: {
    padding: 12,
  },
  flatListGap: {
    gap: 20,
  },

  postTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.poppins.semiBold,
  },

  postDescription: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fontFamilies.poppins.Regular,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  profileLoader: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectProfile: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageSet: {
    justifyContent: 'space-around',
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  closeText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  profileBorder: {
    width: wp(100),
    height: wp(100),
    borderRadius: 100,
  },
  modalContainer: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '70%',
  },
  backText: {
    fontSize: rf(20),
    fontFamily: fontFamilies.poppins.semiBold,
  },
  icon: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'contain',
  },
});
