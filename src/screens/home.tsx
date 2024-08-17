import { HStack, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'

import { Group } from '@/components/group'
import { HomeHeader } from '@/components/home-header'

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costa')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <Group
          name="Costas"
          isActive={groupSelected === 'costa'}
          onPress={() => setGroupSelected('costa')}
        />

        <Group
          name="Ombro"
          isActive={groupSelected === 'ombro'}
          onPress={() => setGroupSelected('ombro')}
        />
      </HStack>
    </VStack>
  )
}
