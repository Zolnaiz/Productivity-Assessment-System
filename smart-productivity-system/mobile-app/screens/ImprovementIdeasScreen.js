import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createIdeaRequest, getIdeasRequest, voteIdeaRequest } from "../services/api";

export default function ImprovementIdeasScreen({ token, navigate }) {
  const [ideas, setIdeas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadIdeas = async () => {
    const res = await getIdeasRequest(token);
    setIdeas(res.data || []);
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const submitIdea = async () => {
    if (!title || !description) return;
    await createIdeaRequest(token, { title, description });
    setTitle("");
    setDescription("");
    await loadIdeas();
  };

  const vote = async (id) => {
    await voteIdeaRequest(token, id);
    await loadIdeas();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Improvement Ideas</Text>
      <TextInput placeholder="Idea title" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
      <TouchableOpacity style={styles.btn} onPress={submitIdea}><Text>Submit</Text></TouchableOpacity>

      <FlatList
        data={ideas}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.ideaCard}>
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => vote(item.id)} style={styles.vote}><Text>Vote ({item.votes})</Text></TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.back} onPress={() => navigate("dashboard")}><Text>Back Dashboard</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { backgroundColor: "#dbeafe", padding: 10, alignItems: "center", borderRadius: 8, marginBottom: 10 },
  ideaCard: { borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 8, padding: 10, marginBottom: 8 },
  vote: { marginTop: 6, backgroundColor: "#e0f2fe", padding: 8, borderRadius: 6, alignItems: "center" },
  back: { backgroundColor: "#e2e8f0", padding: 10, alignItems: "center", borderRadius: 8 },
});
