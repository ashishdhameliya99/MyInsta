import { useEffect } from 'react';
import AuthStack from './src/navigation/AuthStack';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';

import firebase from '@react-native-firebase/app';
function App() {
  const checkFirebase = () => {
    console.log('Firebase App:', firebase.app());
  };

  checkFirebase();

  useEffect(() => {
    const timer = setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 200);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <AuthStack />
      <Toast />
    </>
  );
}

export default App;
