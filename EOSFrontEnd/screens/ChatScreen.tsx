import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text } from 'react-native';
import { GiftedChat, IMessage as IGiftedMessage } from 'react-native-gifted-chat';
import { View } from '../components/Themed';
import ServerConstants from '../constants/Server';
import { IMessage, toGiftedMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [messages, setMessages] = useState<IGiftedMessage[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { user } =  React.useContext(AuthenticatedUserContext);

  axios.get(ServerConstants.local + 'chatMessages', { params: {roomId: route.params._id } })
  .then(function (response) {
    const receivedMessages = response.data as IMessage[];
    setMessages(receivedMessages.map(x => toGiftedMessage(x, x.userId == user?.uid ? user : route.params.user)));
    setIsLoading(false);
  }).catch(function (error) {
    console.log(error);
  });

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <Text style={styles.title} numberOfLines={1}>{route.params.user.name + " - " + route.params.service.title}</Text>
      <View style={styles.chatContainer}>
        <GiftedChat messages={messages} user={{_id: user!.uid, name: user!.name}}/>
      </View>
      {isLoading && (<View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='white'/>
      </View>)}
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
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    backgroundColor: '#000000AA'
  },
});
