import { useEffect } from 'react';
import AuthStack from './src/navigation/AuthStack';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';

import { ThemeProvider } from './src/hooks/theme/themeContext';
import { MenuProvider } from 'react-native-popup-menu';
import useUserStatus from './src/hooks/userStatus/useStatus';
function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  useUserStatus();

  return (
    <MenuProvider>
      <ThemeProvider>
        <AuthStack />
        <Toast />
      </ThemeProvider>
    </MenuProvider>
  );
}

export default App;
