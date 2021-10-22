import React, { useState, createContext} from 'react';
import { User } from '../interfaces/User';

const defaultContext: { user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>> | null } = { user: null, setUser: null }

export const AuthenticatedUserContext = createContext(defaultContext);

export function AuthenticatedUserProvider({ children }:{ children: any }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}