import AuthTabs from "@/components/auth/AuthTabs";
import LoginPanel from "@/components/auth/LoginPanel";
import RegisterPanel from "@/components/auth/RegisterPanel";
import { Text } from "@/components/ui/Text";
import {
  authSchema,
  AuthSchema,
  registerSchema,
  RegisterSchema,
} from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loginWithEmail, registerWithEmail } from "@/services/auth";

type AuthTab = "login" | "register";

export default function AuthScreen() {
  const [tab, setTab] = useState<AuthTab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const [panelWidth, setPanelWidth] = useState(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const indicatorX = useSharedValue(0);
  const contentX = useSharedValue(0);

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      shopName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: contentX.value }],
  }));

  const animateToTab = (nextTab: AuthTab) => {
    setTab(nextTab);
    const nextIndicator = nextTab === "login" ? 0 : tabWidth;
    const nextContent = nextTab === "login" ? 0 : -panelWidth;

    indicatorX.value = withTiming(nextIndicator, {
      duration: 220,
      easing: Easing.out(Easing.quad),
    });

    contentX.value = withTiming(nextContent, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  };

  const onSignIn = handleLoginSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await loginWithEmail(data.email, data.password);

      if (!result.ok) {
        Alert.alert("Error al iniciar sesión", result.message);
        return;
      }

      router.replace("/dashboard");
    } finally {
      setIsLoading(false);
    }
  });

  const onRegister = handleRegisterSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await registerWithEmail({
        email: data.email,
        password: data.password,
        shopName: data.shopName,
      });

      if (!result.ok) {
        Alert.alert("Error", result.message);
        return;
      }

      if (!result.needsEmailVerification) {
        Alert.alert("¡Éxito!", "Cuenta creada correctamente");
        router.replace("/dashboard");
        return;
      }

      Alert.alert("Verifica tu correo", result.message);
      setLoginValue("email", data.email);
      animateToTab("login");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <View className="flex-1 bg-[#f7f1e6]">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 4,
          paddingTop: 16,
        }}
      >
        <View
          style={{
            flexGrow: 1,
            justifyContent: keyboardVisible ? "flex-start" : "center",
            paddingTop: keyboardVisible ? insets.top + 8 : 0,
          }}
        >
          <View className="bg-white m-4 rounded-3xl p-4 gap-4 overflow-hidden">
            <View className="items-center justify-center">
              <View className="bg-[#1f1f1f] rounded-full p-4 items-center justify-center">
                <Image
                  source={require("../../assets/icons/logoGB.png")}
                  style={{ width: 30, height: 30 }}
                  contentFit="contain"
                />
              </View>
            </View>

            <Text className="text-center uppercase text-lg">Grobles Barbershop</Text>

            <AuthTabs
              tab={tab}
              tabWidth={tabWidth}
              indicatorStyle={indicatorAnimatedStyle}
              onLayout={(half) => {
                setTabWidth(half);
                indicatorX.value = tab === "login" ? 0 : half;
              }}
              onChangeTab={animateToTab}
            />

            <View
              onLayout={(e) => {
                const width = e.nativeEvent.layout.width;
                setPanelWidth(width);
                contentX.value = tab === "login" ? 0 : -width;
              }}
              className="overflow-hidden"
            >
              <Animated.View
                style={[
                  contentStyle,
                  {
                    flexDirection: "row",
                    width: panelWidth > 0 ? panelWidth * 2 : "200%",
                  },
                ]}
              >
                <LoginPanel
                  control={loginControl}
                  errors={loginErrors}
                  isLoading={isLoading}
                  isActive={tab === "login"}
                  width={panelWidth}
                  onSubmit={onSignIn}
                />

                <RegisterPanel
                  control={registerControl}
                  errors={registerErrors}
                  isLoading={isLoading}
                  isActive={tab === "register"}
                  width={panelWidth}
                  onSubmit={onRegister}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
