import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Text } from "./Text";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  leftIcon?: ReactNode;
};

export default function Button({
  title,
  onPress,
  disabled = false,
  className = "",
  textClassName = "",
  leftIcon,
}: ButtonProps) {
  const resolvedTextClass = textClassName || "text-white";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`bg-[#1f1f1f] rounded-full p-3 items-center justify-center ${className}`}
    >
      <View className="flex-row items-center gap-2">
        {leftIcon}
        <Text className={`text-base font-medium ${resolvedTextClass}`}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
