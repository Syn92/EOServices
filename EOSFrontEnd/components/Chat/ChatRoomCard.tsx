import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { User } from '../../interfaces/User'
import { RootTabScreenProps } from '../../types';

interface IProp {
    roomId: string;
    user: User;
    product: string;
    lastMessage: string;
    lastTime: string;
    onPress: (roomId: string) => any;
}

export function ChatRoomCard(props: IProp) {
    return (
        <TouchableOpacity style={styles.mainContainer} onPress={() => props.onPress(props.roomId)}>
            <View>
                <Image style={styles.image} source={require('../../assets/images/avatar.webp')}/>
            </View>
            <View style={styles.descriptionContainer}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.text, styles.title]} numberOfLines={1}>{props.user.name + " - " + props.product }</Text>
                    <Text style={styles.text}>{props.lastTime}</Text>
                </View>
                <View style={styles.lastMessageContainer}>
                    <Text style={styles.text} numberOfLines={1}>{props.lastMessage}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
        marginBottom: 15,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
    },
    descriptionContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 2,
        paddingBottom: 2,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessageContainer: {

    }
})