import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import TaskListScreen from "./screens/TaskListScreen";
import TaskDetailScreen from "./screens/TaskDetailScreen";
import AuditFormScreen from "./screens/AuditFormScreen";
import ImprovementIdeasScreen from "./screens/ImprovementIdeasScreen";

export default function App() {
  const [bootLoading, setBootLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
      setBootLoading(false);
    };
    restoreSession();
  }, []);

  const handleLoginSuccess = (loginUser, loginToken) => {
    setUser(loginUser);
    setToken(loginToken);
    setActiveScreen("dashboard");
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
    setToken(null);
    setActiveScreen("dashboard");
  };

  if (bootLoading) {
    return <SafeAreaView style={{ flex: 1 }}><ActivityIndicator style={{ marginTop: 100 }} /></SafeAreaView>;
  }

  const commonProps = { user, token, onLogout: handleLogout, navigate: setActiveScreen };

  const renderAuthenticated = () => {
    if (activeScreen === "tasks") {
      return <TaskListScreen {...commonProps} onOpenTask={(task) => { setSelectedTask(task); setActiveScreen("taskDetail"); }} />;
    }
    if (activeScreen === "taskDetail") {
      return <TaskDetailScreen {...commonProps} task={selectedTask} onBack={() => setActiveScreen("tasks")} />;
    }
    if (activeScreen === "audit") return <AuditFormScreen {...commonProps} />;
    if (activeScreen === "ideas") return <ImprovementIdeasScreen {...commonProps} />;
    return <DashboardScreen {...commonProps} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {token && user ? renderAuthenticated() : <LoginScreen onLoginSuccess={handleLoginSuccess} />}
    </SafeAreaView>
  );
}
