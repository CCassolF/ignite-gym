import AsyncStorage from '@react-native-async-storage/async-storage'

import { auth_token_storage } from './storage-config'

export async function storageAuthTokenSave(token: string) {
  await AsyncStorage.setItem(auth_token_storage, token)
}

export async function storageAuthTokenGet() {
  const token = await AsyncStorage.getItem(auth_token_storage)

  return token
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(auth_token_storage)
}
