<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useAddUser } from "@/api/kasir";
import type { CreateUserDTO } from "@/types/user";

const { mutate: addUser, isPending } = useAddUser();

// ✅ state form
const form = ref<CreateUserDTO>({
  name: "",
  username: "",
  password: "",
  role: "cashier", // default
});

// ✅ submit handler
const handleAdd = () => {
  if (!form.value.name || !form.value.username || !form.value.password) {
    return alert("Semua field wajib diisi");
  }
  addUser(form.value);
  // ✅ reset form
  form.value = { name: "", username: "", password: "", role: "cashier" };
};
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button class="bg-blue-600 hover:bg-blue-700 text-white">
        Tambah Kasir
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Tambah Kasir Baru</AlertDialogTitle>
        <AlertDialogDescription>
          Lengkapi form di bawah untuk menambahkan kasir baru.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div class="flex flex-col gap-3 my-3">
        <Input
          v-model="form.name"
          placeholder="Nama Kasir"
          class="w-full"
        />
        <Input
          v-model="form.username"
          placeholder="Username"
          class="w-full"
        />
        <Input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full"
        />
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Batal</AlertDialogCancel>
        <AlertDialogAction
          @click="handleAdd"
          :disabled="isPending"
          class="bg-green-600 hover:bg-green-700"
        >
          Simpan
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
