import { Service } from "./Service";
import { User } from "./User";
import { IMessage as IGiftedMessage } from 'react-native-gifted-chat';

export interface IRoom {
  _id: string;
  user: User;
  service: Service;
  lastMessage: IMessage | undefined;
}

export interface IMessage {
    _id: string;
    roomId: string;
    userId: string;
    text: string;
    createdAt: string;
}

export function getCardTitle(room: IRoom) : string {
    return room.user.name + ' - ' + room.service.title;
}

export function toGiftedMessage(message: IMessage, user: User): IGiftedMessage {
    return {
        _id: message._id,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {_id: user.uid, name: user.name}
    }
}

export function toIMessage(message: IGiftedMessage, roomId: string): IMessage {
    return {
        _id: message._id.toString(),
        text: message.text,
        createdAt: message.createdAt.toString(),
        userId: message.user._id.toString(),
        roomId: roomId
    }
}