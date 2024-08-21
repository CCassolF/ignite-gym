import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import BackgroundImg from '@/assets/background.png'
import Logo from '@/assets/logo.svg'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { ToastMessage } from '@/components/toast-message'
import { useAuth } from '@/hooks/use-auth'
import { AuthNavigatorRoutesProps } from '@/routes/auth.routes'
import { AppError } from '@/utils/app-error'

const signInFormSchema = yup.object({
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.'),
})

type SignInFormData = yup.InferType<typeof signInFormSchema>

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { navigate } = useNavigation<AuthNavigatorRoutesProps>()

  async function handleSignIn({ email, password }: SignInFormData) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      setIsLoading(false)

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

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          w="$full"
          h={624}
          position="absolute"
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e o seu corpo.
            </Text>
          </Center>

          <Center gap="$4" flex={1}>
            <Heading color="$gray100">Acesse a conta</Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button
              title="Acessar"
              isLoading={isLoading}
              onPress={handleSubmit(handleSignIn)}
            />
          </Center>

          <Center justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não te acesso?
            </Text>

            <Button
              title="Criar conta"
              variant="outline"
              onPress={() => navigate('signUp')}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
