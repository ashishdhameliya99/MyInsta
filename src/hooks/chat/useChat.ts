import { useCallback, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { IMessage } from 'react-native-gifted-chat';
interface Props {
  receiverData: any;
}

export default function useChatMessages({ receiverData }: Props) {
  const currentUser = auth().currentUser;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const chatId = [currentUser?.uid, receiverData?.uid].sort().join('_');

  // Fetch Messages
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const allMessages: IMessage[] = snapshot.docs.map(doc => {
            const data = doc.data();

            return {
              _id: doc.id,
              text: data?.text || '',
              createdAt: data?.createdAt?.toDate() || new Date(),
              user: {
                _id: data?.senderId,
                name: data?.senderName,
              },
            };
          });

          setMessages(allMessages);
          setLoading(false);
        },

        error => {
          console.error('Message Fetch Error : ', error);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [chatId]);

  // Send Message
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      try {
        const msg = newMessages[0];
        const messageData = {
          text: msg.text,
          senderId: currentUser?.uid,
          senderName: currentUser?.displayName || 'User',
          receiverId: receiverData?.uid,
          createdAt: firestore.FieldValue.serverTimestamp(),
        };

        // Add Message
        await firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add(messageData);

        // Update Last Message
        await firestore()
          .collection('chats')
          .doc(chatId)
          .set(
            {
              users: [currentUser?.uid, receiverData?.uid],
              lastMessage: msg.text,
              lastMessageTime: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
      } catch (error) {
        console.error('Send Error : ', error);
      }
    },
    [chatId, currentUser, receiverData],
  );

  return {
    messages,
    loading,
    onSend,
    currentUser,
  };
}
