<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddProduct } from "@/api/products";
import DialogDescription from "./ui/dialog/DialogDescription.vue";

const { mutate: addProduct, isPending } = useAddProduct();

const productName = ref("");
const description = ref("");
const price = ref<number | undefined>(undefined);
const category = ref("coffee"); // ✅ default
const imageFile = ref<File | null>(null);
const open = ref(false);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target?.files?.length) {
    imageFile.value = target.files[0];
  } else {
    imageFile.value = null;
  }
};

const handleAdd = () => {
  if (!productName.value.trim()) return alert("Nama produk wajib diisi");

  const formData = new FormData();
  formData.append("productName", productName.value);
  formData.append("description", description.value);
  formData.append("category", category.value);
  if (price.value) formData.append("price", price.value.toString());
  if (imageFile.value) formData.append("image", imageFile.value);

  addProduct(formData, {
    onSuccess: () => {
      // ✅ Reset form & tutup dialog
      productName.value = "";
      description.value = "";
      price.value = undefined;
      category.value = "coffee";
      imageFile.value = null;
      open.value = false;
    },
  });
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger asChild>
      <Button class="bg-blue-600 text-white">+ Tambah Produk</Button>
    </DialogTrigger>

    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Tambah Produk</DialogTitle>
      </DialogHeader>
<DialogDescription/>
      <div class="space-y-3">
        <Input v-model="productName" placeholder="Nama Produk" />
        <Input v-model="description" placeholder="Deskripsi Produk" />
        <Input v-model="price" type="number" placeholder="Harga" min="15000" />

        <!-- ✅ Select Category -->
        <select
          v-model="category"
          class="w-full border rounded p-2 text-sm focus:ring"
        >
          <option value="coffee">Coffee</option>
          <option value="non_coffee">Non Coffee</option>
          <option value="snack">Snack</option>
          <option value="heavy_meal">Heavy Meal</option>
        </select>

        <!-- ✅ File Upload -->
        <input type="file" @change="handleFileChange" class="text-sm" />
      </div>

      <DialogFooter class="mt-4">
        <Button :disabled="isPending" @click="handleAdd">Simpan</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
