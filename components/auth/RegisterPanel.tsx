import Button from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { RegisterSchema } from "@/schemas/authSchema";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { TextInput, View } from "react-native";

interface RegisterPanelProps {
  control: Control<RegisterSchema>;
  errors: FieldErrors<RegisterSchema>;
  isLoading: boolean;
  isActive: boolean;
  width?: number;
  onSubmit: () => void;
}

export default function RegisterPanel({
  control,
  errors,
  isLoading,
  isActive,
  width,
  onSubmit,
}: RegisterPanelProps) {
  return (
    <View
      pointerEvents={isLoading || !isActive ? "none" : "auto"}
      style={{ width: width || undefined }}
      className="gap-2 pt-4"
    >
      <Text bold className="uppercase comfortaa-700bold text-center text-xl">
        Crea Tu Cuenta
      </Text>
      <Text className="text-center text-sm">
        Completa los siguientes datos para registrar tu barbería.
      </Text>

      <View className="mb-2 pt-4">
        <Text className="mb-2 font-medium">Nombre de la barbería</Text>
        <Controller
          control={control}
          name="shopName"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                errors.shopName ? "border-red-500" : "border-[#e5e2e1]"
              }`}
              style={{ fontFamily: "Comfortaa_400Regular" }}
              placeholder="Nombre de la barbería"
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
        {errors.email && <Text className="text-red-500 text-sm">{errors.email.message}</Text>}
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
        {errors.password && <Text className="text-red-500 text-sm">{errors.password.message}</Text>}
      </View>

      <View className="mb-4">
        <Text className="mb-2 font-medium">Confirmar contraseña</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              className={`bg-[#e5e2e1] text-[#1f1f1f] px-4 py-3 rounded-xl ${
                errors.confirmPassword ? "border-red-500" : "border-[#e5e2e1]"
              }`}
              style={{ fontFamily: "Comfortaa_400Regular" }}
              placeholder="Confirmar contraseña"
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
          <Text className="text-red-500 text-sm">{errors.confirmPassword.message}</Text>
        )}
      </View>

      <Button
        title={isLoading ? "Creando cuenta..." : "Crear cuenta"}
        onPress={onSubmit}
        disabled={isLoading}
      />
    </View>
  );
}
