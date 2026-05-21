import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import fontFamilies from '../assets/fonts/font';
import { useAppTheme } from '../hooks/theme/themeContext';

interface FollowerCountProps {
  onPress?: (event: GestureResponderEvent) => void;
  number: number;
  text: string;
}
export default function FollowerCount({
  onPress,
  number,
  text,
}: FollowerCountProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={[styles.numberText, { color: theme.text }]}>{number}</Text>
      <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: fontFamilies.poppins.Regular,
  },
  text: {
    fontFamily: fontFamilies.poppins.semiBold,
  },
});
