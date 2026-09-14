import { useState } from "react";
import LoginScreen from "../../screens/LoginScreen";
import RegisterScreen from "../../screens/RegisterScreen";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "register">(
    "register",
  );

  if (currentScreen === "register") {
    return (
      <RegisterScreen
        onNavigateToLogin={() => setCurrentScreen("login")}
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
