import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export const rf = (size: number) => RFValue(size, 926);

export const wp = (value: number) => widthPercentageToDP((value * 100) / 428);
export const hp = (value: number) => heightPercentageToDP((value * 100) / 926);
