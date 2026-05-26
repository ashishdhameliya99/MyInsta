import { StyleSheet } from 'react-native';
import { wp } from '../../../constants/responsiveUI';
import fontFamilies from '../../../assets/fonts/font';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(20),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.poppins.bold,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  listCard: {
    gap: 20,
  },
});
