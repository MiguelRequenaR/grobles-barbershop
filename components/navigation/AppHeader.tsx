import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  brandTitle?: string;
  avatarUrl?: string;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
};

export default function AppHeader({
  brandTitle,
  avatarUrl,
  onPressAvatar,
  onPressNotifications,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  const firstBrandName =
    (brandTitle ?? "Barbería").trim().split(/\s+/)[0] || "Barbería";
  return (
    <View
      className="px-4 bg-transparent"
      style={{ paddingTop: Math.max(insets.top, 8) }}
    >
      <View className="pb-5">
        <View className="flex-row items-center justify-between">
          <View className="items-center px-4 bg-[#292a2a] py-2 rounded-full ">
            <Text
              bold
              className="text-xl text-white font-bold"
              style={{
                fontFamily: "Comfortaa_700Bold",
                fontStyle: "italic",
              }}
            >
              {firstBrandName}
            </Text>
          </View>
          <View className="flex-row items-center gap-x-1 bg-[#292a2a] rounded-full p-1">
            <View className="w-12 items-start">
              <Pressable
                onPress={onPressAvatar}
                hitSlop={12}
                className="p-1 active:opacity-70"
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    className="w-[35px] h-[35px] rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={35}
                    color="#ffffff"
                  />
                )}
              </Pressable>
            </View>
            <View className="w-12 items-end">
              <Pressable
                onPress={onPressNotifications}
                hitSlop={12}
                className="p-1 active:opacity-70"
              >
                <Ionicons
                  name="notifications-outline"
                  size={26}
                  color="#ffffff"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
