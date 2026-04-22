import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function DashboardSummaryCards() {
  return (
    <View className="flex-col gap-4">
      <View className="flex-1 bg-primary rounded-3xl p-4">
        <Text bold className="text-2xl font-bold text-secondary">S/. 450.00</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text className="text-sm text-secondary">Total de ventas</Text>
        </View>
      </View>
      <View className="flex-1 bg-primary rounded-3xl p-4">
        <Text bold className="text-2xl font-bold text-secondary">12</Text>
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text className="text-sm text-secondary">Turnos (Hoy)</Text>
        </View>
      </View>
    </View>
  );
}