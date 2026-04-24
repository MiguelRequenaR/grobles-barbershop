import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabConfig = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const TAB_CONFIG: Record<string, TabConfig> = {
  dashboard: { label: "Home", icon: "grid-outline" },
  calendar: { label: "Calendario", icon: "calendar-outline" },
  clients: { label: "Clientes", icon: "people-outline" },
  rewards: { label: "Recompensas", icon: "gift-outline" },
};

const COLLAPSED_WIDTH = 48;
const ICON_SIZE = 20;
const H_PADDING = 14;
const ICON_LABEL_GAP = 6;
const ACTIVE_COLOR = "#ff9900";
const INACTIVE_COLOR = "#4b5563";
const LABEL_COLOR = "#ffffff";

export default function AnimatedBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: insets.bottom > 0 ? insets.bottom : 16,
        alignItems: "center",
      }}
    >
      <BlurView
        intensity={Platform.OS === "ios" ? 60 : 90}
        tint="light"
        style={{
          borderRadius: 999,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#ff9900",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 6,
            paddingVertical: 6,
            backgroundColor:
              Platform.OS === "ios"
                ? "#1f1f1f"
                : "#1f1f1f",
          }}
        >
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const config = TAB_CONFIG[route.name] ?? {
              label: route.name,
              icon: "ellipse-outline" as const,
            };
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            return (
              <AnimatedTabItem
                key={route.key}
                label={config.label}
                icon={config.icon}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

type AnimatedTabItemProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

function AnimatedTabItem({
  label,
  icon,
  isFocused,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
}: AnimatedTabItemProps) {
  const progress = useSharedValue(isFocused ? 1 : 0);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [isFocused, progress]);

  const expandedWidth = COLLAPSED_WIDTH + ICON_LABEL_GAP + labelWidth;

  const containerStyle = useAnimatedStyle(() => {
    const width =
      COLLAPSED_WIDTH + (expandedWidth - COLLAPSED_WIDTH) * progress.value;
    return {
      width,
    };
  });

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scale: 0.92 + 0.08 * progress.value,
      },
    ],
  }));

  const labelWrapperStyle = useAnimatedStyle(() => ({
    width: labelWidth,
    marginLeft: ICON_LABEL_GAP * progress.value,
    opacity: interpolate(progress.value, [0, 0.65, 1], [0, 0, 1]),
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-8, 0]),
      },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View
        style={[
          containerStyle,
          {
            height: 44,
            justifyContent: "center",
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            pillStyle,
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderRadius: 999,
              backgroundColor: ACTIVE_COLOR,
            },
          ]}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: H_PADDING,
            paddingRight: H_PADDING,
          }}
        >
          <Ionicons
            name={icon}
            size={ICON_SIZE}
            color={isFocused ? LABEL_COLOR : INACTIVE_COLOR}
          />
          <Animated.View
            style={[
              labelWrapperStyle,
              {
                overflow: "hidden",
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={{
                color: LABEL_COLOR,
                fontSize: 13,
                fontWeight: "600",
                fontFamily: "Comfortaa_400Regular",
              }}
            >
              {label}
            </Text>
          </Animated.View>
        </View>

        <Text
          numberOfLines={1}
          onLayout={(e) => {
            const width = Math.ceil(e.nativeEvent.layout.width);
            if (width !== labelWidth) setLabelWidth(width);
          }}
          style={{
            position: "absolute",
            opacity: 0,
            fontSize: 13,
            fontWeight: "600",
            fontFamily: "Comfortaa_400Regular",
          }}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
