import { useFocusEffect } from '@react-navigation/core';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { io } from 'socket.io-client';
import ChatRoomCard from '../components/Chat/ChatRoomCard';
import ServerConstants from '../constants/Server';
import { getCardTitle, IMessage, IRoom } from '../interfaces/Chat';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { RootTabScreenProps } from '../types';


export default function ChatRoomsScreen({ navigation }: RootTabScreenProps<'ChatRooms'>) {
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const [search, setSearch] = useState('');

  function onChannelPress(room: IRoom) {
    navigation.navigate('Chat', room)
  }

  const { user } =  React.useContext(AuthenticatedUserContext);

  const socket = io(ServerConstants.prod + "chat");

  useFocusEffect(
    React.useCallback(() => {
      axios.get(ServerConstants.prod + 'chatRooms', { params: {userId: user?.uid } })
      .then(function (response) {
        const newRooms = response.data as IRoom[];
        if(newRooms && newRooms.length > 0) {
          setRooms(newRooms)
          setUpSockets(newRooms.map(x => x._id));
        }
      }).catch(function (error) {
        console.log(error);
      });

      return function cleanup() {
        socket.close();
      };
    }, [])
  );

  function setUpSockets(roomIds: string[]): void {
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });
    socket.connect();
    socket.emit('watchRooms', user?.uid, roomIds);
    socket.on('newRoom', (room: IRoom) => {
      setRooms(oldRooms => [...oldRooms, room])
      socket.emit('watchRooms', user?.uid, [room._id]);
    });
    socket.on('newMessage', (message: IMessage) => {
      setRooms(oldRooms => {
        let newRooms = [...oldRooms]
        const cardIndex = newRooms.findIndex(x => x._id == message.roomId);
        if(cardIndex >= 0) {
          newRooms[cardIndex].lastMessage = message
        }
        return newRooms
      });
    });
  }

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <View style={styles.searchContainer}>
        {/* @ts-ignore onChangeText wrong type https://github.com/react-native-elements/react-native-elements/issues/3089 */}
        <SearchBar value={search} containerStyle={styles.search} onChangeText={setSearch} round={true} lightTheme={true} />
      </View>
      <ScrollView style={styles.roomsContainer}>
        {rooms.filter(room => getCardTitle(room).toLowerCase().indexOf(search.toLowerCase()) > -1)
          .map((room, key) => { return <ChatRoomCard key={key} room={room} onPress={onChannelPress}/>})}
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
    marginHorizontal: 20,
    marginTop: 40,
    backgroundColor: 'transparent',
  },
  search: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
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
