import { Image } from "expo-image";
import Button from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { AuthSchema } from "@/schemas/authSchema";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { Linking, TextInput, View } from "react-native";

interface LoginPanelProps {
  control: Control<AuthSchema>;
  errors: FieldErrors<AuthSchema>;
  isLoading: boolean;
  isActive: boolean;
  width?: number;
  onSubmit: () => void;
}

export default function LoginPanel({
  control,
  errors,
  isLoading,
  isActive,
  width,
  onSubmit,
}: LoginPanelProps) {
  return (
    <View
      pointerEvents={isLoading || !isActive ? "none" : "auto"}
      style={{ width: width || undefined }}
      className="gap-2 pt-4"
    >
      <Text
        bold
        className="uppercase comfortaa-700bold text-center text-xl"
      >
        Bienvenido de Vuelta
      </Text>
      <Text className="text-center text-sm">
        Ingresa con tus credenciales para continuar.
      </Text>

      <View className="mb-4 pt-4">
        <Text className="mb-2 font-medium">Correo Electrónico</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                errors.email ? "border-red-500" : "border-[#e5e2e1]"
              }`}
              style={{ fontFamily: "Comfortaa_400Regular" }}
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
          <Text className="text-red-500 text-sm">{errors.email.message}</Text>
        )}
      </View>

      <View className="mb-3">
        <Text className="mb-2 font-medium">Contraseña</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                errors.password ? "border-red-500" : "border-[#e5e2e1]"
              }`}
              style={{ fontFamily: "Comfortaa_400Regular" }}
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
          <Text className="text-red-500 text-sm">
            {errors.password.message}
          </Text>
        )}
      </View>

      <Button
        title={isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        onPress={onSubmit}
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
        <Text className="text-sm">O CONTINUA CON</Text>
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
        <Text className="text-center text-sm">
          Desarrollado por{" "}
          <Text
            bold
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
  );
}
