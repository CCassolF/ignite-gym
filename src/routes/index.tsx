import { Box } from '@gluestack-ui/themed'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { gluestackUIConfig } from 'config/gluestack-ui.config'
import { useContext } from 'react'

import { AuthContext } from '@/contexts/auth-context'

import { AuthRoutes } from './auth.routes'

export function Routes() {
  const contextDate = useContext(AuthContext)
  console.log('Usuário logado => ', contextDate)

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}
