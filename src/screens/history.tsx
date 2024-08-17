import { Heading, Text, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'
import { SectionList } from 'react-native'

import { HistoryCard } from '@/components/history-card'
import { ScreenHeader } from '@/components/screen-header'

interface ExercisesProps {
  title: string
  data: string[]
}

export function History() {
  const [exercises, setExercises] = useState<ExercisesProps[]>([
    {
      title: '22.07.24',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      title: '23.07.24',
      data: ['Puxada frontal'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => {
          return (
            <Heading
              color="$gray200"
              fontSize="$md"
              mt="$10"
              mb="$3"
              fontFamily="$heading"
            >
              {section.title}
            </Heading>
          )
        }}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos Fazer exercícios hoje
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
