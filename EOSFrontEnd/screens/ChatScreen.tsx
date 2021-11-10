import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions, Bubble, Composer, GiftedChat, Message, Send } from 'react-native-gifted-chat';
import { useImmer } from 'use-immer';
import { getContractMessage, IGiftedMessage, IMessage, toGiftedMessage, toISentMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { ChatContext, ChatSocketContext } from '../navigation/ChatSocketProvider';
import { RootStackScreenProps } from '../types';
import uuid from 'react-native-uuid';

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

  function renderInputToolbar(props) {
    return (
      <View style={styles.inputToolbar}>
        <Composer {...props} textInputStyle={styles.textInput}/>
        <Send {...props} containerStyle={styles.send}>
          <Icon name="send" color="#0084ff"/>
        </Send>
        {user.uid === route.params.service.owner && <Actions
          containerStyle={styles.sendContract}
          icon={() => <Icon name="description" color="grey"/>}
          onPressActionButton={askSendContract}/>}
    </View>
    )
  }

  function renderCustomView(props: Bubble<IGiftedMessage>['props']) {
    if(props.currentMessage.type === 'contract') {
      const isSender = user.uid == route.params.service.owner
      const messageStyle = isSender ? styles.rightContractText : styles.leftContractText
      const thumbnail = route.params.service.thumbnail || 'https://cdn1.iconfinder.com/data/icons/business-company-1/500/image-512.png'
      return (
        <View style={[(isSender ? props.containerStyle.right : props.containerStyle.left) , styles.contractMessage]}>
          <Text style={[messageStyle, styles.titleContract]}>Offer {isSender ? 'Sent' : 'Received'}</Text>
          <View style={styles.contractContainer}>
            <Text style={[styles.contractText]}>{route.params.service.title}</Text>
            <Image style={styles.contractImage} source={{uri: thumbnail, width: 50, height: 50}}/>
            <Text style={[styles.contractText]}>{route.params.service.priceEOS + " EOS"}</Text>
          </View>
          {isSender ? <Text style={[messageStyle]}>Awaiting answer...</Text>
            : <Button onPress={openOfferDetails} title="See Offer Details"></Button>
          }
        </View>
        )
    }

    return null
  }

  function openOfferDetails() {
    console.log('OPEN OFFER DETAILS');
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
    const contractMessage = getContractMessage(route.params, user)
    const contractGiftedMessage = {...contractMessage, _id: uuid.v4().toString()}
    setGiftedMessages(previousMessages => GiftedChat.append(previousMessages, [toGiftedMessage(contractGiftedMessage, user)]))
    socket.emit('newMessage', contractMessage)
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      {/* <Text style={styles.title} numberOfLines={1}>{route.params.user.name + " - " + route.params.service.title}</Text> */}
      <View style={styles.chatContainer}>
        <GiftedChat messages={giftedMessages}
        shouldUpdateMessage={(props, nextProps) => props.currentMessage !== nextProps.currentMessage}
        user={{_id: user.uid, name: user.name}} onSend={sendMessage}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}/>
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
  },
  contractMessage: {
    flexDirection: 'column',
    padding: 10,
  },
  titleContract: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  contractText: {
    color: 'black',
    fontSize: 14,
  },
  rightContractText: {
    color: 'white',
    textAlign: 'center'
  },
  leftContractText: {
    color: 'black',
    textAlign: 'center'
  },
  contractContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    // width: 150,
    marginVertical: 5,
  },
  contractImage: {
    width: 150,
    height: 70,
    marginVertical: 5,
  },
});
