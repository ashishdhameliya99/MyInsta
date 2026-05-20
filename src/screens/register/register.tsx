import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icon } from '../../assets/icons/icon';
import { useTranslation } from 'react-i18next';
import '../../localization/i18n';
import InputText from '../../components/InputText';
import DatePicker from 'react-native-date-picker';
import Button from '../../components/Button';
import { routes } from '../../constants/routes';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import auth, {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { styles } from './RegisterStyle';
import { errorToast, successToast } from '../../components/Toast';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { RadioButton } from 'react-native-paper';
GoogleSignin.configure({
  webClientId:
    '520055351712-thklhe3eqbk1oo9hmr0chnb18ehiuhfg.apps.googleusercontent.com',
});

export default function Register() {
  const { t } = useTranslation();
  const route = useRoute<RouteProp<any>>();
  const isEdit = route?.params?.isEdit || false;
  const editUserData = route?.params?.userData;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [firstName, setFirstName] = useState(editUserData?.fname || '');
  const [lastName, setLastName] = useState(editUserData?.lname || '');
  const [mobile, setMobile] = useState(editUserData?.mobile || '');
  const [gender, setGender] = useState(editUserData?.gender || '');
  const [email, setEmail] = useState(editUserData?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState(editUserData?.dob?.toDate?.() || new Date());
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const handleSubmit = async () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !mobile.trim() ||
      !gender.trim() ||
      !email.trim()
    ) {
      errorToast('Invalid', 'Please fill all fields');

      return;
    }

    if (mobile.length !== 10) {
      errorToast('Invalid Mobile', 'Mobile number must be 10 digits');

      return;
    }

    if (isEdit) {
      Alert.alert(
        'Confirm Update',
        'Are you sure you want to update profile?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },

          {
            text: 'OK',

            onPress: async () => {
              try {
                setLoading(true);

                const user = auth().currentUser;

                if (!user) {
                  return;
                }

                await firestore().collection('usersData').doc(user.uid).update({
                  fname: firstName.trim(),
                  lname: lastName.trim(),
                  mobile: mobile.trim(),
                  gender: gender.trim(),
                  dob: dob,
                  email: email.trim(),
                  updatedAt: firestore.FieldValue.serverTimestamp(),
                });

                const postsSnapshot = await firestore()
                  .collection('usersData')
                  .doc(user.uid)
                  .collection('posts')
                  .get();

                const batch = firestore().batch();

                postsSnapshot.docs.forEach(document => {
                  batch.update(document.ref, {
                    userName: firstName.trim(),
                  });
                });

                await batch.commit();

                successToast('Success', 'Profile updated successfully');

                navigation.goBack();
              } catch (error) {
                console.log('Update Error : ', error);

                errorToast('Error', 'Update failed');
              } finally {
                setLoading(false);
              }
            },
          },
        ],
      );

      return;
    }
    if (!password || !confirmPassword) {
      errorToast('Invalid', 'Please enter password');

      return;
    }

    if (password !== confirmPassword) {
      errorToast('Error', 'Passwords do not match');

      return;
    }

    if (password.length < 6) {
      errorToast('Weak Password', 'Password must be at least 6 characters');

      return;
    }
    try {
      setLoading(true);

      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );

      const userId = userCredential.user.uid;

      await firestore().collection('usersData').doc(userId).set({
        uid: userId,
        fname: firstName.trim(),
        lname: lastName.trim(),
        userName: firstName.trim(),
        mobile: mobile.trim(),
        gender: gender.trim(),
        dob: dob,
        email: email.trim(),
        followers: [],
        following: [],
        requestCome: [],
        requestSend: [],
        profilePicture: '',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      successToast('Success', 'Account created successfully');

      navigation.navigate(routes.login);
    } catch (error: any) {
      console.log('Signup Error:', error);

      if (error.code === 'auth/email-already-in-use') {
        errorToast('Email Exists', 'This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        errorToast('Invalid Email', 'Please enter valid email');
      } else {
        errorToast('Signup Failed', error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(
        getAuth(),
        googleCredential,
      );

      const user = userCredential.user;
      const userRef = firestore().collection('usersData').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set({
          uid: user.uid,
          fname: user.displayName || '',
          lname: '',
          userName: user.displayName || '',
          mobile: '',
          gender: '',
          dob: new Date(),
          email: user.email || '',
          followers: [],
          following: [],
          requestCome: [],
          requestSend: [],
          profilePicture: user.photoURL || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      successToast('Success', 'Google login successful');
    } catch (error: any) {
      console.log('Google Login Error:', error);

      errorToast(
        'Google Login Failed',
        error.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.loginCard}
          showsVerticalScrollIndicator={false}
        >
          <Image source={icon.image} style={styles.image} />

          <Text style={styles.titleText}>
            {isEdit ? 'Edit Profile' : t('user_register')}
          </Text>

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
            onChange={setLastName}
            leftIconSource={icon.inActiveUser}
          />

          <Text style={styles.labelText}>{t('mobile')}</Text>

          <InputText
            placeholder={t('mobile')}
            value={mobile}
            onChange={text => {
              const numericValue = text.replace(/[^0-9]/g, '');

              setMobile(numericValue);
            }}
            leftIconSource={icon.phone}
            maxLength={10}
          />

          <Text style={styles.labelText}>Gender</Text>

          <RadioButton.Group
            onValueChange={value => setGender(value)}
            value={gender}
          >
            <View style={styles.radioContainer}>
              <View style={styles.radioMale}>
                <RadioButton value="Male" />
                <Text>Male</Text>
              </View>

              <View style={styles.radioMale}>
                <RadioButton value="Female" />
                <Text>Female</Text>
              </View>

              <View style={styles.radioMale}>
                <RadioButton value="Other" />
                <Text>Other</Text>
              </View>
            </View>
          </RadioButton.Group>

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
          />

          {!isEdit && (
            <>
              <Text style={styles.labelText}>{t('enter_password')}</Text>

              <InputText
                placeholder={t('enter_password')}
                value={password}
                onChange={setPassword}
                secureTextEntry
                leftIconSource={icon.lock}
              />

              <Text style={styles.labelText}>{t('confirmPassword')}</Text>

              <InputText
                placeholder={t('confirmPassword')}
                value={confirmPassword}
                onChange={setConfirmPassword}
                secureTextEntry
                leftIconSource={icon.lock}
              />
            </>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#999" />
          ) : (
            <Button
              title={isEdit ? 'Update Profile' : t('register')}
              onPress={handleSubmit}
            />
          )}

          {!isEdit && (
            <>
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

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={onGooglePress}
              >
                <Image source={icon.google} style={styles.icon} />

                <Text>Google</Text>
              </TouchableOpacity>
            </>
          )}

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
