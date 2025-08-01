<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddTable, useDeleteTable, useTables } from "@/api/tables";

const { data: tables, isLoading } = useTables();
const { mutate: addTable, isPending: adding } = useAddTable();
const { mutate: deleteTable, isPending: deleting } = useDeleteTable();

const newTableNumber = ref<any>(null);

const handleAdd = () => {
  if (!newTableNumber.value) return alert("Nomor meja wajib diisi");
  addTable({ table_number: newTableNumber.value });
  newTableNumber.value = null;
};
</script>

<template>
  <div class="p-6 mx-auto w-full">
    <h2 class="text-xl font-bold mb-4">Manajemen Meja</h2>

    <!-- Form Tambah Meja -->
    <div class="flex gap-2 mb-4">
      <Input
        v-model="newTableNumber"
        type="number"
        min="1"
        placeholder="Nomor Meja"
        class="w-32"
      />
      <Button @click="handleAdd" :disabled="adding"> Tambah Meja </Button>
    </div>

    <!-- List Meja -->
    <div v-if="isLoading">Loading...</div>
    <ul v-else class="space-y-2">
      <li
        v-for="table in tables"
        :key="table.id"
        class="p-2 border rounded flex justify-between items-center"
      >
        <span>Meja #{{ table.table_number }}</span>
        <Button 
          variant="destructive"
          @click="()=>deleteTable(table.id)"
          :disabled="deleting"
          class="cursor-pointer"
        >
          Hapus
        </Button>
      </li>
    </ul>
  </div>
</template>
