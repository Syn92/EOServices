import axios from 'axios';
import React, { useState, createContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import ServerConstants from '../constants/Server';
import { IMessage, IRoom } from '../interfaces/Chat';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

export interface SocketContextType {
  socket: Socket,
}

export interface ChatContextType {
  rooms: IRoom[]
  messages: Map<string, IMessage[]>,
}

const socket = io(ServerConstants.local + "chat");
export const SocketContext = createContext<SocketContextType>({socket});

export const ChatContext = createContext<ChatContextType | undefined>({rooms: [], messages: new Map<string, IMessage[]>()});

export function SocketProvider({ children }:{ children: any }) {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [messages, setMessages] = useState<Map<string, IMessage[]>>();
  // const [notifsCount, setNotifsCount] = useState<number>(0);

  const { user } =  React.useContext(AuthenticatedUserContext);

  useEffect(() => {
    if(!user){
      console.log("NO USER SOCKETS")
      setRooms([]);
      setMessages(new Map<string, IMessage[]>());
      socket.close();
      return;
    }
    console.log("CONNECTING SOCKETS")

    axios.get(ServerConstants.local + 'chatRooms', { params: {userId: user.uid } })
      .then(function (response) {
        const newRooms = response.data as IRoom[];
        if(newRooms && newRooms.length > 0) {
          setUpMessages(newRooms)
          setUpSockets(newRooms.map(x => x._id));
        }
      }).catch(function (error) {
        console.log(error);
      });

      return function cleanup() {
        socket.close();
      };
  }, [user])

  function setUpSockets(roomIds: string[]): void {
    socket.on("connect_error", (err) => {
      console.log(err.message);
    });
    socket.connect();
    socket.emit('watchRooms', user?.uid, roomIds);
    socket.on('newRoom', (room: IRoom) => {
      setRooms(oldRooms => [...oldRooms, room])
      socket.emit('joinRoom', user?.uid, room._id);
    });
    socket.on('newMessage', (message: IMessage) => {
      console.log('receive new message')
      setMessages(oldMessages => {
        const roomMessages = [...oldMessages.get(message.roomId), message];
        const newMap = new Map(oldMessages);
        return newMap.set(message.roomId, roomMessages);
      })
    });
  }

  function setUpMessages(newRooms: IRoom[]): void {
    setRooms(newRooms);
    newRooms.forEach(newRoom => {
      axios.get(ServerConstants.local + 'chatMessages', { params: {roomId: newRoom._id } })
      .then(function (response) {
        setMessages(oldMessages => oldMessages.set(newRoom._id, response.data as IMessage[] || []));
      }).catch(function (error) {
        console.log(error);
      });
    })

  }

  return (
    <SocketContext.Provider value={{socket}}>
      <ChatContext.Provider value={{rooms, messages}}>
        {children}
      </ChatContext.Provider>
    </SocketContext.Provider>
  )
}