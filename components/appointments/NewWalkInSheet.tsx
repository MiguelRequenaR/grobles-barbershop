import { forwardRef, useMemo, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { Text } from "@/components/ui/Text";
import Button from "@/components/ui/Button";

type QuickService = "Corte Clasico" | "Fade" | "Barba" | "Combo";

type NewWalkInPayload = {
  customerName: string;
  phone: string;
  quickService: QuickService;
};

interface NewWalkInSheetProps {
  onSubmit?: (payload: NewWalkInPayload) => void;
  onClose?: () => void;
}

const QUICK_SERVICES: QuickService[] = [
  "Corte Clasico",
  "Fade",
  "Barba",
  "Combo",
];

const NewWalkInSheet = forwardRef<BottomSheetModal, NewWalkInSheetProps>(
  ({ onSubmit, onClose }, ref) => {
    const snapPoints = useMemo(() => ["95%"], []);
    const [search, setSearch] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [quickService, setQuickService] =
      useState<QuickService>("Corte Clasico");

    const handleSubmit = () => {
      onSubmit?.({
        customerName: customerName.trim(),
        phone: phone.trim(),
        quickService,
      });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onClose}
        handleIndicatorStyle={{ backgroundColor: "#4b5563", width: 40 }}
        backgroundStyle={{ backgroundColor: "#1f1f1f", borderRadius: 24 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between my-6">
            <Text
              bold
              className="text-white text-3xl"
            >
              Nuevo Walk-in
            </Text>
          </View>

          <Text
            bold
            className="text-tertiary text-sm mb-2 uppercase"
          >
            Buscar cliente
          </Text>
          <View className="bg-black/60 rounded-xl px-3 py-3 flex-row items-center gap-2 mb-6">
            <Ionicons
              name="search"
              size={18}
              color="#6b7280"
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Nombre o teléfono..."
              placeholderTextColor="#6b7280"
              className="flex-1 text-white"
              style={{ fontFamily: "Comfortaa_400Regular" }}
            />
          </View>

          <View className="flex-row items-center mb-6">
            <View className="h-px bg-white/10 flex-1" />
            <Text className="text-tertiary text-xs px-2">O CREAR NUEVO</Text>
            <View className="h-px bg-white/10 flex-1" />
          </View>

          <Text
            bold
            className="text-tertiary text-sm mb-2 uppercase"
          >
            Nombre
          </Text>
          <TextInput
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Nombre del cliente"
            placeholderTextColor="#6b7280"
            className="bg-black/60 rounded-xl px-4 py-3 text-white mb-4"
            style={{ fontFamily: "Comfortaa_400Regular" }}
          />

          <Text
            bold
            className="text-tertiary text-sm mb-2 uppercase"
          >
            Teléfono
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="999 999 999"
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
            className="bg-black/60 rounded-xl px-4 py-3 text-white mb-6"
            style={{ fontFamily: "Comfortaa_400Regular" }}
          />

          <Text
            bold
            className="text-tertiary text-sm mb-3 uppercase"
          >
            Servicio rápido
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {QUICK_SERVICES.map((service) => {
              const isActive = quickService === service;
              return (
                <Pressable
                  key={service}
                  onPress={() => setQuickService(service)}
                  className={`px-4 py-2 rounded-full border ${
                    isActive
                      ? "bg-primary/20 border-primary"
                      : "bg-black/50 border-transparent"
                  }`}
                >
                  <Text className={isActive ? "text-primary" : "text-white"}>
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            title="AÑADIR A LA COLA"
            onPress={handleSubmit}
            className="bg-[#292a2a] border border-primary rounded-full py-4"
            textClassName="text-white"
            leftIcon={
              <Ionicons
                name="add-circle"
                size={18}
                color="white"
              />
            }
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

NewWalkInSheet.displayName = "NewWalkInSheet";

export default NewWalkInSheet;
