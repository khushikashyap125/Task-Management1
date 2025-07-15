<template>
  <div>
    <h2>Admin Dashboard</h2>
    
    <!-- Create Task -->
    <h3>Create Task</h3>
    <input v-model="title" placeholder="Task Title" />
    <input v-model="description" placeholder="Description" />
    <button @click="createTask">Create</button>

    <hr />

    <!-- Task List -->
    <h3>All Tasks</h3>
    <div v-for="task in tasks" :key="task._id" class="task">
      <strong>{{ task.title }}</strong> - {{ task.status }}
      <p>{{ task.description }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../api";

export default {
  setup() {
    const tasks = ref([]);
    const title = ref("");
    const description = ref("");

    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        tasks.value = res.data;
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    const createTask = async () => {
      try {
        await api.post(
          "/tasks",
          { title: title.value, description: description.value },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        title.value = "";
        description.value = "";
        fetchTasks(); // Refresh list
      } catch (err) {
        console.error("Error creating task", err);
      }
    };

    onMounted(fetchTasks);

    return {
      tasks,
      title,
      description,
      createTask,
    };
  },
};
</script>

<style scoped>
.task {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
