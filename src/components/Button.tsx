import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CustomButtonProps } from '.././interface/type';
import fontFamilies from '.././assets/fonts/font';
import { hp, wp } from '.././constants/responsiveUI';
import { color } from '../utils/color';

const CustomButton = ({ title, onPress }: CustomButtonProps) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: color.blue,
      padding: wp(12),
      borderRadius: 8,
      paddingHorizontal: wp(20),
      marginVertical: hp(10),
    },
    buttonTitle: {
      color: '#fff',
      textAlign: 'center',
      fontFamily: fontFamilies.poppins.bold,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
export default CustomButton;
