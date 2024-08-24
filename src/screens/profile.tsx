import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity } from 'react-native'
import * as yup from 'yup'

import DefaultUserPhotoImage from '@/assets/userPhotoDefault.png'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { ScreenHeader } from '@/components/screen-header'
import { ToastMessage } from '@/components/toast-message'
import { UserPhoto } from '@/components/user-photo'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/services/api'
import { AppError } from '@/utils/app-error'

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
  const [isUpdating, setIsUpdating] = useState(false)

  const toast = useToast()

  const { user, updateUserProfile } = useAuth()

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
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado com sucesso!."
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'

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
    } finally {
      setIsUpdating(false)
    }
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

        const fileExtension = photoURI.split('.').pop()
        const fileName = `${user.name}.${fileExtension}`
          .toLocaleLowerCase()
          .replaceAll(' ', '-')

        const photoType = photoSelected.assets[0].type

        const photoFile = {
          name: fileName,
          uri: photoURI,
          type: `${photoType}/${fileExtension}`,
        }

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdateResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              accept: 'application/json',
              'content-type': 'multipart/form-data',
            },
          },
        )

        const userUpdated = user
        userUpdated.avatar = avatarUpdateResponse.data.avatar

        updateUserProfile(userUpdated)

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Foto atualizada!."
              onClose={() => toast.close(id)}
            />
          ),
        })
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
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : DefaultUserPhotoImage
            }
            size="xl"
            alt="Imagem do usuário"
          />

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
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
