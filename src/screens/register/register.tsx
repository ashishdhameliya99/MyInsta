import { Image, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '../../assets/icons/icon';
import { useTranslation } from 'react-i18next';
import '../../localization/i18n';
import InputText from '../../components/InputText';
import DatePicker from 'react-native-date-picker';
import Button from '../../components/Button';
import { routes } from '../../constants/routes';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import { styles } from './RegisterStyle';

export default function Register() {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLstName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleLogin = () => {};
  const onGooglePress = () => {};
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.loginCard}
          showsVerticalScrollIndicator={false}
        >
          <Image source={icon.image} style={styles.image} />
          <Text style={styles.titleText}>{t('user_register')}</Text>
          <Text style={styles.labelText}>{t('firstName')}</Text>
          <InputText
            placeholder={t('firstName')}
            value={firstName}
            onChange={setFirstName}
            leftIconSource={icon.inActiveUser}
          />
          <Text style={styles.labelText}>{t('lastName')}</Text>
          <InputText
            placeholder={t('lastName')}
            value={lastName}
            onChange={setLstName}
            leftIconSource={icon.inActiveUser}
          />
          <Text style={styles.labelText}>{t('mobile')}</Text>
          <InputText
            placeholder={t('mobile')}
            value={mobile}
            onChange={setMobile}
            leftIconSource={icon.phone}
          />
          <Text style={styles.labelText}>{t('dob')}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpenDate(true)}
          >
            <View pointerEvents="none">
              <InputText
                placeholder="Select DOB"
                value={formatDate(dob)}
                editable={false}
                leftIconSource={icon.calendar}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.labelText}>{t('enter_email')}</Text>
          <InputText
            placeholder={t('enter_email')}
            value={email}
            onChange={setEmail}
            leftIconSource={icon.email}
            contextmenu={true}
          />
          <Text style={styles.labelText}>{t('enter_password')}</Text>
          <InputText
            placeholder={t('enter_password')}
            value={password}
            onChange={setPassword}
            secureTextEntry={true}
            leftIconSource={icon.lock}
            contextmenu={true}
          />
          <Text style={styles.labelText}>{t('confirmPassword')}</Text>
          <InputText
            placeholder={t('confirmPassword')}
            value={confirmPassword}
            onChange={setConfirmPassword}
            secureTextEntry={true}
            leftIconSource={icon.lock}
            contextmenu={true}
          />
          <Text style={styles.forgotLink}>{t('forgot_password')}</Text>
          <Button title={t('register')} onPress={handleLogin} />
          <View style={styles.acLinkContainer}>
            <Text style={styles.dontHaveText}>{t('accountAlready')}</Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate(routes.login)}
            >
              {t('login')}
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
          <DatePicker
            modal
            mode="date"
            open={openDate}
            date={dob}
            onConfirm={date => {
              setDob(date);

              setOpenDate(false);
            }}
            onCancel={() => setOpenDate(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
