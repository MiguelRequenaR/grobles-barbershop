import { useCallback, useRef, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Alert, RefreshControl, ScrollView } from "react-native";
import DashboardGreeting from "@/components/dashboard/DashboardGreeting"
import DashboardSummaryCards from "@/components/dashboard/DashboardSummaryCards"
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments"
import { useDashboard } from "@/hooks/useDashboard";
import { useShopCustomers } from "@/hooks/useShopCustomers";
import { useShopServices } from "@/hooks/useShopServices";
import { NewWalkInSheet } from "@/components/appointments";
import { useAuthStore } from "@/store/useAuthStore";
import { createWalkInAppointment } from "@/services/walkInService";

export default function Dashboard() {
  const { data, isLoading, isRefetching, refetch } = useDashboard();
  const shopId = useAuthStore((state) => state.shopId);
  const { data: shopServices = [], isLoading: servicesLoading } =
    useShopServices(shopId);
  const { data: shopCustomers = [], isLoading: customersLoading } =
    useShopCustomers(shopId);
  const newWalkInSheetRef = useRef<BottomSheetModal>(null);
  const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleOpenWalkInSheet = useCallback(() => {
    newWalkInSheetRef.current?.present();
  }, []);

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pt-32 gap-6 pb-24"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor="#d97706"
          />
        }
      >
        <DashboardGreeting />
        <DashboardSummaryCards
          ingresos={data?.ingresos ?? 0}
          turnos={data?.turnos ?? 0}
          clientesActivos={shopCustomers.length}
          isLoading={isLoading}
          onNewWalkIn={handleOpenWalkInSheet}
        />
        <UpcomingAppointments
          appointments={data?.proximosTurnos ?? []}
          isLoading={isLoading}
        />
      </ScrollView>

      <NewWalkInSheet
        ref={newWalkInSheetRef}
        services={shopServices}
        servicesLoading={servicesLoading}
        customers={shopCustomers}
        customersLoading={customersLoading}
        isSubmitting={isSubmittingWalkIn}
        onSubmit={async (payload) => {
          if (!shopId) {
            Alert.alert("Error", "No se pudo identificar la barbería actual.");
            return;
          }

          try {
            setIsSubmittingWalkIn(true);
            await createWalkInAppointment({
              shopId,
              customerName: payload.customerName,
              phone: payload.phone,
              serviceId: payload.serviceId,
            });
            await refetch();
            newWalkInSheetRef.current?.dismiss();
            Alert.alert("Turno creado correctamente.");
          } catch (error) {
            Alert.alert(
              "No se pudo crear el walk-in",
              error instanceof Error ? error.message : "Intenta nuevamente.",
            );
          } finally {
            setIsSubmittingWalkIn(false);
          }
        }}
      />
    </>
  );
}