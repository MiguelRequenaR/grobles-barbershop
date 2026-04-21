import { Ionicons } from "@expo/vector-icons"
import { Image } from "expo-image"
import { Pressable, View } from "react-native"
import { Text } from "@/components/ui/Text"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const DEFAULT_AVATAR =   "https://api.dicebear.com/7.x/avataaars/png?seed=barber&backgroundColor=b6e3f4";

type AppHeaderProps = {
  brandTitle?: string;
  avatarUrl?: string;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
}

export default function AppHeader({
  brandTitle = "Grobles",
  avatarUrl = DEFAULT_AVATAR,
  onPressAvatar,
  onPressNotifications,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="bg-primary px-4 rounded-b-[35px]"
      style={{ paddingTop: Math.max(insets.top, 8) }}
    >
      <View className="pb-5">
        <View className="flex-row items-center">
          <View className="w-12 items-start">
            <Pressable
              onPress={onPressAvatar}
              className="h-11 w-11 overflow-hidden rounded-full border-2 border-white/90 active:opacity-80"
            >
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </Pressable>
          </View>
          <View className="flex-1 items-center px-2">
            <Text
              bold
              className="text-xl text-white uppercase font-bold"
              style={{
                fontFamily: "Comfortaa_700Bold",
                fontStyle: "italic",
              }}
            >
              {brandTitle}
            </Text>
          </View>
          <View className="w-12 items-end">
            <Pressable
              onPress={onPressNotifications}
              hitSlop={12}
              className="p-1 active:opacity-70"
            >
              <Ionicons name="notifications-outline" size={26} color="#d1d5db" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
