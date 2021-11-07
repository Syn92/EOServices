import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { getCardTitle, IMessage, IRoom } from '../../interfaces/Chat';
import { ChatContext } from '../../navigation/ChatSocketProvider';

interface IProp {
  room: IRoom;
  onPress: (room: IRoom) => any;
}

export default function ChatRoomCard(props: IProp) {
    const { messages } =  useContext(ChatContext);

    const [lastMessage, setLastMessage] = useState<IMessage | undefined>(undefined);

    useEffect(() => {
        if(messages.has(props.room._id) && messages.get(props.room._id).length > 0) {
            setLastMessage(messages.get(props.room._id)[messages.get(props.room._id).length - 1]);
        }
    }, [messages])

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={() => props.onPress(props.room)}>
        <View>
            <Image style={styles.image} source={require('../../assets/images/avatar.webp')}/>
        </View>
        <View style={styles.descriptionContainer}>
            <View style={styles.titleContainer}>
                <Text style={[styles.text, styles.title]} numberOfLines={1}>{getCardTitle(props.room)}</Text>
                <Text style={styles.text}>{lastMessage ? new Date(lastMessage.createdAt).toDateString() : ''}</Text>
            </View>
            <View style={styles.lastMessageContainer}>
                <Text style={styles.text} numberOfLines={1}>{lastMessage?.text || '(No Messages)'}</Text>
            </View>
        </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    mainContainer: {
        marginHorizontal: 20,
        marginVertical: 15,
        display: 'flex',
        flexDirection: 'row',
    },
    descriptionContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 2,
        paddingLeft: 10,
        flexShrink: 1,
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: '100%'
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        flexGrow: 0,
        flexShrink: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        flexGrow: 1,
        flexShrink: 1,
        marginRight: 10,
    },
    lastMessageContainer: {

    }
})