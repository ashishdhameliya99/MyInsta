import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme } from '../../utils/color';

const THEME_KEY = 'theme';

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme !== null) {
          setDark(savedTheme === 'dark');
        } else {
          console.log('not set theme');
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newDarkState = !dark;
      setDark(newDarkState);
      await AsyncStorage.setItem(THEME_KEY, newDarkState ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const theme = dark ? darkTheme : lightTheme;
  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export const useAppTheme = () => useContext(ThemeContext);
