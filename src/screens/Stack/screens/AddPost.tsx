import React, { useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { addUserPost, getCurrentUser } from '../../../services/firestore';

import { useTranslation } from 'react-i18next';
import { icon } from '../../../assets/icons/icon';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import InputText from '../../../components/InputText';
import Button from '../../../components/Button';
import { imageList } from '../../../helper/global';
import { errorToast, successToast } from '../../../components/Toast';
import { routes } from '../../../constants/routes';
import { styles } from '../styles/AddPostStyle';
import { useUserData } from '../../../hooks/userData/useUserData';

import useAppNavigation from '../../../hooks/navigation/useNavigation';

export default function AddPost() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedImage, setSelectedImage] = useState(imageList[0]);
  const [loading, setLoading] = useState(false);
  const userData = useUserData();
  const navigation = useAppNavigation();

  const handleSubmit = async () => {
    if (!title.trim() || !desc.trim()) {
      errorToast('Validation', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const user = getCurrentUser;
      if (!user) {
        errorToast('Error', 'User not found');
        return;
      }

      const postPayload = {
        userData: userData,
        postDetails: {
          title: title.trim(),
          desc: desc.trim(),
          selectedImage: selectedImage,
        },
      };

      await addUserPost(postPayload);
      successToast('Success', 'Post added successfully');
      setTitle('');
      setDesc('');
      setSelectedImage(imageList[0]);

      navigation.navigate(routes.home);
    } catch (error) {
      console.error('Add Post Error : ', error);

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
            borderColor: isSelected ? '#0095F6' : 'transparent',
          },
        ]}
        onPress={() => setSelectedImage(item)}
      >
        <Image
          source={{
            uri: item,
          }}
          style={styles.postImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.background,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
            keyExtractor={index => index.toString()}
            horizontal
            renderItem={renderImageItem}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.postImages}
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
          <View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0095F6"
                style={[styles.loader, { backgroundColor: theme.background }]}
              />
            ) : (
              <Button title={t('submit')} onPress={handleSubmit} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
