import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed'
import { StatusBar } from 'react-native'

import { Loading } from '@/components/loading'

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
      {!fontsLoader ? (
        <Center flex={1} bg="$gray700">
          <Text>Home</Text>
        </Center>
      ) : (
        <Loading />
      )}
    </GluestackUIProvider>
  )
}
