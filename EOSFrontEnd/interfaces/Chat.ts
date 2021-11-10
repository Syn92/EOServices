import { Service } from "./Service";
import { User } from "./User";
import { IMessage as ITempMessage } from 'react-native-gifted-chat';

export type IGiftedMessage = ITempMessage & {type: MessageType | null}

export type MessageType = "text" | "contract"

export interface IRoom {
  _id: string;
  user: User;
  service: Service;
}

export interface IMessage extends ISentMessage {
    _id: string;
}

export interface ISentMessage {
    roomId: string;
    userId: string;
    text: string;
    createdAt: string;
    seen: boolean;
    type: MessageType;
}

export function getCardTitle(room: IRoom) : string {
    return room.user.name + ' - ' + room.service.title;
}

export function toGiftedMessage(message: IMessage, user: User): IGiftedMessage {
    return {
        _id: message._id,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {_id: user.uid, name: user.name},
        sent: true,
        received: message.seen,
        type: message.type,
    }
}

export function toIMessage(message: IGiftedMessage, roomId: string): IMessage {
    return {...toISentMessage(message, roomId), _id: message._id.toString()}
}

export function toISentMessage(message: IGiftedMessage, roomId: string): ISentMessage {
    return {
        text: message.text,
        createdAt: message.createdAt.toString(),
        userId: message.user._id.toString(),
        roomId: roomId,
        seen: false,
        type: message.type ? message.type : 'text'
    }
}

export function getContractMessage(room: IRoom, user: User): ISentMessage {
    return {
        text: '',
        createdAt: new Date().toISOString(),
        userId: user.uid,
        roomId: room._id,
        seen: false,
        type: 'contract'
    }
}