import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import LoginScreen from "./screens/LoginScreen";

export default function App() {
  const handleLoginSuccess = (user) => {
    alert(`Login success: ${user.name}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
    </SafeAreaView>
  );
}
