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
  const [filter, setFilter] = useState("all"); // all | active | done
  const [editingTaskId, setEditingTaskId] = useState(null);

  const isEditing = editingTaskId !== null;

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
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const updateTask = () => {
    const title = input.trim();
    if (!title || !editingTaskId) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTaskId ? { ...t, title } : t))
    );

    setInput("");
    setEditingTaskId(null);
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateTask();
    } else {
      addTask();
    }
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setInput(task.title);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
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
        onPress: () => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
          if (editingTaskId === id) {
            cancelEdit();
          }
        },
      },
    ]);
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    if (editingTaskId) {
      const editingTask = tasks.find((t) => t.id === editingTaskId);
      if (editingTask?.completed) cancelEdit();
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    return { total, done, active: total - done };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "done") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

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

      <TouchableOpacity
        onPress={() => startEditTask(item)}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteTask(item.id)}
        style={styles.deleteBtn}
      >
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

        {isEditing ? (
          <Text style={styles.editingLabel}>Editing task...</Text>
        ) : null}

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={isEditing ? "Update task..." : "Enter a task..."}
            style={styles.input}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.addBtn, isEditing && styles.updateBtn]}
            onPress={handleSubmit}
          >
            <Text style={styles.addBtnText}>{isEditing ? "Update" : "Add"}</Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <TouchableOpacity style={styles.cancelEditBtn} onPress={cancelEdit}>
            <Text style={styles.cancelEditBtnText}>Cancel Edit</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.filterRow}>
          {["all", "active", "done"].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filter === f && styles.filterBtnTextActive,
                ]}
              >
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            filteredTasks.length === 0 && styles.listEmptyContainer,
          ]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {filter === "all" ? "No tasks yet. Add one." : `No ${filter} tasks.`}
            </Text>
          }
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={[styles.clearBtn, stats.done === 0 && styles.clearBtnDisabled]}
          onPress={clearCompleted}
          disabled={stats.done === 0}
        >
          <Text style={styles.clearBtnText}>Clear Completed</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },

  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  subtitle: { marginTop: 4, marginBottom: 10, color: "#6b7280" },
  editingLabel: {
    marginBottom: 10,
    color: "#1d4ed8",
    fontWeight: "600",
  },

  inputRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
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
    minWidth: 74,
  },
  updateBtn: {
    backgroundColor: "#2563eb",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },

  cancelEditBtn: {
    alignSelf: "flex-start",
    marginBottom: 12,
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  cancelEditBtnText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 12,
  },

  filterRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  filterBtn: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  filterBtnActive: {
    backgroundColor: "#111827",
  },
  filterBtnText: { fontSize: 12, fontWeight: "700", color: "#374151" },
  filterBtnTextActive: { color: "#fff" },

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

  taskTextWrap: { flex: 1, marginRight: 6 },
  taskText: { fontSize: 16, color: "#111827" },
  taskTextDone: { color: "#9ca3af", textDecorationLine: "line-through" },

  editBtn: {
    marginLeft: 4,
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: { color: "#1d4ed8", fontWeight: "600", fontSize: 12 },

  deleteBtn: {
    marginLeft: 6,
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteBtnText: { color: "#b91c1c", fontWeight: "600", fontSize: 12 },

  clearBtn: {
    marginTop: "auto",
    backgroundColor: "#ef4444",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnDisabled: { opacity: 0.5 },
  clearBtnText: { color: "#fff", fontWeight: "700" },
});