import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '../../assets/icons/icon';
import { useTranslation } from 'react-i18next';
import '../../localization/i18n';
import LanguagePicker from '../../components/LanguagePicker';
import InputText from '../../components/InputText';
import Button from '../../components/Button';
import { routes } from '../../constants/routes';
import { styles } from './LoginStyle';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth, {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { errorToast, successToast } from '../../components/Toast';
import { ActivityIndicator } from 'react-native-paper';
import useAppNavigation from '../../hooks/navigation/useNavigation';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useAppNavigation();
  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      errorToast('Require field', 'please enter email and password');
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      successToast('Success', 'Welcome Back');
      navigation.navigate(routes.mainApp);
    } catch {
      errorToast('Login failed', 'require all field');
    } finally {
      setLoading(false);
    }
  };

  GoogleSignin.configure({
    webClientId:
      '520055351712-thklhe3eqbk1oo9hmr0chnb18ehiuhfg.apps.googleusercontent.com',
  });

  async function onGooglePress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const signInResult = await GoogleSignin.signIn();

      if (signInResult.type === 'success') {
        const { idToken } = signInResult.data;

        if (!idToken) {
          throw new Error(
            'No ID token found. Ensure webClientId is configured.',
          );
        }
        const googleCredential = GoogleAuthProvider.credential(idToken);
        return signInWithCredential(getAuth(), googleCredential);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.error('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.error('Signin is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services not available or outdated');
      } else {
        console.error('Some other error happened: ', error);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={icon.image} style={styles.image} />
      <LanguagePicker />
      <Text style={styles.titleText}>{t('user_login')}</Text>
      <View style={styles.loginCard}>
        <Text style={styles.labelText}>{t('enter_email')}</Text>
        <InputText
          placeholder={t('enter_email')}
          value={email}
          onChange={setEmail}
          leftIconSource={icon.email}
        />
        <Text style={styles.labelText}>{t('enter_password')}</Text>
        <InputText
          placeholder={t('enter_password')}
          value={password}
          onChange={setPassword}
          secureTextEntry={true}
          leftIconSource={icon.lock}
        />
        <Text style={styles.forgotLink}>{t('forgot_password')}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#999" />
        ) : (
          <Button title={t('login')} onPress={handleLogin} />
        )}
        <View style={styles.acLinkContainer}>
          <Text style={styles.dontHaveText}>{t('account')}</Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate(routes.register)}
          >
            {t('sign_up')}
          </Text>
        </View>
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>{t('or')}</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.socialBtn} onPress={onGooglePress}>
          <Image source={icon.google} style={styles.icon} />
          <Text>Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
