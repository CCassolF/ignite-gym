import { createContext, ReactNode } from 'react'

import { UserDTO } from '@/dtos/user-dto'

export interface AuthContextDataProps {
  user: UserDTO
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: '1',
          name: 'Carlos',
          email: 'rodrigo@email.com',
          avatar: 'rodrigo.png',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
