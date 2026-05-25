import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

const initI18n = async () => {
  const savedLang = await AsyncStorage.getItem('userLanguage');

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLang || 'en',
    fallbackLng: 'en',
  });
};

initI18n();

export default i18n;
