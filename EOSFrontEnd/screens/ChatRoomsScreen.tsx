import { useFocusEffect } from '@react-navigation/core';
import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { ChatRoomCard, IRoomCard } from '../components/Chat/ChatRoomCard';
import { View } from '../components/Themed';
import ServerConstants from '../constants/Server';
import { IRoom } from '../interfaces/Room';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { RootTabScreenProps } from '../types';


export default function ChatRoomsScreen({ navigation }: RootTabScreenProps<'ChatRooms'>) {
  const [roomCards, setRoomCards] = useState<IRoomCard[]>([]);

  function onChannelPress(room: IRoom) {
    navigation.navigate('Chat', room)
  }

  const { user } =  React.useContext(AuthenticatedUserContext);

  useFocusEffect(
    React.useCallback(() => {
      axios.get(ServerConstants.local + 'chatRoom', { params: {userId: user?.uid } })
      .then(function (response) {
        // handle success
        const rooms = response.data as IRoom[];
        // console.log(rooms[0])
        const cards = Array<IRoomCard>(10).fill({room: rooms[0],
          lastMessage:  'Hi! I was wondering if you still have that PS5 available, hopefully before christmas. Thanks!',
          lastTime: '28/10/2021'
        })
        setRoomCards(cards)
      }).catch(function (error) {
        // handle error
        console.log(error);
      });
    }, [])
  )

  return (
    <ImageBackground style={styles.container} source={require('../assets/images/bg.png')}>
      <View style={styles.searchContainer}>
        <Icon style={styles.searchIcon} name="search" size={30} color="white"/>
      </View>
      <ScrollView style={styles.roomsContainer}>
          {roomCards.map((card, idx) =>
          <ChatRoomCard key={idx} roomCard={card} onPress={onChannelPress}/>)}
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
