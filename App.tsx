import {
  Roboto_400Regular as RobotoRegular,
  Roboto_700Bold as RobotoBold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed'
import { StatusBar, View } from 'react-native'

import { config } from './config/gluestack-ui.config'

export default function App() {
  const [fontsLoader] = useFonts({ RobotoRegular, RobotoBold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {fontsLoader ? (
        <Center flex={1} bg="$info600">
          <Text>Home</Text>
        </Center>
      ) : (
        <View />
      )}
    </GluestackUIProvider>
  )
}
