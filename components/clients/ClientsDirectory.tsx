import { Text } from "@/components/ui/Text";
import type { ShopCustomerOption } from "@/services/customersService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

type ClientsDirectoryProps = {
  customers: ShopCustomerOption[];
  isLoading?: boolean;
};

type ClientFilter = "all" | "vip";

const formatPhone = (phone: string | null) => {
  if (!phone) return "Sin teléfono";
  return phone;
};

const getInitials = (fullName: string) => {
  const chunks = fullName.trim().split(/\s+/).filter(Boolean);
  if (!chunks.length) return "CL";
  return chunks
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
};

export default function ClientsDirectory({
  customers,
  isLoading = false,
}: ClientsDirectoryProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClientFilter>("all");

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesFilter = filter === "all" ? true : Boolean(customer.is_vip);
      if (!matchesFilter) return false;
      if (!query) return true;
      const name = customer.full_name.toLowerCase();
      const phone = (customer.phone ?? "").toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [customers, filter, search]);

  return (
    <View className="flex-1 p-4 pt-32">
      <Text bold className="text-white text-2xl">
        Directorio de clientes
      </Text>
      <Text className="mt-1 text-tertiary text-base">
        Gestiona y conecta con tu clientela.
      </Text>

      <View className="mt-5 flex-row items-center rounded-2xl border border-white/10 bg-[#222324] px-4 py-3">
        <Ionicons name="search-outline" size={18} color="#9ca3af" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nombre o teléfono..."
          placeholderTextColor="#6b7280"
          className="ml-3 flex-1 text-white"
          style={{ fontFamily: "Comfortaa_400Regular" }}
        />
      </View>

      <View className="mt-4 flex-row gap-2">
        <Pressable
          onPress={() => setFilter("all")}
          className={`rounded-full border px-4 py-2 ${
            filter === "all"
              ? "border-primary bg-primary/15"
              : "border-white/10 bg-transparent"
          }`}
        >
          <Text className={filter === "all" ? "text-primary" : "text-tertiary"}>
            Todos
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("vip")}
          className={`rounded-full border px-4 py-2 ${
            filter === "vip"
              ? "border-primary bg-primary/15"
              : "border-white/10 bg-transparent"
          }`}
        >
          <Text className={filter === "vip" ? "text-primary" : "text-tertiary"}>
            VIP
          </Text>
        </Pressable>
      </View>

      <View className="mt-5 gap-3 pb-24">
        {isLoading ? (
          <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6">
            <Text className="text-tertiary text-center">Cargando clientes...</Text>
          </View>
        ) : visibleCustomers.length === 0 ? (
          <View className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6">
            <Text className="text-tertiary text-center">
              No hay clientes para este filtro.
            </Text>
          </View>
        ) : (
          visibleCustomers.map((customer) => (
            <Pressable
              key={customer.id}
              onPress={() => router.push(`/clients/${customer.id}`)}
              className="flex-row items-center gap-3 rounded-2xl border border-white/10 bg-[#292a2a] px-4 py-3"
            >
              <View className="h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/25">
                <Text className="text-tertiary">{getInitials(customer.full_name)}</Text>
              </View>

              <View className="min-w-0 flex-1">
                <View className="flex-row items-center gap-2">
                  <Text bold className="text-white text-xl" numberOfLines={1}>
                    {customer.full_name}
                  </Text>
                  {customer.is_vip ? (
                    <View className="rounded-full bg-primary px-2 py-0.5">
                      <Text bold className="text-secondary text-[10px]">
                        VIP
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View className="mt-1 flex-row items-center gap-1">
                  <Ionicons name="call-outline" size={14} color="#9ca3af" />
                  <Text className="text-tertiary text-sm">
                    {formatPhone(customer.phone)}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}
