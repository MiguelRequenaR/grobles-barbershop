import { Tabs } from "expo-router";
import React from "react";
import AnimatedBottomTabBar from "@/components/navigation/AnimatedBottomTabBar";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AnimatedBottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendario",
        }}
      />

      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
        }}
      />

      <Tabs.Screen
        name="rewards"
        options={{
          title: "Recompensas",
        }}
      />
    </Tabs>
  );
}
