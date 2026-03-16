import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { updateTaskRequest } from "../services/api";

export default function TaskDetailScreen({ token, task, onBack }) {
  const [status, setStatus] = useState(task?.status || "Pending");

  const updateStatus = async (nextStatus) => {
    if (!task) return;
    await updateTaskRequest(token, task.id, { status: nextStatus });
    setStatus(nextStatus);
  };

  if (!task) return <View style={styles.container}><Text>No task selected</Text><TouchableOpacity onPress={onBack}><Text>Back</Text></TouchableOpacity></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>{task.description || "No description"}</Text>
      <Text style={styles.status}>Current: {status}</Text>
      <View style={styles.row}>
        <Btn title="In Progress" onPress={() => updateStatus("In Progress")} />
        <Btn title="Completed" onPress={() => updateStatus("Completed")} />
      </View>
      <TouchableOpacity onPress={onBack} style={styles.back}><Text>Back Task List</Text></TouchableOpacity>
    </View>
  );
}

const Btn = ({ title, onPress }) => <TouchableOpacity onPress={onPress} style={styles.btn}><Text>{title}</Text></TouchableOpacity>;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  status: { marginVertical: 12, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8 },
  btn: { backgroundColor: "#dbeafe", borderRadius: 8, padding: 10 },
  back: { marginTop: 20, backgroundColor: "#e2e8f0", padding: 10, borderRadius: 8, alignItems: "center" },
});
