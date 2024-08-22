import { createContext, ReactNode, useEffect, useState } from 'react'

import { UserDTO } from '@/dtos/user-dto'
import { api } from '@/services/api'
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@/storage/sorage-auth-token'
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@/storage/storage-user'

export interface AuthContextDataProps {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
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

  function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave(token)
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsLoadingUserStorageData(true)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })

      if (data.user && data.token) {
        setIsLoadingUserStorageData(true)

        await storageUserAndTokenSave(data.user, data.token)

        userAndTokenUpdate(data.user, data.token)
      }
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)

      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (error) {
      console.log(error)
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    async function loadUserData() {
      try {
        setIsLoadingUserStorageData(true)
        const userLogged = await storageUserGet()
        const token = await storageAuthTokenGet()

        if (token && userLogged) {
          userAndTokenUpdate(userLogged, token)
        }
      } catch (error) {
        console.log(error)
        throw error
      } finally {
        setIsLoadingUserStorageData(false)
      }
    }

    loadUserData()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
