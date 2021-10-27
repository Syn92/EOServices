import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function ChatScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  function ChannelView() {
      return (
        <View>
            <Text>Search</Text>
        </View>
      )
  }

  function ChatView() {
      return (
        <View>
            <GiftedChat/>
        </View>
      )
  }

  return (
    <View style={styles.container}>
        { currentChat ? ChatView() : ChannelView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
