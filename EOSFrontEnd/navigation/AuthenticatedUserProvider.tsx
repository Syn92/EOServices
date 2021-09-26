import React, { useState, createContext} from 'react';

const defaultContext: { user: any, setUser: any } = { user: null, setUser: null }

export const AuthenticatedUserContext = createContext(defaultContext);

export function AuthenticatedUserProvider({ children }:{ children: any }) {
  const [user, setUser] = useState(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}