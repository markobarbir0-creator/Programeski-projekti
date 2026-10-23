import { useRouter } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Switch, Text, TouchableOpacity, View } from "react-native";
import { db } from "./firebase";
export default function ToDoList() {
  const router = useRouter();
  const [selectedcategory, setSelectedCategory] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const handleDelete = (id) => {
    Alert.alert("Delete task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("trying delete:", id);

            await deleteDoc(doc(db, "tasks", id));

            console.log("deleted OK");
          } catch (error) {
            console.log("DELETE ERROR:", error);
          }
        },
      },
    ]);
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Prikaži samo nezavršene</Text>

        <Switch
          value={showOnlyPending}
          onValueChange={(value) => setShowOnlyPending(value)}
        />
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedCategory("All")}
        >
          <Text style={styles.filterText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedCategory("Work")}
        >
          <Text style={styles.filterText}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedCategory("School")}
        >
          <Text style={styles.filterText}>School</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedCategory("Personal")}
        >
          <Text style={styles.filterText}>Personal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSelectedCategory("Other")}
        >
          <Text style={styles.filterText}>Other</Text>
        </TouchableOpacity>
      </View>

      {tasks
        .filter((task) => {
          if (selectedcategory === "" || selectedcategory === "All") {
            return true;
          }

          return task.category === selectedcategory;
        })
        .filter((task) => {
          return showOnlyPending ? !task.done : true;
        })
        .map((task) => (
          <View key={task.id} style={styles.taskBox}>
            <TouchableOpacity onPress={() => router.push(`/task/${task.id}`)}>
              <Text>
                {task.title} (prioritet:{task.priority})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleDelete(task.id)}>
              <Text style={{ fontSize: 18 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

      <TouchableOpacity
        style={styles.addbutton}
        onPress={() => router.push("new")}
      >
        <Text style={styles.addbuttontext}>➕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  search: {
    marginLeft: 10,
    border: 1,
    borderWidth: 1,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 20,
  },

  taskBox: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  taskText: {
    fontSize: 16,
  },
  addbutton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addbuttontext: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  taskBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    margin: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
  },
};
