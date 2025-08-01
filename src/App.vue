<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div>
    <router-view />
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme="light"
    />
  </div>
</template>


<style scoped>
nav {
  padding: 10px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}
nav a.router-link-exact-active {
  font-weight: bold;
  color: red;
}
</style>
