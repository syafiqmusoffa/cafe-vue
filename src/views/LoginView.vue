<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl mb-4">Login</h1>
    <form @submit.prevent="handleLogin" class="flex flex-col gap-2 w-64">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border p-2 rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 rounded"
      />
      <button type="submit" class="bg-blue-500 text-white py-2 rounded">
        Login
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const username = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login(username.value, password.value);

    if (auth.role === "admin") router.push("/admin");
    else if (auth.role === "cashier") router.push("/kasir");
  } catch (err: any) {
    error.value = err;
  }
};
</script>
