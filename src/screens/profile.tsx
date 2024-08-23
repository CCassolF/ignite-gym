import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity } from 'react-native'
import * as yup from 'yup'

// import DefaultUserPhotoImage from '@/assets/userPhotoDefault.png'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { ScreenHeader } from '@/components/screen-header'
import { ToastMessage } from '@/components/toast-message'
import { UserPhoto } from '@/components/user-photo'
import { useAuth } from '@/hooks/use-auth'

const profileFormSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string(),
  old_password: yup.string(),
  password: yup
    .string()
    .min(6, 'A senha deve ter pelo menos 6 dígitos.')
    .nullable()
    .transform((value) => value || null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere.')
    .when('password', {
      is: (Field: unknown) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => value || null),
    }),
})

type ProfileFormData = yup.InferType<typeof profileFormSchema>

export function Profile() {
  const [usePhoto, setUserPhoto] = useState('https://github.com/arthurrios.png')

  const toast = useToast()

  const { user } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  })

  async function handleUpdateProfile(data: ProfileFormData) {
    console.log(data)
  }

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Essa imagem é muito grande. Escolha uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          })
        }

        setUserPhoto(photoURI)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto source={usePhoto} size="xl" alt="Imagem do usuário" />

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    placeholder="Nome"
                    bg="$gray600"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.name?.message}
                  />
                )
              }}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    bg="$gray600"
                    placeholder="E-mail"
                    isReadOnly
                    value={value}
                    onChangeText={onChange}
                  />
                )
              }}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => {
                return (
                  <Input
                    bg="$gray600"
                    placeholder="Senha antiga"
                    secureTextEntry
                    onChangeText={onChange}
                  />
                )
              }}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => {
                return (
                  <Input
                    bg="$gray600"
                    placeholder="Nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )
              }}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange } }) => {
                return (
                  <Input
                    bg="$gray600"
                    placeholder="Confirme a nova senha"
                    secureTextEntry
                    onChangeText={onChange}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(handleUpdateProfile)}
                    errorMessage={errors.confirm_password?.message}
                  />
                )
              }}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleUpdateProfile)}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
