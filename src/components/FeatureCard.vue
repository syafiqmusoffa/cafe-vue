<template>
  <div class="bg-yellow-100 rounded-xl p-6 shadow hover:shadow-lg transition text-center">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-gray-700">{{ desc }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  desc: string
}>()
</script>
