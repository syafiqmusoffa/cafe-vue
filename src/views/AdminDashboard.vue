<template>
  <div class="">
    <!-- Navbar -->
    <nav class="flex items-center justify-between mb-6 bg-gray-100 p-4 rounded shadow">
      <div class="flex space-x-4">
        <RouterLink to="/admin/cashier" class="text-gray-700 hover:text-blue-600 font-medium">Kasir</RouterLink>
        <RouterLink to="/admin/tables" class="text-gray-700 hover:text-blue-600 font-medium">Meja</RouterLink>
        <RouterLink to="/admin/products" class="text-gray-700 hover:text-blue-600 font-medium">Produk</RouterLink>
      </div>
      <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Logout
      </button>
    </nav>

    <!-- Halaman Konten -->
    <RouterView />
  </div>
</template>


<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>
