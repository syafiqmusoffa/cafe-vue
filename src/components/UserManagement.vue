<script setup lang="ts">
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2 } from "lucide-vue-next"; // lucide versi Vue
import { toast } from "vue-sonner";
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

import { ref } from "vue";
import type { User } from "@/types/user";
import {
  useDeleteUser,
  useUpdateCashierStatus,
  useUpdateUser,
  useUsers,
} from "@/api/kasir";
import AddUserModal from "./AddUserModal.vue";

const { data: users, isLoading } = useUsers();
const { mutate: updateUser, isPending } = useUpdateUser();
const { mutate: deleteUser, isPending: deleting } = useDeleteUser();
const { mutate: updateCashierStatus, isPending: updatingStatus } =
  useUpdateCashierStatus();

// ✅ state editing mirip LinkList
const editingId = ref<number | null>(null);
const editValues = ref<{
  [id: number]: { name: string; password?: string; username: string };
}>({});

const handleEditToggle = (user: User) => {
  editingId.value = user.id;
  editValues.value[user.id] = {
    name: user.name,
    password: user.password,
    username: user.username,
  };
};
const handleStatusChange = (id: number, newStatus: boolean) => {
  updateCashierStatus({ id, status: newStatus });
};

const handleSave = (id: number) => {
  const { name, password } = editValues.value[id];

  if (!name.trim()) {
    return toast.error("Username tidak boleh kosong");
  }

  updateUser({
    id,
    name,
    ...(password?.trim() ? { password } : {}), // hanya kirim jika ada
  });

  editingId.value = null;
};
</script>

<template>
  <div class="flex flex-col gap-4 p-6 mx-auto w-full">
    <h2 class="text-xl font-bold mb-2">Daftar Kasir</h2>
    <AddUserModal />
    <div v-if="isLoading">Loading...</div>

    <template v-else>
      <Card
        v-for="user in users"
        :key="user.id"
        class="p-4 rounded-xl shadow-md border bg-white flex flex-col gap-2"
      >
        <div v-if="editingId === user.id">
          <Input
            v-model="editValues[user.id].name"
            class="font-semibold mb-2"
            placeholder="Nama kasir"
          />
          <Input
            v-model="editValues[user.id].username"
            class="font-semibold mb-2"
            placeholder="Nama kasir"
          />
          <Input
            type="password"
            v-model="editValues[user.id].password"
            placeholder="Ubah password (optional)"
          />
        </div>
        <div v-else>
          <div class="font-semibold">{{ user.name }}</div>
          <div class="text-sm text-gray-500">Kasir</div>
        </div>

        <div class="flex items-center justify-between mt-2">
          <!-- Switch Aktif / Nonaktif -->
          <div class="flex items-center gap-2">
            <Switch
              :model-value="user.status"
              @update:model-value="(val:any) => handleStatusChange(user.id, val)"
              class="cursor-pointer"
            />
            <span>{{ user.status ? "Aktif" : "Nonaktif" }}</span>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex gap-2 items-center">
            <Button
              v-if="editingId === user.id"
              variant="outline"
              size="icon"
              @click="() => handleSave(user.id)"
              :disabled="isPending"
            >
              <Save class="h-4 w-4" />
            </Button>
            <Button
              v-else
              variant="outline"
              size="icon"
              @click="() => handleEditToggle(user)"
              class="cursor-pointer"
            >
              <Pencil class="h-4 w-4" />
            </Button>

            <!-- Delete dengan AlertDialog -->
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  class="cursor-pointer hover:bg-red-700"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Kasir?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Kasir akan dihapus
                    permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    @click="() => deleteUser(user.id)"
                    :disabled="deleting"
                    class="bg-red-500 cursor-pointer"
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </template>
  </div>
</template>
