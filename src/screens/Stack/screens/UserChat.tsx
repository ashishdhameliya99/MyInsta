import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../hooks/theme/themeContext';
import useAppNavigation from '../../../hooks/navigation/useNavigation';
import useChatMessages from '../../../hooks/chat/useChat';
import ChatHeader from '../../../components/chatHeader';
import { hp } from '../../../constants/responsiveUI';

type RouteParams = {
  params: {
    receiverData: any;
  };
};

export default function UserChat() {
  const route = useRoute<RouteProp<RouteParams>>();
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();
  const receiverData = route?.params?.receiverData;
  const { messages, loading, onSend, currentUser } = useChatMessages({
    receiverData,
  });

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
        <Text style={styles.emptyText}>No chat, Say hello!</Text>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
      edges={['top', 'left', 'right']}
    >
      <ChatHeader user={receiverData} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: currentUser?.uid || '',
          }}
          alwaysShowSend
          scrollToBottom
          showUserAvatar={false}
          renderAvatar={null}
          keyboardShouldPersistTaps="handled"
          placeholder="Type message..."
          bottomOffset={Platform.OS === 'android' ? 5 : 0}
          renderChatEmpty={renderEmptyChat}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(20),
  },

  flex: {
    flex: 1,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});
