import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { GiftedChat, IMessage as IGiftedMessage } from 'react-native-gifted-chat';
import { IMessage, toGiftedMessage, toIMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { ChatContext, SocketContext } from '../navigation/SocketProvider';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [giftedMessages, setGiftedMessages] = useState<IGiftedMessage[]>([]);

  const { user } =  React.useContext(AuthenticatedUserContext);
  const { messages }= React.useContext(ChatContext);
  const { socket } =  React.useContext(SocketContext);

  React.useEffect(() => {
    console.log('handle new message')
    const newMessageNb = messages.get(route.params._id).length - giftedMessages.length;
    if(newMessageNb > 0) {
      appendMessages(messages.get(route.params._id).slice(-newMessageNb))
    } else if(newMessageNb < 0) {
      setMessages(messages.get(route.params._id))
    }
  }, [messages])

  function sendMessage(newMessages: IGiftedMessage[]) {
    for(const message of newMessages) {
      socket.emit('newMessage', toIMessage(message, route.params._id))
    }
  }

  function setMessages(messages: IMessage[]) {
    setGiftedMessages(messages.map(x => toGiftedMessage(x, x.userId == user?.uid ? user : route.params.user)).reverse())
  }

  function appendMessages(messages: IMessage[]) {
    setGiftedMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages.map(message => toGiftedMessage(message, message.userId == user?.uid ? user : route.params.user)).reverse())
    )
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <Text style={styles.title} numberOfLines={1}>{route.params.user.name + " - " + route.params.service.title}</Text>
      <View style={styles.chatContainer}>
        <GiftedChat messages={giftedMessages}
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
    paddingVertical: 20,
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
