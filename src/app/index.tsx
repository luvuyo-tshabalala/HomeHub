import { useState } from "react";
import JoinFamilyScreen from "../../screens/JoinFamilyScreen";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<
    "login" | "register" | "joinFamily"
  >("login");

  if (currentScreen === "joinFamily") {
    return (
      <JoinFamilyScreen
        onNavigateBack={() => setCurrentScreen("login")}
        onCompleteOnboarding={() => {
          // Future step: route to your shared DashboardScreen
          setCurrentScreen("login");
        }}
        navigation={undefined}
      />
    );
  }

  if (currentScreen === "register") {
    return (
      <RegisterScreen
        onNavigateToLogin={() => setCurrentScreen("login")}
        onNavigateToFamilySetup={() => setCurrentScreen("joinFamily")}
        navigation={undefined}
      />
    );
  }

  return (
    <LoginScreen
      onNavigateToRegister={() => setCurrentScreen("register")}
      navigation={undefined}
    />
  );
}
