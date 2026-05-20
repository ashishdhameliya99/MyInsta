import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';
import { icon } from '../../../assets/icons/icon';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import InputText from '../../../components/InputText';
import Button from '../../../components/Button';
import { imageList } from '../../../helper/global';
import { errorToast, successToast } from '../../../components/Toast';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { routes } from '../../../constants/routes';
import { styles } from '../styles/AddPostStyle';
import { useUserData } from '../../../hooks/userData/useUserData';

export default function AddPost() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const userData = useUserData();
  const [selectedImage, setSelectedImage] = useState(imageList[0]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const handleSubmit = async () => {
    if (!title.trim() || !desc.trim()) {
      errorToast('Validation', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) {
        errorToast('Error', 'User not found');
        return;
      }

      await firestore()
        .collection('usersData')
        .doc(user.uid)
        .collection('posts')
        .add({
          title: title.trim(),
          description: desc.trim(),
          imageURL: selectedImage,
          uid: user.uid,
          likes: [],
          comments: [],
          createdAt: firestore.FieldValue.serverTimestamp(),
          postCreated: {
            fname: userData?.fname.trim(),
            lname: userData?.lname.trim(),
            email: userData?.email.trim(),
          },
        });

      successToast('Success', 'Post added successfully');
      navigation.navigate(routes.home);

      setTitle('');
      setDesc('');
      setSelectedImage(imageList[0]);
    } catch (error) {
      console.log('Add Post Error : ', error);

      errorToast('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderImageItem = ({ item }: { item: string }) => {
    const isSelected = selectedImage === item;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.imageWrapper,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            borderColor: isSelected ? '#000' : 'transparent',
          },
        ]}
        onPress={() => setSelectedImage(item)}
      >
        <Image source={{ uri: item }} style={styles.postImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <Text
        style={[
          styles.labelText,
          {
            color: theme.text,
          },
        ]}
      >
        {t('selectImage')}
      </Text>

      <FlatList
        data={imageList}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={renderImageItem}
        showsHorizontalScrollIndicator={false}
      />

      <Text
        style={[
          styles.labelText,
          {
            color: theme.text,
          },
        ]}
      >
        {t('title')}
      </Text>

      <InputText
        placeholder={t('title')}
        value={title}
        onChange={setTitle}
        leftIconSource={icon.title}
      />

      <Text
        style={[
          styles.labelText,
          {
            color: theme.text,
          },
        ]}
      >
        {t('description')}
      </Text>

      <InputText
        placeholder={t('description')}
        value={desc}
        onChange={setDesc}
        leftIconSource={icon.desc}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#999" style={styles.loader} />
      ) : (
        <Button title={t('submit')} onPress={handleSubmit} />
      )}
    </View>
  );
}
