import React, { useState } from 'react';

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import useAppNavigation from '../../../hooks/navigation/useNavigation';
import useChatMessages from '../../../hooks/chat/useChat';
import ChatHeader from '../../../components/chatHeader';
import { RouteParams } from '../../../interface/type';
import fontFamilies from '../../../../android/app/src/main/assets/custom/font';
import { hp, wp } from '../../../constants/responsiveUI';
import { icon } from '../../../assets/icons/icon';

export default function UserChat() {
  const route = useRoute<RouteProp<RouteParams>>();
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();
  const receiverData = route.params.receiverData;
  const { messages, loading, onSend, currentUser } = useChatMessages({
    receiverData,
  });
  const [customText, setCustomText] = useState('');
  const handleSend = () => {
    if (customText.trim()) {
      onSend([
        {
          text: customText,
          _id: Math.random().toString(),
          createdAt: new Date(),
          user: { _id: currentUser?.uid || '' },
        },
      ]);
      setCustomText('');
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loader,
          {
            backgroundColor: theme.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#0095F6" />
      </View>
    );
  }
  const renderEmptyChat = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No message</Text>
        <Text style={styles.emptyTitle}>Start conversation</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <ChatHeader user={receiverData} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <GiftedChat
          messages={messages}
          renderChatEmpty={renderEmptyChat}
          onSend={onSend}
          user={{ _id: currentUser?.uid || '' }}
          // inverted={messages.length > 0}
          // alwaysShowSend
          // scrollToBottom
          // keyboardShouldPersistTaps="handled"
          renderAvatar={null}
          // isKeyboardInternallyHandled={true}
          // bottomOffset={Platform.OS === 'android' ? 20 : 0}
          minInputToolbarHeight={0}
          renderInputToolbar={() => null}
          // listViewProps={{
          //   showsVerticalScrollIndicator: false,
          //   keyboardDismissMode: 'interactive',
          // }}
          messagesContainerStyle={{ backgroundColor: theme.background }}
        />

        <View
          style={[styles.inputContainer, { backgroundColor: theme.background }]}
        >
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: theme.modal, color: theme.chatText },
            ]}
            placeholder="Type a message..."
            value={customText}
            onChangeText={setCustomText}
            selectionColor={theme.text}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Image
              source={icon.sendMsg}
              style={[styles.sendIcon, { tintColor: theme.text }]}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(15),
    paddingVertical: hp(10),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.poppins.semiBold,
  },
  emptyContainer: {
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  sendIcon: {
    height: hp(20),
    width: hp(20),
  },
});
