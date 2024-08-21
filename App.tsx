import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar } from 'react-native'

import { Loading } from '@/components/loading'
import { AuthContextProvider } from '@/contexts/auth-context'
import { Routes } from '@/routes'

import { config } from './config/gluestack-ui.config'

export default function App() {
  const [fontsLoader] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContextProvider>
        {fontsLoader ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  )
}
