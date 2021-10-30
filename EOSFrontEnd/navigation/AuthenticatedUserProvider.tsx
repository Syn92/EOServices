import React, { useState, createContext} from 'react';
import { User } from '../interfaces/User';

const defaultContext: { user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>> | null,
   isNewUser: boolean, setIsNewUser: React.Dispatch<React.SetStateAction<boolean>> | null } = { user: null, setUser: null,
   isNewUser: false, setIsNewUser: null}

export const AuthenticatedUserContext = createContext(defaultContext);

export function AuthenticatedUserProvider({ children }:{ children: any }) {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, isNewUser, setIsNewUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}