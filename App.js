import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "todo_app_tasks_v1";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch (err) {
      console.log("Load error:", err);
    }
  };

  const saveTasks = async (nextTasks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const addTask = () => {
    const title = input.trim();
    if (!title) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    Alert.alert("Delete task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks((prev) => prev.filter((t) => t.id !== id)),
      },
    ]);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    return { total, done, active: total - done };
  }, [tasks]);

  const renderItem = ({ item }) => (
    <View style={styles.taskRow}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxDone]}
        onPress={() => toggleTask(item.id)}
      >
        {item.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskTextWrap}
        onPress={() => toggleTask(item.id)}
        activeOpacity={0.7}
      >
        <Text style={[styles.taskText, item.completed && styles.taskTextDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Todo App</Text>
        <Text style={styles.subtitle}>
          {stats.active} active • {stats.done} done • {stats.total} total
        </Text>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Enter a task..."
            style={styles.input}
            onSubmitEditing={addTask}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            tasks.length === 0 && styles.listEmptyContainer,
          ]}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks yet. Add one.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 4, marginBottom: 14, color: "#6b7280" },

  inputRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  listContent: { paddingBottom: 12 },
  listEmptyContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6b7280", fontSize: 15 },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxDone: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  checkmark: { color: "#fff", fontWeight: "700", fontSize: 14 },

  taskTextWrap: { flex: 1 },
  taskText: { fontSize: 16, color: "#111827" },
  taskTextDone: {
    color: "#9ca3af",
    textDecorationLine: "line-through",
  },

  deleteBtn: {
    marginLeft: 8,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: { color: "#b91c1c", fontWeight: "600", fontSize: 12 },
});