<script setup lang="ts">
import { useOrders } from '@/api/order';

const { data: orders, isLoading, isError } = useOrders();
</script>

<template>
  <div class="p-6 mx-auto w-full">
    <h2 class="text-2xl font-bold mb-4">📋 Daftar Semua Order</h2>

    <div v-if="isLoading" class="text-gray-500">Memuat daftar order...</div>
    <div v-else-if="isError" class="text-red-500">Gagal memuat order.</div>

    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border rounded-lg p-4 shadow bg-white"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold text-lg">Meja #{{ order.Table?.table_number || order.table_id }}</h3>
            <p class="text-sm text-gray-500 capitalize">Status: {{ order.status }}</p>
          </div>
          <div class="text-right">
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
        </div>

        <ul class="mt-2 text-sm text-gray-700 list-disc list-inside">
          <li
            v-for="item in order.Items"
            :key="item.id"
          >
            {{ item.product?.productName || 'Produk tidak ditemukan' }} × {{ item.quantity }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
