import { IService } from "./Service";
import { User } from "./User";
import { IMessage as ITempMessage } from 'react-native-gifted-chat';

export type IGiftedMessage = ITempMessage & {offerValue: number | null, contractId: string | null, lastOffer: boolean | null}

export interface ISentRoom {
    room: {
        sellerId: string;
        buyerId: string;
        serviceId: string;
    }
    userId: string;
    text: string;
}

export interface IRoom {
    _id: string;
    user: User;
    service: IService;
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
    offerValue: number | null;
    contractId: string | null;
    image: string | null;
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
        offerValue: message.offerValue,
        contractId: message.contractId,
        lastOffer: false,
        image: message.image
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
        offerValue: message.offerValue,
        contractId: message.contractId,
        image: message.image
    }
}

export function getContractMessage(room: IRoom, user: User, value: number, contractId: string): ISentMessage {
    return {
        text: '',
        createdAt: new Date().toISOString(),
        userId: user.uid,
        roomId: room._id,
        seen: false,
        offerValue: value,
        contractId: contractId,
        image: null
    }
}

export function getImageMessage(room: IRoom, user: User, image: string): ISentMessage {
    return {
        text: '',
        createdAt: new Date().toISOString(),
        userId: user.uid,
        roomId: room._id,
        seen: false,
        offerValue: null,
        contractId: null,
        image: image
    }
}