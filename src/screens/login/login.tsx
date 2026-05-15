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
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from './LoginStyle';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const handleLogin = () => {};
  const onGooglePress = () => {};
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
        <Button title={t('login')} onPress={handleLogin} />
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
