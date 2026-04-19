import { Pressable } from "react-native";
import { Text } from "./Text";

export default function Button({title, onPress, disabled} : any) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="bg-[#1f1f1f] rounded-full p-3 items-center justify-center"
    >
      <Text className="text-white text-base font-medium">{title}</Text>
    </Pressable>
  )
}
