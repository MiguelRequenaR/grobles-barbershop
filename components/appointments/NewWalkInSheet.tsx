import { forwardRef, useEffect, useMemo, useState } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Text } from "@/components/ui/Text";
import Button from "@/components/ui/Button";
import type { ShopCustomerOption } from "@/services/customersService";
import type { ShopServiceOption } from "@/services/servicesCatalogService";

type NewWalkInPayload = {
  customerName: string;
  phone: string;
  serviceId: string;
};

interface NewWalkInSheetProps {
  services: ShopServiceOption[];
  servicesLoading?: boolean;
  customers: ShopCustomerOption[];
  customersLoading?: boolean;
  onSubmit?: (payload: NewWalkInPayload) => Promise<void> | void;
  onClose?: () => void;
  isSubmitting?: boolean;
}

const NewWalkInSheet = forwardRef<BottomSheetModal, NewWalkInSheetProps>(
  (
    {
      services,
      servicesLoading = false,
      customers,
      customersLoading = false,
      onSubmit,
      onClose,
      isSubmitting = false,
    },
    ref,
  ) => {
    const snapPoints = useMemo(() => ["85%"], []);
    const [search, setSearch] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedCustomer, setSelectedCustomer] =
      useState<ShopCustomerOption | null>(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
      null,
    );

    useEffect(() => {
      if (services.length === 0) {
        setSelectedServiceId(null);
        return;
      }
      setSelectedServiceId((current) => {
        if (current && services.some((s) => s.id === current)) {
          return current;
        }
        return services[0].id;
      });
    }, [services]);

    const normalize = (value: string) => value.toLowerCase().trim();
    const normalizePhone = (value: string) => value.replace(/\s+/g, "");

    const filteredCustomers = useMemo(() => {
      const query = normalize(search);
      if (!query) {
        return customers.slice(0, 12);
      }

      const queryPhone = normalizePhone(query);
      return customers
        .filter((customer) => {
          const customerNameValue = normalize(customer.full_name);
          const customerPhoneValue = normalizePhone(customer.phone ?? "");
          return (
            customerNameValue.includes(query) ||
            (queryPhone.length > 0 && customerPhoneValue.includes(queryPhone))
          );
        })
        .slice(0, 20);
    }, [customers, search]);

    const handleSearchChange = (value: string) => {
      setSearch(value);
      if (
        selectedCustomer &&
        normalize(value) !== normalize(selectedCustomer.full_name)
      ) {
        setSelectedCustomer(null);
      }
    };

    const handleSelectCustomer = (customer: ShopCustomerOption) => {
      setSelectedCustomer(customer);
      setCustomerName(customer.full_name);
      setPhone(customer.phone ?? "");
      setSearch(customer.full_name);
      setIsSearchFocused(false);
    };

    const resetForm = () => {
      setSearch("");
      setCustomerName("");
      setPhone("");
      setSelectedCustomer(null);
      setIsSearchFocused(false);
      setSelectedServiceId(services[0]?.id ?? null);
    };

    const handleSubmit = async () => {
      if (!selectedServiceId) {
        return;
      }

      const finalName = selectedCustomer
        ? selectedCustomer.full_name.trim()
        : customerName.trim();
      const finalPhone = selectedCustomer
        ? (selectedCustomer.phone ?? "").trim()
        : phone.trim();

      await onSubmit?.({
        customerName: finalName,
        phone: finalPhone,
        serviceId: selectedServiceId,
      });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={() => {
          resetForm();
          onClose?.();
        }}
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
              onChangeText={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 120);
              }}
              placeholder="Nombre o teléfono..."
              placeholderTextColor="#6b7280"
              className="flex-1 text-white"
              style={{ fontFamily: "Comfortaa_400Regular" }}
            />
          </View>

          {isSearchFocused && (
            <View className="mt-[-16] mb-6 bg-black/40 rounded-xl overflow-hidden max-h-56">
              {customersLoading ? (
                <Text className="text-tertiary text-xs px-3 py-3">
                  Buscando clientes...
                </Text>
              ) : filteredCustomers.length === 0 ? (
                <Text className="text-tertiary text-xs px-3 py-3">
                  Sin resultados
                </Text>
              ) : (
                filteredCustomers.map((customer) => (
                  <Pressable
                    key={customer.id}
                    onPress={() => handleSelectCustomer(customer)}
                    className="px-3 py-3 border-b border-white/10"
                  >
                    <Text className="text-white">{customer.full_name}</Text>
                    <Text className="text-tertiary text-xs">
                      {customer.phone || "Sin teléfono"}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {!selectedCustomer && (
            <>
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
            </>
          )}

          {selectedCustomer && (
            <View className="mb-6 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3">
              <Text className="text-primary">Cliente seleccionado</Text>
              <Text className="text-white mt-1">{selectedCustomer.full_name}</Text>
              <Text className="text-tertiary text-xs mt-1">
                {selectedCustomer.phone || "Sin teléfono"}
              </Text>
            </View>
          )}

          <Text
            bold
            className="text-tertiary text-sm mb-3 uppercase"
          >
            Servicio
          </Text>
          {servicesLoading ? (
            <Text className="text-tertiary mb-8">Cargando servicios...</Text>
          ) : services.length === 0 ? (
            <Text className="text-tertiary mb-8">
              No hay servicios en esta barbería. Crea al menos uno para registrar
              walk-ins.
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2 mb-8">
              {services.map((service) => {
                const isActive = selectedServiceId === service.id;
                return (
                  <Pressable
                    key={service.id}
                    onPress={() => setSelectedServiceId(service.id)}
                    className={`px-4 py-2 rounded-full border ${
                      isActive
                        ? "bg-primary/20 border-primary"
                        : "bg-black/50 border-transparent"
                    }`}
                  >
                    <Text className={isActive ? "text-primary" : "text-white"}>
                      {service.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Button
            title={isSubmitting ? "GUARDANDO..." : "AÑADIR A LA COLA"}
            onPress={handleSubmit}
            disabled={
              isSubmitting ||
              servicesLoading ||
              services.length === 0 ||
              !selectedServiceId ||
              (!selectedCustomer && !customerName.trim())
            }
            className="bg-[#292a2a] border border-primary rounded-full py-4"
            textClassName="text-white"
            leftIcon={
              isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color="white"
                />
              ) : (
                <Ionicons
                  name="add-circle"
                  size={18}
                  color="white"
                />
              )
            }
          />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

NewWalkInSheet.displayName = "NewWalkInSheet";

export default NewWalkInSheet;
