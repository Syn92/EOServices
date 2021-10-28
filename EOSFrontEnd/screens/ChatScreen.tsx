import * as React from 'react';
import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

export default function ChatScreen({ navigation, route }: RootStackScreenProps<'Chat'>) {

  return (
    <View style={styles.container}>
        <View>
            <GiftedChat/>
        </View>
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
