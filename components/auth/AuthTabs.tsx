import { Text } from "@/components/ui/Text";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

type AuthTab = "login" | "register";

interface AuthTabsProps {
  tab: AuthTab;
  tabWidth: number;
  indicatorStyle: object;
  onLayout: (width: number) => void;
  onChangeTab: (tab: AuthTab) => void;
}

export default function AuthTabs({
  tab,
  tabWidth,
  indicatorStyle,
  onLayout,
  onChangeTab,
}: AuthTabsProps) {
  return (
    <View
      onLayout={(e) => onLayout(e.nativeEvent.layout.width / 2)}
      className="bg-[#e5e2e1] rounded-full p-1 flex-row relative overflow-hidden"
    >
      {tabWidth > 0 && (
        <Animated.View
          className="bg-white rounded-full shadow-sm"
          style={[
            indicatorStyle,
            {
              position: "absolute",
              top: 4,
              bottom: 4,
              left: 4,
              width: tabWidth - 8,
            },
          ]}
        />
      )}

      <Pressable
        onPress={() => onChangeTab("login")}
        className="flex-1 py-3 rounded-full items-center justify-center"
      >
        <Text
          className={`text-base font-medium ${
            tab === "login" ? "text-[#1f1f1f]" : "text-[#1f1f1f]/60"
          }`}
        >
          Ingresar
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChangeTab("register")}
        className="flex-1 py-3 rounded-full items-center justify-center"
      >
        <Text
          className={`text-base font-medium ${
            tab === "register" ? "text-[#1f1f1f]" : "text-[#1f1f1f]/60"
          }`}
        >
          Registrarse
        </Text>
      </Pressable>
    </View>
  );
}
