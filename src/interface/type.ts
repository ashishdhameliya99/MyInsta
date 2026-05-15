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
