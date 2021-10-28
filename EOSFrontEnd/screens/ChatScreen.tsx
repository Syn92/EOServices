import * as React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {
  const [messages, setMessages] = useState<IMessage[]>([{
    _id: 1,
    text: 'Hey! this is a test',
    createdAt: Date.now(),
    user: {_id: 2, name: 'Elon Musk'},
  }]);

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <Text style={styles.title} numberOfLines={1}>{route.params.userName + " - " + route.params.product}</Text>
      <View style={styles.chatContainer}>
        <GiftedChat messages={messages}/>
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
