import Button from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { supabase } from "@/lib/supabase";
import { authSchema, AuthSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AuthTab = "login" | "register";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );
    const hide = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
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
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = handleSubmit(async (data: AuthSchema) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Error al Iniciar Sesión", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View className="flex-1 justify-center bg-[#f7f1e6]">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 4,
          paddingTop: 16,
        }}
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
          <Text className="text-[#1f1f1f] text-center uppercase text-lg">
            Grobles Barbershop
          </Text>
          <View className="bg-[#e5e2e1] rounded-full p-1 flex-row">
            <Pressable
              onPress={() => setTab("login")}
              className={`flex-1 py-3 rounded-full items-center justify-center ${
                tab === "login" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  tab === "login" ? "text-[#1f1f1f]" : "text-[#1f1f1f]/60"
                }`}
              >
                Ingresar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setTab("register");
                router.push("/(auth)/register");
              }}
              className={`flex-1 py-3 rounded-full items-center justify-center ${
                tab === "register" ? "bg-white shadow-sm" : ""
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  tab === "register" ? "text-[#1f1f1f]" : "text-[#1f1f1f]/60"
                }`}
              >
                Registrarse
              </Text>
            </Pressable>
          </View>
          <View
            pointerEvents={isLoading ? "none" : "auto"}
            className="gap-2 pt-4"
          >
            <Text
              bold
              className="text-[#1f1f1f] uppercase comfortaa-700bold text-center text-xl"
            >
              Bienvenido de Vuelta
            </Text>
            <Text className="text-[#1f1f1f] text-center text-sm">
              Ingresa con tus credenciales para continuar.
            </Text>
            <View className="mb-4 pt-4">
              <Text className="text-[#1f1f1f] mb-2 font-medium">
                Correo Electrónico
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                      errors.email ? "border-red-500" : "border-[#e5e2e1]"
                    }`}
                    placeholder="Correo Electrónico"
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
                <Text className="text-red-500 text-sm">
                  {errors.email.message}
                </Text>
              )}
            </View>
            <View className="mb-3">
              <Text className="text-[#1f1f1f] mb-2 font-medium">
                Contraseña
              </Text>
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
                    keyboardType="default"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              <View className="flex-row justify-end px-2 pt-1">
                <Pressable>
                  <Text className="text-[#1f1f1f] text-sm underline">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Pressable>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm">
                  {errors.password.message}
                </Text>
              )}
            </View>
            <Button
              title={isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
              onPress={onSignIn}
              disabled={isLoading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
              <Text className="text-[#1f1f1f] text-sm">O CONTINUA CON</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
            </View>
            <View className="flex-row justify-center items-center gap-5">
              <View className="bg-[#e5e2e1] rounded-xl py-2 px-6">
                <Image
                  source={{
                    uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagepng.org%2Fwp-content%2Fuploads%2F2019%2F08%2Fgoogle-icon-1.png&f=1&nofb=1&ipt=fd9c2b55d396ce8909d77410e3c2b29714db3ff54bea212c6e82338710dc730e",
                  }}
                  style={{ width: 30, height: 30 }}
                  contentFit="contain"
                />
              </View>
              <View className="bg-[#e5e2e1] rounded-xl py-2 px-6">
                <Image
                  source={{
                    uri: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffreepnglogo.com%2Fimages%2Fall_img%2Ffacebook-logo.png&f=1&nofb=1&ipt=fe03b76d9a650e45545d284a2da848a2bf539e51a833bcb410c57586fcf7a491",
                  }}
                  style={{ width: 30, height: 30 }}
                  contentFit="contain"
                />
              </View>
              <View className="bg-[#e5e2e1] rounded-xl py-2 px-6">
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1920px-Apple_logo_black.svg.png",
                  }}
                  style={{ width: 30, height: 30 }}
                  contentFit="contain"
                />
              </View>
            </View>
            <View className="mt-4">
              <Text className="text-[#1f1f1f] text-center text-sm">
                Desarrollado por{" "}
                <Text
                  bold
                  className="text-[#1f1f1f]"
                  style={{ textDecorationLine: "underline" }}
                  suppressHighlighting
                  onPress={() => {
                    Linking.openURL("https://www.groblestudio.com/");
                  }}
                  pressRetentionOffset={{
                    bottom: 0,
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                >
                  Grobles Studio.
                </Text>
              </Text>
            </View>
          </View>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}
