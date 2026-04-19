import Button from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { registerSchema, RegisterSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInRight,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const indicatorX = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const goToLogin = () => {
    router.replace("/(auth)/login");
  };

  const handleTabPress = (tab: "login" | "register") => {
    if (tab === "register") {
      indicatorX.value = withTiming(tabWidth, {
        duration: 220,
        easing: Easing.out(Easing.quad),
      });
      return;
    }
    indicatorX.value = withTiming(
      0,
      { duration: 220, easing: Easing.out(Easing.quad) },
      (finished) => {
        if (finished) runOnJS(goToLogin)();
      },
    );
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      shopName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegister = handleSubmit(async () => {
    setIsLoading(true);
    try {
      Alert.alert(
        "Formulario listo",
        "Ya tienes la pantalla de registro con los campos requeridos.",
      );
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View className="flex-1 bg-[#f7f1e6]">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 4, paddingTop: 16 }}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: keyboardVisible ? "flex-start" : "center",
            paddingTop: keyboardVisible ? insets.top + 8 : 0,
          }}
        >
          <View className="bg-white m-4 rounded-3xl p-5 gap-4">
            <View className="items-center justify-center">
              <View className="bg-[#1f1f1f] rounded-full p-4 items-center justify-center">
                <Image
                  source={require("../../assets/icons/logoGB.png")}
                  style={{ width: 30, height: 30 }}
                  contentFit="contain"
                />
              </View>
            </View>
            <Text className="text-center uppercase text-lg">Grobles Barbershop</Text>

            <View
              onLayout={(e) => {
                const half = e.nativeEvent.layout.width / 2;
                setTabWidth(half);
                if (indicatorX.value === 0) {
                  indicatorX.value = half;
                }
              }}
              className="bg-[#e5e2e1] rounded-full p-1 flex-row relative overflow-hidden"
            >
              {tabWidth > 0 && (
                <Animated.View
                  style={[
                    indicatorStyle,
                    {
                      position: "absolute",
                      top: 4,
                      bottom: 4,
                      left: 4,
                      width: tabWidth - 8,
                    },
                  ]}
                  className="bg-white rounded-full shadow-sm"
                />
              )}
              <Pressable
                onPress={() => handleTabPress("login")}
                className="flex-1 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-base font-medium text-[#1f1f1f]/60">
                  Ingresar
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleTabPress("register")}
                className="flex-1 py-3 rounded-full items-center justify-center"
              >
                <Text className="text-base font-medium text-[#1f1f1f]">
                  Registrarse
                </Text>
              </Pressable>
            </View>

            <Animated.View
              entering={FadeInRight.duration(320).easing(
                Easing.out(Easing.cubic),
              )}
              pointerEvents={isLoading ? "none" : "auto"}
              className="gap-2 pt-4"
            >
              <Text bold className="uppercase comfortaa-700bold text-center text-xl">
                Crea Tu Cuenta
              </Text>
              <Text className="text-center text-sm">
                Completa los siguientes datos para registrar tu barberia.
              </Text>

              <View className="mb-2 pt-4">
                <Text className="mb-2 font-medium">Nombre de la barberia</Text>
                <Controller
                  control={control}
                  name="shopName"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                        errors.shopName ? "border-red-500" : "border-[#e5e2e1]"
                      }`}
                      placeholder="Nombre de la barberia"
                      placeholderTextColor="#6b7280"
                      autoCapitalize="words"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.shopName && (
                  <Text className="text-red-500 text-sm">{errors.shopName.message}</Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="mb-2 font-medium">Correo Electronico</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                        errors.email ? "border-red-500" : "border-[#e5e2e1]"
                      }`}
                      placeholder="Correo Electronico"
                      placeholderTextColor="#6b7280"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoCorrect={false}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm">{errors.email.message}</Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="mb-2 font-medium">Contraseña</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                        errors.password ? "border-red-500" : "border-[#e5e2e1]"
                      }`}
                      placeholder="Contraseña"
                      placeholderTextColor="#6b7280"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm">{errors.password.message}</Text>
                )}
              </View>

              <View className="mb-4">
                <Text className="mb-2 font-medium">Confirmar Contraseña</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                        errors.confirmPassword ? "border-red-500" : "border-[#e5e2e1]"
                      }`}
                      placeholder="Confirmar Contraseña"
                      placeholderTextColor="#6b7280"
                      autoCapitalize="none"
                      autoCorrect={false}
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              <Button
                title={isLoading ? "Creando Cuenta..." : "Crear Cuenta"}
                onPress={onRegister}
                disabled={isLoading}
              />
            </Animated.View>
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-sm">¿Ya tienes una cuenta?</Text>
              <Pressable onPress={goToLogin}>
                <Text bold className="text-sm underline">Iniciar sesión.</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}