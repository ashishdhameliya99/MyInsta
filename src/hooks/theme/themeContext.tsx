import React, { createContext, useContext, useState, ReactNode } from 'react';
import { darkTheme, lightTheme } from '../../utils/color';

const ThemeContext = createContext({
  dark: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [dark, setDark] = useState(false);
  const theme = dark ? darkTheme : lightTheme;

  const toggleTheme = () => setDark(!dark);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
