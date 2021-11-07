import * as React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import ChatRoomCard from '../components/Chat/ChatRoomCard';
import { getCardTitle, IRoom } from '../interfaces/Chat';
import { ChatContext } from '../navigation/ChatSocketProvider';
import { RootTabScreenProps } from '../types';

export default function ChatRoomsScreen({ navigation }: RootTabScreenProps<'ChatRooms'>) {

  const [search, setSearch] = useState('');

  function onChannelPress(room: IRoom) {
    navigation.navigate('Chat', room)
  }

  const { rooms } =  React.useContext(ChatContext);

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
