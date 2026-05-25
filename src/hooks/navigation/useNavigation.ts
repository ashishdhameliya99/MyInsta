import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const useAppNavigation = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return navigation;
};

export default useAppNavigation;
