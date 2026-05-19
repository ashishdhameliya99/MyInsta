import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../hooks/theme/themeContext';

const data = [
  { label: 'English', value: 'en' },
  { label: 'Hindi (हिन्दी)', value: 'hi' },
];

const LanguagePicker = () => {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language);
  const { theme } = useAppTheme();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setValue(lang);
  };

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
        placeholder="Select Language"
        value={value}
        onChange={item => changeLanguage(item.value)}
        placeholderStyle={{ color: theme.text }}
        selectedTextStyle={{ color: theme.text }}
        // itemTextStyle={{ color: theme.text }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    height: 50,
    width: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
});

export default LanguagePicker;
