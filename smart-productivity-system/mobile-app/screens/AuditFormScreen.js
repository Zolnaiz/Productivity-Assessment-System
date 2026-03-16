import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createAuditRequest } from "../services/api";

export default function AuditFormScreen({ token, user, navigate }) {
  const [score, setScore] = useState("90");
  const [imageUrl, setImageUrl] = useState("");

  const submit = async () => {
    await createAuditRequest(token, {
      department_id: user?.department_id || 1,
      score: Number(score),
      images: imageUrl ? [imageUrl] : [],
    });
    Alert.alert("Success", "Audit saved");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>5S Audit Form</Text>
      <TextInput value={score} onChangeText={setScore} keyboardType="numeric" style={styles.input} placeholder="Score 0-100" />
      <TextInput value={imageUrl} onChangeText={setImageUrl} style={styles.input} placeholder="Image URL (optional)" />
      <TouchableOpacity style={styles.btn} onPress={submit}><Text>Submit Audit</Text></TouchableOpacity>
      <TouchableOpacity style={styles.back} onPress={() => navigate("dashboard")}><Text>Back Dashboard</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, marginBottom: 10 },
  btn: { backgroundColor: "#dbeafe", padding: 10, borderRadius: 8, alignItems: "center" },
  back: { marginTop: 12, backgroundColor: "#e2e8f0", padding: 10, borderRadius: 8, alignItems: "center" },
});
