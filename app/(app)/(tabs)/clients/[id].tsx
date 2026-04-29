import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/ui/Text";
import { useCustomerProfile } from "@/hooks/useCustomerProfile";
import { useAuthStore } from "@/store/useAuthStore";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string | null) => {
  if (!value) return "Sin registros";
  return new Date(value).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusLabel = (status: string | null) => {
  if (!status) return "Sin estado";
  if (status === "pending") return "Pendiente";
  if (status === "confirmed") return "Confirmado";
  if (status === "completed") return "Completado";
  if (status === "cancelled") return "Cancelado";
  return status;
};

const getInitials = (fullName: string) => {
  const chunks = fullName.trim().split(/\s+/).filter(Boolean);
  if (!chunks.length) return "CL";
  return chunks
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
};

export default function ClientDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const shopId = useAuthStore((state) => state.shopId);
  const customerId = typeof params.id === "string" ? params.id : null;
  const { data, isLoading } = useCustomerProfile(shopId, customerId);

  const memberSince = useMemo(() => formatDate(data?.created_at ?? null), [data?.created_at]);
  const lastVisit = useMemo(() => formatDate(data?.last_visit ?? null), [data?.last_visit]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-tertiary">Cargando cliente...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-tertiary">No se encontró el cliente.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" contentContainerClassName="px-4 pt-32 pb-28 gap-5">
      <Pressable
        onPress={() => router.replace("/clients")}
        className="h-10 w-10 items-center justify-center rounded-full bg-white/5"
      >
        <Ionicons name="chevron-back" size={24} color="#e5e2e1" />
      </Pressable>

      <View className="items-center">
        <View className="h-28 w-28 items-center justify-center rounded-full border border-primary/30 bg-[#292a2a]">
          <Text bold className="text-primary text-3xl">
            {getInitials(data.full_name)}
          </Text>
        </View>
        <Text bold className="mt-4 text-white text-4xl text-center">
          {data.full_name}
        </Text>
        <View className="mt-2 flex-row items-center gap-1">
          <Ionicons name="star" size={14} color="#ff9900" />
          <Text className="text-tertiary">
            {data.is_vip ? "Miembro VIP" : "Miembro"} desde {memberSince}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-white/10 bg-[#292a2a] p-4">
          <Text className="text-tertiary text-xs uppercase">Visitas</Text>
          <Text bold className="mt-2 text-white text-3xl">
            {data.total_appointments}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl border border-white/10 bg-[#292a2a] p-4">
          <Text className="text-tertiary text-xs uppercase">Total gastado</Text>
          <Text bold className="mt-2 text-primary text-3xl">
            {formatCurrency(data.lifetime_value)}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <View className="flex-1 rounded-2xl border border-white/10 bg-[#292a2a] p-4">
          <Text className="text-tertiary text-xs uppercase">Última visita</Text>
          <Text bold className="mt-2 text-white text-xl">{lastVisit}</Text>
        </View>
        <View className="flex-1 rounded-2xl border border-white/10 bg-[#292a2a] p-4">
          <Text className="text-tertiary text-xs uppercase">Inasistencias</Text>
          <Text bold className="mt-2 text-white text-3xl">{data.no_shows}</Text>
        </View>
      </View>

      <View className="rounded-2xl border border-white/10 bg-[#292a2a] p-4">
        <Text bold className="text-white text-2xl">
          Historial reciente
        </Text>
        <View className="mt-3 gap-3">
          {data.recent_history.length === 0 ? (
            <Text className="text-tertiary">Sin historial por ahora.</Text>
          ) : (
            data.recent_history.map((item) => (
              <View
                key={item.id}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-3"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text bold className="text-white flex-1" numberOfLines={1}>
                    {item.service_name}
                  </Text>
                  <Text bold className="text-primary">
                    {formatCurrency(item.service_price)}
                  </Text>
                </View>
                <View className="mt-1 flex-row items-center justify-between">
                  <Text className="text-tertiary text-xs">
                    {formatDate(item.appointment_date)}
                  </Text>
                  <Text className="text-tertiary text-xs">{statusLabel(item.status)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
