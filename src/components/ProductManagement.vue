<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Save, Trash2 } from "lucide-vue-next";
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

import AddProductModal from "./AddProductModal.vue";
import {
  useProducts,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/api/products";
import { Product, ProductCategory } from "@/types/products";

// ✅ Query & Mutation
const { data: products, isLoading } = useProducts();
const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();
const{mutate: updateProductStatus, isPending: updatingStatus}=useUpdateProductStatus()

// ✅ State untuk editing produk
const editingId = ref<number | null>(null);
const editValues = ref<{
  [id: number]: {
    productName: string;
    price: number;
    category: ProductCategory;
    description?: string;
    imageFile?: File | null;
  };
}>({});

// ✅ Toggle edit mode
const handleEditToggle = (product: Product) => {
  editingId.value = product.id;
  editValues.value[product.id] = {
    productName: product.productName,
    price: product.price,
    category: product.category,
    description: product.description || "",
    imageFile: null,
  };
};

// ✅ Handle perubahan gambar
const handleImageChange = (e: Event, id: number) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    editValues.value[id].imageFile = target.files[0];
    toast.info(`Gambar dipilih: ${target.files[0].name}`);
  }
};

// ✅ Simpan perubahan
const handleSave = (id: number) => {
  const { productName, price, category, description, imageFile } =
    editValues.value[id];

  if (!productName.trim()) {
    return toast.error("Nama produk tidak boleh kosong");
  }

  const formData = new FormData();
  formData.append("productName", productName);
  formData.append("price", price.toString());
  formData.append("category", category);
  if (description) formData.append("description", description);
  if (imageFile) formData.append("image", imageFile);

  updateProduct({ id, data: formData });
  editingId.value = null;
};
const handleStatusChange = (id:number, newStatus: boolean) => {
  updateProductStatus({id, available: newStatus})
}
</script>

<template>
  <div class="flex flex-col gap-4 p-6 mx-auto w-full">
    <h2 class="text-xl font-bold mb-2">Daftar Produk</h2>
    <AddProductModal />

    <div v-if="isLoading">Loading...</div>

    <template v-else>
      <Card
        v-for="product in products"
        :key="product.id"
        class="p-4 rounded-xl shadow-md border bg-white flex flex-col gap-2"
      >
        <!-- Bagian Gambar + Detail Produk -->
        <div class="flex gap-4 items-start">
          <img
            :src="product.img_url"
            alt="product image"
            class="w-16 h-16 rounded object-cover"
          />

          <div class="flex-1 space-y-2">
            <!-- Edit Mode -->
            <div v-if="editingId === product.id" class="space-y-2">
              <Input
                v-model="editValues[product.id].productName"
                placeholder="Nama Produk"
              />
              <Input
                type="number"
                v-model="editValues[product.id].price"
                placeholder="Harga"
              />
              <select
                v-model="editValues[product.id].category"
                class="border p-1 rounded w-full"
              >
                <option value="coffee">Coffee</option>
                <option value="non_coffee">Non Coffee</option>
                <option value="snack">Snack</option>
                <option value="heavy_meal">Heavy Meal</option>
              </select>
              <Input
                type="text"
                v-model="editValues[product.id].description"
                placeholder="Deskripsi (opsional)"
              />

              <!-- Upload Gambar Baru -->
              <Input
                type="file"
                accept="image/*"
                @change="(e: any) => handleImageChange(e, product.id)"
              />
            </div>

            <!-- View Mode -->
            <div v-else>
              <div class="font-semibold">{{ product.productName }}</div>
              <div class="text-sm text-gray-500">
                {{ product.category }} • Rp{{ product.price }}
              </div>
            </div>
          </div>
        </div>

        <!-- Bagian Aksi -->
        <div class="flex items-center justify-between mt-2">
          <!-- Status Placeholder (opsional) -->
          <div class="flex items-center gap-2">
            <Switch 
            :model-value="product.available"
            @update:model-value="(val:any)=> handleStatusChange(product.id, val)"
            class="cursor-pointer" />
            <span>{{ product.available ? "Tersedia" : "Tidak tersedia" }}</span>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex gap-2 items-center">
            <!-- Simpan -->
            <Button
              v-if="editingId === product.id"
              variant="outline"
              size="icon"
              @click="() => handleSave(product.id)"
              :disabled="updating"
            >
              <Save class="h-4 w-4" />
            </Button>

            <!-- Edit -->
            <Button
              v-else
              variant="outline"
              size="icon"
              @click="() => handleEditToggle(product)"
              class="cursor-pointer"
            >
              <Pencil class="h-4 w-4" />
            </Button>

            <!-- Delete -->
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
                  <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Produk akan dihapus
                    permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    @click="() => deleteProduct(product.id)"
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
