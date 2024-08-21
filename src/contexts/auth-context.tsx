import { createContext, ReactNode, useEffect, useState } from 'react'

import { UserDTO } from '@/dtos/user-dto'
import { api } from '@/services/api'
import { storageUserGet, storageUserSave } from '@/storage/storage-user'

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  isLoadingUserStorageData: boolean
}

interface AuthContextProviderProps {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user) {
        setUser(data.user)
        storageUserSave(data.user)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()

      if (userLogged) {
        setUser(userLogged)
        setIsLoadingUserStorageData(false)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  )
}
