<template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import api from "../api";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const error = ref("");

    const login = async () => {
      try {
        const res = await api.post("/auth/login", {
          username: username.value,
          password: password.value,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "admin") router.push("/admin");
        else router.push("/user");
      } catch (err) {
        error.value = "Login failed.";
      }
    };

    return { username, password, error, login };
  },
};
</script>
