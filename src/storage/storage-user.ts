import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserDTO } from '@/dtos/user-dto'

import { userStorage } from './storage-config'

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(userStorage, JSON.stringify(user))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(userStorage)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}
