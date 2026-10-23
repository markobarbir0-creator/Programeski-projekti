import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { db } from "../firebase";
export default function TaskScreen() {
  const { id } = useLocalSearchParams();
  const taskId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("None");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      const docRef = doc(db, "tasks", taskId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setPriority(data.priority);
        setDone(data.done);
      }
    };
    loadTask();
  }, [taskId]);

  const handleSave = async () => {
    try {
      const taskRef = doc(db, "tasks", taskId);

      await updateDoc(taskRef, {
        title,
        description,
        category,
        priority,
        done,
      });

      router.push("/");
    } catch (error) {
      console.log("UPDATE ERROR:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textarea]}
        placeholder="Enter description"
        multiline
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryBox}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
        >
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="School" value="School" />
          <Picker.Item label="Personal" value="Personal" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      <View style={styles.categoryBox}>
        <Picker
          selectedValue={priority}
          onValueChange={(value) => setPriority(value)}
        >
          <Picker.Item label="Low" value="Low" />
          <Picker.Item label="Mid" value="Mid" />
          <Picker.Item label="High" value="High" />
        </Picker>
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Done</Text>
        <Switch value={done} onValueChange={setDone} />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoryBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
};
