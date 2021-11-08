import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { GiftedChat, IMessage as IGiftedMessage } from 'react-native-gifted-chat';
import { IMessage, toGiftedMessage, toIMessage, toISentMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { ChatContext, ChatSocketContext } from '../navigation/ChatSocketProvider';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [giftedMessages, setGiftedMessages] = useState<IGiftedMessage[]>([]);

  const { user } =  React.useContext(AuthenticatedUserContext);
  const { messages, roomWatchedId, setRoomWatchedId }= React.useContext(ChatContext);
  const { socket } =  React.useContext(ChatSocketContext);

  const messagesSeenListener = (userId: string, roomId: string) => {
    console.log('messages seen!')
    if(roomId == route.params._id) {
      setGiftedMessages(old => {
        const newMessages = [...old]
        newMessages.forEach(x => { if(!x.received && x.user._id != userId) x.received = true})
        return newMessages;
      });
    }
  }

  const newMessageListener = (message: IMessage) => {
    console.log('message received!')
    if(message.roomId != route.params._id) return;

    if (message.userId == user.uid) { // from me, update it
      setGiftedMessages(old => {
        const newMessages = [...old]
        const sentIndex = newMessages.findIndex(x => !x.sent)
        if(sentIndex >= 0) {
          newMessages[sentIndex].sent = true
          newMessages[sentIndex]._id = message._id
        }
        return newMessages
      });
    } else { // not from me, add it as seen
      message.seen = true
      appendMessages([message])
    }
  }

  useFocusEffect(
    useCallback(() => {
      setRoomWatchedId(route.params._id);
      return () => {
        setRoomWatchedId(null)
      }
    }, [route.params._id])
  )

  useEffect(() => {
    setMessages(messages.get(route.params._id))
    socket.on('messagesSeen', messagesSeenListener)
    socket.on('newMessage', newMessageListener);

    return function cleanup() {
      socket.off('messagesSeen', messagesSeenListener)
      socket.off('newMessage', newMessageListener)
      setGiftedMessages([])
    }
  }, [route.params._id])

  function sendMessage(sentMessages: IGiftedMessage[]) {
    setGiftedMessages(previousMessages => GiftedChat.append(previousMessages, sentMessages))
    for(const message of sentMessages.map(x => toISentMessage(x, route.params._id))) {
      socket.emit('newMessage', message)
    }
  }

  function appendMessages(newMessages: IMessage[]) {
    setGiftedMessages(previousMessages =>
      GiftedChat.append(previousMessages,
        newMessages.map(message => toGiftedMessage(message, message.userId == user?.uid ? user : route.params.user)).reverse())
    )
  }

  function setMessages(newMessages: IMessage[]) {
    setGiftedMessages(newMessages.map(message => toGiftedMessage(message, message.userId == user?.uid ? user : route.params.user)).reverse())
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      {/* <Text style={styles.title} numberOfLines={1}>{route.params.user.name + " - " + route.params.service.title}</Text> */}
      <View style={styles.chatContainer}>
        <GiftedChat messages={giftedMessages}
        shouldUpdateMessage={(props, nextProps) => props.currentMessage !== nextProps.currentMessage}
        user={{_id: user.uid, name: user.name}} onSend={sendMessage}/>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chatContainer: {
    // height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
    flexShrink: 1,
  },
  title: {
    margin: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
  },
});
