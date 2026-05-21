import {
  GestureResponderEvent,
  ImageProps,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';

export interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChange?: (text: string) => void;
  leftIconSource?: ImageProps;
  rightIconSource?: ImageProps;
  isPasswordVisible?: boolean;
  contextmenu?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  maxLength?: number;
}
type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
}

export interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  color?: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  AddPost: undefined;
  Notification: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  mainTabs: undefined;
};

export type Post = {
  id: string;
  [key: string]: any;
};

export interface UserType {
  id: string;
  uid?: string;
  fname?: string;
  lname?: string;
  email?: string;
  profilePicture?: string;
  followers?: object[];
  following?: object[];
  requestCome?: object[];
  requestSend?: object[];
}

export interface FollowerProps {
  onClose?: () => void;
  type?: 'followers' | 'following';
}
