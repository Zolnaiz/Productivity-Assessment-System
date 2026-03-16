import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getAuditsRequest, getTasksRequest } from "../services/api";

export default function DashboardScreen({ user, token, onLogout, navigate }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, auditScore: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const tasksRes = await getTasksRequest(token);
        const auditsRes = await getAuditsRequest(token);
        const tasks = tasksRes.data || [];
        const audits = auditsRes.data || [];
        const completed = tasks.filter((t) => t.status === "Completed").length;
        const pending = tasks.length - completed;
        const auditScore = audits.length ? Math.round(audits.reduce((a, b) => a + b.score, 0) / audits.length) : 0;
        setStats({ total: tasks.length, completed, pending, auditScore });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard - {user?.name}</Text>
      <View style={styles.row}>
        <Card label="Tasks Today" value={stats.total} />
        <Card label="Completed" value={stats.completed} />
      </View>
      <View style={styles.row}>
        <Card label="Pending" value={stats.pending} />
        <Card label="5S Score" value={stats.auditScore} />
      </View>

      <View style={styles.navRow}>
        <NavBtn title="Tasks" onPress={() => navigate("tasks")} />
        <NavBtn title="Audit" onPress={() => navigate("audit")} />
        <NavBtn title="Ideas" onPress={() => navigate("ideas")} />
      </View>

      <TouchableOpacity style={styles.logout} onPress={onLogout}><Text style={{ color: "white" }}>Logout</Text></TouchableOpacity>
    </View>
  );
}

const Card = ({ label, value }) => <View style={styles.card}><Text style={styles.cardLabel}>{label}</Text><Text style={styles.cardValue}>{value}</Text></View>;
const NavBtn = ({ title, onPress }) => <TouchableOpacity onPress={onPress} style={styles.navBtn}><Text>{title}</Text></TouchableOpacity>;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  card: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 10, padding: 12 },
  cardLabel: { color: "#64748b" },
  cardValue: { fontSize: 24, fontWeight: "700" },
  navRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  navBtn: { flex: 1, alignItems: "center", padding: 10, backgroundColor: "#dbeafe", borderRadius: 8 },
  logout: { marginTop: 24, backgroundColor: "#ef4444", padding: 12, borderRadius: 8, alignItems: "center" },
});
