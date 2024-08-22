import AsyncStorage from '@react-native-async-storage/async-storage'

import { UserDTO } from '@/dtos/user-dto'

import { user_storage } from './storage-config'

export async function storageUserSave(user: UserDTO) {
  await AsyncStorage.setItem(user_storage, JSON.stringify(user))
}

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(user_storage)

  const user: UserDTO = storage ? JSON.parse(storage) : {}

  return user
}

export async function storageUserRemove() {
  await AsyncStorage.removeItem(user_storage)
}
