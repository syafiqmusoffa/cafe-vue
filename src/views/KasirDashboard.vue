<template>
  <div class="">
    <nav class="flex items-center justify-between mb-6 bg-gray-100 p-4 rounded shadow">
      <div class="flex space-x-4">
        <RouterLink to="/kasir/orders" class="text-gray-700 hover:text-blue-600 font-medium">Order Aktif</RouterLink>
        <RouterLink to="/kasir/order-list" class="text-gray-700 hover:text-blue-600 font-medium">Order keseluruhan</RouterLink>
      </div>
      <button
        @click="logout"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  router.push("/login");
};


</script>
