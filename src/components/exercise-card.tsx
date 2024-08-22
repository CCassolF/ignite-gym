import {
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { ExerciseDTO } from '@/dtos/exercise-dto'
import { api } from '@/services/api'

export interface ExerciseCardProps extends TouchableOpacityProps {
  data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        p="$2"
        pr="$4"
        rounded="$sm"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Imagem do exercício"
          w="$16"
          h="$16"
          rounded="$md"
          mr="$4"
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data.name}
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={ChevronRight} color="$gray300" ml="$4" />
      </HStack>
    </TouchableOpacity>
  )
}
