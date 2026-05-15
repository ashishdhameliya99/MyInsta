import { useEffect } from 'react';
import AuthStack from './src/navigation/AuthStack';
import RNBootSplash from 'react-native-bootsplash';

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 200);

    return () => clearTimeout(timer);
  }, []);
  return <AuthStack />;
}

export default App;
