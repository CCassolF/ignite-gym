import { Heading, HStack, Text, useToast, VStack } from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'

import { ExerciseCard } from '@/components/exercise-card'
import { Group } from '@/components/group'
import { HomeHeader } from '@/components/home-header'
import { ToastMessage } from '@/components/toast-message'
import { ExerciseDTO } from '@/dtos/exercise-dto'
import { AppNavigatorRoutesProps } from '@/routes/app.routes'
import { api } from '@/services/api'
import { AppError } from '@/utils/app-error'

export function Home() {
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState('Costas')

  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  const toast = useToast()

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await api.get('/groups')

        setGroups(response.data)
      } catch (error) {
        const isAppError = error instanceof AppError
        const title = isAppError
          ? error.message
          : 'Não foi possível carregar os grupos musculares.'

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="error"
              title={title}
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    }

    fetchGroups()
  }, [toast])

  useFocusEffect(
    useCallback(() => {
      async function fetchExercisesByGroup() {
        try {
          const response = await api.get(`/exercises/bygroup/${groupSelected}`)

          setExercises(response.data)
        } catch (error) {
          const isAppError = error instanceof AppError
          const title = isAppError
            ? error.message
            : 'Não foi possível carregar os exercícios.'

          toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title={title}
                onClose={() => toast.close(id)}
              />
            ),
          })
        }
      }

      fetchExercisesByGroup()
    }, [groupSelected, toast]),
  )

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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <ExerciseCard data={item} onPress={() => navigate('exercise')} />
            )
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
