import AppHeader from "@/components/navigation/AppHeader";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { Slot, usePathname, useRouter } from "expo-router";
import { View } from "react-native";

export default function AppGroupLayout() {
  const { data: shop } = useCurrentShop();
  const router = useRouter();
  const pathname = usePathname();
  const isProfile = pathname === "/profile";

  return (
    <View className="flex-1 bg-secondary">
      <View
        className="absolute left-0 right-0 top-0 z-50"
        pointerEvents="box-none"
      >
        <AppHeader
          brandTitle={shop?.name}
          avatarUrl={shop?.logo_url ?? undefined}
          avatarMode={isProfile ? "dashboard" : "avatar"}
          onPressAvatar={() => (isProfile ? router.replace("/dashboard") : router.push("/profile"))}
        />
      </View>
      <View className="flex-1 overflow-hidden">
        <Slot />
      </View>
    </View>
  );
}
