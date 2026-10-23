import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Pressable, Switch, Text, TextInput, View } from "react-native";
import { db } from "./firebase";
export default function TaskScreen() {
  const categories = ["Work", "School", "Personal", "Other"];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [done, setDone] = useState(false);
  const [priority, setPriority] = useState("None");
  const router = useRouter();

  const handleSave = async () => {
    const newTask = {
      title,
      description,
      category,
      priority,
      done,
    };
    await addDoc(collection(db, "tasks"), newTask);
    console.log("saved:", newTask);
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>
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
