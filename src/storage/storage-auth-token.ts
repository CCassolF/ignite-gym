import AsyncStorage from '@react-native-async-storage/async-storage'

import { auth_token_storage } from './storage-config'

interface StorageAuthTokenProps {
  token: string
  refresh_token: string
}

export async function storageAuthTokenSave({
  token,
  refresh_token,
}: StorageAuthTokenProps) {
  await AsyncStorage.setItem(
    auth_token_storage,
    JSON.stringify({ token, refresh_token }),
  )
}

export async function storageAuthTokenGet() {
  const response = await AsyncStorage.getItem(auth_token_storage)

  console.log('Response', response)

  const { token, refresh_token }: StorageAuthTokenProps = response
    ? JSON.parse(response)
    : {}

  console.log('Token', token)

  return { token, refresh_token }
}

export async function storageAuthTokenRemove() {
  await AsyncStorage.removeItem(auth_token_storage)
}
