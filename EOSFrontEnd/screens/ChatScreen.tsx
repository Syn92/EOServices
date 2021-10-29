import * as React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '../components/Themed';
import { toGiftedMessage } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [messages, setMessages] = useState<IMessage[]>(route.params.messages.map(toGiftedMessage));

  const { user } =  React.useContext(AuthenticatedUserContext);

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <Text style={styles.title} numberOfLines={1}>{route.params.room.user.name + " - " + route.params.room.service.title}</Text>
      <View style={styles.chatContainer}>
        <GiftedChat messages={messages} user={{_id: user?.uid ? user?.uid : 'CURRENT_USER_ID', name: user?.name}}/>
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
  }
});
