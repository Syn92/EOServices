import * as React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { ChatRoomCard } from '../components/Chat/ChatRoomCard';
import { Text, View } from '../components/Themed';
import { User } from '../interfaces/User';
import { RootTabScreenProps } from '../types';

export default function ChatRoomsScreen({ navigation }: RootTabScreenProps<'ChatRooms'>) {

    function onChannelPress(roomId: string) {
    navigation.navigate('Chat', { roomId })
  }

  const user: User = {uid: '1', email: '', name: 'a', joinedDate: ''}

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <View style={styles.searchContainer}>
        <Icon style={styles.searchIcon} name="search" size={30} color="white"/>
      </View>
      <ScrollView style={styles.roomsContainer}>
          {Array(10).fill(
          <ChatRoomCard user={user} product={'Plomberie'} lastTime='16h40' onPress={onChannelPress} roomId={'1'}
          lastMessage='I have a problem with my toilet, can you fix it'/>)}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%'
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  searchContainer: {
    marginLeft: 30,
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    padding: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
    color: 'white',
    fontSize: 40,
  },
  roomsContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: 20,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      alignContent: 'center',
      elevation: 5,
      backgroundColor: 'white',
  }
});
