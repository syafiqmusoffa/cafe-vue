<template>
  <div class="p-6 mx-auto w-full">
    <h1 class="text-2xl font-bold">Dashboard Kasir</h1>

    <div v-if="isLoading" class="text-gray-500 animate-pulse">
      Memuat pesanan...
    </div>
    <div v-else-if="orders.length === 0" class="text-gray-500">
      Tidak ada pesanan aktif.
    </div>

    <div v-else class="grid gap-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-2xl shadow-md p-5 bg-white space-y-4 transition hover:shadow-lg"
      >
        <!-- Info Order -->
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Meja #{{ order.Table?.table_number ?? order.table_id }}
            </h2>
            <p class="text-sm text-gray-500">
              Status:
              <span
                :class="{
                  'text-yellow-500': order.status === 'pending',
                  'text-yellow-400': order.status === 'validated',
                  'text-yellow-300': order.status === 'processing',
                  'text-green-500': order.status === 'completed',
                  'text-green-600': order.status === 'paid',
                  'text-red-500': order.status === 'canceled',
                }"
              >
                {{ order.status.toUpperCase() }}
              </span>
            </p>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex gap-2">
            <button
              @click="update(order.id, 'pending')"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded shadow"
            >
              Pending
            </button>
            <button
              @click="update(order.id, 'validated')"
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded shadow"
            >
              Divalidasi
            </button>
            <button
              @click="update(order.id, 'processing')"
              class="bg-yellow-300 hover:bg-yellow-400 text-white px-4 py-1 rounded shadow"
            >
              Sedang diproses
            </button>
            <button
              @click="update(order.id, 'completed')"
              class="bg-green-400 hover:bg-green-500 text-white px-4 py-1 rounded shadow"
            >
              Selesai
            </button>
            <button
              @click="update(order.id, 'canceled')"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow"
            >
              Batalkan
            </button>
            <button
              @click="update(order.id, 'paid')"
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow"
            >
              Lunas
            </button>
          </div>
        </div>

        <!-- Daftar Item -->
        <div class="bg-gray-50 rounded-md p-3">
          <h3 class="font-medium text-gray-700 mb-2">Detail Pesanan:</h3>
          <ul class="space-y-1 text-sm text-gray-800">
            <li
              v-for="item in order.Items"
              :key="item.product_id"
              class="flex justify-between"
            >
              <span>
                {{ item.product?.productName || "Produk tidak tersedia" }} ×
                {{ item.quantity }}
              </span>
              <span class="text-gray-600">
                Rp {{ (item.product?.price || 0).toLocaleString("id-ID") }}
              </span>
            </li>
              <div class="text-right pt-6">
            <p>
              Total:
              <strong>
                Rp {{
                  order.Items?.reduce((total:any, item:any) => {
                    return total + (item.quantity * (item.product?.price || 0));
                  }, 0).toLocaleString('id-ID')
                }}
              </strong>
            </p>
            <p class="text-sm text-gray-400">
              {{ new Date(order.CreatedAt).toLocaleString("id-ID") }}
            </p>
          </div>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrdersActive, useUpdateOrderStatus } from "@/api/order";
import { toast } from "vue-sonner";

const { data: orders = [], isLoading } = useOrdersActive();
const { mutate } = useUpdateOrderStatus();

const update = (id: number, status: string) => {
  mutate(
    { id, status },
    {
      onSuccess: () => {
        toast.success("Status diperbarui");
      },
      onError: () => {
        toast.error("Gagal memperbarui status");
      },
    }
  );
};
</script>
