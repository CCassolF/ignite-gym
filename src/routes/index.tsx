import { Box } from '@gluestack-ui/themed'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { gluestackUIConfig } from 'config/gluestack-ui.config'

import { Loading } from '@/components/loading'
import { useAuth } from '@/hooks/use-auth'

import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'

export function Routes() {
  const { user, isLoadingUserStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = gluestackUIConfig.tokens.colors.gray700

  if (isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="$gray700">
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
