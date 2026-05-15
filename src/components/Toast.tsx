import Toast from 'react-native-toast-message';
import { ToastProps } from '../interface/type';

export const showToast = ({ type = 'info', title, message }: ToastProps) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 3000,
  });
};

export const successToast = (title: string, message?: string) => {
  showToast({ type: 'success', title, message });
};

export const errorToast = (title: string, message?: string) => {
  showToast({ type: 'error', title, message });
};
