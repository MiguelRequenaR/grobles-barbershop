import { Text } from "@/components/ui/Text";
import { View } from "react-native";

import { useMemo } from "react";

export default function DashboardGreeting() {
  const { formattedDate, greetingName } = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const formattedDate = today.toLocaleDateString("es-ES", options);
    const greetingName = "Miguel";
    return { formattedDate, greetingName };
  }, []);

  return (
    <View className="mb-6">
      <Text className="text-3xl mb-1 text-white">
        Hola, <Text bold className="text-primary uppercase">{greetingName}</Text>
      </Text>
      <Text className="text-lg text-white">
        Resumen de hoy, {formattedDate}
      </Text>
    </View>
  );
}
