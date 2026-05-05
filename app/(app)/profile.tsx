import { Text } from "@/components/ui/Text";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useAuthStore } from "@/store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ScrollView, View } from "react-native";

const getInitials = (name?: string) => {
  if (!name) return "B";
  const chunks = name.trim().split(/\s+/).filter(Boolean);
  if (chunks.length === 0) return "B";
  return chunks
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
};

export default function ProfileScreen() {
  const { data: shop, isLoading } = useCurrentShop();
  const user = useAuthStore((state) => state.user);
  const initials = getInitials(shop?.name);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pt-32 pb-10 gap-4"
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text
            bold
            className="text-2xl text-white"
          >
            Perfil de barberia
          </Text>
          <Text className="text-tertiary text-sm">
            Datos principales de tu negocio y cuenta
          </Text>
        </View>
      </View>

      <View className="rounded-3xl border border-primary bg-[#292a2a] p-5">
        <View className="flex-row items-center gap-4">
          {shop?.logo_url ? (
            <Image
              source={{ uri: shop.logo_url }}
              className="h-20 w-20 rounded-full border border-white/20"
              contentFit="cover"
            />
          ) : (
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary">
              <Text
                bold
                className="text-2xl text-secondary"
              >
                {initials}
              </Text>
            </View>
          )}
          <View className="flex-1">
            <Text
              bold
              className="text-xl text-white"
            >
              {isLoading ? "Cargando..." : (shop?.name ?? "Sin barberia")}
            </Text>
            <Text className="mt-1 text-tertiary text-sm">
              {user?.email ?? "Sin correo disponible"}
            </Text>
          </View>
        </View>
      </View>

      <View className="rounded-3xl border border-white/10 bg-[#292a2a] p-4">
        <View className="mb-4 flex-row items-center gap-2">
          <Ionicons
            name="business-outline"
            size={20}
            color="#ff9900"
          />
          <Text
            bold
            className="text-base text-white"
          >
            Informacion del negocio
          </Text>
        </View>
        <View className="gap-3">
          <View>
            <Text className="text-xs text-tertiary">Nombre comercial</Text>
            <Text className="mt-1 text-base text-white">
              {isLoading ? "Cargando..." : (shop?.name ?? "No configurado")}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-tertiary">ID de barberia</Text>
            <Text className="mt-1 text-base text-white">
              {isLoading ? "Cargando..." : (shop?.id ?? "No disponible")}
            </Text>
          </View>
        </View>
      </View>

      <View className="rounded-3xl border border-white/10 bg-[#292a2a] p-4">
        <View className="mb-4 flex-row items-center gap-2">
          <Ionicons
            name="person-outline"
            size={20}
            color="#ff9900"
          />
          <Text
            bold
            className="text-base text-white"
          >
            Cuenta del propietario
          </Text>
        </View>
        <View className="gap-3">
          <View>
            <Text className="text-xs text-tertiary">Correo</Text>
            <Text className="mt-1 text-base text-white">
              {user?.email ?? "No disponible"}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-tertiary">Usuario</Text>
            <Text className="mt-1 text-base text-white">
              {user?.user_metadata?.full_name ??
                user?.user_metadata?.name ??
                shop?.name ??
                "Sin nombre"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
