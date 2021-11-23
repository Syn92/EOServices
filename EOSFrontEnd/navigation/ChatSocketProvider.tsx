import axios from 'axios';
import React, { useState, createContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useImmer } from 'use-immer';
import ServerConstants from '../constants/Server';
import { IMessage, IRoom } from '../interfaces/Chat';
import { ContractRequest, RequestStatus } from '../interfaces/Contracts';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

export interface SocketContextType {
  socket: Socket,
}

export interface ChatContextType {
  rooms: IRoom[],
  messages: Map<string, IMessage[]>,
  notifsCount: number,
  roomWatchedId: string | null,
  setRoomWatchedId: React.Dispatch<React.SetStateAction<string | null>>,
}

const socket = io(ServerConstants.prod + "chat");
export const ChatSocketContext = createContext<SocketContextType>({socket});

export const ChatContext = createContext<ChatContextType | undefined>({rooms: [], messages: new Map<string, IMessage[]>(),
  notifsCount: 0, roomWatchedId: null, setRoomWatchedId: () => {}});

export function ChatSocketProvider({ children }:{ children: any }) {
  const [rooms, setRooms] = useImmer<IRoom[]>([]);
  const [messages, setMessages] = useImmer<Map<string, IMessage[]>>( new Map<string, IMessage[]>());
  const [notifsCount, setNotifsCount] = useState<number>(0);
  const [roomWatchedId, setRoomWatchedId] = useState<string | null>(null);

  const { user } =  React.useContext(AuthenticatedUserContext);

  useEffect(() => {
    setRooms([]);
    setMessages(old => { old.clear() });
    setNotifsCount(0);
    setRoomWatchedId(null);

    if(!user) return;

    console.log("setting up sockets")
    axios.get(ServerConstants.prod + 'chatRooms', { params: {userId: user.uid } })
    .then(function (response) {
      const newRooms = response.data as IRoom[] || [];
      setUpMessages(newRooms)
      setUpSockets(newRooms.map(x => x._id));
    }).catch(function (error) {
      console.log('getchat rooms: ', error);
    });

    return function cleanup() {
      socket.off()
      socket.close();
    };
  }, [user])

  function setUpSockets(roomIds: string[]): void {
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });
    socket.connect();
    socket.emit('watchRooms', user.uid, roomIds);
    socket.on('newRoom', (room: IRoom) => {
      setRooms(oldRooms => {oldRooms.push(room)})
    });
    socket.on('messagesSeen', (userId: string, roomId: string) => {
      setMessages(old => {old.get(roomId)?.forEach(x => { if(!x.seen && x.userId != userId) x.seen = true })});
    })
    socket.on('newRequestStatus', newRequestStatusListener)
    socket.on('newContractRequest', newContractRequestListener)
  }

  function setUpMessages(newRooms: IRoom[]): void {
    setRooms(newRooms);
    newRooms.forEach(newRoom => {
      axios.get(ServerConstants.prod + 'chatMessages', { params: {roomId: newRoom._id } })
      .then(function (response) {
        const newMessages = response.data as IMessage[] || []
        setMessages(oldMessages => {oldMessages.set(newRoom._id, newMessages)});
        setNotifsCount(oldNotifs => oldNotifs + newMessages.filter(x => !x.seen && x.userId != user.uid).length)
      }).catch(function (error) {
        console.log('get chat messages: ', error);
      });
    })
  }

  const newMessageListener = (message: IMessage) => {
    if (message.userId != user.uid) { // not from me
      if(roomWatchedId == message.roomId) { // is in the room, seen and send socket
        message.seen = true;
        socket.emit('messagesSeen', user.uid, message.roomId)
      } else { // is not in the room, add to notifs
        setNotifsCount(notifs => notifs + 1)
      }
    }
    setMessages(oldMessages => {
      if(oldMessages.has(message.roomId))
        oldMessages.get(message.roomId).push(message);
      else
        oldMessages.set(message.roomId, [message])
    })
  };

  const newRequestStatusListener = (status: RequestStatus) => {
    setRooms(old => {
      if(status.accepted)
        old.find(x => x._id == status.roomId).contract.accepted = true;
      else
        old.find(x => x._id == status.roomId).contract = null;
    })
  }

  const newContractRequestListener = (request: ContractRequest) => {
    setRooms(old =>{ old.find(x => x._id == request.roomId).contract = request })
  }

  useEffect(() => {
    socket.on('newMessage', newMessageListener)

    if(roomWatchedId) {
      let count = 0;
      setMessages(old => { old.get(roomWatchedId)?.forEach(x => {
        if(!x.seen && x.userId != user.uid) {
          x.seen = true;
          count++;
        }
      })})
      setNotifsCount(old => old - count)
      socket.emit('messagesSeen', user.uid, roomWatchedId)
    }
    return () => {
      socket.off('newMessage', newMessageListener)
    }
  }, [user, roomWatchedId])

  return (
    <ChatSocketContext.Provider value={{socket}}>
      <ChatContext.Provider value={{rooms, messages, notifsCount, roomWatchedId, setRoomWatchedId}}>
        {children}
      </ChatContext.Provider>
    </ChatSocketContext.Provider>
  )
}