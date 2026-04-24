import { Text } from "@/components/ui/Text";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppHeaderProps = {
  brandTitle?: string;
  avatarUrl?: string;
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
};

export default function AppHeader({
  brandTitle = "Grobles",
  onPressAvatar,
  onPressNotifications,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
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
              {brandTitle}
            </Text>
          </View>
          <View className="flex-row items-center gap-x-1 bg-[#292a2a] rounded-full p-1">
            <View className="w-12 items-start">
              <Pressable
                onPress={onPressAvatar}
                hitSlop={12}
                className="p-1 active:opacity-70"
              >
                <Ionicons
                  name="person-circle-outline"
                  size={35}
                  color="#ff9900"
                />
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
                  color="#ff9900"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
