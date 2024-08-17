import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'
import { FlatList } from 'react-native'

import { ExerciseCard } from '@/components/exercise-card'
import { Group } from '@/components/group'
import { HomeHeader } from '@/components/home-header'

export function Home() {
  const [exercises, setExercises] = useState([
    'Puxada frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento terra',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '9',
    '8',
  ])
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro'])
  const [groupSelected, setGroupSelected] = useState('Costas')

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          return (
            <Group
              name={item}
              isActive={
                groupSelected.toLocaleLowerCase() === item.toLocaleLowerCase()
              }
              onPress={() => setGroupSelected(item)}
            />
          )
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px="$8" flex={1}>
        <HStack alignItems="center" justifyContent="space-between" mb="$5">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>

        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={() => <ExerciseCard />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
