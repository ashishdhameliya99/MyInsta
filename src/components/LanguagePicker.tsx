import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/theme/themeContext';
import { hp, wp } from '../constants/responsiveUI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
  { label: 'English', value: 'en' },
  { label: 'Hindi (हिन्दी)', value: 'hi' },
];

const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState<string | null>(null);
  const { theme } = useAppTheme();

  useEffect(() => {
    const loadInitialLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('userLanguage');
        const langToUse = storedLang || 'en';
        changeLanguage(langToUse);
      } catch (error) {
        console.error('Error reading language from storage', error);
        changeLanguage('en');
      }
    };

    loadInitialLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      setValue(lang);
      await AsyncStorage.setItem('userLanguage', lang);
    } catch (error) {
      console.error('Error saving language', error);
    }
  };

  // useEffect(() => {
  //   const loadLanguage = async () => {
  //     try {
  //       const savedLanguage = await AsyncStorage.getItem('userLanguage');
  //       if (savedLanguage) {
  //         setValue(savedLanguage);
  //         i18n.changeLanguage(savedLanguage);
  //       }
  //     } catch (error) {
  //       console.error('Error loading language', error);
  //     }
  //   };

  //   loadLanguage();
  // }, [i18n]);

  return (
    <View style={[styles.container]}>
      <Dropdown
        style={[
          styles.dropdown,
          { backgroundColor: theme.background, borderColor: theme.text },
        ]}
        data={data}
        labelField="label"
        valueField="value"
        // placeholder="Select Language"
        value={value}
        onChange={item => changeLanguage(item.value)}
        placeholderStyle={{ color: theme.text }}
        selectedTextStyle={{ color: theme.text }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    height: hp(50),
    width: wp(100),
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
});

export default LanguagePicker;
