import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { Alert, ImageBackground, StyleSheet, View } from 'react-native';
import { colors, Icon } from 'react-native-elements';
import { Actions, Composer, GiftedChat, IMessage as IGiftedMessage, InputToolbarProps, Send } from 'react-native-gifted-chat';
import { useImmer } from 'use-immer';
import { IMessage, toGiftedMessage, toISentMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { ChatContext, ChatSocketContext } from '../navigation/ChatSocketProvider';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [giftedMessages, setGiftedMessages] = useImmer<IGiftedMessage[]>([]);

  const { user } =  React.useContext(AuthenticatedUserContext);
  const { messages, roomWatchedId, setRoomWatchedId }= React.useContext(ChatContext);
  const { socket } =  React.useContext(ChatSocketContext);

  const messagesSeenListener = (userId: string, roomId: string) => {
    if(roomId == route.params._id) {
      setGiftedMessages(old => {old.forEach(x => { if(!x.received && x.user._id != userId) x.received = true})});
    }
  }

  const newMessageListener = (message: IMessage) => {
    if(message.roomId != route.params._id) return;

    if (message.userId == user.uid) { // from me, update it
      setGiftedMessages(old => {
        const sentIndex = old.findIndex(x => !x.sent)
        if(sentIndex >= 0) {
          old[sentIndex].sent = true
          old[sentIndex]._id = message._id
        }
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

  function renderInputToolbar(props: InputToolbarProps) {
    return (
      <View style={styles.inputToolbar}>
        <Composer {...props} textInputStyle={styles.textInput}/>
        <Send {...props} containerStyle={styles.send}>
          <Icon name="send" color="#0084ff"/>
        </Send>
        <Actions
          containerStyle={styles.sendContract}
          icon={() => <Icon name="description" color="grey"/>}
          onPressActionButton={askSendContract}/>
    </View>
    )
  }

  function askSendContract() {
    const cleanTitle = route.params.service.title.length > 15 ? route.params.service.title.substring(0, 15) : route.params.service.title
    Alert.alert(
      'Sending Contract',
      'Are you sure you want to send the contract: "' + cleanTitle + '" for ' + route.params.service.priceEOS + " EOS ?",
      [
        { text: "Yes", onPress: sendContract },
        { text: "No" },
      ]
    );
  }

  function sendContract() {
    console.log('SEND CONTRACT')
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      {/* <Text style={styles.title} numberOfLines={1}>{route.params.user.name + " - " + route.params.service.title}</Text> */}
      <View style={styles.chatContainer}>
        <GiftedChat messages={giftedMessages}
        shouldUpdateMessage={(props, nextProps) => props.currentMessage !== nextProps.currentMessage}
        user={{_id: user.uid, name: user.name}} onSend={sendMessage}
        renderInputToolbar={renderInputToolbar}/>
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
  inputToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // height: 45,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textInput: {
    justifyContent:'center',
    backgroundColor: 'white',
    marginBottom: 3,
    marginTop: 3,
    lineHeight: 22,
  },
  send: {
    justifyContent: 'center',
    marginBottom: 0,
    maxHeight: '100%',
  },
  sendContract: {
    marginBottom: 0,
    justifyContent: 'center'
  }
});
