import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getTasksRequest } from "../services/api";

export default function TaskListScreen({ token, navigate, onOpenTask }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasksRequest(token).then((res) => setTasks(res.data || []));
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onOpenTask(item)}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text>{item.status}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity onPress={() => navigate("dashboard")} style={styles.back}><Text>Back Dashboard</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  itemTitle: { fontWeight: "600" },
  back: { marginTop: 10, padding: 10, backgroundColor: "#dbeafe", alignItems: "center", borderRadius: 8 },
});
