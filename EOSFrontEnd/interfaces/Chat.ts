import { Service } from "./Service";
import { User } from "./User";
import { IMessage as IGiftedMessage } from 'react-native-gifted-chat';

export interface IRoom {
  _id: string;
  user: User;
  service: Service;
}

export interface IMessage {
    _id: string;
    roomId: string;
    user: User;
    text: string;
    createdAt: Date;
}

export function toGiftedMessage(message: IMessage): IGiftedMessage {
    return {
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: {_id: message.user.uid, name: message.user.name}
    }
}