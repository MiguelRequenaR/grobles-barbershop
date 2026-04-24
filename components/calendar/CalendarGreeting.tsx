import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, View, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/Text";

interface CalendarGreetingProps {
  title?: string;
  selectedDate?: Date;
  onSelectedDateChange?: (date: Date) => void;
}

const DAY_CARD_WIDTH = 84;
const DAY_CARD_SPACING = 8;
const TOTAL_SIDE_DAYS = 3650;
const DAY_ITEM_SIZE = DAY_CARD_WIDTH + DAY_CARD_SPACING;

const startOfDay = (date: Date) => {
  const localDate = new Date(date);
  localDate.setHours(0, 0, 0, 0);
  return localDate;
};

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export default function CalendarGreeting({
  title = "Turnos del día",
  selectedDate,
  onSelectedDateChange,
}: CalendarGreetingProps) {
  const listRef = useRef<FlatList<Date>>(null);
  const { width: screenWidth } = useWindowDimensions();
  const [initialDate] = useState(() => startOfDay(selectedDate ?? new Date()));
  const [currentSelectedDate, setCurrentSelectedDate] = useState(initialDate);
  const sidePadding = Math.max((screenWidth - DAY_CARD_WIDTH) / 2, 0);

  useEffect(() => {
    if (!selectedDate) return;
    setCurrentSelectedDate(startOfDay(selectedDate));
  }, [selectedDate]);

  const dates = useMemo(
    () =>
      Array.from({ length: TOTAL_SIDE_DAYS * 2 + 1 }, (_, index) =>
        addDays(initialDate, index - TOTAL_SIDE_DAYS),
      ),
    [initialDate],
  );

  const formattedSelectedDate = currentSelectedDate.toLocaleDateString(
    "es-ES",
    {
      weekday: "long",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text bold className="text-white text-2xl">
            {title}
          </Text>
          <Text className="text-tertiary text-base">{formattedSelectedDate}</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={dates}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={TOTAL_SIDE_DAYS}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        getItemLayout={(_, index) => ({
          length: DAY_ITEM_SIZE,
          offset: DAY_ITEM_SIZE * index,
          index,
        })}
        onLayout={() => {
          requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
              index: TOTAL_SIDE_DAYS,
              animated: false,
              viewPosition: 0.5,
            });
          });
        }}
        initialNumToRender={14}
        maxToRenderPerBatch={14}
        windowSize={7}
        keyExtractor={(item) => item.toISOString().slice(0, 10)}
        renderItem={({ item }) => {
          const normalizedDate = startOfDay(item);
          const isActive =
            normalizedDate.getTime() === currentSelectedDate.getTime();
          const weekday = normalizedDate
            .toLocaleDateString("es-ES", { weekday: "short" })
            .toUpperCase();
          const day = normalizedDate.toLocaleDateString("es-ES", {
            day: "2-digit",
          });
          const month = normalizedDate
            .toLocaleDateString("es-ES", { month: "short" })
            .toUpperCase();

          return (
            <Pressable
              onPress={() => {
                setCurrentSelectedDate(normalizedDate);
                onSelectedDateChange?.(normalizedDate);
              }}
              className={`mr-2 w-[84px] rounded-2xl border px-3 py-2 ${
                isActive ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"
              }`}
            >
              <Text
                className={`text-center text-[10px] ${
                  isActive ? "text-primary" : "text-tertiary"
                }`}
              >
                {weekday}
              </Text>
              <Text
                bold
                className={`text-center text-3xl ${
                  isActive ? "text-primary" : "text-white"
                }`}
              >
                {day}
              </Text>
              <Text className="text-center text-[10px] text-tertiary">{month}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
