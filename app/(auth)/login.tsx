import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema, AuthSchema } from '@/schemas/authSchema';
import { supabase } from '@/lib/supabase';

export default function Login() {

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSignIn = handleSubmit(async (data: AuthSchema) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);

    if(error) {
      Alert.alert('Error al Iniciar Sesión', error.message);
    }
  })

  return (
    <View className="flex-1 justify-center px-6 bg-zinc-900">
      <View className="mb-10">
        <Text className="text-4xl font-bold text-white mb-2">Bienvenido de nuevo</Text>
        <Text className="text-zinc-400 text-lg">Gestiona tu barbería al máximo nivel</Text>
      </View>

      <View className="mb-4">
        <Text className="text-zinc-300 mb-2 font-medium">Correo electrónico</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-zinc-800 text-white px-4 py-3 rounded-xl border ${
                errors.email ? "border-red-500" : "border-zinc-700"
              }`}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#71717a"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-zinc-300 mb-2 font-medium">Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`bg-zinc-800 text-white px-4 py-3 rounded-xl border ${
                errors.password ? "border-red-500" : "border-zinc-700"
              }`}
              placeholder="••••••••"
              placeholderTextColor="#71717a"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
        )}
      </View>

      <TouchableOpacity
        className={`bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center ${
          isLoading ? "opacity-70" : "opacity-100"
        }`}
        onPress={onSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg text-center">
            Iniciar Sesión
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-zinc-400">¿No tienes una cuenta? </Text>
        <Link href="/register" asChild>
          <TouchableOpacity>
            <Text className="text-emerald-400 font-bold">Regístrate</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
