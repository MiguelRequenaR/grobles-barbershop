import { Text } from "@/components/ui/Text";
import { View } from "react-native";
import { useMemo } from "react";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardGreeting() {
  const { data: shop } = useCurrentShop();
  const user = useAuthStore((state) => state.user);

  const { formattedDate, greetingName } = useMemo(() => {
    const today = new Date();

    const formattedDate = today.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const fromShop = shop?.name;

    const fromMetaData = 
      (user?.user_metadata?.full_name as string | undefined) ??
      (user?.user_metadata?.name as string | undefined);
    
    const fromEmail = user?.email?.split("@")[0];
    const greetingName = fromShop || fromMetaData || fromEmail || "Barbero"

    return { formattedDate, greetingName };
  }, [shop?.name, user]);

  return (
    <View>
      <Text className="text-2xl mb-1 text-white">
        Hola, <Text bold className="text-primary">{greetingName}</Text>
      </Text>
      <Text className="text-base text-white">
        Resumen de hoy, {formattedDate}
      </Text>
    </View>
  );
}
