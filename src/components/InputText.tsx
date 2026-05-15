import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { color } from '../utils/color';
import { icon } from '../assets/icons/icon';
import { wp } from '../constants/ResponsiveUI';
import { Props } from '../interface/type';

const InputText = ({
  placeholder,
  secureTextEntry,
  value,
  onChange,
  leftIconSource,
  rightIconSource,
  contextmenu,
  autoCapitalize,
}: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View style={styles.container}>
      {leftIconSource && <Image source={leftIconSource} style={styles.icon} />}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={color.placeholderText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        value={value}
        onChangeText={onChange}
        style={styles.input}
        contextMenuHidden={contextmenu}
        autoCapitalize={autoCapitalize}
      />
      {secureTextEntry ? (
        <TouchableOpacity onPress={toggleVisibility}>
          <Image
            source={isPasswordVisible ? icon.eyeShow : icon.eyeHide}
            style={styles.icon}
          />
        </TouchableOpacity>
      ) : (
        rightIconSource && (
          <Image source={rightIconSource} style={styles.icon} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: color.borderColor,
    alignItems: 'center',
  },
  icon: {
    width: wp(20),
    height: wp(20),
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    paddingLeft: wp(10),
  },
});

export default InputText;
